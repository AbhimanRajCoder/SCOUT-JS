import { test, describe, before, after } from 'node:test';
import assert from 'node:assert/strict';
import express from 'express';
import { z } from 'zod';
import { autoDocs, describeRoute } from '../index.js';
import { generateMockFromSchema } from '../lib/server/mock-engine.js';

describe('Built-in Mock Server Engine (Phase 4)', () => {
  let app;
  let server;
  let baseUrl;
  let instance;

  before(async () => {
    app = express();
    app.use(express.json());

    // 1. Route with Zod responseModel
    app.get('/api/users/:id', describeRoute({
      summary: 'Get user profile',
      responseModel: z.object({
        id: z.string(),
        email: z.string().email(),
        status: z.enum(['active', 'suspended']),
        profile: z.object({
          displayName: z.string(),
          age: z.number()
        }),
        source: z.string().optional()
      })
    }), (req, res) => {
      res.json({ id: req.params.id, source: 'real-database' });
    });

    // 2. Route with explicit example response
    app.post('/api/orders', describeRoute({
      summary: 'Create order',
      responses: {
        201: {
          description: 'Order created',
          example: {
            orderId: 'ord_99999',
            amount: 149.99,
            status: 'confirmed'
          }
        }
      }
    }), (req, res) => {
      res.status(201).json({ source: 'real-order' });
    });

    // 3. Route without schema or example
    app.get('/api/unspecified', (req, res) => {
      res.json({ source: 'unspecified-real' });
    });

    instance = autoDocs(app, {
      info: { title: 'Mock Test API', version: '1.0.0' },
      mock: { enabled: true, prefix: '/docs/mock' }
    });

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

  test('generateMockFromSchema handles nested objects, enums, and formats', () => {
    const schema = {
      type: 'object',
      properties: {
        id: { type: 'string', format: 'uuid' },
        email: { type: 'string', format: 'email' },
        role: { type: 'string', enum: ['superadmin', 'guest'] },
        count: { type: 'integer', minimum: 5 },
        active: { type: 'boolean' },
        tags: { type: 'array', items: { type: 'string' } }
      }
    };

    const mock = generateMockFromSchema(schema);
    assert.equal(mock.id, '00000000-0000-0000-0000-000000000000');
    assert.equal(mock.email, 'user@example.com');
    assert.equal(mock.role, 'superadmin');
    assert.equal(mock.count, 5);
    assert.equal(mock.active, true);
    assert.deepEqual(mock.tags, ['string']);
  });

  test('serves mock response via /docs/mock path prefix with headers', async () => {
    const res = await fetch(`${baseUrl}/docs/mock/api/users/456`);
    assert.equal(res.status, 200);
    assert.equal(res.headers.get('x-scout-mock'), 'true');
    assert.ok(res.headers.get('x-scout-latency'), 'Must include X-Scout-Latency');

    const data = await res.json();
    assert.equal(data.email, 'user@example.com');
    assert.equal(data.status, 'active');
    assert.equal(typeof data.profile, 'object');
    assert.equal(data.profile.displayName, 'string');
    assert.equal(typeof data.profile.age, 'number');
    assert.notEqual(data.source, 'real-database', 'Must not hit real database handler');
  });

  test('serves declared explicit response example on mock route', async () => {
    const res = await fetch(`${baseUrl}/docs/mock/api/orders`, {
      method: 'POST'
    });
    assert.equal(res.status, 201);
    assert.equal(res.headers.get('x-scout-mock'), 'true');

    const data = await res.json();
    assert.equal(data.orderId, 'ord_99999');
    assert.equal(data.amount, 149.99);
    assert.equal(data.status, 'confirmed');
  });

  test('intercepts real route when X-Scout-Mock header is present', async () => {
    // With mock header -> returns mock
    const mockRes = await fetch(`${baseUrl}/api/users/123`, {
      headers: { 'X-Scout-Mock': 'true' }
    });
    assert.equal(mockRes.status, 200);
    assert.equal(mockRes.headers.get('x-scout-mock'), 'true');
    const mockData = await mockRes.json();
    assert.equal(mockData.email, 'user@example.com');
    assert.notEqual(mockData.source, 'real-database');

    // Without mock header -> executes real handler
    const realRes = await fetch(`${baseUrl}/api/users/123`);
    assert.equal(realRes.status, 200);
    assert.equal(realRes.headers.get('x-scout-mock'), null);
    const realData = await realRes.json();
    assert.equal(realData.source, 'real-database');
  });

  test('intercepts real route when ?__mock=true query param is present', async () => {
    const res = await fetch(`${baseUrl}/api/users/789?__mock=true`);
    assert.equal(res.status, 200);
    assert.equal(res.headers.get('x-scout-mock'), 'true');
    const data = await res.json();
    assert.equal(data.email, 'user@example.com');
  });

  test('returns 404 for unmatched mock paths', async () => {
    const res = await fetch(`${baseUrl}/docs/mock/non-existent-endpoint`);
    assert.equal(res.status, 404);
    const data = await res.json();
    assert.equal(data.error, 'Not Found');
    assert.ok(data.message.includes('No registered route matching mock path'));
  });

  test('handles route with unspecified schema gracefully', async () => {
    const res = await fetch(`${baseUrl}/docs/mock/api/unspecified`);
    assert.equal(res.status, 200);
    assert.equal(res.headers.get('x-scout-mock'), 'true');
    const data = await res.json();
    assert.ok(data.message.includes('No response schema or example declared'));
  });
});
