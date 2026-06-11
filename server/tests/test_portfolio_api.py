import unittest
from decimal import Decimal
from pathlib import Path
import sys

from fastapi.testclient import TestClient

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

import main


class InMemoryPortfolioRepository:
    def __init__(self):
        self.portfolios: dict[str, main.PortfolioDocument] = {}
        self.legacy_portfolios: dict[str, main.PortfolioDocument] = {}

    def get_portfolio(self, user_id: str, email: str | None = None) -> main.PortfolioDocument | None:
        if user_id in self.portfolios:
            return self.portfolios[user_id]
        if email and email in self.legacy_portfolios:
            legacy_document = self.legacy_portfolios[email]
            return main.PortfolioDocument(
                user_id=user_id,
                email=email,
                holdings=legacy_document.holdings,
                source=legacy_document.source,
                schema_version=legacy_document.schema_version,
                created_at=legacy_document.created_at,
                updated_at=legacy_document.updated_at,
                legacy_migrated=True,
            )
        return None

    def replace_portfolio(
        self,
        user_id: str,
        holdings: dict[str, Decimal],
        email: str | None,
        source: str,
        auth_email: str | None = None,
    ) -> main.PortfolioDocument:
        resolved_email = email or auth_email
        document = main.PortfolioDocument(
            user_id=user_id,
            email=resolved_email,
            holdings=holdings,
            source=source,
            schema_version=2,
            created_at="2026-04-14T00:00:00+00:00",
            updated_at="2026-04-14T00:00:00+00:00",
            legacy_migrated=bool(resolved_email and resolved_email in self.legacy_portfolios),
        )
        self.portfolios[user_id] = document
        if resolved_email:
            self.legacy_portfolios.pop(resolved_email, None)
        return document

    def delete_portfolio(
        self,
        user_id: str,
        email: str | None = None,
        auth_email: str | None = None,
    ) -> bool:
        deleted = self.portfolios.pop(user_id, None) is not None
        for candidate in (email, auth_email):
            if candidate:
                deleted = self.legacy_portfolios.pop(candidate, None) is not None or deleted
        return deleted


class PortfolioApiTests(unittest.TestCase):
    def setUp(self):
        self.repo = InMemoryPortfolioRepository()
        self.client = TestClient(main.app)
        main.app.dependency_overrides[main.get_auth_context] = lambda: main.AuthContext(
            user_id="user_123",
            session_id="sess_123",
            email="user@example.com",
            claims={"sub": "user_123"},
        )
        main.app.dependency_overrides[main.get_portfolio_repository] = lambda: self.repo

    def tearDown(self):
        main.app.dependency_overrides.clear()

    def test_replace_get_and_delete_portfolio(self):
        replace_response = self.client.put(
            "/portfolio",
            json={
                "email": "User@Example.com",
                "holdings": {"aapl": "10", "nvda": 5},
                "source": "manual_upload",
            },
        )

        self.assertEqual(replace_response.status_code, 200)
        self.assertEqual(
            replace_response.json()["holdings"],
            {"AAPL": 10.0, "NVDA": 5.0},
        )

        get_response = self.client.get("/portfolio")
        self.assertEqual(get_response.status_code, 200)
        self.assertEqual(get_response.json()["email"], "user@example.com")

        delete_response = self.client.request(
            "DELETE",
            "/portfolio",
            json={"email": "user@example.com"},
        )
        self.assertEqual(delete_response.status_code, 200)
        self.assertTrue(delete_response.json()["deleted"])

        missing_response = self.client.get("/portfolio")
        self.assertEqual(missing_response.status_code, 404)

    def test_replace_portfolio_rejects_invalid_holdings(self):
        response = self.client.put(
            "/portfolio",
            json={
                "email": "user@example.com",
                "holdings": {"AAPL": 0},
                "source": "manual_upload",
            },
        )

        self.assertEqual(response.status_code, 422)

    def test_replace_portfolio_migrates_legacy_email_keyed_portfolio(self):
        self.repo.legacy_portfolios["user@example.com"] = main.PortfolioDocument(
            user_id="user@example.com",
            email="user@example.com",
            holdings={"MSFT": Decimal("12")},
            source="legacy_import",
            schema_version=1,
            created_at=None,
            updated_at=None,
            legacy_migrated=False,
        )

        response = self.client.put(
            "/portfolio",
            json={
                "email": "user@example.com",
                "holdings": {"MSFT": 15},
                "source": "manual_upload",
            },
        )

        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.json()["legacy_migrated"])
        self.assertNotIn("user@example.com", self.repo.legacy_portfolios)

    def test_missing_authorization_header_returns_401(self):
        del main.app.dependency_overrides[main.get_auth_context]
        response = self.client.get("/portfolio")
        self.assertEqual(response.status_code, 401)


if __name__ == "__main__":
    unittest.main()
