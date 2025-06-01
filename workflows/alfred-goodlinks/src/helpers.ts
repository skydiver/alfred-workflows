/*****************************************************************************
 * Function to validate if a string is a valid URL
 ****************************************************************************/
export function isValidUrl(string: string): boolean {
  // First check if the string starts with proper protocol format
  if (!string.startsWith('http://') && !string.startsWith('https://')) {
    return false;
  }

  try {
    const url = new URL(string);
    // Only allow http: and https: protocols
    if (url.protocol !== 'http:' && url.protocol !== 'https:') {
      return false;
    }
    // Ensure there's a proper hostname (not empty)
    if (!url.hostname) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
}
