import { Request, Response, NextFunction } from 'express';
import DOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';

const window = new JSDOM('').window;
const purify = DOMPurify(window);

// Configure DOMPurify for stricter sanitization
purify.setConfig({
  ALLOWED_TAGS: [], // No HTML tags allowed
  ALLOWED_ATTR: [], // No attributes allowed
  KEEP_CONTENT: true, // Keep text content, remove only tags
  RETURN_DOM: false,
  RETURN_DOM_FRAGMENT: false
});

const sanitizeValue = (value: unknown): unknown => {
  if (typeof value === 'string') {
    // First trim whitespace, then sanitize
    const trimmed = value.trim();
    // Use DOMPurify to remove any HTML/script content
    const sanitized = purify.sanitize(trimmed);
    return sanitized;
  }

  if (Array.isArray(value)) {
    return value.map(sanitizeValue);
  }

  if (value && typeof value === 'object' && value.constructor === Object) {
    const sanitized: Record<string, unknown> = {};
    for (const [key, val] of Object.entries(value)) {
      // Also sanitize object keys
      const sanitizedKey = typeof key === 'string' ? purify.sanitize(key.trim()) : key;
      sanitized[sanitizedKey] = sanitizeValue(val);
    }
    return sanitized;
  }

  // Return primitive values as-is (numbers, booleans, null, undefined)
  return value;
};

export const sanitizeRequest = (req: Request, res: Response, next: NextFunction): void => {
  try {
    // Sanitize request body
    if (req.body && typeof req.body === 'object') {
      req.body = sanitizeValue(req.body) as any;
    }

    // Sanitize query parameters
    if (req.query && typeof req.query === 'object') {
      req.query = sanitizeValue(req.query) as any;
    }

    // Sanitize URL parameters
    if (req.params && typeof req.params === 'object') {
      req.params = sanitizeValue(req.params) as any;
    }

    next();
  } catch (error) {
    console.error('Error during request sanitization:', error);
    next(error);
  }
};