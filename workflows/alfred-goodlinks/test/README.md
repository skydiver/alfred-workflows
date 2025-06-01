# Tests

This directory contains test files for the Alfred GoodLinks workflow.

## Running Tests

To run all tests:

```bash
npm test
```

To run tests in watch mode (re-runs tests when files change):

```bash
npm run test:watch
```

## Test Files

- `helpers.test.ts` - Tests for utility functions in `src/helpers.ts`
- `index.test.ts` - Tests for the main entry point in `src/index.ts`

## Test Coverage

The tests cover:

### `isValidUrl` function (helpers.test.ts)

- Valid HTTP and HTTPS URLs
- Invalid protocols (FTP, file, mailto, etc.)
- Malformed URLs
- Edge cases (localhost, IP addresses, special characters)

The function strictly validates that URLs:

1. Start with `http://` or `https://`
2. Have valid URL syntax
3. Have a proper hostname

### Main application logic (index.test.ts)

- Command line argument parsing with minimist
- URL filtering using `isValidUrl`
- JSON output generation for Alfred workflow
- Handling of `--` separator for argument parsing
- Error cases (no URLs, invalid URLs)
- Edge cases (special characters, long URLs, ports)

The tests verify:

1. Valid URLs are processed correctly and formatted for Alfred
2. Invalid URLs are filtered out appropriately
3. JSON output format is consistent and valid
4. Command line argument parsing works as expected
5. Error scenarios are handled gracefully

## Testing Framework

This project uses [Vitest](https://vitest.dev/) for testing, which provides:

- Fast test execution
- TypeScript support out of the box
- Jest-compatible API
- Built-in code coverage

### Test Approach

- **Unit tests** (`helpers.test.ts`): Direct function testing with mocked inputs
- **Integration tests** (`index.test.ts`): End-to-end testing using child
  processes to run the actual TypeScript file with `tsx`
