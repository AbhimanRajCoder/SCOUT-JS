/**
 * Security and production controls for SCOUT-JS.
 */

/**
 * Checks whether the documentation endpoints should be enabled.
 * Rule: Secure by default. Disabled in production unless explicitly enabled.
 * 
 * @param {Object} [options={}]
 * @returns {boolean}
 */
export function isDocsEnabled(options = {}) {
  if (options.docs?.enabled !== undefined) {
    return Boolean(options.docs.enabled);
  }

  const isProd = process.env.NODE_ENV === 'production';
  if (isProd) {
    // In production, require explicit opt-in or protectDocs
    return Boolean(options.security?.protectDocs);
  }

  return true;
}

/**
 * Creates authentication guard middleware for documentation endpoints.
 * 
 * @param {Object} [options={}]
 * @returns {import('express').RequestHandler}
 */
export function createAuthGuard(options = {}) {
  const protectDocs = options.security?.protectDocs;
  const credentials = options.security?.credentials; // { username, password }

  return function docsAuthGuard(req, res, next) {
    if (!protectDocs) {
      return next();
    }

    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Basic ')) {
      res.setHeader('WWW-Authenticate', 'Basic realm="API Documentation"');
      return res.status(401).send('Authentication required to access API documentation.');
    }

    if (credentials?.username && credentials?.password) {
      const b64 = authHeader.split(' ')[1];
      const decoded = Buffer.from(b64, 'base64').toString('utf-8');
      const [u, p] = decoded.split(':');

      if (u !== credentials.username || p !== credentials.password) {
        res.setHeader('WWW-Authenticate', 'Basic realm="API Documentation"');
        return res.status(401).send('Invalid credentials.');
      }
    }

    return next();
  };
}

