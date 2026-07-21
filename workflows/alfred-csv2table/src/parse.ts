import Papa from 'papaparse';

/** Spreadsheet exports prefix UTF-8 files with a byte order mark */
function stripBom(text: string): string {
  return text.replace(/^﻿/, '');
}

/*****************************************************************************
 * Parses CSV text into a matrix, where row 0 is the header.
 *
 * An empty `delimiter` tells papaparse to sniff the separator across comma,
 * tab, pipe and semicolon, falling back to comma when nothing wins.
 ****************************************************************************/
export function parseCsv(text: string): string[][] {
  const result = Papa.parse<string[]>(stripBom(text), {
    delimiter: '',
    header: false,
    skipEmptyLines: true,
  });

  return result.data;
}
