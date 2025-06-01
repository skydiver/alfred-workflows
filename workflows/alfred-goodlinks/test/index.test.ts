import { describe, it, expect } from 'vitest';
import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';

const execAsync = promisify(exec);

interface AlfredItem {
  title: string;
  subtitle: string;
  arg: string;
}

interface AlfredResult {
  items: AlfredItem[];
}

describe('index.ts', () => {
  const indexPath = path.resolve(__dirname, '../src/index.ts');

  const runIndex = async (args: string[] = []): Promise<AlfredResult> => {
    const command = `tsx "${indexPath}" ${args.map((arg) => `"${arg}"`).join(' ')}`;

    try {
      const { stdout } = await execAsync(command, {
        cwd: path.dirname(indexPath),
      });

      return JSON.parse(stdout.trim());
    } catch (error) {
      console.error('Command failed:', command);
      console.error('Error:', error);
      throw error;
    }
  };

  describe('valid URLs processing', () => {
    it('should process single valid HTTP URL', async () => {
      const result = await runIndex(['http://example.com']);

      expect(result).toEqual({
        items: [
          {
            title: 'http://example.com',
            subtitle: 'Save http://example.com to GoodLinks',
            arg: 'http://example.com',
          },
        ],
      });
    });

    it('should process single valid HTTPS URL', async () => {
      const result = await runIndex(['https://example.com']);

      expect(result).toEqual({
        items: [
          {
            title: 'https://example.com',
            subtitle: 'Save https://example.com to GoodLinks',
            arg: 'https://example.com',
          },
        ],
      });
    });

    it('should process multiple valid URLs', async () => {
      const result = await runIndex([
        'https://example.com',
        'http://test.com',
        'https://api.github.com/users',
      ]);

      expect(result).toEqual({
        items: [
          {
            title: 'https://example.com',
            subtitle: 'Save https://example.com to GoodLinks',
            arg: 'https://example.com',
          },
          {
            title: 'http://test.com',
            subtitle: 'Save http://test.com to GoodLinks',
            arg: 'http://test.com',
          },
          {
            title: 'https://api.github.com/users',
            subtitle: 'Save https://api.github.com/users to GoodLinks',
            arg: 'https://api.github.com/users',
          },
        ],
      });
    });

    it('should process URLs with complex paths and queries', async () => {
      const url = 'https://example.com/path/to/resource?param1=value1&param2=value2#section';
      const result = await runIndex([url]);

      expect(result).toEqual({
        items: [
          {
            title: url,
            subtitle: `Save ${url} to GoodLinks`,
            arg: url,
          },
        ],
      });
    });
  });

  describe('invalid URLs filtering', () => {
    it('should filter out invalid URLs and show no URLs message', async () => {
      const result = await runIndex(['not-a-url', 'ftp://example.com', 'mailto:test@test.com']);

      expect(result).toEqual({
        items: [
          {
            title: 'No URLs provided',
            subtitle: 'Cannot retrieve URLs from the specified browser',
            arg: '',
          },
        ],
      });
    });

    it('should filter out invalid URLs but keep valid ones', async () => {
      const result = await runIndex([
        'https://example.com',
        'not-a-url',
        'ftp://invalid.com',
        'http://valid.com',
        'mailto:test@test.com',
      ]);

      expect(result).toEqual({
        items: [
          {
            title: 'https://example.com',
            subtitle: 'Save https://example.com to GoodLinks',
            arg: 'https://example.com',
          },
          {
            title: 'http://valid.com',
            subtitle: 'Save http://valid.com to GoodLinks',
            arg: 'http://valid.com',
          },
        ],
      });
    });

    it('should filter out URLs without proper protocol', async () => {
      const result = await runIndex(['example.com', 'www.example.com', 'https://valid.com']);

      expect(result).toEqual({
        items: [
          {
            title: 'https://valid.com',
            subtitle: 'Save https://valid.com to GoodLinks',
            arg: 'https://valid.com',
          },
        ],
      });
    });
  });

  describe('no URLs provided scenarios', () => {
    it('should handle no arguments', async () => {
      const result = await runIndex([]);

      expect(result).toEqual({
        items: [
          {
            title: 'No URLs provided',
            subtitle: 'Cannot retrieve URLs from the specified browser',
            arg: '',
          },
        ],
      });
    });

    it('should handle empty arguments', async () => {
      const result = await runIndex(['', '   ']);

      expect(result).toEqual({
        items: [
          {
            title: 'No URLs provided',
            subtitle: 'Cannot retrieve URLs from the specified browser',
            arg: '',
          },
        ],
      });
    });
  });

  describe('argument parsing with -- separator', () => {
    it('should process URLs after -- separator', async () => {
      const result = await runIndex(['--', 'https://example.com', 'http://test.com']);

      expect(result).toEqual({
        items: [
          {
            title: 'https://example.com',
            subtitle: 'Save https://example.com to GoodLinks',
            arg: 'https://example.com',
          },
          {
            title: 'http://test.com',
            subtitle: 'Save http://test.com to GoodLinks',
            arg: 'http://test.com',
          },
        ],
      });
    });

    it('should prioritize URLs after -- over regular arguments', async () => {
      const result = await runIndex(['https://ignored.com', '--', 'https://used.com']);

      expect(result).toEqual({
        items: [
          {
            title: 'https://used.com',
            subtitle: 'Save https://used.com to GoodLinks',
            arg: 'https://used.com',
          },
        ],
      });
    });

    it('should fall back to regular arguments when no -- arguments', async () => {
      const result = await runIndex(['https://example.com', '--']);

      expect(result).toEqual({
        items: [
          {
            title: 'https://example.com',
            subtitle: 'Save https://example.com to GoodLinks',
            arg: 'https://example.com',
          },
        ],
      });
    });
  });

  describe('JSON output format', () => {
    it('should always output valid JSON', async () => {
      const testCases = [
        [],
        ['https://example.com'],
        ['invalid-url'],
        ['https://example.com', 'http://test.com'],
      ];

      for (const args of testCases) {
        const result = await runIndex(args);

        // Should be a valid object
        expect(result).toBeTypeOf('object');

        // Should have items property
        expect(result).toHaveProperty('items');
        expect(Array.isArray(result.items)).toBe(true);

        // Each item should have required properties
        result.items.forEach((item: AlfredItem) => {
          expect(item).toHaveProperty('title');
          expect(item).toHaveProperty('subtitle');
          expect(item).toHaveProperty('arg');
          expect(typeof item.title).toBe('string');
          expect(typeof item.subtitle).toBe('string');
          expect(typeof item.arg).toBe('string');
        });
      }
    });
  });

  describe('edge cases', () => {
    it('should handle URLs with special characters', async () => {
      const url = 'https://example.com/search?q=hello%20world&category=test';
      const result = await runIndex([url]);

      expect(result.items[0].title).toBe(url);
      expect(result.items[0].arg).toBe(url);
    });

    it('should handle very long URLs', async () => {
      const longPath = 'a'.repeat(100); // Reduced length to avoid command line limits
      const url = `https://example.com/${longPath}`;
      const result = await runIndex([url]);

      expect(result.items[0].title).toBe(url);
      expect(result.items[0].arg).toBe(url);
    });

    it('should handle URLs with ports', async () => {
      const url = 'https://example.com:8443/api';
      const result = await runIndex([url]);

      expect(result.items[0].title).toBe(url);
      expect(result.items[0].arg).toBe(url);
    });
  });
});
