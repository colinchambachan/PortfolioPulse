# Core Platform Stabilization Spec

## Purpose

Turn PortfolioPulse from a promising prototype into a stable application foundation that can safely support continued feature work.

This spec is focused on hardening the current product path rather than expanding scope. The goal is to make user identity, portfolio storage, extraction, and daily delivery trustworthy and maintainable.

## Problem Statement

The repo already has a working concept and a presentable frontend, but the core platform has four classes of risk:

1. Identity and authorization are not enforced on the backend.
2. The data model is inconsistent across the app and AWS pipeline.
3. Operational flows still contain prototype assumptions and hard-coded users.
4. Tooling, docs, and tests are not yet strong enough to support fast iteration.

## Goals

1. Every write, read, and delete operation must be tied to an authenticated user.
2. Portfolio records must use an explicit, documented storage model that supports deterministic create, update, and delete flows.
3. The ingestion and daily email pipeline must operate on real user data, not hard-coded values.
4. Local development, verification, and onboarding must be straightforward.
5. The repo must have enough tests and documentation to reduce rework.

## Non-Goals

1. Rebuilding the product UI from scratch.
2. Implementing full analytics, recommendations, or a pro billing system in this phase.
3. Migrating cloud providers during stabilization.

## Current Risks

### Authentication and Identity

- `server/main.py` accepts arbitrary request bodies and trusts caller-provided `email`.
- Deletion is triggered by query string email, which allows cross-user actions if the endpoint is reachable.
- The client sends `clerk_id` and `tier`, but the server ignores them.

### Persistence

- The FastAPI path writes `user`, `quantity`, `symbol`, and `unique_key`, but the delete path scans and deletes by a different key shape.
- The AWS lambdas use different environment variable names and different item shapes.
- There is no clear source of truth for whether the unit of storage is:
  - one record per user
  - one record per user/symbol
  - one record per upload

### Pipeline Correctness

- The email lambda filters for one hard-coded user.
- The symbol processing lambda writes a hard-coded `user`.
- There is no explicit orchestration contract for upload -&gt; extraction -&gt; persistence -&gt; daily send.

### Operational Quality

- Limited tests exist for the main app path.
- Env setup is implicit.
- Docs and scripts had drifted from the current framework versions.

## Target Architecture

### Identity Contract

1. Clerk remains the frontend identity provider.
2. The FastAPI service verifies a Clerk-backed identity token for protected endpoints.
3. The backend derives the user identity from the verified token, not from request body fields.
4. User-controlled input may include portfolio contents, but not authoritative identity fields.

### Portfolio Storage Contract

Preferred model for the stabilization phase:

- One logical portfolio per user.
- One record per `user_id + symbol`.
- Deterministic primary key that does not depend on quantity.

Recommended logical fields:

- `user_id`
- `email`
- `symbol`
- `quantity`
- `source`
- `tier`
- `created_at`
- `updated_at`

Recommended key strategy:

- Partition key: `user_id`
- Sort key: `symbol`

This model keeps deletes simple, prevents quantity-based key mistakes, and makes per-user queries efficient.

## Required Backend Changes

### Phase 1: API Hardening

1. Introduce request models with Pydantic.
2. Add authenticated dependency/middleware for protected routes.
3. Remove trust in caller-supplied email/query identity.
4. Validate payload shape and symbol/quantity values.
5. Return normalized error responses.

Acceptance criteria:

- Unauthenticated requests to protected endpoints fail.
- A user can only create, replace, or delete their own portfolio.
- Invalid payloads return 4xx instead of generic 500s.

### Phase 2: Data Model Cleanup

1. Document the DynamoDB schema in-repo.
2. Update create flow to use the new key model.
3. Replace scan-based delete with user-scoped query/delete.
4. Decide whether create means merge or replace.
5. Add idempotency expectations for repeated uploads.

Recommended behavior:

- `PUT /portfolio`: replace current holdings for the authenticated user.
- `DELETE /portfolio`: remove all holdings for the authenticated user.
- `POST /extract-symbols`: extract holdings only; do not persist.

Acceptance criteria:

- Re-uploading a portfolio cannot leave orphan rows.
- Delete does not depend on quantity values.
- The API contract is explicit and documented.

### Phase 3: Extraction Hardening

1. Validate file type and file size on both client and server.
2. Add structured extraction errors.
3. Add tests around OCR parsing edge cases.
4. Track extraction confidence or at least ambiguous rows for manual review.

Acceptance criteria:

- Invalid files fail predictably.
- OCR edge cases are covered by tests.
- The frontend can distinguish upload failure from parse failure.

## Required AWS / Delivery Changes

### Phase 4: Remove Prototype Assumptions

1. Remove hard-coded user/email assumptions from lambdas.
2. Normalize environment variable names across lambdas.
3. Make the daily email job iterate through real subscribed users.
4. Separate email rendering from user selection and news fetching.

Acceptance criteria:

- No hard-coded user identifiers remain in pipeline code.
- One daily run can process multiple users safely.
- The email job can be tested with fixture data.

### Phase 5: Delivery Safety

1. Add retry/error logging around external calls.
2. Bound news requests and email sends to avoid noisy failures.
3. Define subscription state for free/pro users.
4. Decide whether the AWS pipeline remains the main path or is treated as legacy while the FastAPI path becomes canonical.

## Testing Strategy

### Minimum Required Coverage

1. FastAPI unit tests for request validation and auth enforcement.
2. FastAPI integration tests for create/replace/delete portfolio behavior.
3. Parsing tests for `extract_stock_data`.
4. Lambda tests for user iteration and email payload generation.

Suggested tooling:

- `pytest`
- `httpx` / `TestClient`
- fixture-based OCR text samples

## Observability and Ops

1. Replace ad hoc prints with structured logging.
2. Add request IDs where practical.
3. Document rate limits and failure modes.
4. Add health/readiness endpoints if the server becomes a longer-lived production service.

## Repo/Developer Experience Requirements

1. Working lint and build scripts.
2. `.env.example` files for each active area.
3. One root README that reflects the current stack and points to active docs.
4. A tracked debt backlog that can be pruned as work lands.

## Milestones

### Milestone 1: Secure API Boundary

- Authenticated portfolio endpoints
- Typed request/response models
- Consistent error handling

### Milestone 2: Stable Persistence

- New DynamoDB key model
- Replace/clear portfolio semantics
- Migration notes if needed

### Milestone 3: Reliable Delivery Path

- Hard-coded pipeline assumptions removed
- Multi-user email flow
- Better logging and tests

### Milestone 4: Feature-Ready Foundation

- Core tests in place
- Docs current
- Local setup predictable

## Open Decisions

1. Should the canonical portfolio system live in FastAPI only, or remain split with AWS lambdas?
2. Should uploads store the original document temporarily for audit/debug, or never store it at all?
3. Should free/pro tiers be enforced at write time, send time, or both?
4. Is email the only supported delivery surface, or should a dashboard become the canonical read model next?

## Immediate Implementation Order

1. Fix API auth and portfolio endpoint contracts.
2. Clean up the DynamoDB schema and delete semantics.
3. Add server tests for the portfolio lifecycle.
4. Remove hard-coded users from AWS code.
5. Add logging, env normalization, and stronger docs.

