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

Attach optional metadata and schemas directly to your route:

```javascript
app.post('/items', describeRoute({
  summary: 'Create item',
  description: 'Adds an item to the catalog',
  tags: ['Items'],
  body: {
    type: 'object',
    required: ['name'],
    properties: {
      name: { type: 'string' },
      price: { type: 'number' }
    }
  },
  responses: {
    201: { description: 'Item created successfully' },
    400: { description: 'Invalid request payload' }
  }
}), (req, res) => {
  res.status(201).json(req.body);
});
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

