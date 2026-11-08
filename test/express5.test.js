import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { introspectExpress5 } from '../lib/discovery/express5-adapter.js';

describe('Express 5 Compatibility Adapter', () => {
  test('introspects router stack using Express 5 app.router structure', () => {
    // Mock an Express 5 application where routes are held on app.router.stack
    const mockExpress5App = {
      router: {
        stack: [
          {
            route: {
              path: '/v2/products',
              methods: { get: true, post: true },
              stack: [{ name: 'getProducts' }]
            }
          },
          {
            route: {
              path: '/v2/products/:productId',
              methods: { get: true, delete: true },
              stack: [{ name: 'getProductById' }]
            }
          }
        ]
      }
    };

    const routes = introspectExpress5(mockExpress5App);

    assert.equal(routes.length, 4);

    const getProducts = routes.find(r => r.method === 'get' && r.path === '/v2/products');
    assert.ok(getProducts);
    assert.equal(getProducts.status, 'discovered');

    const getProductById = routes.find(r => r.method === 'get' && r.path === '/v2/products/{productId}');
    assert.ok(getProductById);
    assert.equal(getProductById.pathParams.length, 1);
    assert.equal(getProductById.pathParams[0].name, 'productId');
    assert.equal(getProductById.pathParams[0].required, true);
  });

  test('introspects nested sub-routers in Express 5 structure', () => {
    const subRouter = {
      stack: [
        {
          route: {
            path: '/details',
            methods: { get: true },
            stack: [{ name: 'getDetails' }]
          }
        }
      ]
    };

    const mockExpress5App = {
      router: {
        stack: [
          {
            name: 'router',
            regexp: /^\/api\/orders\/?(?=\/|$)/i,
            handle: subRouter
          }
        ]
      }
    };

    const routes = introspectExpress5(mockExpress5App);
    assert.equal(routes.length, 1);
    assert.equal(routes[0].path, '/api/orders/details');
    assert.equal(routes[0].method, 'get');
  });

  test('handles malformed or empty router gracefully without throwing', () => {
    assert.deepEqual(introspectExpress5(null), []);
    assert.deepEqual(introspectExpress5({}), []);
    assert.deepEqual(introspectExpress5({ router: {} }), []);
  });
});
