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

## Test Coverage

The tests cover:

### `isValidUrl` function

- Valid HTTP and HTTPS URLs
- Invalid protocols (FTP, file, mailto, etc.)
- Malformed URLs
- Edge cases (localhost, IP addresses, special characters)

The function strictly validates that URLs:

1. Start with `http://` or `https://`
2. Have valid URL syntax
3. Have a proper hostname

## Testing Framework

This project uses [Vitest](https://vitest.dev/) for testing, which provides:

- Fast test execution
- TypeScript support out of the box
- Jest-compatible API
- Built-in code coverage
