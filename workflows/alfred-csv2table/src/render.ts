/*****************************************************************************
 * Matches an optionally signed integer or decimal, with optional thousands
 * separators. Used to decide whether a cell is right-aligned.
 ****************************************************************************/
const NUMERIC_PATTERN = /^[+-]?(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d+)?$/;

/*****************************************************************************
 * Counts Unicode code points rather than UTF-16 units, so accented and astral
 * characters do not inflate a column's width.
 ****************************************************************************/
export function displayWidth(value: string): number {
  return Array.from(value).length;
}

/*****************************************************************************
 * A cell is right-aligned only when its trimmed value reads as a number.
 ****************************************************************************/
export function isNumericCell(value: string): boolean {
  const trimmed = value.trim();

  if (trimmed === '') {
    return false;
  }

  return NUMERIC_PATTERN.test(trimmed);
}

/*****************************************************************************
 * Splits a cell on embedded newlines. A single-line cell yields one entry.
 ****************************************************************************/
export function splitLines(value: string): string[] {
  return value.split(/\r?\n/);
}
