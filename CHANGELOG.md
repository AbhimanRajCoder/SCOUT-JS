# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-11-08

### Added
- **Core Route Discovery Engine:**
  - Automatic runtime route discovery across all standard HTTP methods (`GET`, `POST`, `PUT`, `PATCH`, `DELETE`, `OPTIONS`, `HEAD`, `ALL`).
  - Bi-directional detection for routes registered both before and after `autoDocs()` initialization.
  - Multi-level nested router mount prefix resolution (`/api/v1/users/{id}`).
  - Route chaining support via `app.route('/path')`.
  - Express 4 and Express 5 safe router introspection adapters.
  - Express parameter conversion (`:param` to OpenAPI `{param}`).
  - Endpoint discovery status tracking (`discovered`, `partial`, `unsupported`, `excluded`).

- **OpenAPI 3.1 Spec Generator:**
  - Valid OpenAPI 3.1.0 JSON export (`/openapi.json`).
  - Zero-dependency built-in pure JavaScript YAML export (`/openapi.yaml`).
  - Strict compliance with Principle 3: Never fabricate schemas or examples.
  - Deterministic operationId and tag generation.
  - In-memory document caching with sub-millisecond retrieval.

- **FastAPI / Swagger-Level Interactive UI:**
  - Perk-themed design layout: electric lime on warm parchment paper.
  - Multi-language live code snippets (cURL, JavaScript Fetch, Axios, Python Requests, Go `net/http`) with live parameter synchronization and preferred language persistence.
  - Tag grouping with collapsible accordions.
  - Parameter tables with type indicators, locations (path, query, header), and required markers.
  - Example Value vs. Schema tab toggling for request body and responses.
  - Interactive "Try it out" API playground with pre-filled example payloads.
  - In-browser request execution with duration timings, status badges, response headers, and JSON formatting.
  - Generated cURL snippets with single-click copy.
  - Authorization modal for persistent Bearer tokens and API keys.
  - Real-time instant search and endpoint filtering.
  - 100% offline-ready with zero external CDN dependencies.

- **Developer Ergonomics & Typing:**
  - `describeRoute()` middleware helper for summary, description, tags, query, headers, body, and responses.
  - Runtime request validation (`validate: true` or `{ body, query, params, headers }`) supporting Zod and standard JSON Schema.
  - Automatic coercion for query and path parameters (e.g. string numbers and booleans).
  - FastAPI-style response serialization and sensitive field filtering (`responseModel` / `serialize: true`) with automatic stripping of unlisted database fields.
  - Built-in Mock Server Engine generating deterministic mock responses via `/docs/mock/*`, `X-Scout-Mock: true` header, or UI Mock Mode toggle.
  - Standardized 400 Bad Request error payload with issue details (`field`, `message`, `code`) and customizable `onValidationError` handler.
  - Auto-documentation of 400 Bad Request responses in OpenAPI paths when validation is active.
  - Full TypeScript definitions in `index.d.ts` for IDE autocomplete and type safety.
  - Pure JavaScript schema converter with automatic Zod schema support.

- **Dual Distribution & Packaging:**
  - Dual ESM (`import`) and CommonJS (`require`) export support.
  - Clean npm package bundle (< 30 kB unpacked).

