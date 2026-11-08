import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

describe('CommonJS Module Compatibility', () => {
  test('require("./index.cjs") exposes all public exports', () => {
    const cjs = require('../index.cjs');

    assert.equal(typeof cjs.autoDocs, 'function');
    assert.equal(typeof cjs.describeRoute, 'function');
    assert.equal(typeof cjs.RouteRegistry, 'function');
    assert.equal(typeof cjs.buildOpenApiDocument, 'function');
    assert.equal(typeof cjs.validateOpenApiDocument, 'function');
  });

  test('autoDocs initializes properly when required via CommonJS', () => {
    const { autoDocs, describeRoute } = require('../index.cjs');
    const express = require('express');

    const app = express();
    app.get('/health', describeRoute({ summary: 'Health check' }), (req, res) => res.send('ok'));

    const instance = autoDocs(app, {
      info: { title: 'CJS Test App', version: '1.0.0' }
    });

    const doc = instance.getDocument();
    assert.equal(doc.info.title, 'CJS Test App');
    assert.ok(doc.paths['/health']);
    assert.equal(doc.paths['/health'].get.summary, 'Health check');

    instance.close();
  });
});

