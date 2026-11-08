# PRD: SCOUT-JS

**Version:** 1.0 (MVP)
**Name:** SCOUT-JS (npm package: `scout-js`). Check npm availability and trademarks before committing.

---

## 1. Overview

### Vision
Make Express.js APIs self-documenting. Install one package, register it with your app, and get interactive API documentation without writing Swagger annotations or YAML files.

### Problem
Express has no built-in link between routes, schemas and documentation (unlike FastAPI). Developers must write routes, Swagger annotations and OpenAPI specs separately, then keep them in sync by hand. This causes documentation drift.

### Solution
A runtime documentation engine that discovers registered Express routes, builds an OpenAPI 3.1 spec, and serves a custom interactive docs UI.

```js
import express from "express";
import { autoDocs } from "scout-js";

const app = express();
app.get("/users/:id", (req, res) => res.json({ id: req.params.id }));

autoDocs(app, { info: { title: "My API", version: "1.0.0" } });
app.listen(3000);
```

| Endpoint | Purpose |
| --- | --- |
| `/docs` | Interactive documentation UI |
| `/openapi.json` | Generated OpenAPI spec |
| `/openapi.yaml` | YAML export |
| `/docs/health` | Engine health |

---

## 2. Goals and Non-Goals

### Goals
- Zero-config route discovery for common Express apps
- Valid OpenAPI 3.1 output
- Custom, fast, accessible docs UI with a try-it playground
- Secure by default in production

### Non-Goals (v1)
- Inferring request/response schemas from handler code
- Wrapping Swagger UI or Scalar
- Supporting frameworks other than Express
- Hosted/commercial features

### Product Principles
1. Zero configuration by default.
2. Docs reflect actually registered routes.
3. **Never fabricate schemas or examples.** Unknown means unknown.
4. Minimal changes to existing apps.
5. Output follows OpenAPI standards.
6. UI is independent of Express internals.
7. Secure by default.

---

## 3. Target Users

Node.js / Express backend developers, full-stack developers, indie hackers, and startup engineering teams.

---

## 4. Functional Requirements

### P0 (MVP critical)

**FR-01 Route discovery**
- Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS, HEAD, ALL
- Routes registered before and after `autoDocs()`
- Nested routers with preserved mount prefixes
- `app.route()` chaining
- Convert `:id` to `{id}`; detect duplicates
- Do not rely only on private `_router` / `router.stack`; use instrumentation plus version-specific fallback adapters (Express 4 and 5)
- Report a status per endpoint: `discovered`, `partial`, `unsupported`, `excluded`. Never silently omit a route.

**FR-02 Metadata extraction** (only what is safely observable)

| Metadata | Discovery |
| --- | --- |
| Method, path, path params, router hierarchy | Automatic |
| Middleware chain, handler names | Partial / best effort |
| Request body, response structure | Not inferable; must be explicit |
| Authentication | Explicit config only |

**FR-03 OpenAPI generation**
- Valid OpenAPI 3.1 JSON, validated before serving
- Path params always `required`
- Reusable schemas under `components.schemas`
- Unknown schemas are left unspecified

**FR-04 Documentation UI**
- Light/dark/system themes, sidebar navigation, method badges, search
- Parameter tables, request/response schema viewer, auth panel
- cURL and code samples (generated from the OpenAPI doc)
- Responsive layout; works without external CDNs

**FR-05 Playground**
- Select endpoint, set path/query params, headers, body, auth; execute; view status, headers, duration, body
- Warn before production requests
- Restrict requests to the configured API origin or an allowlist
- Never send credentials to external hosts; never expose server secrets

### P1

**FR-06 Optional developer metadata**
- `describeRoute({ summary, tags, body, responses })` as optional enrichment
- Zod as an optional integration, not a hard dependency

**FR-07 Production controls**
- Enable/disable docs, custom docs and spec paths
- Protect docs with authentication
- Include/exclude route filters, custom server URL
- Configurable caching, safe error handling

---

## 5. Public API (v1)

```ts
interface AutoDocsOptions {
  info: { title: string; version: string; description?: string };
  docs?: { enabled?: boolean; path?: string; theme?: "light" | "dark" | "system" };
  openapi?: { path?: string; version?: "3.1.0" };
  discovery?: { enabled?: boolean; include?: string[]; exclude?: string[] };
  security?: { protectDocs?: boolean; schemes?: Record<string, unknown> };
  server?: { url?: string };
}

interface AutoDocsInstance {
  getDocument(): OpenAPIDocument;
  refresh(): Promise<void>;
  getRoutes(): RouteDefinition[];
  getStats(): DiscoveryStats;
  close(): void;
}
```

Exports for v1: `autoDocs()` and `describeRoute()`. Keep the public surface small; defer `defineSchema`, `excludeRoute`, `registerSecurity`, etc.

---

## 6. Architecture

```
Express App
  -> Runtime Discovery Engine   (instrumentation, introspection, router tree)
  -> Metadata Registry          (normalized RouteDefinition model)
  -> Schema Engine              (explicit schemas only; Zod adapter)
  -> OpenAPI Generator          (+ validator)
  -> Docs UI  |  JSON/YAML export
```

Key decisions:
- Discovery is independent of OpenAPI generation.
- The internal registry is the source of truth; OpenAPI is the contract for the UI.
- Single npm package with internal modules (`core`, `discovery`, `metadata`, `schema`, `openapi`, `server`, `security`, `ui`).
- UI is compiled and bundled as static assets; users do not install React or Tailwind.

### Tech Stack
TypeScript, Node.js, OpenAPI 3.1, Zod (optional), `@apidevtools/swagger-parser`, `yaml`, React + Tailwind + Radix UI (UI workspace), tsup, Vitest, Supertest, Playwright, pnpm workspaces.

---

## 7. Security Requirements

- Docs disabled in production unless explicitly enabled
- Optional protection for `/docs` and `/openapi.json`
- No leaking of environment variables or secrets
- Playground never executes server handlers; outbound requests restricted
- No automatic collection of real request bodies
- Sanitize descriptions and examples against HTML/script injection
- Internal routes hidden unless explicitly included

---

## 8. Known Risks and Limitations

| Risk | Mitigation |
| --- | --- |
| Express 4 vs 5 internals differ | Version-specific adapters, compatibility tests |
| Routes registered before init | Router introspection |
| Dynamic or conditional routes | Instrumentation, diagnostics for unsupported cases |
| TypeScript type erasure | Explicit schemas (Zod); compiler integration later |
| Response/auth inference unreliable | Explicit config; unknowns left unspecified |
| Production performance | Cache generated docs; no per-request introspection |

Full route discovery cannot be guaranteed via public APIs alone. This limitation must be documented.

---

## 9. Milestones (6 weeks)

| Week | Phase | Deliverable |
| --- | --- | --- |
| 1 | Discovery engine | Working route discovery |
| 2 | OpenAPI engine | Valid spec generator, Zod, JSON/YAML export |
| 3 | Express integration | Nested routers, `app.route()`, Express 4/5, `/docs` and `/openapi.json` |
| 4 | UI | Sidebar, endpoint explorer, schema viewer, themes, search |
| 5 | Playground and security | Request builder, cURL, execution policies, access control |
| 6 | Release | Tests, CI, README, public beta |

**Start with Milestone 01:** the route discovery engine, before any UI work.

### Release Plan

| Version | Scope |
| --- | --- |
| v0.1.0 | Route discovery + basic OpenAPI |
| v0.2.0 | Nested routers + Express 4/5 |
| v0.3.0 | Custom UI |
| v0.4.0 | Playground |
| v0.5.0 | Zod + authentication |
| v1.0.0 | Stable release |

---

## 10. Acceptance Criteria (MVP Definition of Done)

- [ ] Basic routes discovered automatically
- [ ] Routes added after initialization are discovered
- [ ] Pre-existing routes discovered via introspection
- [ ] Nested routers produce the correct full path
- [ ] `:param` converted to `{param}`
- [ ] `app.route()` methods discovered
- [ ] Duplicate registrations reported without corrupting the document
- [ ] Zod schemas produce correct JSON Schema
- [ ] Unknown response schemas are not fabricated
- [ ] OpenAPI output passes validation
- [ ] Docs UI works without external CDNs
- [ ] Playground executes only permitted requests
- [ ] Secure production defaults
- [ ] Express 4 and 5 compatibility tests pass

### Performance Targets (to be measured, not yet claims)
- Init under 100 ms for a small app
- Cached spec retrieval under 10 ms
- Discovery overhead under 5%
- No per-request introspection; no memory growth on repeated refresh

---

## 11. Success Metric

A developer goes from install to working docs in about 30 seconds, not 30 minutes.