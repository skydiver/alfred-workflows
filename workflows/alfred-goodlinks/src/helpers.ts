/*****************************************************************************
 * Function to validate if a string is a valid URL
 ****************************************************************************/
export function isValidUrl(string: string): boolean {
  try {
    new URL(string);
    return true;
  } catch {
    return false;
  }
}
