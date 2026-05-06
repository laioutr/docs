import { describe, it, expect } from 'vitest';
import { nullOrEmpty } from './nullOrEmpty';

describe('nullOrEmpty', () => {
  it('returns true for missing type', () => {
    expect(nullOrEmpty({})).toBe(true);
  });

  it('returns true for type: null', () => {
    expect(nullOrEmpty({ type: 'null' })).toBe(true);
  });

  it('returns true for empty object', () => {
    expect(nullOrEmpty({ type: 'object' })).toBe(true);
    expect(nullOrEmpty({ type: 'object', properties: {} })).toBe(true);
  });

  it('returns false for object with properties', () => {
    expect(nullOrEmpty({ type: 'object', properties: { a: { type: 'string' } } })).toBe(false);
  });

  it('returns false for primitive types', () => {
    expect(nullOrEmpty({ type: 'string' })).toBe(false);
    expect(nullOrEmpty({ type: 'number' })).toBe(false);
    expect(nullOrEmpty({ type: 'integer' })).toBe(false);
    expect(nullOrEmpty({ type: 'boolean' })).toBe(false);
    expect(nullOrEmpty({ type: 'array' })).toBe(false);
  });

  it('returns false for any union (anyOf, oneOf, allOf)', () => {
    expect(nullOrEmpty({ anyOf: [{ type: 'string' }] })).toBe(false);
    expect(nullOrEmpty({ oneOf: [{ type: 'string' }] })).toBe(false);
    expect(nullOrEmpty({ allOf: [{ type: 'string' }] })).toBe(false);
  });
});
