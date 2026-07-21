import { readFile, writeFile } from "fs/promises";
import { resolve } from "path";

/**
 * Updates the version in the .plist file
 */
async function updatePlistVersion(plistPath: string) {
  try {
    const pkgContent = await readFile(
      resolve(process.cwd(), "package.json"),
      "utf-8",
    );
    const pkg = JSON.parse(pkgContent) as { version: string };

    const newVersion = pkg.version;

    // plist 5 ships ESM-only with named exports and no CJS "require"
    // condition in its package.json "exports" map. A static
    // `import plist from "plist"` fails to resolve once tsx transpiles
    // this file's imports to require() calls (our scripts are CJS since
    // the root package.json has no "type": "module"). A dynamic import()
    // goes through Node's ESM resolver instead, which plist 5 supports.
    const { parse, build } = await import("plist");

    // Read and parse the plist file
    const plistContent = await readFile(plistPath, "utf-8");
    const plistData = parse(plistContent) as Record<string, string>;

    // Update the version key
    if (plistData.version) {
      console.log(`Current version: ${plistData.version}`);
    } else {
      console.warn("Version key not found. Adding new version key.");
    }
    plistData.version = newVersion;

    // Convert back to plist format and save
    const updatedPlistContent = build(plistData);
    await writeFile(plistPath, updatedPlistContent, "utf-8");

    console.log(`✅ Updated version to ${newVersion} in ${plistPath}`);
  } catch (error) {
    console.error(
      `❌ Error updating plist file:`,
      error instanceof Error ? error.message : error,
    );
    process.exitCode = 1;
  }
}

const plistFilePath = resolve(`${process.cwd()}/assets/info.plist`);

updatePlistVersion(plistFilePath);
