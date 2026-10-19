# Technical Guide

## Overview

not-emojis has two entry points backed by the same scanner:

- `src/cli.js` for local command-line use.
- `src/action.js` for the GitHub Action runtime.

`src/scanner.js` asks Git for the repository's indexed file list with NUL-delimited output, reads regular files as bytes, skips files containing a NUL byte, decodes the remaining content as UTF-8, and searches it with `emoji-regex`. Findings contain the Git path, one-based line number, and matched emoji sequence.

## File coverage

The scanner relies on `git ls-files`, so it checks tracked and staged paths in the active Git index, including files of any extension. It does not recurse through directories itself. Git-ignored untracked dependencies and build output are not included unless they are added to the index. Symlinks, submodules, and binary files are skipped. This keeps the default scope focused on content maintained in the repository.

If Git cannot list files, or a regular file cannot be inspected or read, the scanner returns an error. Both entry points make errors visible and fail rather than reporting a clean scan.

## Unicode and line numbers

The scanner uses `emoji-regex` to match emoji sequences, including composed sequences such as flags, skin-tone modifiers, keycaps, variation selectors, and joined glyphs. Each sequence is reported as one finding. Line numbers are one-based and count LF line breaks.

## Privacy and permissions

Scanning is local to the runner. The action does not make network requests, call GitHub APIs, or upload file contents. The example workflow grants only `contents: read` to checkout the repository.

## Packaging

GitHub downloads the action from the tagged repository. `npm run build` bundles the action and its runtime dependencies into `dist/index.js` using `@vercel/ncc`; the generated license notices are written to `dist/licenses.txt`. The build then escapes emoji glyph literals that `@actions/core` includes for optional console formatting, preserving their runtime string values while allowing not-emojis to scan the generated bundle without a self-match. The bundle is checked into version control. The action declares the Node.js 24 runtime in `action.yml`.

See [the release guide](releasing.md) for publishing tags and updating the major-version reference.
