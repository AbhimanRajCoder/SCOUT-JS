/**
 * Serializer for OpenAPI specifications (JSON and YAML).
 */

/**
 * Pure JavaScript YAML dumper. Zero external dependencies.
 * 
 * @param {any} data 
 * @param {number} [indent=0] 
 * @returns {string}
 */
export function dumpYaml(data, indent = 0) {
  const spaces = '  '.repeat(indent);

  if (data === null || data === undefined) {
    return 'null\n';
  }

  if (typeof data === 'boolean' || typeof data === 'number') {
    return String(data) + '\n';
  }

  if (typeof data === 'string') {
    // If multiline or contains special YAML characters, quote or block
    if (data.includes('\n')) {
      const lines = data.split('\n').map(l => '  '.repeat(indent + 1) + l).join('\n');
      return `|\n${lines}\n`;
    }
    if (data.match(/[:#\[\]{}|>&*!%@`,'"?]/) || data.trim() !== data || data === '') {
      return JSON.stringify(data) + '\n';
    }
    return data + '\n';
  }

  if (Array.isArray(data)) {
    if (data.length === 0) return '[]\n';
    let out = '';
    for (const item of data) {
      if (typeof item === 'object' && item !== null) {
        const itemYaml = dumpYaml(item, indent + 1).trimStart();
        out += `${spaces}- ${itemYaml}`;
      } else {
        out += `${spaces}- ${dumpYaml(item, 0)}`;
      }
    }
    return out;
  }

  if (typeof data === 'object') {
    const keys = Object.keys(data);
    if (keys.length === 0) return '{}\n';
    let out = '';
    for (const key of keys) {
      const val = data[key];
      if (val === undefined) continue;

      if (typeof val === 'object' && val !== null) {
        if (Array.isArray(val) && val.length === 0) {
          out += `${spaces}${key}: []\n`;
        } else if (Object.keys(val).length === 0) {
          out += `${spaces}${key}: {}\n`;
        } else {
          out += `${spaces}${key}:\n${dumpYaml(val, indent + 1)}`;
        }
      } else {
        out += `${spaces}${key}: ${dumpYaml(val, 0)}`;
      }
    }
    return out;
  }

  return String(data) + '\n';
}

/**
 * Serializes OpenAPI document to JSON.
 * @param {Object} doc 
 * @returns {string}
 */
export function toJson(doc) {
  return JSON.stringify(doc, null, 2);
}

/**
 * Serializes OpenAPI document to YAML.
 * @param {Object} doc 
 * @returns {string}
 */
export function toYaml(doc) {
  return dumpYaml(doc);
}

