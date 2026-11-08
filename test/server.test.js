import { test, describe, before, after } from 'node:test';
import assert from 'node:assert/strict';
import express from 'express';
import { autoDocs, describeRoute } from '../index.js';

describe('Server Integration & Endpoints', () => {
  let app;
  let server;
  let baseUrl;
  let instance;

  before(async () => {
    app = express();
    app.use(express.json());

    // Register a pre-existing route with describeRoute
    app.get('/users/:id', describeRoute({
      summary: 'Fetch user profile',
      tags: ['Users'],
      responses: {
        200: { description: 'User profile found' },
        404: { description: 'User not found' }
      }
    }), (req, res) => res.json({ id: req.params.id, name: 'Alice' }));

    // Initialize autoDocs
    instance = autoDocs(app, {
      info: { title: 'Acme API', version: '1.2.3', description: 'Internal testing service' },
      server: { url: 'http://localhost:3000' }
    });

    // Register a post-existing route
    app.post('/items', describeRoute({
      summary: 'Create item',
      tags: ['Items']
    }), (req, res) => res.status(201).json({ id: 'item-1' }));

    // Start server on a random port
    await new Promise((resolve) => {
      server = app.listen(0, () => {
        const port = server.address().port;
        baseUrl = `http://127.0.0.1:${port}`;
        resolve();
      });
    });
  });

  after(async () => {
    instance.close();
    await new Promise((resolve) => server.close(resolve));
  });

  test('serves interactive docs UI at /docs', async () => {
    const res = await fetch(`${baseUrl}/docs`);
    assert.equal(res.status, 200);
    assert.equal(res.headers.get('content-type'), 'text/html; charset=utf-8');

    const html = await res.text();
    assert.ok(html.includes('Acme API'), 'Should include API title');
    assert.ok(html.includes('v1.2.3'), 'Should include version badge');
    assert.ok(html.includes('/users/{id}'), 'Should list users endpoint');
    assert.ok(html.includes('data-theme'), 'Should have theme attribute');
  });

  test('serves valid OpenAPI 3.1 JSON at /openapi.json', async () => {
    const res = await fetch(`${baseUrl}/openapi.json`);
    assert.equal(res.status, 200);
    assert.equal(res.headers.get('content-type'), 'application/json; charset=utf-8');

    const spec = await res.json();
    assert.equal(spec.openapi, '3.1.0');
    assert.equal(spec.info.title, 'Acme API');
    assert.ok(spec.paths['/users/{id}']);
    assert.equal(spec.paths['/users/{id}'].get.summary, 'Fetch user profile');
    assert.deepEqual(spec.paths['/users/{id}'].get.tags, ['Users']);
  });

  test('serves OpenAPI YAML at /openapi.yaml', async () => {
    const res = await fetch(`${baseUrl}/openapi.yaml`);
    assert.equal(res.status, 200);
    assert.equal(res.headers.get('content-type'), 'text/yaml; charset=utf-8');

    const yaml = await res.text();
    assert.ok(yaml.includes('openapi: 3.1.0'));
    assert.ok(yaml.includes('title: Acme API'));
  });

  test('serves health diagnostics at /docs/health', async () => {
    const res = await fetch(`${baseUrl}/docs/health`);
    assert.equal(res.status, 200);

    const health = await res.json();
    assert.equal(health.status, 'healthy');
    assert.equal(health.validation.valid, true);
    assert.ok(health.routes.total >= 2);
  });

  test('AutoDocsInstance API methods work correctly', () => {
    const doc = instance.getDocument();
    assert.equal(doc.info.title, 'Acme API');

    const routes = instance.getRoutes();
    assert.ok(routes.length >= 2);

    const stats = instance.getStats();
    assert.ok(stats.discovered >= 2);
  });
});

describe('Security & Basic Auth Protection', () => {
  let app;
  let server;
  let baseUrl;
  let instance;

  before(async () => {
    app = express();
    instance = autoDocs(app, {
      info: { title: 'Secure API', version: '1.0.0' },
      security: {
        protectDocs: true,
        credentials: { username: 'admin', password: 'secretpassword' }
      }
    });

    app.get('/hello', (req, res) => res.send('world'));

    await new Promise((resolve) => {
      server = app.listen(0, () => {
        const port = server.address().port;
        baseUrl = `http://127.0.0.1:${port}`;
        resolve();
      });
    });
  });

  after(async () => {
    instance.close();
    await new Promise((resolve) => server.close(resolve));
  });

  test('blocks unauthenticated requests with 401', async () => {
    const res = await fetch(`${baseUrl}/docs`);
    assert.equal(res.status, 401);
    assert.ok(res.headers.get('www-authenticate'));
  });

  test('allows authenticated requests with correct basic auth header', async () => {
    const credentials = Buffer.from('admin:secretpassword').toString('base64');
    const res = await fetch(`${baseUrl}/docs`, {
      headers: {
        'Authorization': `Basic ${credentials}`
      }
    });
    assert.equal(res.status, 200);
  });
});

