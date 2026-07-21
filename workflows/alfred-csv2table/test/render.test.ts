import { describe, expect, it } from 'vitest';
import { displayWidth, isNumericCell, splitLines } from '../src/render';

describe('displayWidth', () => {
  it('counts plain ASCII characters', () => {
    expect(displayWidth('name')).toBe(4);
    expect(displayWidth('')).toBe(0);
  });

  it('counts a code point once, not its UTF-16 units', () => {
    expect(displayWidth('prior month’s')).toBe(13);
    expect(displayWidth('café')).toBe(4);
    expect(displayWidth('🙂')).toBe(1);
  });
});

describe('isNumericCell', () => {
  it('accepts integers and decimals, signed or not', () => {
    expect(isNumericCell('3000')).toBe(true);
    expect(isNumericCell('-12.5')).toBe(true);
    expect(isNumericCell('+7')).toBe(true);
    expect(isNumericCell('0')).toBe(true);
  });

  it('accepts thousands separators', () => {
    expect(isNumericCell('1,234')).toBe(true);
    expect(isNumericCell('1,234,567.89')).toBe(true);
  });

  it('ignores surrounding whitespace', () => {
    expect(isNumericCell('  42  ')).toBe(true);
  });

  it('rejects anything else', () => {
    expect(isNumericCell('98%')).toBe(false);
    expect(isNumericCell('Greater than prior month')).toBe(false);
    expect(isNumericCell('')).toBe(false);
    expect(isNumericCell('   ')).toBe(false);
    expect(isNumericCell('1,23')).toBe(false);
    expect(isNumericCell('12abc')).toBe(false);
  });
});

describe('splitLines', () => {
  it('returns a single entry for a single-line cell', () => {
    expect(splitLines('plain')).toEqual(['plain']);
  });

  it('splits on unix and windows newlines', () => {
    expect(splitLines('a\nb')).toEqual(['a', 'b']);
    expect(splitLines('a\r\nb')).toEqual(['a', 'b']);
  });

  it('keeps empty leading and trailing lines', () => {
    expect(splitLines('\na\n')).toEqual(['', 'a', '']);
  });
});
