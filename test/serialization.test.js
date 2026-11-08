import { test, describe, before, after } from 'node:test';
import assert from 'node:assert/strict';
import express from 'express';
import { z } from 'zod';
import { autoDocs, describeRoute } from '../index.js';

describe('Response Serialization & Output Filtering (Phase 3)', () => {
  let app;
  let server;
  let baseUrl;
  let instance;
  let capturedValidationWarnings = [];

  before(async () => {
    app = express();
    app.use(express.json());

    // 1. JSON Schema response filtering (stripping sensitive fields)
    app.get('/users/json-schema', describeRoute({
      summary: 'Get user filtered via JSON Schema',
      responseModel: {
        type: 'object',
        required: ['id', 'username'],
        properties: {
          id: { type: 'string' },
          username: { type: 'string' },
          email: { type: 'string' }
        }
      }
    }), (req, res) => {
      // Backend returns secret fields that should be stripped
      res.json({
        id: 'user_123',
        username: 'alice',
        email: 'alice@example.com',
        password_hash: '$2b$12$e8Yk2u...',
        stripe_customer_id: 'cus_99999',
        internal_notes: 'VIP customer'
      });
    });

    // 2. Zod response filtering
    const UserOutSchema = z.object({
      id: z.string(),
      fullName: z.string(),
      role: z.enum(['admin', 'member'])
    });

    app.get('/users/zod', describeRoute({
      summary: 'Get user filtered via Zod',
      responseModel: UserOutSchema
    }), (req, res) => {
      res.json({
        id: 'user_456',
        fullName: 'Bob Smith',
        role: 'member',
        api_secret: 'sec_abcdef',
        ssn: '000-11-2222'
      });
    });

    // 3. Array response filtering
    app.get('/items', describeRoute({
      summary: 'List items',
      responseModel: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            title: { type: 'string' }
          }
        }
      }
    }), (req, res) => {
      res.json([
        { id: '1', title: 'Laptop', supplier_cost: 800, warehouse_bin: 'A-12' },
        { id: '2', title: 'Monitor', supplier_cost: 150, warehouse_bin: 'B-04' }
      ]);
    });

    // 4. Custom validation callback
    app.get('/users/invalid', describeRoute({
      summary: 'Trigger response validation hook',
      responseModel: {
        type: 'object',
        required: ['id', 'required_missing_field'],
        properties: {
          id: { type: 'string' },
          required_missing_field: { type: 'string' }
        }
      },
      onResponseValidationError: (issues) => {
        capturedValidationWarnings.push(...issues);
      }
    }), (req, res) => {
      res.json({ id: 'user_789' });
    });

    // 5. 4xx error responses are not modified
    app.get('/error-test', describeRoute({
      summary: 'Error status bypass',
      responseModel: {
        type: 'object',
        properties: { data: { type: 'string' } }
      }
    }), (req, res) => {
      res.status(404).json({ error: 'Not Found', debug_info: 'detailed stack' });
    });

    instance = autoDocs(app, {
      info: { title: 'Serialization Test API', version: '1.0.0' }
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

  test('JSON Schema responseModel strips unlisted/sensitive fields', async () => {
    const res = await fetch(`${baseUrl}/users/json-schema`);
    assert.equal(res.status, 200);
    const data = await res.json();

    assert.equal(data.id, 'user_123');
    assert.equal(data.username, 'alice');
    assert.equal(data.email, 'alice@example.com');

    // Verify secret fields are stripped
    assert.equal(data.password_hash, undefined);
    assert.equal(data.stripe_customer_id, undefined);
    assert.equal(data.internal_notes, undefined);
  });

  test('Zod responseModel strips unknown fields automatically', async () => {
    const res = await fetch(`${baseUrl}/users/zod`);
    assert.equal(res.status, 200);
    const data = await res.json();

    assert.equal(data.id, 'user_456');
    assert.equal(data.fullName, 'Bob Smith');
    assert.equal(data.role, 'member');

    // Verify private fields are stripped
    assert.equal(data.api_secret, undefined);
    assert.equal(data.ssn, undefined);
  });

  test('Array responseModel filters every item in the array', async () => {
    const res = await fetch(`${baseUrl}/items`);
    assert.equal(res.status, 200);
    const data = await res.json();

    assert.equal(data.length, 2);
    assert.deepEqual(data, [
      { id: '1', title: 'Laptop' },
      { id: '2', title: 'Monitor' }
    ]);
  });

  test('Custom onResponseValidationError hook captures schema issues', async () => {
    capturedValidationWarnings = [];
    const res = await fetch(`${baseUrl}/users/invalid`);
    assert.equal(res.status, 200);

    assert.ok(capturedValidationWarnings.length > 0, 'Must invoke onResponseValidationError callback');
    assert.ok(capturedValidationWarnings.some(w => w.message.includes('required_missing_field')));
  });

  test('Non-2xx error responses bypass responseModel filtering', async () => {
    const res = await fetch(`${baseUrl}/error-test`);
    assert.equal(res.status, 404);
    const data = await res.json();

    assert.equal(data.error, 'Not Found');
    assert.equal(data.debug_info, 'detailed stack');
  });

  test('responseModel automatically documents 200 response in OpenAPI spec', () => {
    const doc = instance.getDocument();
    const zodPath = doc.paths['/users/zod'];
    assert.ok(zodPath);
    assert.ok(zodPath.get.responses['200']);

    const schema = zodPath.get.responses['200'].content['application/json'].schema;
    assert.ok(schema);
    assert.equal(schema.type, 'object');
    assert.ok(schema.properties.fullName);
  });
});
