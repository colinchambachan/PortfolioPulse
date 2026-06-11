# PortfolioPulse

[https://www.portfoliopulse.xyz](https://www.portfoliopulse.xyz)

Daily portfolio-aware market updates based on a user's holdings.

## Current Shape

PortfolioPulse is split into three layers:

- `client/`: Next.js 16 + React 19 frontend with Clerk auth and a marketing/onboarding flow.
- `server/`: FastAPI service for OCR extraction and portfolio subscription management.
- `aws/`: Lambda-based ingestion and email delivery experiments/prototypes.

The product concept is clear and the frontend is in decent shape. The current priority is hardening the core platform so auth, persistence, ingestion, and delivery are reliable enough to build on.

## Core Docs

- [Core Platform Stabilization Spec](docs/core-platform-stabilization-spec.md)
- [Repo Maintenance Backlog](docs/repo-maintenance-backlog.md)
- [Dev Environment](docs/DEV_ENVIRONMENT.md)

## Deployment

- Render backend blueprint: [render.yaml](render.yaml)

These two docs are the working source of truth for the next phase of the project.

## Local Development

### Client

```bash
cd client
npm install
npm run dev
```

Required env file:

- `client/.env.local`
- Example template: `client/.env.example`

### Server

```bash
cd server
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
```

Required env file:

- `server/.env`
- Example template: `server/.env.example`
- For authenticated API verification, configure either `CLERK_JWT_ISSUER` or `CLERK_JWKS_URL`

### Verification

```bash
cd client && npm run lint && npm run build
cd server && python3 -m py_compile main.py && . .venv/bin/activate && python -m unittest discover -s tests -p 'test_*.py'
```

## Tech Stack

- Frontend: Next.js 16, React 19, TypeScript, Tailwind CSS, Clerk, TanStack Query
- Backend: FastAPI, Tesseract, OpenCV, Pillow, pdf2image, DynamoDB via boto3
- Cloud/prototypes: AWS Lambda, SES, SNS, S3, DynamoDB, Textract

## Near-Term Direction

- Lock down identity and API authorization
- Clean up the DynamoDB data model and deletion path
- Make ingestion and daily delivery user-aware rather than hard-coded
- Add tests, docs, and observability before expanding the feature surface
