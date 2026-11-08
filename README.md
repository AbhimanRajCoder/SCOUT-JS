# SCOUT-JS

> Zero-config runtime API documentation engine for Express.js. Built in 100% pure JavaScript with zero compilation overhead, zero external CDNs, and instant interactive docs with Swagger UI familiarity.

[![Node.js Version](https://img.shields.io/badge/Node.js-18%2B-blue.svg)](https://nodejs.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![OpenAPI 3.1](https://img.shields.io/badge/OpenAPI-3.1.0-green.svg)](https://spec.openapis.org/oas/v3.1.0)
[![Pure JavaScript](https://img.shields.io/badge/Code-100%25%20Pure%20JavaScript-yellow.svg)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Tests](https://img.shields.io/badge/Tests-66%20Passing-brightgreen.svg)](test)
[![Dependencies](https://img.shields.io/badge/Dependencies-0%20Runtime-success.svg)](package.json)

---

## Table of Contents

- [Overview](#overview)
- [Why SCOUT-JS?](#why-scout-js)
- [Installation](#installation)
- [30-Second Quickstart](#30-second-quickstart)
- [Key Features](#key-features)
- [Architecture & Core Concepts](#architecture--core-concepts)
- [Detailed Usage Guides](#detailed-usage-guides)
  - [1. Automatic Route Discovery](#1-automatic-route-discovery)
  - [2. Route Documentation with describeRoute()](#2-route-documentation-with-describeroute)
  - [3. Runtime Request Validation (Phase 1)](#3-runtime-request-validation-phase-1)
  - [4. Multi-Language Code Snippets (Phase 2)](#4-multi-language-code-snippets-phase-2)
  - [5. Sensitive Data Filtering with responseModel (Phase 3)](#5-sensitive-data-filtering-with-responsemodel-phase-3)
  - [6. Built-in Mock Server Engine (Phase 4)](#6-built-in-mock-server-engine-phase-4)
  - [7. Inline Handler Docstrings & JSDoc (Phase 5)](#7-inline-handler-docstrings--jsdoc-phase-5)
  - [8. Security & Production Safeguards](#8-security--production-safeguards)
- [Complete Configuration Reference](#complete-configuration-reference)
- [AutoDocsInstance Methods](#autodocsinstance-methods)
- [Swagger UI & FastAPI Parity Comparison](#swagger-ui--fastapi-parity-comparison)
- [Dual ESM & CommonJS Support](#dual-esm--commonjs-support)
- [Testing & Quality Verification](#testing--quality-verification)
- [License](#license)

---

## Overview

In frameworks like FastAPI, route definitions, input validation, and interactive documentation are unified automatically. In Express.js, developers traditionally had to write routes in JavaScript, maintain separate OpenAPI / Swagger YAML files or complex comment annotations by hand, and manage external UI CDN assets. When routes change, documentation drifts.

**SCOUT-JS solves this problem.** It inspects your Express application at runtime, discovers all mounted routes, normalizes path parameters, generates a strict OpenAPI 3.1 specification, and serves a self-contained, responsive documentation interface inspired by FastAPI's Swagger UI layout and styled with the Perk Design System (*electric lime on warm parchment paper*).

### What You Get Out of the Box:
- **`/docs`**: Responsive, interactive API documentation interface with live "Try it out" execution.
- **`/openapi.json`**: Auto-generated, validated OpenAPI 3.1 specification.
- **`/openapi.yaml`**: Clean YAML export generated with zero external YAML libraries.
- **`/docs/health`**: Real-time engine health, route metrics, and validation diagnostics.
- **`/docs/mock/*`**: Instant mock server engine simulating schema-compliant endpoints.

---

## Why SCOUT-JS?

- **Zero Build Step:** 100% pure native JavaScript (Node.js 18+). No TypeScript compiler (`tsc`), no bundlers (`tsup`, `esbuild`, `webpack`), and no babel required.
- **Zero External CDNs:** 100% offline-ready. CSS and client-side JavaScript are pre-inlined into the HTML response. Works behind corporate air-gapped firewalls without loading external scripts.
- **Principle 3 Compliance (Never Fabricate Schemas):** Unknown request bodies or undocumented responses are never hallucinated. Unknown means unknown.
- **Bi-directional Discovery:** Automatically registers routes mounted **before** and **after** `autoDocs()` is called.
- **Deep Router Introspection:** Recursively traces nested `express.Router()` mounts and preserves full prefix hierarchies (e.g. `/api` + `/v1` + `/users/:id` -> `/api/v1/users/{id}`).
- **Strictly Zero Emojis:** Professional editorial UI designed for enterprise teams.

---

## Installation

Install via npm:

```bash
npm install scout-js
```

Or using yarn or pnpm:

```bash
yarn add scout-js
pnpm add scout-js
```

### Optional Peer Dependencies:
If you want to use [Zod](https://github.com/colinhacks/zod) for request validation or response models:
```bash
npm install zod
```
*(Zod is completely optional; SCOUT-JS also natively supports standard JSON Schema with zero dependencies).*

---

## 30-Second Quickstart

```javascript
import express from 'express';
import { autoDocs, describeRoute } from 'scout-js';

const app = express();
app.use(express.json());

// 1. Define standard Express routes
app.get('/api/users/:id', describeRoute({
  summary: 'Retrieve user by ID',
  description: 'Fetches complete user details from the database',
  tags: ['Users']
}), (req, res) => {
  res.json({ id: req.params.id, name: 'Alice Smith', role: 'admin' });
});

// 2. Initialize SCOUT-JS
autoDocs(app, {
  info: {
    title: 'Acme Enterprise API',
    version: '1.0.0',
    description: 'Internal microservice API documentation'
  }
});

// 3. Start server
app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
  console.log('Interactive Docs: http://localhost:3000/docs');
});
```

Open your browser to `http://localhost:3000/docs` to see your live documentation.

---

## Key Features

1. **Bi-directional Route Discovery:** Automatically instruments Express so that routes mounted before or after `autoDocs()` are detected.
2. **Deep Router Hierarchy:** Detects nested router trees (`app.use('/api', apiRouter); apiRouter.use('/v1', v1Router)`).
3. **Runtime Request Validation (`validate: true`):** Validates request body, query parameters, path parameters, and headers using Zod or JSON Schema with automatic type coercion and standard 400 Bad Request error responses.
4. **FastAPI-Style Output Filtering (`responseModel`):** Automatically strips unlisted/sensitive fields (e.g. `password_hash`, internal columns) before sending `res.json()`.
5. **Multi-Language Code Snippets:** Live client SDK snippets for **cURL**, **JavaScript (Fetch)**, **Axios**, **Python (Requests)**, and **Go (`net/http`)**, updating dynamically as you fill out parameters.
6. **Built-in Mock Server Engine:** Test against schema-compliant simulated responses via `/docs/mock/*`, `X-Scout-Mock: true` header, or the UI Mock Mode toggle.
7. **Inline Handler Docstrings & JSDoc:** Document endpoints directly inside function bodies without wrapping them in `describeRoute()`.
8. **Perk Design Theme:** Electric lime (`#beff50`) on warm parchment paper (`#f5f5eb`) with off-black ink (`#14140f`), 28px/18px radii, and zero drop shadows.
9. **Interactive API Testing ("Try it out"):** In-browser request execution with duration timings, status badges, formatted JSON, and headers inspection.
10. **Production Guardrails:** Automatically disabled in `NODE_ENV=production` unless explicitly opted-in; supports HTTP Basic Auth protection.

---

## Architecture & Core Concepts

SCOUT-JS operates on five core modules:

```
+-----------------------------------------------------------------------+
| Express Application (app.get, app.post, app.use, app.route)           |
+-----------------------------------+-----------------------------------+
                                    |
            +-----------------------v-----------------------+
            |  Discovery Engine (Express 4 & 5 Adapters)    |
            |  - Path normalization (:id -> {id})           |
            |  - Router mount tree hierarchy resolution     |
            |  - JSDoc docstring parser                     |
            +-----------------------+-----------------------+
                                    |
            +-----------------------v-----------------------+
            |  Route Registry & Middleware Interceptor      |
            |  - describeRoute() metadata store             |
            |  - Runtime validator (validate: true)         |
            |  - Response serializer (responseModel)        |
            +-----------------------+-----------------------+
                                    |
            +-----------------------v-----------------------+
            |  OpenAPI 3.1 & Mock Engine                    |
            |  - JSON & YAML serializers                    |
            |  - Mock response generator                    |
            +-----------------------+-----------------------+
                                    |
            +-----------------------v-----------------------+
            |  Perk Documentation UI (lib/ui/render.js)     |
            |  - Self-contained HTML/CSS/JS (Zero CDNs)     |
            |  - Live playground & multi-language snippets   |
            +-----------------------------------------------+
```

---

## Detailed Usage Guides

### 1. Automatic Route Discovery

SCOUT-JS automatically discovers routes regardless of how they are declared in Express:

#### Flat Routes:
```javascript
app.get('/items', (req, res) => res.json([]));
app.post('/items', (req, res) => res.status(201).json({}));
```

#### Nested Routers:
```javascript
import express from 'express';
const api = express.Router();
const users = express.Router();

users.get('/:id/posts', (req, res) => res.json([]));
api.use('/users', users);
app.use('/api/v1', api);
// Discovered as: GET /api/v1/users/{id}/posts
```

#### Route Chaining:
```javascript
app.route('/orders')
  .get((req, res) => res.json([]))
  .post((req, res) => res.status(201).json({}))
  .delete((req, res) => res.status(204).send());
```

---

### 2. Route Documentation with describeRoute()

Use `describeRoute()` to attach metadata, summaries, tags, parameters, and schemas directly to your route:

```javascript
import { describeRoute } from 'scout-js';

app.get('/catalog/products/:id', describeRoute({
  summary: 'Get product by ID',
  description: 'Returns product details, inventory status, and pricing.',
  tags: ['Catalog'],
  params: {
    type: 'object',
    required: ['id'],
    properties: {
      id: { type: 'string', description: 'Product unique alphanumeric SKU' }
    }
  },
  query: {
    type: 'object',
    properties: {
      currency: {
        type: 'string',
        enum: ['USD', 'EUR', 'GBP'],
        default: 'USD',
        description: 'Currency code for price localization'
      }
    }
  },
  headers: {
    type: 'object',
    properties: {
      'x-client-id': { type: 'string', description: 'Client application identifier' }
    }
  },
  responses: {
    200: {
      description: 'Product found',
      example: { id: 'SKU-001', name: 'Wireless Headphones', price: 99.99 }
    },
    404: { description: 'Product not found' }
  }
}), (req, res) => {
  res.json({ id: req.params.id, name: 'Wireless Headphones', price: 99.99 });
});
```

---

### 3. Runtime Request Validation (Phase 1)

Turn your schemas into active Express validation middleware by setting `validate: true` inside `describeRoute()`.

#### Using Zod:
```javascript
import { z } from 'zod';
import { describeRoute } from 'scout-js';

const CreateItemSchema = z.object({
  name: z.string().min(3),
  price: z.number().positive(),
  category: z.enum(['electronics', 'books', 'apparel'])
});

app.post('/items', describeRoute({
  summary: 'Create item with runtime validation',
  tags: ['Items'],
  validate: true, // Automatically validates body, query, and params
  body: CreateItemSchema,
  query: z.object({
    dryRun: z.boolean().optional()
  })
}), (req, res) => {
  // req.body and req.query are guaranteed valid here
  // In Zod, string numbers and booleans in query params are coerced automatically
  res.status(201).json({ item: req.body });
});
```

#### Standard 400 Bad Request Response:
When validation fails, SCOUT-JS terminates the request and responds with status `400`:
```json
{
  "error": "Bad Request",
  "message": "Request validation failed",
  "statusCode": 400,
  "issues": [
    {
      "field": "name",
      "message": "String must contain at least 3 character(s)",
      "code": "too_small",
      "location": "body"
    }
  ]
}
```

#### Granular Validation & Custom Error Handlers:
```javascript
describeRoute({
  // Only validate body and query; skip params
  validate: { body: true, query: true, params: false },
  onValidationError: (issues, req, res, next) => {
    // Custom error format
    res.status(422).json({
      error: 'Unprocessable Entity',
      details: issues
    });
  }
})
```

---

### 4. Multi-Language Code Snippets (Phase 2)

Every endpoint card in the `/docs` UI includes an interactive **Code Snippets** panel with tabs for 5 languages:
- **cURL** (standard shell execution)
- **JavaScript / TypeScript (Fetch API)**
- **JavaScript / TypeScript (Axios)**
- **Python (Requests)**
- **Go (`net/http`)**

#### Real-Time Reactivity:
As you fill out parameters in "Try it out", all code snippets dynamically update in real time with your actual parameter values, query string, headers, and request body. The chosen language is stored in `localStorage` and persists across page reloads.

---

### 5. Sensitive Data Filtering with responseModel (Phase 3)

Emulate FastAPI's `response_model` directly in Express.js. Intercepts `res.json(data)` and automatically strips unlisted fields (such as `password_hash`, internal columns, or sensitive tokens) before sending the response to the client.

```javascript
import { z } from 'zod';
import { describeRoute } from 'scout-js';

// Define the public response model
const PublicUserSchema = z.object({
  id: z.string(),
  username: z.string(),
  email: z.string().email()
});

app.get('/users/:id', describeRoute({
  summary: 'Get public user profile',
  responseModel: PublicUserSchema // Automatically filters outgoing res.json()
}), async (req, res) => {
  const dbUser = await db.getUser(req.params.id);
  // Database returns:
  // { id: 'u1', username: 'alice', email: 'alice@example.com', password_hash: '$2b$12$...', ssn: '000-00-0000' }
  
  res.json(dbUser);
  // Client receives ONLY:
  // { "id": "u1", "username": "alice", "email": "alice@example.com" }
});
```

- **Non-Production Diagnostics:** In development mode (`NODE_ENV !== 'production'`), if required fields are missing from your response payload, SCOUT-JS logs a warning in your terminal.
- **Custom Error Callback:** You can provide `onResponseValidationError: (issues, data) => void` for custom monitoring or alerting.
- **Status Code Isolation:** Only successful 2xx responses are filtered; 4xx and 5xx error responses pass through untouched.

---

### 6. Built-in Mock Server Engine (Phase 4)

Simulate endpoints before backend logic or databases are implemented. Frontend, QA, and mobile teams can develop against simulated responses strictly conforming to declared schemas.

#### 1. Via Dedicated Path Prefix (`/docs/mock/*`):
```bash
# Requesting /docs/mock/api/users/123 returns a compliant mock response
curl -X 'GET' 'http://localhost:3000/docs/mock/api/users/123'
```
Response:
```json
{
  "id": "00000000-0000-0000-0000-000000000000",
  "email": "user@example.com",
  "status": "active"
}
```

#### 2. Via Request Header:
Send `X-Scout-Mock: true` or `?__mock=true` to any real endpoint to receive the simulated mock response without triggering the real database handler:
```bash
curl -X 'GET' 'http://localhost:3000/api/users/123' -H 'X-Scout-Mock: true'
```

#### 3. Via UI Toggle:
In `/docs`, check the **Mock Mode** toggle next to the "Execute" button in the API playground. The UI returns the simulated response with an amber `[MOCK]` status badge and execution latency timing.

---

### 7. Inline Handler Docstrings & JSDoc (Phase 5)

Document your routes directly inside handler function bodies using standard JSDoc tags without needing `describeRoute()`:

```javascript
app.get('/api/users/:id', function getUser(req, res) {
  /**
   * @summary Fetch user by ID
   * @description Retrieves a complete user profile from the database
   * @tags Users, Accounts
   * @param {string} id - The unique user ID
   * @deprecated
   */
  res.json({ id: req.params.id, name: 'Alice' });
});

// Arrow functions are also supported:
app.post('/api/items', (req, res) => {
  /**
   * @summary Create catalog item
   * @tags Items
   */
  res.status(201).json(req.body);
});
```

#### Supported Tags:
- `@summary <text>`: Operation summary.
- `@description <text>`: Detailed markdown or prose description.
- `@tags <tag1>, <tag2>`: Comma-separated category tags.
- `@param {type} [name=default] - description`: Parameter metadata.
- `@deprecated`: Marks the operation as deprecated in OpenAPI.
- `@returns {type} [status] - description`: Response description.

*Precedence Rule: If a route uses both `describeRoute()` and JSDoc docstrings, explicit `describeRoute()` metadata always takes precedence.*

---

### 8. Security & Production Safeguards

#### Automatic Production Shutdown:
By default, SCOUT-JS documentation routes are disabled when `NODE_ENV=production`. To explicitly enable docs in production (e.g. for a public developer platform):
```javascript
autoDocs(app, {
  docs: {
    enabled: true // Explicit opt-in
  }
});
```

#### HTTP Basic Authentication Protection:
Protect your documentation behind credentials:
```javascript
autoDocs(app, {
  security: {
    protectDocs: true,
    credentials: {
      username: 'admin',
      password: process.env.DOCS_PASSWORD || 'secret-password'
    }
  }
});
```
When enabled, navigating to `/docs`, `/openapi.json`, `/openapi.yaml`, or `/docs/health` prompts for HTTP Basic Auth and blocks unauthorized requests with status `401 Unauthorized`.

#### Remote Mutating Request Confirmation:
When using the interactive playground on remote or non-localhost origins, mutating requests (`POST`, `PUT`, `DELETE`, `PATCH`) trigger a browser confirmation prompt to prevent accidental data modification.

---

## Complete Configuration Reference

```javascript
const instance = autoDocs(app, {
  // OpenAPI Info Object
  info: {
    title: 'My Service API',
    version: '1.0.0',
    description: 'Detailed service description'
  },

  // Documentation UI Settings
  docs: {
    enabled: true,            // Default: true in dev, false in prod
    path: '/docs',            // Mounting path for UI (Default: '/docs')
    theme: 'light'            // 'light' | 'dark' | 'system'
  },

  // OpenAPI Specification Export Settings
  openapi: {
    path: '/openapi.json',     // Path for JSON spec (Default: '/openapi.json')
    version: '3.1.0'          // OAS version (Default: '3.1.0')
  },

  // Route Discovery Filtering
  discovery: {
    enabled: true,            // Enable runtime discovery (Default: true)
    include: ['/api'],        // Prefix array or regex patterns to include
    exclude: ['/admin', '/internal'], // Omit sensitive routes
    extractJSDoc: true        // Parse inline handler docstrings (Default: true)
  },

  // Built-in Mock Server Engine
  mock: {
    enabled: true,            // Default: true in dev, false in prod
    prefix: '/docs/mock'      // Mock endpoint path prefix (Default: '/docs/mock')
  },

  // Security & Authentication Protection
  security: {
    protectDocs: false,       // Require Basic Auth for /docs (Default: false)
    credentials: {
      username: 'admin',
      password: 'password'
    },
    schemes: {                // Global OpenAPI security schemes
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    }
  },

  // API Server URL in OpenAPI Spec & Playground
  server: {
    url: 'http://localhost:3000',
    description: 'Local development server'
  }
});
```

---

## AutoDocsInstance Methods

The object returned by `autoDocs(app)` exposes methods for programmatic control:

```javascript
const instance = autoDocs(app);

// 1. Get live OpenAPI 3.1 specification object
const spec = instance.getDocument();

// 2. Refresh route tree and regenerate spec
await instance.refresh();

// 3. Inspect discovered routes array
const routes = instance.getRoutes();

// 4. Retrieve discovery metrics
const stats = instance.getStats();
console.log(stats);
// Output: { total: 15, discovered: 15, partial: 0, unsupported: 0, excluded: 0 }

// 5. Clean up listeners and memory cache
instance.close();
```

---

## Swagger UI & FastAPI Parity Comparison

| Capability | FastAPI (`/docs`) | Swagger-UI-Express | SCOUT-JS |
|---|:---:|:---:|:---:|
| **Language & Environment** | Python | Node.js | **100% Pure Node.js (0 Build Steps)** |
| **Route Discovery** | Automatic | Manual YAML/JSDoc | **Automatic Runtime Discovery** |
| **OpenAPI Specification** | 3.1.0 | 2.0 / 3.0 | **OpenAPI 3.1.0** |
| **Zero CDN Dependencies** | Yes | No (Loads CDNs) | **100% Offline (Zero External CDNs)** |
| **UI Design System** | Swagger Default | Swagger Default | **Perk Design (Electric Lime / Parchment)** |
| **Client Code Snippets** | Plugin required | No | **Built-in (cURL, Fetch, Axios, Python, Go)** |
| **Response Model Filtering** | `response_model` | No | **`responseModel` (Built-in)** |
| **Runtime Request Validation** | Pydantic | Requires separate lib | **`validate: true` (Zod & JSON Schema)** |
| **Built-in Mock Server** | No | No | **`/docs/mock/*` & `X-Scout-Mock: true`** |
| **Inline Handler Docstrings** | Python docstrings | No | **JSDoc Docstrings (`extractJSDoc: true`)** |
| **Offline Air-gapped Support** | Yes | No | **Yes (100% Embedded Assets)** |
| **Zero Emojis** | No | No | **Strictly Zero Emojis Across Code & UI** |

---

## Dual ESM & CommonJS Support

SCOUT-JS natively supports both ES Modules (`import`) and CommonJS (`require`):

### ES Modules (ESM):
```javascript
import { autoDocs, describeRoute } from 'scout-js';
```

### CommonJS (CJS):
```javascript
const { autoDocs, describeRoute } = require('scout-js');
```

The package contains an automated pre-pack build script that compiles `index.cjs` with pre-inlined CSS and client scripts, allowing dual distribution in older and newer Node.js versions alike.

---

## Testing & Quality Verification

SCOUT-JS uses Node's native test runner (`node:test`) with zero testing framework overhead:

```bash
# Run complete test suite (17 test suites, 66 tests)
npm test

# Run example applications
npm run example
npm run example:nested
```

### Verification Checklist:
- `66 / 66 passing tests` across 17 test suites with 0 failures.
- `0 emojis` across 100% of the codebase, documentation, and UI assets.
- `0 build dependencies` (runs directly in standard Node.js 18+).
- Clean npm package tarball (< 75 kB packed).

---

## License

[MIT](LICENSE) - Copyright 2026 Antigravity & DeepMind Team.
