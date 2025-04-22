import { normalizePassageStr } from '../modules/utils.js';

describe('normalizePassageStr', () => {
  test('empty or invalid input', () => {
    expect(normalizePassageStr('')).toBe('');
    expect(normalizePassageStr(null)).toBe('');
    expect(normalizePassageStr(undefined)).toBe('');
  });

  test('single verse', () => {
    expect(normalizePassageStr('LUK.2.39')).toBe('Luke 2:39');
  });

  test('same-chapter range', () => {
    expect(normalizePassageStr('MAT.1.1-MAT.1.17')).toBe('Matthew 1:1-17');
    expect(normalizePassageStr('LUK.1.1-LUK.1.17')).toBe('Luke 1:1-17');
  });

  test('multi-chapter range', () => {
    expect(normalizePassageStr('MAT.2.1-MAT.3.10')).toBe('Matthew 2:1-3:10');
  });
});
