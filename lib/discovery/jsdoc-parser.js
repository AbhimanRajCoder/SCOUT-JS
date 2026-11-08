/**
 * Pure JavaScript JSDoc and Docstring Parser for SCOUT-JS.
 * Extracts metadata, summaries, descriptions, tags, parameters, and deprecation flags
 * directly from route handler functions with zero external dependencies.
 */

/**
 * Extracts the first JSDoc comment block string from a function's source code.
 * 
 * @param {Function} fn 
 * @returns {string | null}
 */
export function extractJSDocComment(fn) {
  if (typeof fn !== 'function') return null;
  const source = fn.toString();
  const match = source.match(/\/\*\*([\s\S]*?)\*\//);
  return match ? match[1] : null;
}

/**
 * Parses raw JSDoc comment content into structured OpenAPI operation metadata.
 * 
 * @param {string} commentStr 
 * @returns {{
 *   summary?: string,
 *   description?: string,
 *   tags?: string[],
 *   deprecated?: boolean,
 *   params?: Record<string, { type: string, description?: string, required: boolean, defaultValue?: string }>,
 *   responses?: Record<string, { description: string, type?: string }>
 * }}
 */
export function parseJSDoc(commentStr) {
  if (!commentStr || typeof commentStr !== 'string') {
    return {};
  }

  const lines = commentStr
    .split('\n')
    .map(line => line.replace(/^\s*\*\s?/, '').trim())
    .filter(Boolean);

  const result = {
    summary: undefined,
    description: undefined,
    tags: [],
    deprecated: false,
    params: {},
    responses: {}
  };

  const generalLines = [];

  for (const line of lines) {
    if (line.startsWith('@summary')) {
      result.summary = line.replace(/^@summary\s+/, '').trim();
    } else if (line.startsWith('@description')) {
      result.description = line.replace(/^@description\s+/, '').trim();
    } else if (/^@tags?/.test(line)) {
      const tagContent = line.replace(/^@tags?\s+/, '').trim();
      const extracted = tagContent.split(',').map(t => t.trim()).filter(Boolean);
      result.tags.push(...extracted);
    } else if (/^@deprecated/.test(line)) {
      result.deprecated = true;
    } else if (/^@param/.test(line)) {
      const match = line.match(/^@param\s*(?:\{([^}]+)\})?\s*(\[?[a-zA-Z0-9_.]+(?:=[^\]]+)?\]?)\s*(?:-\s*)?(.*)$/);
      if (match) {
        let [, type, rawName, desc] = match;
        let required = true;
        let defaultValue = undefined;

        if (rawName && rawName.startsWith('[') && rawName.endsWith(']')) {
          required = false;
          rawName = rawName.slice(1, -1);
          if (rawName.includes('=')) {
            const parts = rawName.split('=');
            rawName = parts[0];
            defaultValue = parts[1];
          }
        }

        if (rawName) {
          result.params[rawName] = {
            type: type || 'string',
            description: desc ? desc.trim() : undefined,
            required,
            defaultValue
          };
        }
      }
    } else if (/^@returns?/.test(line)) {
      const match = line.match(/^@returns?\s*(?:\{([^}]+)\})?\s*(?:(\d{3})\s*)?(?:-\s*)?(.*)$/);
      if (match) {
        const [, type, code, desc] = match;
        const statusCode = code || '200';
        result.responses[statusCode] = {
          description: desc ? desc.trim() : 'Successful Response',
          type: type || 'object'
        };
      }
    } else if (!line.startsWith('@')) {
      generalLines.push(line);
    }
  }

  // Use leading free-text paragraph lines if @summary or @description were not specified
  if (!result.summary && generalLines.length > 0) {
    result.summary = generalLines[0];
  }
  if (!result.description && generalLines.length > 1) {
    result.description = generalLines.slice(1).join(' ');
  }

  // Deduplicate tags
  result.tags = Array.from(new Set(result.tags));

  return result;
}

/**
 * Extracts and parses JSDoc metadata from an array of Express handlers.
 * 
 * @param {Array<Function>} handlers 
 * @returns {Object} Extracted metadata
 */
export function extractJSDocFromHandlers(handlers) {
  if (!Array.isArray(handlers)) return {};

  for (const h of handlers) {
    if (typeof h !== 'function') continue;
    // Skip describeRoute internal wrappers
    if (h.name === 'scoutDescribeRoute' || h.__scout_metadata__) continue;

    const comment = extractJSDocComment(h);
    if (comment) {
      const parsed = parseJSDoc(comment);
      if (parsed.summary || parsed.description || parsed.tags.length > 0 || parsed.deprecated || Object.keys(parsed.params).length > 0) {
        return parsed;
      }
    }
  }

  return {};
}
