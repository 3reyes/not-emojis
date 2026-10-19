import { readFileSync, writeFileSync } from 'node:fs';
import emojiRegex from 'emoji-regex';

const bundlePath = new URL('../dist/index.js', import.meta.url);
let bundle = readFileSync(bundlePath, 'utf8');

// @actions/core includes emoji glyphs in optional console formatting strings.
// Escape those string literals so not-emojis can scan its own generated bundle.
const replacements = new Map([
  ['\u{2705}', '\\u{2705}'],
  ['\u{274c}', '\\u{274c}'],
]);

for (const [literal, escaped] of replacements) {
  bundle = bundle.replaceAll(literal, escaped);
}

const remainingEmoji = emojiRegex().exec(bundle);
if (remainingEmoji) {
  throw new Error(`Unescaped emoji remains in ${bundlePath}: ${remainingEmoji[0]}`);
}

writeFileSync(bundlePath, bundle);
