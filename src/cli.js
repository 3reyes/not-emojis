#!/usr/bin/env node

import { scanRepository } from './scanner.js';

const rootFlag = process.argv.indexOf('--root');
const root = rootFlag >= 0 ? process.argv[rootFlag + 1] : process.cwd();

if (rootFlag >= 0 && (!root || root.startsWith('--'))) {
  console.error('Usage: not-emojis [--root <repository-path>]');
  process.exitCode = 2;
} else {
  const { findings, errors } = scanRepository(root);

  for (const finding of findings) {
    console.log(`${JSON.stringify(finding.path)}:${finding.line}: emoji found: ${finding.emoji}`);
  }

  for (const error of errors) {
    console.error(`${JSON.stringify(error.path)}: error: ${error.message}`);
  }

  if (findings.length > 0) {
    const files = new Set(findings.map(({ path }) => path));
    console.error(`Found ${findings.length} emoji sequence(s) in ${files.size} file(s).`);
  } else if (errors.length === 0) {
    console.log('No emojis found in Git-tracked text files.');
  }

  if (findings.length > 0 || errors.length > 0) process.exitCode = 1;
}
