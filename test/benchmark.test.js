import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import express from 'express';
import { autoDocs, describeRoute } from '../index.js';

describe('Performance Benchmarks', () => {
  test('initialization runs in well under 100 ms', () => {
    const app = express();
    // Register 20 routes
    for (let i = 0; i < 20; i++) {
      app.get(`/api/v1/resource-${i}/:id`, describeRoute({
        summary: `Resource ${i}`,
        tags: [`Resource${i}`]
      }), (req, res) => res.json({ id: req.params.id }));
    }

    const start = performance.now();
    const instance = autoDocs(app, {
      info: { title: 'Benchmark API', version: '1.0.0' }
    });
    const initDuration = performance.now() - start;

    assert.ok(initDuration < 100, `Init took ${initDuration.toFixed(2)}ms (target: < 100ms)`);
    assert.equal(instance.getRoutes().length, 24); // 20 resources + 4 docs endpoints

    instance.close();
  });

  test('cached document retrieval executes in under 1 ms (target: < 10 ms)', () => {
    const app = express();
    for (let i = 0; i < 10; i++) {
      app.get(`/item-${i}`, (req, res) => res.send('ok'));
    }

    const instance = autoDocs(app, { info: { title: 'Cache Test', version: '1.0.0' } });

    // Retrieve cached spec 50 times
    const start = performance.now();
    for (let i = 0; i < 50; i++) {
      const doc = instance.getDocument();
      assert.ok(doc);
    }
    const avgDuration = (performance.now() - start) / 50;

    assert.ok(avgDuration < 1.0, `Average cached retrieval took ${avgDuration.toFixed(4)}ms (target: < 10ms)`);
    instance.close();
  });

  test('no memory leak on repeated refresh()', async () => {
    const app = express();
    app.get('/test', (req, res) => res.send('ok'));

    const instance = autoDocs(app, { info: { title: 'Leak Test', version: '1.0.0' } });

    // Run 100 refreshes
    for (let i = 0; i < 100; i++) {
      await instance.refresh();
    }

    // Verify registry size remains stable
    assert.equal(instance.getRoutes().length, 5); // 1 route + 4 docs endpoints
    instance.close();
  });
});

