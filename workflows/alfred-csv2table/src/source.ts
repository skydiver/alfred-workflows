import { readFileSync } from 'node:fs';

/** Which Alfred entry point invoked the script */
export type Mode = 'file' | 'text';

/*****************************************************************************
 * Resolves the raw CSV text. In file mode the argument is a path Alfred took
 * from the File Action; in text mode it is the CSV itself.
 *
 * A missing or unreadable path throws, and index.ts converts that into the
 * workflow's failure sentinel.
 ****************************************************************************/
export function readCsv(mode: Mode, content: string): string {
  if (mode === 'file') {
    return readFileSync(content.trim(), 'utf-8');
  }

  return content;
}
