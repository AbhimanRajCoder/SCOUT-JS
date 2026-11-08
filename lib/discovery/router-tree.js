/**
 * Router Tree and mount metadata tracking.
 */

import { joinPaths } from './params.js';

/**
 * WeakMap tracking router mount prefixes.
 * router -> Array<{ parent: any, prefix: string }>
 */
export const routerMountMap = new WeakMap();

/**
 * Attaches a mount prefix to a router instance.
 * @param {Object} router 
 * @param {string} prefix 
 * @param {Object} [parent]
 */
export function recordRouterMount(router, prefix, parent = null) {
  if (!router || (typeof router !== 'object' && typeof router !== 'function')) {
    return;
  }
  const existing = routerMountMap.get(router) || [];
  existing.push({ prefix: prefix || '', parent });
  routerMountMap.set(router, existing);
}

/**
 * Extracts a mount path from an Express router layer regexp if available.
 * e.g. /^\/api\/v1\/?(?=\/|$)/i -> "/api/v1"
 * 
 * @param {RegExp} regexp 
 * @returns {string|null}
 */
export function extractPrefixFromRegexp(regexp) {
  if (!regexp) return null;
  if (regexp.fast_slash) return '';

  let s = regexp.source;
  if (!s || s === '^\\/?$') return '';

  // Remove leading ^
  s = s.replace(/^\^/, '');

  // Remove trailing Express lookaheads and optional trailing slashes
  s = s.replace(/\\\/\?\(\?=\\\/\|\$\)$/, '');
  s = s.replace(/\(\?=\\\/\|\$\)$/, '');
  s = s.replace(/\\\/\?$/, '');
  s = s.replace(/\\\/?$/, '');

  // Unescape backslashes
  s = s.replace(/\\(.)/g, '$1');

  if (!s.startsWith('/')) {
    s = '/' + s;
  }
  // Remove trailing slash if longer than 1 char
  if (s.length > 1 && s.endsWith('/')) {
    s = s.slice(0, -1);
  }

  return s;
}
