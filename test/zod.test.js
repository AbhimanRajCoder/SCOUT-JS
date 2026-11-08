import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { z } from 'zod';
import { zodToJsonSchema } from '../lib/schema/json-schema.js';
import { describeRoute } from '../lib/schema/describe-route.js';

describe('Zod Schema Integration', () => {
  test('converts ZodObject with primitive types to JSON Schema', () => {
    const userSchema = z.object({
      name: z.string().min(2).max(50),
      age: z.number().int().min(0),
      email: z.string().email(),
      isActive: z.boolean().optional()
    });

    const jsonSchema = zodToJsonSchema(userSchema);

    assert.equal(jsonSchema.type, 'object');
    assert.deepEqual(jsonSchema.required, ['name', 'age', 'email']);
    assert.equal(jsonSchema.properties.name.type, 'string');
    assert.equal(jsonSchema.properties.name.minLength, 2);
    assert.equal(jsonSchema.properties.name.maxLength, 50);
    assert.equal(jsonSchema.properties.age.type, 'integer');
    assert.equal(jsonSchema.properties.age.minimum, 0);
    assert.equal(jsonSchema.properties.email.format, 'email');
    assert.equal(jsonSchema.properties.isActive.type, 'boolean');
  });

  test('converts ZodArray and ZodEnum', () => {
    const roleSchema = z.enum(['admin', 'user', 'guest']);
    const tagsSchema = z.array(z.string());

    const roleJson = zodToJsonSchema(roleSchema);
    assert.equal(roleJson.type, 'string');
    assert.deepEqual(roleJson.enum, ['admin', 'user', 'guest']);

    const tagsJson = zodToJsonSchema(tagsSchema);
    assert.equal(tagsJson.type, 'array');
    assert.equal(tagsJson.items.type, 'string');
  });

  test('describeRoute automatically converts Zod request body and query', () => {
    const bodySchema = z.object({
      title: z.string(),
      count: z.number()
    });

    const querySchema = z.object({
      limit: z.number().optional()
    });

    const middleware = describeRoute({
      summary: 'Create post',
      body: bodySchema,
      query: querySchema
    });

    assert.ok(middleware.__scout_metadata__);
    assert.ok(middleware.__scout_metadata__.requestBody);
    const content = middleware.__scout_metadata__.requestBody.content['application/json'];
    assert.equal(content.schema.type, 'object');
    assert.deepEqual(content.schema.required, ['title', 'count']);

    assert.ok(middleware.__scout_metadata__.queryParams);
    assert.equal(middleware.__scout_metadata__.queryParams[0].name, 'limit');
  });
});

