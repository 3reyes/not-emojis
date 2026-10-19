import { execFileSync } from 'node:child_process';
import { lstatSync, readFileSync } from 'node:fs';
import { isAbsolute, relative, resolve, sep } from 'node:path';
import emojiRegex from 'emoji-regex';

const GIT_OUTPUT_LIMIT = 64 * 1024 * 1024;

/**
 * Scan files Git knows about under a repository root.
 *
 * @param {string} root repository directory
 * @returns {{findings: Array<{path: string, line: number, emoji: string}>, errors: Array<{path: string, message: string}>}}
 */
export function scanRepository(root = process.cwd()) {
  const repositoryRoot = resolve(root);
  const findings = [];
  const errors = [];
  let fileNames;

  try {
    const output = execFileSync('git', ['ls-files', '-z'], {
      cwd: repositoryRoot,
      encoding: null,
      maxBuffer: GIT_OUTPUT_LIMIT,
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    fileNames = output.toString('utf8').split('\0').filter(Boolean);
  } catch (error) {
    errors.push({
      path: '.',
      message: `Could not list Git-tracked files: ${error.message}`,
    });
    return { findings, errors };
  }

  for (const fileName of fileNames) {
    const filePath = resolve(repositoryRoot, fileName);
    const relativePath = relative(repositoryRoot, filePath);

    if (isAbsolute(relativePath) || relativePath === '..' || relativePath.startsWith(`..${sep}`)) {
      errors.push({ path: fileName, message: 'Git returned a path outside the repository.' });
      continue;
    }

    let metadata;
    try {
      metadata = lstatSync(filePath);
    } catch (error) {
      errors.push({ path: fileName, message: `Could not inspect file: ${error.message}` });
      continue;
    }

    // Symlinks and submodules are not source text owned by this repository.
    if (!metadata.isFile()) continue;

    let contents;
    try {
      contents = readFileSync(filePath);
    } catch (error) {
      errors.push({ path: fileName, message: `Could not read file: ${error.message}` });
      continue;
    }

    // A NUL byte is a practical signal that a tracked file is binary.
    if (contents.includes(0)) continue;

    const text = contents.toString('utf8');
    let line = 1;
    let cursor = 0;

    for (const match of text.matchAll(emojiRegex())) {
      while (cursor < match.index) {
        if (text.charCodeAt(cursor) === 10) line += 1;
        cursor += 1;
      }

      findings.push({ path: fileName, line, emoji: match[0] });
      cursor = match.index + match[0].length;
    }
  }

  return { findings, errors };
}
