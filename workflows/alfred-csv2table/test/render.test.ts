import { describe, expect, it } from 'vitest';
import { displayWidth, isNumericCell, renderTable, splitLines } from '../src/render';

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

describe('renderTable', () => {
  it('renders the canonical example exactly', () => {
    const rows = [
      ['name', 'age', 'goal'],
      ['Ada', '36', '3000'],
      ['Linus', '54', 'Greater than prior month'],
    ];

    expect(renderTable(rows)).toBe(
      [
        '|-------|-----|--------------------------|',
        '| name  | age | goal                     |',
        '|-------|-----|--------------------------|',
        '| Ada   |  36 |                     3000 |',
        '|-------|-----|--------------------------|',
        '| Linus |  54 | Greater than prior month |',
        '|-------|-----|--------------------------|',
      ].join('\n')
    );
  });

  it('left-aligns header cells even in a numeric column', () => {
    const rows = [['count'], ['1']];

    expect(renderTable(rows)).toBe(
      ['|-------|', '| count |', '|-------|', '|     1 |', '|-------|'].join('\n')
    );
  });

  it('aligns per cell, not per column', () => {
    const rows = [['goal'], ['3000'], ['98%']];

    expect(renderTable(rows)).toBe(
      ['|------|', '| goal |', '|------|', '| 3000 |', '|------|', '| 98%  |', '|------|'].join(
        '\n'
      )
    );
  });

  it('sizes a column to its widest cell, header included', () => {
    const rows = [
      ['a', 'header'],
      ['longer value', 'x'],
    ];

    expect(renderTable(rows)).toBe(
      [
        '|--------------|--------|',
        '| a            | header |',
        '|--------------|--------|',
        '| longer value | x      |',
        '|--------------|--------|',
      ].join('\n')
    );
  });

  it('renders a header-only table', () => {
    expect(renderTable([['a', 'bb']])).toBe(['|---|----|', '| a | bb |', '|---|----|'].join('\n'));
  });

  it('pads ragged rows with empty cells', () => {
    const rows = [['a', 'b', 'c'], ['1']];

    expect(renderTable(rows)).toBe(
      ['|---|---|---|', '| a | b | c |', '|---|---|---|', '| 1 |   |   |', '|---|---|---|'].join(
        '\n'
      )
    );
  });

  it('returns an empty string for no rows', () => {
    expect(renderTable([])).toBe('');
  });

  it('measures width by code point so unicode rows stay aligned', () => {
    const rows = [['x'], ['café']];

    expect(renderTable(rows)).toBe(
      ['|------|', '| x    |', '|------|', '| café |', '|------|'].join('\n')
    );
  });
});

describe('renderTable with multi-line cells', () => {
  it('stacks a multi-line cell and pads its neighbours', () => {
    const rows = [
      ['name', 'note'],
      ['Ada', 'first\nsecond'],
    ];

    expect(renderTable(rows)).toBe(
      [
        '|------|--------|',
        '| name | note   |',
        '|------|--------|',
        '| Ada  | first  |',
        '|      | second |',
        '|------|--------|',
      ].join('\n')
    );
  });

  it('sizes the column to the widest line inside the cell', () => {
    const rows = [['note'], ['short\nmuch longer line']];

    expect(renderTable(rows)).toBe(
      [
        '|------------------|',
        '| note             |',
        '|------------------|',
        '| short            |',
        '| much longer line |',
        '|------------------|',
      ].join('\n')
    );
  });

  it('never right-aligns a multi-line cell', () => {
    const rows = [['value'], ['10\n20']];

    expect(renderTable(rows)).toBe(
      ['|-------|', '| value |', '|-------|', '| 10    |', '| 20    |', '|-------|'].join('\n')
    );
  });

  it('stacks a multi-line header', () => {
    const rows = [
      ['top\nbottom', 'x'],
      ['a', 'b'],
    ];

    expect(renderTable(rows)).toBe(
      [
        '|--------|---|',
        '| top    | x |',
        '| bottom |   |',
        '|--------|---|',
        '| a      | b |',
        '|--------|---|',
      ].join('\n')
    );
  });
});
