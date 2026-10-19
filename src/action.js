import * as core from '@actions/core';
import { scanRepository } from './scanner.js';

const workspace = process.env.GITHUB_WORKSPACE;

if (!workspace) {
  core.setFailed('GITHUB_WORKSPACE is not set. Check out the repository before running not-emojis.');
} else {
  const { findings, errors } = scanRepository(workspace);

  for (const finding of findings) {
    core.warning(`Emoji found: ${finding.emoji}`, {
      file: finding.path,
      startLine: finding.line,
      title: 'not-emojis',
    });
  }

  for (const error of errors) {
    core.error(error.message, {
      file: error.path === '.' ? undefined : error.path,
      title: 'not-emojis could not complete the scan',
    });
  }

  if (findings.length > 0 || errors.length > 0) {
    core.setFailed(`not-emojis found ${findings.length} emoji sequence(s) and ${errors.length} scan error(s).`);
  } else {
    core.info('not-emojis found no emojis in Git-tracked text files.');
  }
}
