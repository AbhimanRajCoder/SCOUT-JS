/**
 * TypeScript definitions for SCOUT-JS.
 * Provides IDE autocomplete and static type safety.
 */

import type { Application, RequestHandler } from 'express';

export type HttpMethod = 'get' | 'post' | 'put' | 'patch' | 'delete' | 'options' | 'head' | 'all';
export type RouteStatus = 'discovered' | 'partial' | 'unsupported' | 'excluded';

export interface RouteDefinition {
  id: string;
  method: HttpMethod;
  path: string;
  originalPath: string;
  pathParams: Array<{
    name: string;
    in: 'path';
    required: true;
    schema: { type: string };
    description?: string;
  }>;
  queryParams?: Array<{
    name: string;
    in: 'query';
    required: boolean;
    schema: Record<string, unknown>;
    description?: string;
  }>;
  headerParams?: Array<{
    name: string;
    in: 'header';
    required: boolean;
    schema: Record<string, unknown>;
    description?: string;
  }>;
  status: RouteStatus;
  handlerName?: string;
  tags?: string[];
  summary?: string;
  description?: string;
  requestBody?: Record<string, unknown>;
  responses?: Record<string | number, { description: string; content?: Record<string, unknown> }>;
  security?: Record<string, string[]>[];
  warnings: string[];
}

export interface DiscoveryStats {
  total: number;
  discovered: number;
  partial: number;
  unsupported: number;
  excluded: number;
}

export interface AutoDocsOptions {
  info: {
    title: string;
    version: string;
    description?: string;
  };
  docs?: {
    enabled?: boolean;
    path?: string;
    theme?: 'light' | 'dark' | 'system';
  };
  openapi?: {
    path?: string;
    version?: '3.1.0';
  };
  discovery?: {
    enabled?: boolean;
    include?: (string | RegExp)[];
    exclude?: (string | RegExp)[];
  };
  security?: {
    protectDocs?: boolean;
    credentials?: {
      username?: string;
      password?: string;
    };
    schemes?: Record<string, unknown>;
  };
  server?: {
    url?: string;
    description?: string;
  };
  components?: {
    schemas?: Record<string, unknown>;
    securitySchemes?: Record<string, unknown>;
  };
}

export interface AutoDocsInstance {
  getDocument(): Record<string, unknown>;
  refresh(): Promise<void>;
  getRoutes(): RouteDefinition[];
  getStats(): DiscoveryStats;
  close(): void;
}

export interface RouteValidationIssue {
  field: string;
  message: string;
  location?: 'body' | 'query' | 'params' | 'headers';
  code?: string;
}

export interface RouteMetadata {
  summary?: string;
  description?: string;
  tags?: string[];
  body?: unknown;
  example?: unknown;
  query?: unknown;
  headers?: unknown;
  params?: unknown;
  responses?: Record<string | number, string | { description: string; body?: unknown; schema?: unknown; example?: unknown }>;
  responseModel?: unknown;
  serialize?: boolean;
  security?: Record<string, string[]>[];
  validate?: boolean | {
    body?: boolean;
    query?: boolean;
    params?: boolean;
    headers?: boolean;
  };
  onValidationError?: (
    issues: RouteValidationIssue[],
    req: any,
    res: any,
    next: any
  ) => void;
  onResponseValidationError?: (
    issues: Array<{ field?: string; message: string; code?: string }>,
    data: any,
    options: any
  ) => void;
}

/**
 * Initializes SCOUT-JS on an Express application.
 * Discovers registered routes, generates an OpenAPI 3.1 spec, and mounts the interactive docs UI.
 */
export function autoDocs(app: Application, options?: AutoDocsOptions): AutoDocsInstance;

/**
 * Attaches metadata and request/response schemas to an Express route.
 */
export function describeRoute(options?: RouteMetadata): RequestHandler;

export class RouteRegistry {
  register(definition: Partial<RouteDefinition>): RouteDefinition;
  get(method: string, path: string): RouteDefinition | undefined;
  getAll(): RouteDefinition[];
  getStats(): DiscoveryStats;
  clear(): void;
}

export function buildOpenApiDocument(registry: RouteRegistry, options?: AutoDocsOptions): Record<string, unknown>;
export function validateOpenApiDocument(doc: Record<string, unknown>): { valid: boolean; errors: string[] };

