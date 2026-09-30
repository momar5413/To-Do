// Publishes the signed release APK to downloads/ so GitHub Pages serves it.
import { createHash } from 'node:crypto';
import { copyFile, mkdir, readFile, stat } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const src = join(root, 'android/app/build/outputs/apk/release/app-release.apk');
const dest = join(root, 'downloads/mahami.apk');
await mkdir(dirname(dest), { recursive: true });
await copyFile(src, dest);
const { size } = await stat(dest);
const sha = createHash('sha256').update(await readFile(dest)).digest('hex');
console.log(`downloads/mahami.apk  ${(size / 1048576).toFixed(2)} MB  sha256 ${sha}`);
