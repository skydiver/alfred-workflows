import { parseCsv } from './parse';
import { renderTable } from './render';
import { type Mode, readCsv } from './source';

/** Sentinel the workflow's Conditional node matches to show the error notification */
const FAILURE = 'false';

/*****************************************************************************
 * Alfred calls this as `node bundle.js "$MODE" "$CONTENT"`. Every failure is
 * reported as the sentinel on stdout with exit code 0, so Alfred always gets a
 * routable value instead of a stack trace.
 ****************************************************************************/
function toTable(): string {
  const mode: Mode = process.argv[2] === 'file' ? 'file' : 'text';
  const content = process.argv[3];

  if (!content || content.trim() === '') {
    return FAILURE;
  }

  try {
    const rows = parseCsv(readCsv(mode, content));
    return rows.length === 0 ? FAILURE : renderTable(rows);
  } catch {
    return FAILURE;
  }
}

console.log(toTable());
