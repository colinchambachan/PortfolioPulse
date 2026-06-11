from __future__ import annotations

import io
import logging
import os
import re
from dataclasses import dataclass
from datetime import datetime, timezone
from decimal import Decimal, InvalidOperation
from functools import lru_cache
from typing import Annotated, Any, Protocol

import boto3
import cv2
import jwt
import numpy as np
import pytesseract
from boto3.dynamodb.conditions import Key
from dotenv import load_dotenv
from fastapi import Body, Depends, FastAPI, Header, HTTPException, Request, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from jwt import PyJWKClient
from jwt.exceptions import InvalidTokenError
from pdf2image import convert_from_bytes
from pydantic import BaseModel, ConfigDict, Field, field_validator
from slowapi import Limiter
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware
from slowapi.util import get_remote_address

load_dotenv()

PORTFOLIO_RECORD_SORT_KEY = Decimal(os.getenv("PORTFOLIO_RECORD_SORT_KEY", "0"))
ALLOWED_SYMBOL_PATTERN = re.compile(r"^[A-Z][A-Z0-9.\-]{0,9}$")

app = FastAPI()
limiter = Limiter(key_func=get_remote_address)

app.state.limiter = limiter
app.add_exception_handler(
    RateLimitExceeded,
    lambda request, exc: JSONResponse(
        status_code=429,
        content={"message": "Rate limit exceeded"},
    ),
)

allowed_origins = [
    "http://localhost:3000",
    "https://portfoliopulse.xyz",
    "https://www.portfoliopulse.xyz",
    "https://portfolio-pulse-nu.vercel.app",
    "https://www.portfolio-pulse-nu.vercel.app",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.add_middleware(SlowAPIMiddleware)


def utc_now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def normalize_optional_email(value: str | None) -> str | None:
    if value is None:
        return None

    normalized = value.strip().lower()
    if not normalized:
        return None
    if "@" not in normalized:
        raise ValueError("Email must be a valid email address")
    return normalized


def coerce_optional_email(value: Any) -> str | None:
    if not isinstance(value, str):
        return None

    try:
        return normalize_optional_email(value)
    except ValueError:
        return None


def to_decimal(value: Decimal | float | int | str) -> Decimal:
    try:
        decimal_value = Decimal(str(value))
    except InvalidOperation as error:
        raise ValueError("Quantity must be numeric") from error

    if decimal_value <= 0:
        raise ValueError("Quantity must be greater than zero")

    return decimal_value


def normalize_holdings(holdings: dict[str, Decimal | float | int | str]) -> dict[str, Decimal]:
    normalized: dict[str, Decimal] = {}

    if not holdings:
        raise ValueError("Portfolio must contain at least one holding")

    for raw_symbol, raw_quantity in holdings.items():
        symbol = raw_symbol.strip().upper()
        if not ALLOWED_SYMBOL_PATTERN.fullmatch(symbol):
            raise ValueError(f"Invalid symbol: {raw_symbol}")

        normalized[symbol] = to_decimal(raw_quantity)

    return normalized


@dataclass(slots=True)
class AuthContext:
    user_id: str
    session_id: str | None
    email: str | None
    claims: dict[str, Any]


@dataclass(slots=True)
class PortfolioDocument:
    user_id: str
    email: str | None
    holdings: dict[str, Decimal]
    source: str | None
    schema_version: int
    created_at: str | None
    updated_at: str | None
    legacy_migrated: bool = False


class ReplacePortfolioRequest(BaseModel):
    model_config = ConfigDict(extra="forbid")

    email: str | None = None
    holdings: dict[str, Decimal] = Field(min_length=1)
    source: str = "manual_upload"

    @field_validator("email")
    @classmethod
    def validate_email(cls, value: str | None) -> str | None:
        return normalize_optional_email(value)

    @field_validator("source")
    @classmethod
    def validate_source(cls, value: str) -> str:
        normalized = value.strip().lower()
        if not normalized:
            raise ValueError("Source cannot be empty")
        return normalized

    @field_validator("holdings")
    @classmethod
    def validate_holdings(cls, value: dict[str, Decimal]) -> dict[str, Decimal]:
        return normalize_holdings(value)


class DeletePortfolioRequest(BaseModel):
    model_config = ConfigDict(extra="forbid")

    email: str | None = None

    @field_validator("email")
    @classmethod
    def validate_email(cls, value: str | None) -> str | None:
        return normalize_optional_email(value)


class PortfolioResponse(BaseModel):
    email: str | None
    holdings: dict[str, float]
    source: str | None
    schema_version: int
    created_at: str | None
    updated_at: str | None
    legacy_migrated: bool = False


class DeletePortfolioResponse(BaseModel):
    message: str
    deleted: bool


class ExtractSymbolsResponse(BaseModel):
    filename: str
    extracted_text: dict[str, float]


class PortfolioRepository(Protocol):
    def get_portfolio(self, user_id: str, email: str | None = None) -> PortfolioDocument | None:
        ...

    def replace_portfolio(
        self,
        user_id: str,
        holdings: dict[str, Decimal],
        email: str | None,
        source: str,
        auth_email: str | None = None,
    ) -> PortfolioDocument:
        ...

    def delete_portfolio(
        self,
        user_id: str,
        email: str | None = None,
        auth_email: str | None = None,
    ) -> bool:
        ...


class DynamoDBPortfolioRepository:
    def __init__(self, table: Any):
        self.table = table

    def get_portfolio(self, user_id: str, email: str | None = None) -> PortfolioDocument | None:
        current_items = self._query_items(user_id)
        document = self._build_document(user_id=user_id, items=current_items)
        if document is not None:
            return document

        if email and email != user_id:
            legacy_items = self._query_items(email)
            document = self._build_document(
                user_id=user_id,
                items=legacy_items,
                fallback_email=email,
                legacy_migrated=True,
            )
            if document is not None:
                return document

        return None

    def replace_portfolio(
        self,
        user_id: str,
        holdings: dict[str, Decimal],
        email: str | None,
        source: str,
        auth_email: str | None = None,
    ) -> PortfolioDocument:
        current_document = self.get_portfolio(user_id=user_id, email=email or auth_email)
        created_at = current_document.created_at if current_document else utc_now_iso()
        updated_at = utc_now_iso()
        resolved_email = normalize_optional_email(email) or auth_email

        self._delete_items(self._query_items(user_id))
        if resolved_email and resolved_email != user_id:
            self._delete_items(self._query_items(resolved_email))

        item = {
            "user": user_id,
            "quantity": PORTFOLIO_RECORD_SORT_KEY,
            "email": resolved_email,
            "positions": holdings,
            "schema_version": 2,
            "source": source,
            "created_at": created_at,
            "updated_at": updated_at,
        }
        self.table.put_item(Item=item)

        return PortfolioDocument(
            user_id=user_id,
            email=resolved_email,
            holdings=holdings,
            source=source,
            schema_version=2,
            created_at=created_at,
            updated_at=updated_at,
            legacy_migrated=bool(current_document and current_document.legacy_migrated),
        )

    def delete_portfolio(
        self,
        user_id: str,
        email: str | None = None,
        auth_email: str | None = None,
    ) -> bool:
        deleted = False
        candidate_keys = [user_id]

        for candidate in (normalize_optional_email(email), auth_email):
            if candidate and candidate not in candidate_keys:
                candidate_keys.append(candidate)

        for candidate_key in candidate_keys:
            items = self._query_items(candidate_key)
            if items:
                self._delete_items(items)
                deleted = True

        return deleted

    def _query_items(self, user_key: str) -> list[dict[str, Any]]:
        if not user_key:
            return []

        response = self.table.query(KeyConditionExpression=Key("user").eq(user_key))
        items = list(response.get("Items", []))

        while "LastEvaluatedKey" in response:
            response = self.table.query(
                KeyConditionExpression=Key("user").eq(user_key),
                ExclusiveStartKey=response["LastEvaluatedKey"],
            )
            items.extend(response.get("Items", []))

        return items

    def _delete_items(self, items: list[dict[str, Any]]) -> None:
        if not items:
            return

        with self.table.batch_writer() as batch:
            for item in items:
                batch.delete_item(
                    Key={
                        "user": item["user"],
                        "quantity": item["quantity"],
                    }
                )

    def _build_document(
        self,
        user_id: str,
        items: list[dict[str, Any]],
        fallback_email: str | None = None,
        legacy_migrated: bool = False,
    ) -> PortfolioDocument | None:
        if not items:
            return None

        for item in items:
            if "positions" in item:
                holdings = normalize_holdings(item["positions"])
                return PortfolioDocument(
                    user_id=user_id,
                    email=coerce_optional_email(item.get("email")) or fallback_email,
                    holdings=holdings,
                    source=item.get("source"),
                    schema_version=int(item.get("schema_version", 2)),
                    created_at=item.get("created_at"),
                    updated_at=item.get("updated_at"),
                    legacy_migrated=legacy_migrated,
                )

        legacy_holdings: dict[str, Decimal] = {}
        for item in items:
            symbol = item.get("symbol")
            quantity = item.get("quantity")
            if not symbol or quantity is None:
                continue
            legacy_holdings[symbol.strip().upper()] = to_decimal(quantity)

        if not legacy_holdings:
            return None

        return PortfolioDocument(
            user_id=user_id,
            email=fallback_email,
            holdings=legacy_holdings,
            source="legacy_import",
            schema_version=1,
            created_at=None,
            updated_at=None,
            legacy_migrated=legacy_migrated,
        )


class PortfolioSummary(BaseModel):
    email: str | None
    holdings: dict[str, float]
    source: str | None
    schema_version: int
    created_at: str | None
    updated_at: str | None
    legacy_migrated: bool

    @classmethod
    def from_document(cls, document: PortfolioDocument) -> "PortfolioSummary":
        return cls(
            email=document.email,
            holdings={symbol: float(quantity) for symbol, quantity in document.holdings.items()},
            source=document.source,
            schema_version=document.schema_version,
            created_at=document.created_at,
            updated_at=document.updated_at,
            legacy_migrated=document.legacy_migrated,
        )


def get_aws_credentials() -> tuple[str | None, str | None, str | None]:
    return (
        os.getenv("AWS_ACCESS_KEY_ID"),
        os.getenv("AWS_SECRET_ACCESS_KEY"),
        os.getenv("AWS_REGION"),
    )


def get_ddb_connection() -> Any:
    aws_access_key_id, aws_secret_access_key, region = get_aws_credentials()
    return boto3.resource(
        "dynamodb",
        region_name=region,
        aws_access_key_id=aws_access_key_id,
        aws_secret_access_key=aws_secret_access_key,
    )


def get_table_name() -> str:
    table_name = os.getenv("TABLE_NAME")
    if not table_name:
        raise HTTPException(status_code=500, detail="TABLE_NAME is not configured")
    return table_name


def get_clerk_jwks_url() -> str:
    jwks_url = os.getenv("CLERK_JWKS_URL")
    issuer = os.getenv("CLERK_JWT_ISSUER")

    if jwks_url:
        return jwks_url
    if issuer:
        return f"{issuer.rstrip('/')}/.well-known/jwks.json"

    raise HTTPException(
        status_code=500,
        detail="Clerk JWT verification is not configured",
    )


@lru_cache(maxsize=1)
def get_jwks_client() -> PyJWKClient:
    return PyJWKClient(get_clerk_jwks_url())


def verify_clerk_session_token(token: str) -> AuthContext:
    issuer = os.getenv("CLERK_JWT_ISSUER")
    audience = os.getenv("CLERK_JWT_AUDIENCE")
    authorized_parties = [
        party.strip()
        for party in os.getenv("CLERK_AUTHORIZED_PARTIES", "").split(",")
        if party.strip()
    ]

    try:
        signing_key = get_jwks_client().get_signing_key_from_jwt(token)
        decode_kwargs: dict[str, Any] = {
            "key": signing_key.key,
            "algorithms": ["RS256"],
            "options": {
                "require": ["exp", "iat", "sub"],
                "verify_aud": bool(audience),
                "verify_iss": bool(issuer),
            },
        }

        if issuer:
            decode_kwargs["issuer"] = issuer
        if audience:
            decode_kwargs["audience"] = audience

        claims = jwt.decode(token, **decode_kwargs)
    except InvalidTokenError as error:
        raise HTTPException(status_code=401, detail="Invalid authentication token") from error

    azp = claims.get("azp")
    if authorized_parties and azp not in authorized_parties:
        raise HTTPException(status_code=401, detail="Token was issued for an unexpected party")

    email = None
    for candidate in (
        claims.get("email"),
        claims.get("primary_email_address"),
        claims.get("email_address"),
    ):
        if isinstance(candidate, str):
            try:
                email = normalize_optional_email(candidate)
            except ValueError:
                email = None
            if email:
                break

    return AuthContext(
        user_id=str(claims["sub"]),
        session_id=str(claims["sid"]) if claims.get("sid") else None,
        email=email,
        claims=claims,
    )


def get_auth_context(
    authorization: Annotated[str | None, Header(alias="Authorization")] = None,
) -> AuthContext:
    if not authorization:
        raise HTTPException(status_code=401, detail="Missing Authorization header")

    scheme, _, token = authorization.partition(" ")
    if scheme.lower() != "bearer" or not token:
        raise HTTPException(status_code=401, detail="Invalid Authorization header")

    return verify_clerk_session_token(token)


def get_portfolio_repository() -> PortfolioRepository:
    dynamodb = get_ddb_connection()
    table = dynamodb.Table(get_table_name())
    return DynamoDBPortfolioRepository(table=table)


def extract_stock_data(text: str) -> dict[str, float]:
    stock_data: dict[str, float] = {}
    pattern = r"([A-Z]{1,5})\s+([\d,\.]+)"
    matches = re.findall(pattern, text.upper())

    for symbol, quantity in matches:
        stock_data[symbol] = round(float(quantity.replace(",", "")), 2)

    return stock_data


def preprocess_image(image_bytes: bytes) -> Any:
    img_array = np.frombuffer(image_bytes, np.uint8)
    img = cv2.imdecode(img_array, cv2.IMREAD_GRAYSCALE)

    if img is None:
        raise ValueError("Failed to load image for preprocessing")

    return cv2.GaussianBlur(img, (1, 1), 0)


@app.get("/")
@limiter.limit("10/minute")
def read_root(request: Request) -> dict[str, str]:
    return {"status": "ok"}


@app.get("/portfolio", response_model=PortfolioResponse)
@limiter.limit("30/minute")
def get_portfolio(
    request: Request,
    auth: Annotated[AuthContext, Depends(get_auth_context)],
    repo: Annotated[PortfolioRepository, Depends(get_portfolio_repository)],
) -> PortfolioSummary:
    document = repo.get_portfolio(user_id=auth.user_id, email=auth.email)
    if document is None:
        raise HTTPException(status_code=404, detail="Portfolio not found")
    return PortfolioSummary.from_document(document)


@app.put("/portfolio", response_model=PortfolioResponse)
@limiter.limit("10/minute")
def replace_portfolio(
    request: Request,
    payload: ReplacePortfolioRequest,
    auth: Annotated[AuthContext, Depends(get_auth_context)],
    repo: Annotated[PortfolioRepository, Depends(get_portfolio_repository)],
) -> PortfolioSummary:
    document = repo.replace_portfolio(
        user_id=auth.user_id,
        holdings=payload.holdings,
        email=payload.email,
        source=payload.source,
        auth_email=auth.email,
    )
    return PortfolioSummary.from_document(document)


@app.delete("/portfolio", response_model=DeletePortfolioResponse)
@limiter.limit("10/minute")
def delete_portfolio(
    request: Request,
    auth: Annotated[AuthContext, Depends(get_auth_context)],
    repo: Annotated[PortfolioRepository, Depends(get_portfolio_repository)],
    payload: DeletePortfolioRequest | None = Body(default=None),
) -> DeletePortfolioResponse:
    email = payload.email if payload else None
    deleted = repo.delete_portfolio(user_id=auth.user_id, email=email, auth_email=auth.email)
    return DeletePortfolioResponse(
        message="Portfolio deleted successfully" if deleted else "Portfolio not found",
        deleted=deleted,
    )


@app.post("/extract-symbols", response_model=ExtractSymbolsResponse)
@limiter.limit("10/minute")
async def create_upload_file(
    request: Request,
    file: UploadFile,
    auth: Annotated[AuthContext, Depends(get_auth_context)],
) -> ExtractSymbolsResponse:
    if not file.filename:
        raise HTTPException(status_code=400, detail="File name is required")

    file_data = await file.read()
    if not file_data:
        raise HTTPException(status_code=400, detail="Uploaded file is empty")

    if file.filename.lower().endswith(".pdf"):
        images = convert_from_bytes(file_data)
        extracted_text = ""

        for image in images:
            img_byte_array = io.BytesIO()
            image.save(img_byte_array, format="PNG")
            preprocessed_img = preprocess_image(img_byte_array.getvalue())
            extracted_text += pytesseract.image_to_string(preprocessed_img) + "\n"
    else:
        preprocessed_img = preprocess_image(file_data)
        extracted_text = pytesseract.image_to_string(preprocessed_img)

    return ExtractSymbolsResponse(
        filename=file.filename,
        extracted_text=extract_stock_data(extracted_text),
    )
