import { describe, expect, it } from 'vitest';
import { readCsv } from '../src/source';

const FIXTURE = 'test/fixtures/sample.csv';

describe('readCsv', () => {
  it('returns text mode content unchanged', () => {
    expect(readCsv('text', 'a,b\n1,2')).toBe('a,b\n1,2');
  });

  it('reads a file from disk in file mode', () => {
    expect(readCsv('file', FIXTURE)).toContain('name,age,note');
  });

  it('trims whitespace around a path before reading', () => {
    expect(readCsv('file', `  ${FIXTURE}  `)).toContain('name,age,note');
  });

  it('throws when the file does not exist', () => {
    expect(() => readCsv('file', 'test/fixtures/missing.csv')).toThrow();
  });
});
