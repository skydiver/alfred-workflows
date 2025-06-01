import { describe, it, expect } from 'vitest';
import { isValidUrl } from '../src/helpers';

describe('isValidUrl', () => {
  describe('valid URLs', () => {
    it('should return true for valid HTTP URLs', () => {
      expect(isValidUrl('http://example.com')).toBe(true);
      expect(isValidUrl('http://www.example.com')).toBe(true);
      expect(isValidUrl('http://example.com/path')).toBe(true);
      expect(isValidUrl('http://example.com/path?query=value')).toBe(true);
      expect(isValidUrl('http://example.com:8080')).toBe(true);
      expect(isValidUrl('http://subdomain.example.com')).toBe(true);
      expect(isValidUrl('http://192.168.1.1')).toBe(true);
    });

    it('should return true for valid HTTPS URLs', () => {
      expect(isValidUrl('https://example.com')).toBe(true);
      expect(isValidUrl('https://www.example.com')).toBe(true);
      expect(isValidUrl('https://example.com/path')).toBe(true);
      expect(isValidUrl('https://example.com/path?query=value')).toBe(true);
      expect(isValidUrl('https://example.com:443')).toBe(true);
      expect(isValidUrl('https://subdomain.example.com')).toBe(true);
      expect(isValidUrl('https://api.example.com/v1/users')).toBe(true);
    });

    it('should return true for URLs with fragments', () => {
      expect(isValidUrl('https://example.com#section')).toBe(true);
      expect(isValidUrl('http://example.com/page#anchor')).toBe(true);
    });

    it('should return true for URLs with complex paths and queries', () => {
      expect(isValidUrl('https://example.com/path/to/resource?param1=value1&param2=value2')).toBe(
        true
      );
      expect(isValidUrl('http://example.com/search?q=test+query&limit=10')).toBe(true);
    });
  });

  describe('invalid URLs - wrong protocol', () => {
    it('should return false for FTP URLs', () => {
      expect(isValidUrl('ftp://example.com')).toBe(false);
      expect(isValidUrl('ftp://ftp.example.com/file.txt')).toBe(false);
    });

    it('should return false for file URLs', () => {
      expect(isValidUrl('file:///path/to/file.txt')).toBe(false);
      expect(isValidUrl('file://localhost/path/to/file')).toBe(false);
    });

    it('should return false for mailto URLs', () => {
      expect(isValidUrl('mailto:user@example.com')).toBe(false);
      expect(isValidUrl('mailto:test@test.com?subject=Hello')).toBe(false);
    });

    it('should return false for other protocols', () => {
      expect(isValidUrl('ws://example.com')).toBe(false);
      expect(isValidUrl('wss://example.com')).toBe(false);
      expect(isValidUrl('ssh://user@example.com')).toBe(false);
      expect(isValidUrl('tel:+1234567890')).toBe(false);
      expect(isValidUrl('data:text/plain;base64,SGVsbG8=')).toBe(false);
    });
  });

  describe('invalid URLs - malformed', () => {
    it('should return false for completely invalid URLs', () => {
      expect(isValidUrl('not-a-url')).toBe(false);
      expect(isValidUrl('just text')).toBe(false);
      expect(isValidUrl('example.com')).toBe(false);
      expect(isValidUrl('www.example.com')).toBe(false);
    });

    it('should return false for malformed HTTP/HTTPS URLs', () => {
      expect(isValidUrl('http://')).toBe(false);
      expect(isValidUrl('https://')).toBe(false);
      expect(isValidUrl('http:///')).toBe(false);
      expect(isValidUrl('https:///')).toBe(false);
      expect(isValidUrl('http:example.com')).toBe(false);
      expect(isValidUrl('https:example.com')).toBe(false);
    });

    it('should return false for empty or invalid inputs', () => {
      expect(isValidUrl('')).toBe(false);
      expect(isValidUrl(' ')).toBe(false);
      expect(isValidUrl('   ')).toBe(false);
    });

    it('should return false for URLs with invalid characters', () => {
      expect(isValidUrl('http://example .com')).toBe(false);
      expect(isValidUrl('https://[invalid]')).toBe(false);
    });
  });

  describe('edge cases', () => {
    it('should handle URLs with special domains', () => {
      expect(isValidUrl('https://localhost')).toBe(true);
      expect(isValidUrl('http://127.0.0.1')).toBe(true);
      expect(isValidUrl('https://[::1]')).toBe(true); // IPv6
    });

    it('should handle URLs with unusual but valid ports', () => {
      expect(isValidUrl('http://example.com:3000')).toBe(true);
      expect(isValidUrl('https://example.com:8443')).toBe(true);
    });

    it('should handle URLs with encoded characters', () => {
      expect(isValidUrl('https://example.com/path%20with%20spaces')).toBe(true);
      expect(isValidUrl('http://example.com/search?q=hello%20world')).toBe(true);
    });
  });
});
