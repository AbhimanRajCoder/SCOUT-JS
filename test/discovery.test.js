import { test, describe, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import express from 'express';
import { RouteRegistry } from '../lib/metadata/registry.js';
import { discoverRoutes } from '../lib/discovery/index.js';

describe('Discovery Engine', () => {
  let app;
  let registry;

  beforeEach(() => {
    app = express();
    registry = new RouteRegistry();
  });

  test('discovers routes registered before discoverRoutes()', () => {
    app.get('/users', (req, res) => res.json([]));
    app.post('/users/:id', (req, res) => res.json({}));

    discoverRoutes(app, registry);

    const routes = registry.getAll();
    assert.equal(routes.length, 2);

    const getUsers = registry.get('get', '/users');
    assert.ok(getUsers);
    assert.equal(getUsers.status, 'discovered');

    const postUser = registry.get('post', '/users/{id}');
    assert.ok(postUser);
    assert.equal(postUser.pathParams.length, 1);
    assert.equal(postUser.pathParams[0].name, 'id');
  });

  test('discovers routes registered after discoverRoutes()', () => {
    discoverRoutes(app, registry);

    app.get('/products', (req, res) => res.json([]));
    app.delete('/products/:id', (req, res) => res.json({}));

    const getProducts = registry.get('get', '/products');
    assert.ok(getProducts);
    assert.equal(getProducts.status, 'discovered');

    const deleteProduct = registry.get('delete', '/products/{id}');
    assert.ok(deleteProduct);
    assert.equal(deleteProduct.pathParams[0].name, 'id');
  });

  test('discovers nested routers with mount prefixes', () => {
    const apiRouter = express.Router();
    const userRouter = express.Router();

    userRouter.get('/:userId/profile', (req, res) => res.json({}));
    apiRouter.use('/users', userRouter);
    app.use('/api/v1', apiRouter);

    discoverRoutes(app, registry);

    const profileRoute = registry.get('get', '/api/v1/users/{userId}/profile');
    assert.ok(profileRoute, 'Should resolve full nested path');
    assert.equal(profileRoute.pathParams.length, 1);
    assert.equal(profileRoute.pathParams[0].name, 'userId');
  });

  test('discovers nested routers added AFTER discoverRoutes()', () => {
    discoverRoutes(app, registry);

    const orderRouter = express.Router();
    orderRouter.post('/:orderId/pay', (req, res) => res.json({}));

    app.use('/orders', orderRouter);

    const payRoute = registry.get('post', '/orders/{orderId}/pay');
    assert.ok(payRoute, 'Should resolve nested route added afterwards');
    assert.equal(payRoute.pathParams[0].name, 'orderId');
  });

  test('discovers routes via app.route() chaining', () => {
    app.route('/articles')
      .get((req, res) => res.json([]))
      .post((req, res) => res.json({}));

    discoverRoutes(app, registry);

    const getArticles = registry.get('get', '/articles');
    const postArticles = registry.get('post', '/articles');
    assert.ok(getArticles);
    assert.ok(postArticles);
  });

  test('discovers routes via app.route() chaining added AFTER discoverRoutes()', () => {
    discoverRoutes(app, registry);

    app.route('/comments/:commentId')
      .get((req, res) => res.json({}))
      .delete((req, res) => res.json({}));

    const getComment = registry.get('get', '/comments/{commentId}');
    const deleteComment = registry.get('delete', '/comments/{commentId}');
    assert.ok(getComment);
    assert.ok(deleteComment);
  });

  test('handles app.all() by creating entries for standard methods', () => {
    app.all('/webhook', (req, res) => res.send('ok'));
    discoverRoutes(app, registry);

    assert.ok(registry.get('get', '/webhook'));
    assert.ok(registry.get('post', '/webhook'));
    assert.ok(registry.get('put', '/webhook'));
    assert.ok(registry.get('delete', '/webhook'));
  });

  test('respects exclude filters and assigns "excluded" status', () => {
    app.get('/public', (req, res) => res.send('ok'));
    app.get('/admin/secret', (req, res) => res.send('secret'));

    discoverRoutes(app, registry, {
      exclude: ['/admin']
    });

    const publicRoute = registry.get('get', '/public');
    const adminRoute = registry.get('get', '/admin/secret');

    assert.equal(publicRoute.status, 'discovered');
    assert.equal(adminRoute.status, 'excluded');
  });

  test('handles duplicate route registrations cleanly without corruption', () => {
    app.get('/users', (req, res) => res.send('1'));
    app.get('/users', (req, res) => res.send('2'));

    discoverRoutes(app, registry);

    const routes = registry.getAll().filter(r => r.path === '/users');
    assert.equal(routes.length, 1);
  });
});

