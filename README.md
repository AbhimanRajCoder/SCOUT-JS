# SCOUT-JS (100% Pure JavaScript)

> Zero-config runtime API documentation engine for Express.js. Built in 100% pure JavaScript with zero compilation overhead, zero external CDNs, and instant interactive docs.

[![Node.js CI](https://img.shields.io/badge/Node.js-18%2B-green)](https://nodejs.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![OpenAPI 3.1](https://img.shields.io/badge/OpenAPI-3.1.0-orange)](https://spec.openapis.org/oas/v3.1.0)

---

## 30-Second Quickstart

```bash
npm install scout-js
```

```javascript
import express from 'express';
import { autoDocs, describeRoute } from 'scout-js';

const app = express();

app.get('/users/:id', describeRoute({
  summary: 'Retrieve user by ID',
  tags: ['Users']
}), (req, res) => {
  res.json({ id: req.params.id, name: 'Alice' });
});

// One line to enable self-documenting APIs
autoDocs(app, {
  info: {
    title: 'My Express API',
    version: '1.0.0'
  }
});

app.listen(3000, () => {
  console.log('Docs available at http://localhost:3000/docs');
});
```

Navigate to:
- **`/docs`** — Custom interactive docs UI + live try-it playground.
- **`/openapi.json`** — Auto-generated OpenAPI 3.1 specification.
- **`/openapi.yaml`** — Exportable YAML specification.
- **`/docs/health`** — Discovery stats, validation status, and engine health.

---

## Features

- **100% Pure JavaScript:** Runs natively in Node.js ES Modules. Zero TypeScript build tools, zero bundlers, instant execution.
- **Bi-directional Discovery:** Automatically discovers routes defined **before** and **after** `autoDocs()` is called.
- **Runtime Request Validation (`validate: true`):** Optionally turns your route schemas into active Express middleware with zero overhead. Validates request body, query parameters, path parameters, and headers with auto-coercion and standard 400 Bad Request responses.
- **Deep Router Introspection:** Seamlessly handles nested `express.Router()` mounts (`/api/v1` + `/users` -> `/api/v1/users`).
- **Route Chaining:** Fully supports `app.route('/items').get(...).post(...)`.
- **Accurate OpenAPI 3.1:** Automatically converts `:id` -> `{id}`, tags routes by path prefixes, and validates specs.
- **Never Fabricates Schemas:** Unknown bodies and responses are left unspecified—no hallucinated or fake mock data.
- **Self-Contained UI:** Embedded responsive dark/light documentation UI with instant client-side search. Zero external CDN dependencies (works completely offline).
- **Try-It API Playground:** Execute requests directly from your browser with query/path parameter builders, custom headers, duration timings (ms), and JSON inspector.
- **Production Guardrails:** Automatically disabled in `NODE_ENV=production` unless explicitly opted-in; supports Basic Auth credentials and origin protection.

---

## API Reference

### `autoDocs(app, options)`

```javascript
const instance = autoDocs(app, {
  info: {
    title: 'My Service',
    version: '1.0.0',
    description: 'Service API documentation'
  },
  docs: {
    enabled: true,           // Default: true in dev, false in prod
    path: '/docs',           // Default: '/docs'
    theme: 'dark'            // 'dark' | 'light'
  },
  openapi: {
    path: '/openapi.json'    // Default: '/openapi.json'
  },
  discovery: {
    include: ['/api'],       // Prefix or regex filter
    exclude: ['/admin']      // Omit sensitive routes
  },
  security: {
    protectDocs: false,      // Require Basic Auth
    credentials: {
      username: 'admin',
      password: 'password'
    }
  },
  server: {
    url: 'http://localhost:3000'
  }
});
```

#### `AutoDocsInstance` Methods:
- `instance.getDocument()`: Returns the live OpenAPI 3.1 specification object.
- `instance.refresh()`: Re-scans router stack and regenerates cached assets.
- `instance.getRoutes()`: Returns array of discovered route definitions.
- `instance.getStats()`: Returns route discovery metrics (`{ total, discovered, partial, unsupported, excluded }`).
- `instance.close()`: Cleans up listeners, cache, and registry.

---

### `describeRoute(metadata)`

Attach optional metadata, schemas, and runtime request validation directly to your route:

```javascript
import { describeRoute } from 'scout-js';
import { z } from 'zod'; // Optional: Supports Zod or standard JSON Schema

app.post('/items', describeRoute({
  summary: 'Create item',
  description: 'Adds an item to the catalog',
  tags: ['Items'],
  validate: true, // Activates runtime validation for body, query, params & headers
  body: z.object({
    name: z.string().min(2),
    price: z.number().positive(),
    category: z.enum(['electronics', 'books', 'apparel'])
  }),
  query: z.object({
    dryRun: z.boolean().optional()
  }),
  responses: {
    201: { description: 'Item created successfully' }
    // 400 Bad Request is automatically documented when validate: true
  }
}), (req, res) => {
  // req.body and req.query are guaranteed valid and type-coerced here
  res.status(201).json(req.body);
});
```

#### Validation Options & Granular Control:

```javascript
// Validate only specific parts
describeRoute({
  validate: { body: true, query: true, params: false },
  // Custom validation error response handler
  onValidationError: (err, req, res, next) => {
    res.status(422).json({
      error: 'Unprocessable Entity',
      details: err.issues
    });
  }
})
```

---

## Testing

SCOUT-JS uses Node's native test runner (`node:test`):

```bash
npm test
```

Run examples:
```bash
npm run example
npm run example:nested
```

---

## License

MIT

