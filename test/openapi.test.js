import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { RouteRegistry } from '../lib/metadata/registry.js';
import { buildOpenApiDocument } from '../lib/openapi/builder.js';
import { validateOpenApiDocument } from '../lib/openapi/validator.js';
import { toJson, toYaml } from '../lib/openapi/serializer.js';

describe('OpenAPI Engine', () => {
  test('builds valid OpenAPI 3.1 document from registry', () => {
    const registry = new RouteRegistry();
    registry.register({
      method: 'get',
      path: '/users/{id}',
      originalPath: '/users/:id',
      pathParams: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
      status: 'discovered'
    });

    const doc = buildOpenApiDocument(registry, {
      info: { title: 'Test API', version: '2.0.0' }
    });

    assert.equal(doc.openapi, '3.1.0');
    assert.equal(doc.info.title, 'Test API');
    assert.equal(doc.info.version, '2.0.0');
    assert.ok(doc.paths['/users/{id}']);
    assert.ok(doc.paths['/users/{id}'].get);
    assert.equal(doc.paths['/users/{id}'].get.parameters[0].name, 'id');
    assert.equal(doc.paths['/users/{id}'].get.parameters[0].required, true);

    const validation = validateOpenApiDocument(doc);
    assert.equal(validation.valid, true, `Validation errors: ${validation.errors.join(', ')}`);
  });

  test('does not fabricate unknown schemas or examples', () => {
    const registry = new RouteRegistry();
    registry.register({
      method: 'post',
      path: '/tasks',
      status: 'discovered'
    });

    const doc = buildOpenApiDocument(registry);
    const postTask = doc.paths['/tasks'].post;

    assert.equal(postTask.requestBody, undefined, 'Must not fabricate request body');
    assert.ok(postTask.responses['200']);
    assert.equal(postTask.responses['200'].content, undefined, 'Must not fabricate response schema');
  });

  test('serializes to JSON and clean YAML', () => {
    const registry = new RouteRegistry();
    registry.register({
      method: 'get',
      path: '/status',
      status: 'discovered'
    });

    const doc = buildOpenApiDocument(registry);
    const jsonStr = toJson(doc);
    const yamlStr = toYaml(doc);

    assert.ok(jsonStr.includes('"openapi": "3.1.0"'));
    assert.ok(yamlStr.includes('openapi: 3.1.0'));
    assert.ok(yamlStr.includes('/status:'));
  });
});

