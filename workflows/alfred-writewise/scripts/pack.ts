import { createWriteStream, existsSync, mkdirSync } from 'fs';
import archiver from 'archiver';

const buildDir = 'build';

// Ensure the build directory exists
if (!existsSync(buildDir)) {
  mkdirSync(buildDir, { recursive: true }); // Create directory if missing
}

const output = createWriteStream(`${buildDir}/WriteWise.alfredworkflow`);
const archive = archiver('zip', { zlib: { level: 9 } });

output.on('close', () =>
  console.log(`Created WriteWise.alfredworkflow (${archive.pointer()} bytes)`)
);
archive.on('error', (err) => console.error('Error:', err));

archive.pipe(output);

// Add individual files
archive.file('assets/icon3.png', { name: 'icon.png' });
archive.file('assets/info.plist', { name: 'info.plist' });
archive.file('dist/bundle.js', { name: 'bundle.js' });

archive.finalize();
