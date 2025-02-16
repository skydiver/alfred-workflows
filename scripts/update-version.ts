import { readFile, writeFile } from 'fs/promises';
import { resolve } from 'path';
import plist from 'plist';

/**
 * Updates the version in the .plist file
 */
async function updatePlistVersion(plistPath: string) {
  try {
    const pkg = require(`${process.cwd()}/package.json`);

    const newVersion = pkg.version;

    // Read and parse the plist file
    const plistContent = await readFile(plistPath, 'utf-8');
    const plistData = plist.parse(plistContent) as Record<string, string>;

    // Update the version key
    if (plistData.version) {
      console.log(`Current version: ${plistData.version}`);
    } else {
      console.warn('Version key not found. Adding new version key.');
    }
    plistData.version = newVersion;

    // Convert back to plist format and save
    const updatedPlistContent = plist.build(plistData);
    await writeFile(plistPath, updatedPlistContent, 'utf-8');

    console.log(`✅ Updated version to ${newVersion} in ${plistPath}`);
  } catch (error) {
    console.error(`❌ Error updating plist file: ${error.message}`);
  }
}

const plistFilePath = resolve(`${process.cwd()}/assets/info.plist`);

updatePlistVersion(plistFilePath);
