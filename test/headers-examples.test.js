import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { RouteRegistry } from '../lib/metadata/registry.js';
import { describeRoute } from '../lib/schema/describe-route.js';
import { buildOpenApiDocument } from '../lib/openapi/builder.js';
import { validateOpenApiDocument } from '../lib/openapi/validator.js';

describe('Header Parameters and Example Payloads', () => {
  test('describeRoute parses header parameters into metadata', () => {
    const middleware = describeRoute({
      summary: 'Endpoint with custom headers',
      headers: {
        type: 'object',
        required: ['X-Tenant-Id'],
        properties: {
          'X-Tenant-Id': { type: 'string', description: 'Tenant isolation identifier' },
          'X-Client-Version': { type: 'string', description: 'Client app version' }
        }
      }
    });

    const meta = middleware.__scout_metadata__;
    assert.ok(meta.headerParams);
    assert.equal(meta.headerParams.length, 2);

    const tenantParam = meta.headerParams.find(p => p.name === 'X-Tenant-Id');
    assert.ok(tenantParam);
    assert.equal(tenantParam.in, 'header');
    assert.equal(tenantParam.required, true);

    const clientVerParam = meta.headerParams.find(p => p.name === 'X-Client-Version');
    assert.ok(clientVerParam);
    assert.equal(clientVerParam.in, 'header');
    assert.equal(clientVerParam.required, false);
  });

  test('buildOpenApiDocument maps headerParams into parameters array with in: header', () => {
    const registry = new RouteRegistry();
    registry.register({
      method: 'get',
      path: '/api/v1/workspaces',
      status: 'discovered',
      headerParams: [
        { name: 'X-Workspace-Token', in: 'header', required: true, schema: { type: 'string' } }
      ]
    });

    const doc = buildOpenApiDocument(registry);
    const op = doc.paths['/api/v1/workspaces'].get;

    assert.ok(op.parameters);
    const headerP = op.parameters.find(p => p.in === 'header');
    assert.ok(headerP);
    assert.equal(headerP.name, 'X-Workspace-Token');
    assert.equal(headerP.required, true);

    const validation = validateOpenApiDocument(doc);
    assert.equal(validation.valid, true);
  });

  test('describeRoute attaches request and response examples', () => {
    const middleware = describeRoute({
      summary: 'Post with example',
      body: {
        schema: {
          type: 'object',
          properties: { name: { type: 'string' } }
        },
        example: { name: 'Acme Corp' }
      },
      responses: {
        201: {
          description: 'Created',
          body: {
            type: 'object',
            properties: { id: { type: 'string' }, name: { type: 'string' } }
          },
          example: { id: 'corp-123', name: 'Acme Corp' }
        }
      }
    });

    const meta = middleware.__scout_metadata__;
    assert.deepEqual(meta.requestBody.content['application/json'].example, { name: 'Acme Corp' });
    assert.deepEqual(meta.responses['201'].content['application/json'].example, { id: 'corp-123', name: 'Acme Corp' });
  });
});

