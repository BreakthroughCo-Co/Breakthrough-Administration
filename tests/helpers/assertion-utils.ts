import * as crypto from 'crypto';

/**
 * Strict Assertion and Verification Utilities for NDIS BSP Compliance Test Suite
 */

export class AssertionError extends Error {
  actual?: any;
  expected?: any;

  constructor(message: string, actual?: any, expected?: any) {
    super(message);
    this.name = 'AssertionError';
    this.actual = actual;
    this.expected = expected;
  }
}

export function assert(condition: any, message = 'Assertion failed'): asserts condition {
  if (!condition) {
    throw new AssertionError(message, condition, true);
  }
}

export function assertEquals(actual: any, expected: any, message?: string): void {
  if (actual !== expected) {
    const msg = message || `Expected ${JSON.stringify(expected)}, but received ${JSON.stringify(actual)}`;
    throw new AssertionError(msg, actual, expected);
  }
}

export function assertNotEquals(actual: any, expected: any, message?: string): void {
  if (actual === expected) {
    const msg = message || `Expected value to differ from ${JSON.stringify(expected)}`;
    throw new AssertionError(msg, actual, expected);
  }
}

export function assertGreaterThan(actual: number, expected: number, message?: string): void {
  if (typeof actual !== 'number' || actual <= expected) {
    const msg = message || `Expected ${actual} > ${expected}`;
    throw new AssertionError(msg, actual, expected);
  }
}

export function assertGreaterThanOrEqual(actual: number, expected: number, message?: string): void {
  if (typeof actual !== 'number' || actual < expected) {
    const msg = message || `Expected ${actual} >= ${expected}`;
    throw new AssertionError(msg, actual, expected);
  }
}

export function assertLessThan(actual: number, expected: number, message?: string): void {
  if (typeof actual !== 'number' || actual >= expected) {
    const msg = message || `Expected ${actual} < ${expected}`;
    throw new AssertionError(msg, actual, expected);
  }
}

export function assertLessThanOrEqual(actual: number, expected: number, message?: string): void {
  if (typeof actual !== 'number' || actual > expected) {
    const msg = message || `Expected ${actual} <= ${expected}`;
    throw new AssertionError(msg, actual, expected);
  }
}

export function assertDeepEqual(actual: any, expected: any, message?: string): void {
  const actualStr = JSON.stringify(sortObjectKeys(actual));
  const expectedStr = JSON.stringify(sortObjectKeys(expected));
  if (actualStr !== expectedStr) {
    const msg = message || `Deep equality mismatch:\nActual:   ${actualStr}\nExpected: ${expectedStr}`;
    throw new AssertionError(msg, actual, expected);
  }
}

export function assertMatch(actual: string, pattern: RegExp | string, message?: string): void {
  const regex = typeof pattern === 'string' ? new RegExp(pattern) : pattern;
  if (!regex.test(actual)) {
    const msg = message || `String "${actual}" did not match pattern ${regex}`;
    throw new AssertionError(msg, actual, pattern);
  }
}

export function assertArrayContains<T>(array: T[], predicate: (item: T) => boolean, message?: string): void {
  if (!Array.isArray(array) || !array.some(predicate)) {
    const msg = message || `Array did not contain matching element`;
    throw new AssertionError(msg, array, 'predicate satisfied');
  }
}

export function assertThrows(fn: () => void, message?: string): void {
  let threw = false;
  try {
    fn();
  } catch {
    threw = true;
  }
  if (!threw) {
    throw new AssertionError(message || 'Expected function to throw an error, but it did not.');
  }
}

export function computeSha256(data: any): string {
  const serialized = typeof data === 'string' ? data : JSON.stringify(sortObjectKeys(data));
  return crypto.createHash('sha256').update(serialized).digest('hex');
}

function sortObjectKeys(obj: any): any {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  if (Array.isArray(obj)) {
    return obj.map(sortObjectKeys);
  }
  const sorted: Record<string, any> = {};
  for (const key of Object.keys(obj).sort()) {
    sorted[key] = sortObjectKeys(obj[key]);
  }
  return sorted;
}

export interface SchemaValidationResult {
  valid: boolean;
  errors: string[];
}

export function validateDraft07Schema(data: any, schema: any, path = '#'): SchemaValidationResult {
  const errors: string[] = [];

  if (!schema || typeof schema !== 'object') {
    return { valid: true, errors: [] };
  }

  // Type check
  if (schema.type) {
    const actualType = Array.isArray(data) ? 'array' : data === null ? 'null' : typeof data;
    if (schema.type === 'integer') {
      if (typeof data !== 'number' || !Number.isInteger(data)) {
        errors.push(`${path}: expected integer, got ${actualType} (${data})`);
      }
    } else if (schema.type === 'number') {
      if (typeof data !== 'number') {
        errors.push(`${path}: expected number, got ${actualType}`);
      }
    } else if (actualType !== schema.type) {
      errors.push(`${path}: expected type ${schema.type}, got ${actualType}`);
      return { valid: false, errors };
    }
  }

  // Enum check
  if (schema.enum && Array.isArray(schema.enum)) {
    if (!schema.enum.includes(data)) {
      errors.push(`${path}: value "${data}" is not one of enum [${schema.enum.join(', ')}]`);
    }
  }

  // Number bounds
  if (typeof data === 'number') {
    if (schema.minimum !== undefined && data < schema.minimum) {
      errors.push(`${path}: ${data} is less than minimum ${schema.minimum}`);
    }
    if (schema.maximum !== undefined && data > schema.maximum) {
      errors.push(`${path}: ${data} is greater than maximum ${schema.maximum}`);
    }
  }

  // Required properties for objects
  if (schema.type === 'object' && schema.required && Array.isArray(schema.required) && typeof data === 'object' && data !== null) {
    for (const reqProp of schema.required) {
      if (!(reqProp in data) || data[reqProp] === undefined) {
        errors.push(`${path}: missing required property "${reqProp}"`);
      }
    }
  }

  // Nested properties for objects
  if (schema.properties && typeof data === 'object' && data !== null) {
    for (const key of Object.keys(schema.properties)) {
      if (key in data && data[key] !== undefined) {
        const subRes = validateDraft07Schema(data[key], schema.properties[key], `${path}.${key}`);
        errors.push(...subRes.errors);
      }
    }
  }

  // Array checks
  if (Array.isArray(data)) {
    if (schema.minItems !== undefined && data.length < schema.minItems) {
      errors.push(`${path}: array length ${data.length} is less than minItems ${schema.minItems}`);
    }
    if (schema.maxItems !== undefined && data.length > schema.maxItems) {
      errors.push(`${path}: array length ${data.length} is greater than maxItems ${schema.maxItems}`);
    }
    if (schema.items && typeof schema.items === 'object') {
      data.forEach((item, index) => {
        const itemRes = validateDraft07Schema(item, schema.items, `${path}[${index}]`);
        errors.push(...itemRes.errors);
      });
    }
  }

  return {
    valid: errors.length === 0,
    errors
  };
}
