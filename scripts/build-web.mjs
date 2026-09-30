// Copies the website into www/ for Capacitor and adds the native bridge bundle.
import { build } from 'esbuild';
import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const out = join(root, 'www');
const files = ['index.html', 'style.css', 'script.js', 'icon.svg', 'manifest.webmanifest'];
const dirs = ['fonts', 'icons'];

await rm(out, { recursive: true, force: true });
await mkdir(out, { recursive: true });
for (const f of files) await cp(join(root, f), join(out, f));
for (const d of dirs) await cp(join(root, d), join(out, d), { recursive: true });

await build({
  entryPoints: [join(root, 'src/native.js')],
  outfile: join(out, 'native.js'),
  bundle: true,
  format: 'iife',
  minify: true,
  target: 'es2020',
  logLevel: 'warning',
});

// Load the bridge before the app script; the Android app has no use for the web manifest.
const htmlPath = join(out, 'index.html');
let html = await readFile(htmlPath, 'utf8');
html = html
  .replace('<script src="script.js"></script>', '<script src="native.js"></script>\n<script src="script.js"></script>')
  .replace(/\s*<link rel="manifest"[^>]*>/, '');
if (!html.includes('native.js')) throw new Error('Could not inject native.js into index.html');
await writeFile(htmlPath, html);
console.log('Web assets ready in www/');
