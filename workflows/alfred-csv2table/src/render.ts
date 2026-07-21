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

/** One table cell: its physical lines plus the alignment decided for it */
type Cell = {
  lines: string[];
  alignRight: boolean;
};

const PAD = ' ';

/*****************************************************************************
 * Builds a rectangular grid, padding ragged rows with empty cells. Header
 * cells (row 0) are always left-aligned.
 ****************************************************************************/
function toGrid(rows: string[][]): Cell[][] {
  const columnCount = Math.max(...rows.map((row) => row.length));

  return rows.map((row, rowIndex) =>
    Array.from({ length: columnCount }, (_, column) => {
      const value = row[column] ?? '';

      return {
        lines: splitLines(value),
        alignRight: rowIndex > 0 && isNumericCell(value),
      };
    })
  );
}

/*****************************************************************************
 * Width of each column: the widest line across every cell in that column.
 ****************************************************************************/
function columnWidths(grid: Cell[][]): number[] {
  const columnCount = grid[0]?.length ?? 0;

  return Array.from({ length: columnCount }, (_, column) =>
    grid.reduce((widest, row) => {
      const lines = row[column]?.lines ?? [];
      return lines.reduce((max, line) => Math.max(max, displayWidth(line)), widest);
    }, 0)
  );
}

/** A separator segment spans the column width plus its two padding spaces */
function separatorLine(widths: number[]): string {
  return `|${widths.map((width) => '-'.repeat(width + 2)).join('|')}|`;
}

function padLine(line: string, width: number, alignRight: boolean): string {
  const fill = PAD.repeat(width - displayWidth(line));

  return alignRight ? `${PAD}${fill}${line}${PAD}` : `${PAD}${line}${fill}${PAD}`;
}

/*****************************************************************************
 * Renders one logical row, which may span several physical lines when a cell
 * contains newlines.
 ****************************************************************************/
function renderRow(row: Cell[], widths: number[]): string[] {
  const height = Math.max(...row.map((cell) => cell.lines.length));

  return Array.from({ length: height }, (_, lineIndex) => {
    const cells = row.map((cell, column) =>
      padLine(cell.lines[lineIndex] ?? '', widths[column] ?? 0, cell.alignRight)
    );

    return `|${cells.join('|')}|`;
  });
}

/*****************************************************************************
 * Renders a CSV matrix as an ASCII table. Row 0 is the header. A separator
 * line sits above the header, below it, and after every data row.
 ****************************************************************************/
export function renderTable(rows: string[][]): string {
  if (rows.length === 0) {
    return '';
  }

  const grid = toGrid(rows);
  const widths = columnWidths(grid);
  const separator = separatorLine(widths);

  const [header, ...data] = grid;
  const lines = [separator, ...renderRow(header ?? [], widths), separator];

  for (const row of data) {
    lines.push(...renderRow(row, widths), separator);
  }

  return lines.join('\n');
}
