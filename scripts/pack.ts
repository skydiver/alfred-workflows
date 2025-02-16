import archiver from 'archiver';
import { createWriteStream, existsSync, mkdirSync } from 'fs';
import path from 'path';

const distDir = `${process.cwd()}/dist`;
const workflowFile = `${path.basename(process.cwd())}.alfredworkflow`;

/* Ensure dist directory exists */
if (!existsSync(distDir)) {
  mkdirSync(distDir, { recursive: true }); // Create directory if missing
}

/* Create a new zip file */
const output = createWriteStream(`${distDir}/${workflowFile}`);
const archive = archiver('zip', { zlib: { level: 9 } });

output.on('close', () => console.log(`Created ${workflowFile} (${archive.pointer()} bytes)`));

archive.on('error', err => console.error('Error:', err));

archive.pipe(output);

/* Add files to the archive */
archive.file('assets/icon.png', { name: 'icon.png' });
archive.file('assets/info.plist', { name: 'info.plist' });
archive.file('build/bundle.js', { name: 'bundle.js' });

/* Finalize the archive */
archive.finalize();
