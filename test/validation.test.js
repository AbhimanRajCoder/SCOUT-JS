import { test, describe, before, after } from 'node:test';
import assert from 'node:assert/strict';
import express from 'express';
import { z } from 'zod';
import { autoDocs, describeRoute } from '../index.js';

describe('Runtime Request Validation (Phase 1)', () => {
  let app;
  let server;
  let baseUrl;
  let instance;

  before(async () => {
    app = express();
    app.use(express.json());

    // 1. Zod Body Validation Route
    const userZodSchema = z.object({
      name: z.string().min(3),
      email: z.string().email(),
      age: z.number().int().min(18)
    });

    app.post('/api/users', describeRoute({
      summary: 'Create user with Zod validation',
      body: userZodSchema,
      validate: true
    }), (req, res) => {
      res.status(201).json({ success: true, user: req.body });
    });

    // 2. JSON Schema Body & Query Validation Route
    const productSchema = {
      type: 'object',
      required: ['title', 'price', 'category'],
      properties: {
        title: { type: 'string', minLength: 2 },
        price: { type: 'number', minimum: 1 },
        category: { type: 'string', enum: ['electronics', 'clothing', 'books'] }
      }
    };

    const queryFilterSchema = {
      type: 'object',
      properties: {
        limit: { type: 'integer', minimum: 1, maximum: 50 },
        active: { type: 'boolean' }
      }
    };

    app.post('/api/products', describeRoute({
      summary: 'Create product with JSON Schema validation',
      body: productSchema,
      query: queryFilterSchema,
      validate: true
    }), (req, res) => {
      res.status(201).json({
        success: true,
        product: req.body,
        query: req.query
      });
    });

    // 3. Route with validation disabled (default)
    app.post('/api/unvalidated', describeRoute({
      summary: 'Route with validation disabled',
      body: productSchema,
      validate: false
    }), (req, res) => {
      res.json({ received: req.body });
    });

    // 4. Route with custom onValidationError
    app.post('/api/custom-error', describeRoute({
      body: userZodSchema,
      validate: true,
      onValidationError: (issues, req, res) => {
        res.status(422).json({ custom: true, errorCount: issues.length });
      }
    }), (req, res) => res.json({ ok: true }));

    instance = autoDocs(app, {
      info: { title: 'Validation Test App', version: '1.0.0' }
    });

    await new Promise(resolve => {
      server = app.listen(0, () => {
        baseUrl = `http://127.0.0.1:${server.address().port}`;
        resolve();
      });
    });
  });

  after(async () => {
    instance.close();
    await new Promise(resolve => server.close(resolve));
  });

  test('valid Zod payload passes validation and returns 201', async () => {
    const res = await fetch(`${baseUrl}/api/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Alice',
        email: 'alice@example.com',
        age: 25
      })
    });

    assert.equal(res.status, 201);
    const body = await res.json();
    assert.equal(body.success, true);
    assert.equal(body.user.name, 'Alice');
  });

  test('invalid Zod payload returns 400 Bad Request with field issues', async () => {
    const res = await fetch(`${baseUrl}/api/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Al', // min is 3
        email: 'not-an-email',
        age: 15 // min is 18
      })
    });

    assert.equal(res.status, 400);
    const body = await res.json();
    assert.equal(body.error, 'Bad Request');
    assert.equal(body.statusCode, 400);
    assert.ok(Array.isArray(body.issues));
    assert.ok(body.issues.length >= 3);
  });

  test('valid JSON Schema payload passes and coerces numeric query params', async () => {
    const res = await fetch(`${baseUrl}/api/products?limit=25&active=true`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'Keyboard',
        price: 99.99,
        category: 'electronics'
      })
    });

    assert.equal(res.status, 201);
    const body = await res.json();
    assert.equal(body.product.title, 'Keyboard');
    assert.equal(typeof body.query.limit, 'number');
    assert.equal(body.query.limit, 25);
    assert.equal(typeof body.query.active, 'boolean');
    assert.equal(body.query.active, true);
  });

  test('invalid JSON Schema payload fails missing required fields and enum violation', async () => {
    const res = await fetch(`${baseUrl}/api/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'X', // minLength 2
        price: -5, // minimum 1
        category: 'furniture' // not in enum
      })
    });

    assert.equal(res.status, 400);
    const body = await res.json();
    assert.equal(body.error, 'Bad Request');
    assert.ok(body.issues.some(i => i.field === 'title'));
    assert.ok(body.issues.some(i => i.field === 'price'));
    assert.ok(body.issues.some(i => i.field === 'category'));
  });

  test('unvalidated route passes through even with empty or arbitrary body', async () => {
    const res = await fetch(`${baseUrl}/api/unvalidated`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ anyKey: 123 })
    });

    assert.equal(res.status, 200);
    const body = await res.json();
    assert.deepEqual(body.received, { anyKey: 123 });
  });

  test('custom onValidationError is invoked when provided', async () => {
    const res = await fetch(`${baseUrl}/api/custom-error`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({})
    });

    assert.equal(res.status, 422);
    const body = await res.json();
    assert.equal(body.custom, true);
  });

  test('autoDocs auto-documents 400 Bad Request when validate: true', () => {
    const doc = instance.getDocument();
    const userOp = doc.paths['/api/users'].post;
    assert.ok(userOp.responses['400']);
    assert.ok(userOp.responses['400'].description.includes('Validation Error'));
  });
});

