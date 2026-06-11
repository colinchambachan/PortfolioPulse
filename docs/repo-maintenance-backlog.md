# Repo Maintenance Backlog

## Purpose

This is the running debt tracker for PortfolioPulse. It is intentionally practical: each item should either be actionable now, explicitly deferred, or removed once complete.

## Priority Legend

- `P0`: blocking or unsafe
- `P1`: should be addressed before major feature work
- `P2`: worthwhile cleanup that can follow stabilization

## P0

- `Auth`: verify Clerk identity in FastAPI and stop trusting caller-supplied email.
  Status: completed for the FastAPI portfolio path
  Files: `server/main.py`, `client/app/start/page.tsx`, `client/app/configure/page.tsx`

- `Portfolio contract`: replace raw `dict` payloads with Pydantic request/response models.
  Status: completed for the FastAPI portfolio path
  Files: `server/main.py`

- `Delete semantics`: remove scan-based delete logic and use a user-scoped query/key strategy.
  Status: completed for the FastAPI portfolio path
  Files: `server/main.py`

- `Hard-coded pipeline users`: remove hard-coded user assumptions from AWS lambdas.
  Status: in progress
  Files: `aws/EmailFunction/ses_lambda_function.py`, `aws/SymbolProcessing/symbol_processing.py`

- `Data model spec`: document the canonical DynamoDB schema and API behavior.
  Status: open
  Files: `docs/core-platform-stabilization-spec.md`

## P1

- `Server tests`: add pytest coverage for extract/create/delete/replace flows.
  Status: open
  Files: `server/`

- `Extraction robustness`: add tests for OCR parsing edge cases and validation failures.
  Status: open
  Files: `server/main.py`

- `Env normalization`: standardize env names across FastAPI and AWS code.
  Status: open
  Files: `server/main.py`, `aws/`

- `Logging`: replace debug prints with structured logging and error context.
  Status: open
  Files: `server/main.py`, `aws/`

- `Duplicate UI primitives`: decide whether `client/app/components/ui` is legacy and remove or consolidate it.
  Status: open
  Files: `client/app/components/ui`, `client/components/ui`

- `Route naming`: decide whether `/start` is a true dashboard or an onboarding step and rename if needed.
  Status: open
  Files: `client/app/start/page.tsx`, `client/app/components/Navbar.tsx`

## P2

- `README drift`: keep stack/version and workflow docs current as implementation changes.
  Status: in progress
  Files: `README.md`

- `Lint ergonomics`: maintain the flat ESLint config and keep generated files ignored.
  Status: in progress
  Files: `client/package.json`, `client/eslint.config.mjs`

- `Env examples`: keep example env files aligned with active runtime requirements.
  Status: in progress
  Files: `client/.env.example`, `server/.env.example`, `aws/.env.example`

- `Docker docs`: replace template Docker README content with repo-specific instructions.
  Status: open
  Files: `server/README.Docker.md`, `server/compose.yaml`

- `Client polish`: reduce leftover placeholder language such as "Dashboard" for onboarding-only pages.
  Status: open
  Files: `client/app/components/Navbar.tsx`, `client/app/pro/page.tsx`

- `Footer drift`: remove hard-coded years from static pages.
  Status: open
  Files: `client/app/configure/page.tsx`

## Completed in This Pass

- Added a root stabilization spec.
- Added a repo maintenance backlog.
- Fixed frontend lint script drift.
- Configured ESLint to ignore generated output.
- Replaced CommonJS `require()` usage in Tailwind config.
- Added env example templates.
- Updated the root README to reflect the repo's current direction.
- Implemented authenticated FastAPI portfolio endpoints backed by Clerk Bearer tokens.
- Replaced the legacy `/user` flow in the client with authenticated `/portfolio` requests.
- Added server tests for the portfolio lifecycle.
- Updated the SES email lambda to process all stored portfolios instead of one hard-coded user.
