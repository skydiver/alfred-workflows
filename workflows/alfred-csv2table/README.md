# alfred-csv2table

An Alfred workflow that converts CSV into an ASCII table.

## Usage

| Trigger          | Input         | Result                                         |
| ---------------- | ------------- | ---------------------------------------------- |
| `csvtable`       | Clipboard     | Table copied and pasted into the frontmost app |
| Universal Action | Selected text | Table copied and pasted into the frontmost app |
| File Action      | A `.csv` file | Table copied to the clipboard                  |

The delimiter is auto-detected across comma, semicolon, tab, and pipe. Quoted
fields, embedded newlines, and escaped quotes are handled. Numeric cells are
right-aligned; everything else is left-aligned.

## Example

```text
|-------|-----|--------------------------|
| name  | age | goal                     |
|-------|-----|--------------------------|
| Ada   |  36 |                     3000 |
|-------|-----|--------------------------|
| Linus |  54 | Greater than prior month |
|-------|-----|--------------------------|
```

## Development

```sh
pnpm test          # run the test suite
pnpm run lint      # check lint and formatting
pnpm run pack      # build dist/alfred-csv2table.alfredworkflow
```

> **Before the first `pnpm run pack`:** add `assets/icon.png`. The packing
> script adds it unconditionally and fails without it.
