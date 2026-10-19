# not-emojis Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build an open-source JavaScript GitHub Action that scans tracked text files for emojis and fails with file and line details when it finds any.

**Architecture:** Package not-emojis as a JavaScript GitHub Action with a small scanner module and a bundled entry point. Use Git to enumerate tracked repository files, skip binary content, and use a Unicode-aware emoji pattern to report every match. Keep it locally runnable and include a workflow example for adding it to an existing CI.

**Tech Stack:** Node.js 24, JavaScript, GitHub Actions; `emoji-regex` for Unicode emoji sequence matching; `@actions/core` for workflow annotations and failure reporting; `@vercel/ncc` to bundle the action entry point.

**Spec:** `docs/superpowers/specs/2026-10-19-not-emojis-design.md`

## Global Constraints

- Detect emojis in code and documentation.
- Review the repository when the workflow runs; do not limit analysis to lines from the last commit.
- Fail the execution if one or more findings exist.
- Show concrete locations for findings.
- Be addable to an existing GitHub Actions workflow alongside lint, tests, and commit validation.
- Keep analysis local within the GitHub Actions runner; do not send repository content to an external service.
- Report file path and line number for each finding, and identify the emoji.
- Report read or analysis errors as errors rather than silently passing.
- Do not add profanity detection, automatic correction, pull request comments, or binary scanning.
- Cover composed Unicode emoji sequences.
- Keep initial configuration minimal; avoid noise from dependency and generated-output directories without hiding project source or documentation by default.

## Review Focus

- Emoji sequences containing variation selectors, skin tones, flags, or joined glyphs: scanner must report the whole sequence and the correct line.
- Non-emoji text with Unicode symbols: scanner must not report arbitrary symbols as emojis.
- Binary and unreadable files: scanner must skip binary data and surface read failures clearly.
- File paths with spaces or non-ASCII characters: report the correct path without corrupting it.
- Large dependency and generated directories: avoid scanning files not tracked as project content, while scanning tracked code and documentation.

---

### Task 1: Create the scanner package and command-line entry point

**Files:**
- Create: `package.json`
- Create: `.gitignore`
- Create: `package-lock.json`
- Create: `src/scanner.js`
- Create: `src/cli.js`

**Interfaces:**
- Produces: `scanRepository(root: string) -> { findings: Array<{ path: string, line: number, emoji: string }>, errors: Array<{ path: string, message: string }> }`.
- Produces: a CLI entry point that prints one line per finding and returns a nonzero process status for findings or scan errors.

- [x] Initialize the package as `not-emojis`, define `npm run build` for the Action bundle, add `emoji-regex`, `@actions/core`, and `@vercel/ncc`, and include the generated npm lockfile.
- [x] Implement tracked-file enumeration with `git ls-files -z` so whitespace and non-ASCII paths remain intact; handle command failures as scan errors.
- [x] Implement text-file scanning with `emoji-regex`, skip files containing NUL bytes, and calculate one-based line numbers for each match.
- [x] Implement CLI output with `path:line` locations, the matched emoji, a concise summary, and exit status 1 when findings or errors exist.
- [x] Review the scanner behavior against the five input classes listed in Review Focus.

### Task 2: Package the GitHub Action

**Files:**
- Create: `action.yml`
- Create: `src/action.js`
- Create: `scripts/escape-bundle.js`
- Create: `dist/index.js`
- Create: `dist/licenses.txt`
- Create: `dist/package.json`
- Modify: `package-lock.json`
- Modify: `package.json`

**Interfaces:**
- Consumes: `scanRepository(root: string)` from `src/scanner.js`.
- Produces: a JavaScript Action callable with `uses: owner/not-emojis@v1`; it reports findings to the Actions log and marks the step failed when findings or scan errors exist.

- [x] Define the action metadata with `runs.using: node24` and no required inputs for the initial version.
- [x] Implement `src/action.js` to call the shared scanner from `GITHUB_WORKSPACE`, emit readable workflow log annotations for findings and errors, and fail the action when appropriate.
- [x] Bundle the action entry point and runtime dependencies into `dist/index.js`, then escape dependency-internal emoji literals so the project's own scanner does not report its generated bundle.
- [x] Review that the action's bundled entry point uses only the checked-out workspace and does not transmit file contents externally.

### Task 3: Document installation and contribution workflow

**Files:**
- Create: `README.md`
- Create: `README.es.md`
- Create: `CONTRIBUTING.md`
- Create: `SECURITY.md`
- Create: `CODE_OF_CONDUCT.md`
- Create: `CHANGELOG.md`
- Create: `docs/technical-guide.md`
- Create: `docs/releasing.md`
- Create: `.github/workflows/not-emojis.yml`
- Create: `.github/PULL_REQUEST_TEMPLATE.md`
- Create: `.github/ISSUE_TEMPLATE/bug_report.yml`
- Create: `.github/ISSUE_TEMPLATE/feature_request.yml`
- Create: `.github/ISSUE_TEMPLATE/config.yml`
- Create: `.github/dependabot.yml`
- Create: `LICENSE`

- [x] Document the purpose, supported scope, local CLI usage, action usage, output format, and how to publish version tags for users.
- [x] Add an example workflow that runs on pushes to `main` and can be copied into a repository's existing CI; avoid replacing other CI jobs.
- [x] Add an open-source license using the MIT license as the project default.
- [x] Review the README instructions against the Action metadata and package scripts so every shown command and input is real.

