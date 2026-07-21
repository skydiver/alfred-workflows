import { describe, expect, it } from 'vitest';
import { parseCsv } from '../src/parse';

describe('parseCsv', () => {
  it('parses a plain comma-separated file', () => {
    expect(parseCsv('a,b\n1,2')).toEqual([
      ['a', 'b'],
      ['1', '2'],
    ]);
  });

  it('keeps commas inside a quoted field', () => {
    expect(parseCsv('a,b\n1,"x, y, z"')).toEqual([
      ['a', 'b'],
      ['1', 'x, y, z'],
    ]);
  });

  it('unescapes doubled quotes, so embedded JSON survives', () => {
    const csv = 'id,analysis\n1,"{""error"":null,""result"":{""delta"":-1260}}"';

    expect(parseCsv(csv)).toEqual([
      ['id', 'analysis'],
      ['1', '{"error":null,"result":{"delta":-1260}}'],
    ]);
  });

  it('keeps a newline inside a quoted field', () => {
    expect(parseCsv('a\n"first\nsecond"')).toEqual([['a'], ['first\nsecond']]);
  });

  it('auto-detects a semicolon delimiter', () => {
    expect(parseCsv('a;b\n1;2')).toEqual([
      ['a', 'b'],
      ['1', '2'],
    ]);
  });

  it('auto-detects a tab delimiter', () => {
    expect(parseCsv('a\tb\n1\t2')).toEqual([
      ['a', 'b'],
      ['1', '2'],
    ]);
  });

  it('strips a leading byte order mark', () => {
    expect(parseCsv('﻿a,b\n1,2')).toEqual([
      ['a', 'b'],
      ['1', '2'],
    ]);
  });

  it('skips blank lines, including a trailing newline', () => {
    expect(parseCsv('a,b\n1,2\n\n')).toEqual([
      ['a', 'b'],
      ['1', '2'],
    ]);
  });

  it('returns an empty matrix for empty input', () => {
    expect(parseCsv('')).toEqual([]);
  });
});
