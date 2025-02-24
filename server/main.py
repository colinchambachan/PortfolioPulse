from typing import Union
from decimal import Decimal
from fastapi import FastAPI, File, UploadFile, Request, HTTPException
from fastapi.responses import JSONResponse
import pytesseract
from PIL import Image
import io
from pdf2image import convert_from_bytes
import re
from fastapi.middleware.cors import CORSMiddleware
import os
import boto3
from slowapi import Limiter
from slowapi.util import get_remote_address
from slowapi.middleware import SlowAPIMiddleware
from slowapi.errors import RateLimitExceeded
from dotenv import load_dotenv
import cv2
import numpy as np

app = FastAPI()

# Load environment variables from the .env file
load_dotenv()

# Initialize the Limiter
limiter = Limiter(key_func=get_remote_address)

# Add the SlowAPI middleware
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, lambda request, exc: JSONResponse(
    status_code=429,
    content={"message": "Rate limit exceeded"}
))
app.add_middleware(SlowAPIMiddleware)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://portfoliopulse.xyz", "https://www.portfoliopulse.xyz", "https://portfolio-pulse-nu.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_aws_credentials():
    aws_access_key_id = os.getenv("AWS_ACCESS_KEY_ID")
    aws_secret_access_key = os.getenv("AWS_SECRET_ACCESS_KEY")
    region = os.getenv("AWS_REGION")
    return aws_access_key_id, aws_secret_access_key, region

def get_ddb_connection():
    aws_access_key_id, aws_secret_access_key, region = get_aws_credentials()
    dynamodb = boto3.resource(
        'dynamodb',
        region_name=region,
        aws_access_key_id=aws_access_key_id,
        aws_secret_access_key=aws_secret_access_key
    )
    return dynamodb

@app.get("/")
@limiter.limit("5/minute")
def read_root(request: Request, user: Union[str, None] = None):
    return {"Hello": user}

@app.post("/user")
@limiter.limit("2/minute")
async def create_user(request: Request, obj: dict):
    try:
        ddb = get_ddb_connection()
        TABLE_NAME = os.getenv("TABLE_NAME")
        table = ddb.Table(TABLE_NAME)
        # iterate over symbols and add to table accordinly
        for symbol, quantity in obj["portfolio"].items():
            try:
                table.put_item(
                    Item={
                        "user": obj["email"],
                        "quantity": Decimal(str(quantity)),
                        "symbol": str(symbol),
                        "unique_key": f"{obj['email']}_{symbol}"
                    },
                    ConditionExpression="attribute_not_exists(unique_key)" # avoid collisions
                )
            except ddb.meta.client.exceptions.ConditionalCheckFailedException:
                continue
        return {"message": "User created successfully!"}
    except Exception as error:
        raise HTTPException(status_code=500, detail=str(error))
        # return {"error": str(error)}

@app.delete("/user")
@limiter.limit("5/minute")
async def delete_user(request: Request, email: str):
    try:
        ddb = get_ddb_connection()
        TABLE_NAME = os.getenv("TABLE_NAME")
        table = ddb.Table(TABLE_NAME)
        scan = table.scan()
        # Iterate over table and delete rows with inputted email
        with table.batch_writer() as batch:
            for each in scan['Items']:
                if each['user'] == email:
                    batch.delete_item(Key={
                        "user": email,
                        "quantity": each['quantity'],
                        # "symbol": each['symbol'],
                        # "unique_key": each['unique_key']
                    })
        response = {"message": f"All items with user {email} have been deleted."}
        return response
    except Exception as error:
        raise HTTPException(status_code=500, detail=str(error))
        # return {"error": str(error)}

def extract_stock_data(text: str):
    stock_data = {}

    # Match stock symbols and quantities
    pattern = r"([A-Z]{2,4})\s+([\d,\.]+)"
    matches = re.findall(pattern, text)

    for match in matches:
        symbol, quantity = match
        stock_data[symbol] = round(float(quantity.replace(",", "")), 2)
    
    return stock_data

def preprocess_image(image_bytes):
    img_array = np.frombuffer(image_bytes, np.uint8)
    img = cv2.imdecode(img_array, cv2.IMREAD_GRAYSCALE)

    if img is None:
        raise ValueError("Failed to load image for preprocessing")

    # Denoise with minor Gaussian blur and adaptive threshold
    img = cv2.GaussianBlur(img, (3, 3), 0)
    # img = cv2.adaptiveThreshold(img, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, 
    #                             cv2.THRESH_BINARY, 11, 2)

    return img

@app.post("/extract-symbols")
async def create_upload_file(file: UploadFile):
    file_data = await file.read()

    # Convert PDF to images
    if file.filename.endswith(".pdf"):
        images = convert_from_bytes(file_data)
        extracted_text = ""

        for img in images:
            img_byte_array = io.BytesIO()
            img.save(img_byte_array, format="PNG")
            preprocessed_img = preprocess_image(img_byte_array.getvalue())
            extracted_text += pytesseract.image_to_string(preprocessed_img) + "\n"

    # Handle image files
    else:
        image = Image.open(io.BytesIO(file_data))
        
        preprocessed_img = preprocess_image(file_data)
        extracted_text = pytesseract.image_to_string(preprocessed_img)

    stock_data = extract_stock_data(extracted_text)

    return {"filename": file.filename, "extracted_text": stock_data}







