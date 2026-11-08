import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { normalizeExpressPath, joinPaths } from '../lib/discovery/params.js';

describe('normalizeExpressPath', () => {
  test('converts simple parameter :id to {id}', () => {
    const result = normalizeExpressPath('/users/:id');
    assert.equal(result.openApiPath, '/users/{id}');
    assert.equal(result.pathParams.length, 1);
    assert.equal(result.pathParams[0].name, 'id');
    assert.equal(result.pathParams[0].in, 'path');
    assert.equal(result.pathParams[0].required, true);
    assert.equal(result.isSupported, true);
  });

  test('converts multiple parameters', () => {
    const result = normalizeExpressPath('/users/:userId/posts/:postId');
    assert.equal(result.openApiPath, '/users/{userId}/posts/{postId}');
    assert.equal(result.pathParams.length, 2);
    assert.equal(result.pathParams[0].name, 'userId');
    assert.equal(result.pathParams[1].name, 'postId');
  });

  test('handles optional parameters and custom regex', () => {
    const result = normalizeExpressPath('/users/:id(\\d+)?');
    assert.equal(result.openApiPath, '/users/{id}');
    assert.equal(result.pathParams[0].name, 'id');
    assert.equal(result.pathParams[0].required, true);
    assert.ok(result.warnings.length > 0);
  });

  test('flags wildcard paths as unsupported', () => {
    const result = normalizeExpressPath('/files/*');
    assert.equal(result.isSupported, false);
    assert.ok(result.warnings.some(w => w.includes('wildcard')));
  });

  test('handles root and trailing slashes', () => {
    assert.equal(normalizeExpressPath('/users/').openApiPath, '/users');
    assert.equal(normalizeExpressPath('/').openApiPath, '/');
    assert.equal(normalizeExpressPath('users').openApiPath, '/users');
  });
});

describe('joinPaths', () => {
  test('joins parent and child correctly', () => {
    assert.equal(joinPaths('/api/v1', '/users'), '/api/v1/users');
    assert.equal(joinPaths('/api/v1/', '/users/'), '/api/v1/users/');
    assert.equal(joinPaths('/', '/users'), '/users');
    assert.equal(joinPaths('/api', 'users'), '/api/users');
  });
});

