import { test, describe, before, after } from 'node:test';
import assert from 'node:assert/strict';
import express from 'express';
import { autoDocs, describeRoute } from '../index.js';
import { parseJSDoc, extractJSDocComment } from '../lib/discovery/jsdoc-parser.js';

describe('Inline Handler Docstring & JSDoc Extraction (Phase 5)', () => {
  let app;
  let server;
  let baseUrl;
  let instance;

  test('parseJSDoc extracts summary, description, tags, params, and deprecated flags', () => {
    const comment = `
      * Retrieve user details
      * Returns a detailed user profile from the database.
      * @tags Users, Accounts
      * @param {string} id - The user unique identifier
      * @param {number} [limit=25] - Max records
      * @deprecated
    `;

    const parsed = parseJSDoc(comment);
    assert.equal(parsed.summary, 'Retrieve user details');
    assert.equal(parsed.description, 'Returns a detailed user profile from the database.');
    assert.deepEqual(parsed.tags, ['Users', 'Accounts']);
    assert.equal(parsed.deprecated, true);

    assert.ok(parsed.params.id);
    assert.equal(parsed.params.id.type, 'string');
    assert.equal(parsed.params.id.description, 'The user unique identifier');
    assert.equal(parsed.params.id.required, true);

    assert.ok(parsed.params.limit);
    assert.equal(parsed.params.limit.type, 'number');
    assert.equal(parsed.params.limit.required, false);
    assert.equal(parsed.params.limit.defaultValue, '25');
  });

  test('extractJSDocComment retrieves raw docstring from function', () => {
    function sampleHandler(req, res) {
      /**
       * @summary Sample summary
       */
      return res;
    }

    const comment = extractJSDocComment(sampleHandler);
    assert.ok(comment);
    assert.ok(comment.includes('@summary Sample summary'));
  });

  describe('Route Discovery & OpenAPI Generation with JSDoc', () => {
    before(async () => {
      app = express();
      app.use(express.json());

      // 1. Standard function with inline JSDoc
      app.get('/api/users/:id', function getUser(req, res) {
        /**
         * @summary Fetch user by ID
         * @description Returns user profile for specified ID
         * @tags Users, Membership
         * @param {string} id - The unique user ID
         */
        res.json({ id: req.params.id });
      });

      // 2. Arrow function with inline JSDoc & @deprecated
      app.delete('/api/legacy/token', (req, res) => {
        /**
         * @summary Revoke legacy token
         * @tags Legacy
         * @deprecated
         */
        res.json({ revoked: true });
      });

      // 3. Precedence test: describeRoute overrides JSDoc tags and summary
      app.get('/api/conflict', describeRoute({
        summary: 'Explicit Summary From describeRoute',
        tags: ['ExplicitTag']
      }), (req, res) => {
        /**
         * @summary Inferred Summary from JSDoc
         * @tags JSDocTag
         */
        res.json({ status: 'ok' });
      });

      instance = autoDocs(app, {
        info: { title: 'JSDoc Test API', version: '1.0.0' }
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

    test('OpenAPI spec reflects JSDoc summary, description, tags, and param description', () => {
      const doc = instance.getDocument();
      const userOp = doc.paths['/api/users/{id}'].get;

      assert.equal(userOp.summary, 'Fetch user by ID');
      assert.equal(userOp.description, 'Returns user profile for specified ID');
      assert.deepEqual(userOp.tags, ['Users', 'Membership']);

      const idParam = userOp.parameters.find(p => p.name === 'id');
      assert.ok(idParam);
      assert.equal(idParam.description, 'The unique user ID');
      assert.equal(idParam.schema.type, 'string');
    });

    test('OpenAPI spec marks deprecated: true from JSDoc @deprecated tag', () => {
      const doc = instance.getDocument();
      const legacyOp = doc.paths['/api/legacy/token'].delete;

      assert.equal(legacyOp.summary, 'Revoke legacy token');
      assert.deepEqual(legacyOp.tags, ['Legacy']);
      assert.equal(legacyOp.deprecated, true);
    });

    test('describeRoute explicitly takes precedence over JSDoc metadata', () => {
      const doc = instance.getDocument();
      const conflictOp = doc.paths['/api/conflict'].get;

      assert.equal(conflictOp.summary, 'Explicit Summary From describeRoute');
      assert.deepEqual(conflictOp.tags, ['ExplicitTag']);
    });
  });
});
