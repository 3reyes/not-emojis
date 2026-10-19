# not-emojis

**not-emojis** is a GitHub Action and command-line checker that finds emoji sequences in Git-tracked text files. It reports each file and line, then exits with a failure status so the CI job can stop.

## Use in GitHub Actions

Add a step to your existing workflow after checking out the repository. Replace `OWNER` with the GitHub account or organization that hosts this project, and choose a released version tag.

```yaml
steps:
  - uses: actions/checkout@v4
  - name: Check for emojis
    uses: OWNER/not-emojis@v1
```

The action scans files known to Git in the checked-out repository. It skips binary files and symlinks. Each finding appears as a workflow warning with a file and line; any finding makes the step fail. Read or scan errors also fail the step.

To run it on pushes to `main`, add the step to the workflow that already runs your lint, tests, and commit checks. A complete example is in [`.github/workflows/not-emojis.yml`](.github/workflows/not-emojis.yml).

## Run locally

Requirements: Node.js 24 or later, npm, and Git.

Once the package is published to npm, install and run it with:

```sh
npm install --global not-emojis
not-emojis
```

Or run it from a checkout of this repository:

```sh
npm ci
npm run check -- --root /path/to/repository
```

The command exits with status `0` when no emojis or scan errors are found, `1` when it finds emojis or cannot complete the scan, and `2` for invalid command-line usage. Output identifies the path, one-based line number, and matched emoji.

## Scope and configuration

The first version checks Git-tracked text content throughout the repository. It does not limit the scan to the latest commit. Binary files and symlinks are skipped. There are no configuration files or ignore options in the initial version. The project does not detect profanity, edit files, or send repository content to an external service.

## Development

See [CONTRIBUTING.md](CONTRIBUTING.md) for development steps and [the technical guide](docs/technical-guide.md) for scanner behavior and release packaging.

## Releases

The action bundle is committed at `dist/index.js`, so users of a tagged release do not need to install npm dependencies at workflow runtime. See the [release guide](docs/releasing.md) for version and tag conventions.

## License

MIT. See [LICENSE](LICENSE).
