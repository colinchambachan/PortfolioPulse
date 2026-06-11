# Dev Environment

## Purpose

This document defines the minimum dev environment for the active PortfolioPulse architecture.

The goal is to support the real app loop:

1. Sign in with Clerk
2. Upload a portfolio file
3. Extract symbols through FastAPI
4. Save the portfolio to DynamoDB
5. Read or delete the saved portfolio

This is intentionally smaller than "all AWS infrastructure." The old AWS ingestion pipeline remains in the repo for reference, but it is not required for the current dev environment.

## Active Dev Architecture

### Canonical App Path

- `client/` deployed frontend
- `server/` FastAPI backend
- AWS DynamoDB table for portfolio persistence
- Clerk for auth/session tokens

### Reference-Only Path

- `aws/SymbolDetection/`
- `aws/SymbolProcessing/`

These are legacy/reference artifacts and are not required for the active dev environment.

## Current Dev Resources

- AWS account: `335777330661`
- AWS region: `us-east-1`
- Existing legacy/shared table: `portfolio_symbols`
- Dedicated dev table: `portfolio_symbols_dev`

## Minimum Required Services

### Frontend

- Existing real dev frontend deployment
- Clerk publishable key configured
- `NEXT_PUBLIC_API_URL` pointing at the dev backend

### Backend

- FastAPI deployment or local server
- Access to DynamoDB dev table
- Clerk JWT verification configured

### Database

- DynamoDB table: `portfolio_symbols_dev`

Current compatible schema for the active server code:

- Partition key: `user` (`S`)
- Sort key: `quantity` (`N`)

Note:
This schema is only the compatibility shape needed to get dev online safely. It is not the long-term recommended schema. A later migration should move to a cleaner portfolio model.

## Required Environment Variables

### Frontend

Set in `client/.env.local` for local work or your frontend host for deployed dev:

```bash
NEXT_PUBLIC_API_URL=https://your-dev-api-url
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_replace_me
CLERK_SECRET_KEY=sk_test_replace_me
```

### Backend

Set in `server/.env` locally or in your backend host:

```bash
AWS_ACCESS_KEY_ID=replace_me
AWS_SECRET_ACCESS_KEY=replace_me
AWS_REGION=us-east-1
TABLE_NAME=portfolio_symbols_dev
CLERK_JWT_ISSUER=https://your-clerk-issuer
# Optional alternative:
CLERK_JWKS_URL=https://your-clerk-issuer/.well-known/jwks.json
CLERK_AUTHORIZED_PARTIES=https://your-frontend-dev-url
```

## Local Verification Flow

### 1. Run the Backend

```bash
cd server
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
```

### 2. Point the Frontend at the Local Backend

```bash
cd client
npm install
npm run dev
```

Use:

- `NEXT_PUBLIC_API_URL=http://localhost:8000`

### 3. Verify the Real App Loop

1. Sign in through Clerk
2. Upload a sample file or use the sample portfolio
3. Confirm `PUT /portfolio` succeeds
4. Confirm `GET /portfolio` returns saved data
5. Confirm `DELETE /portfolio` removes the portfolio

## Hosted Dev Setup

### Recommended Layout

- Frontend: Vercel
- Backend: Render or Railway
- Database: DynamoDB in `us-east-1`
- Auth: Clerk dev instance

### Render Blueprint

The repo includes a Render blueprint for the dev backend:

- [render.yaml](../render.yaml)

It defines:

- service name: `portfoliopulse-api-dev`
- runtime: Docker
- root directory: `server/`
- branch: `dev`
- health check: `/`

Set these values manually in Render because they are secrets or deployment-specific:

- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `CLERK_AUTHORIZED_PARTIES`

After the service is created, set `CLERK_AUTHORIZED_PARTIES` to the exact frontend origin that will call the backend, for example:

```bash
https://your-frontend-dev-url.vercel.app
```

### Deployment Order

1. Ensure the dev DynamoDB table exists
2. Create the Render service from `render.yaml`
3. Configure backend env vars
4. Set `NEXT_PUBLIC_API_URL` in the frontend deployment
5. Verify token-authenticated requests across deployed frontend and backend

## AWS CLI Commands Used

### Create the Compatible Dev Table

```bash
./scripts/aws/create_dev_table.sh
```

### Inspect the Table

```bash
aws dynamodb describe-table \
  --table-name portfolio_symbols_dev \
  --region us-east-1
```

## Important Notes

- Do not use the root AWS account for long-term backend deployments. The current CLI session resolves to the AWS root account, which is acceptable for bootstrapping but not for a durable setup.
- The current server code supports the dev table and legacy records, but the table schema should still be migrated later.
- The AWS email delivery flow can be added back once the deployed FastAPI loop is stable.

## Next Steps After Dev Comes Online

1. Deploy the FastAPI server to a real dev URL
2. Point the frontend dev deployment at that server
3. Smoke test the full authenticated portfolio flow
4. Decide whether to add the daily email path next or build the first monetizable dashboard feature
