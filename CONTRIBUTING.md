# Contributing

Contributions are welcome. Please open an issue before a larger change so maintainers can agree on the scope.

## Development setup

- Node.js 24 or later
- npm
- Git

```sh
git clone <repository-url>
cd not-emojis
npm ci
```

## Build the action bundle

The generated `dist/index.js` is committed so GitHub can run a tagged release without installing npm dependencies in the user's workflow.

```sh
npm run build
```

When a change affects the action or its dependencies, include the regenerated `dist/index.js` and `dist/licenses.txt` in the same change. Run the repository's CI workflow before opening a pull request.

## Pull requests

- Keep changes focused and explain the user-visible behavior.
- Follow [Conventional Commits](https://www.conventionalcommits.org/) for commit messages; for example, `feat: report emoji locations` or `fix: handle unreadable files`.
- Update the English and Spanish README files when usage or behavior changes.
- Update `docs/technical-guide.md` when scanner or packaging behavior changes.
- Do not add dependencies without explaining why they are needed.
- Never include repository contents in telemetry or external requests.

By submitting a contribution, you agree that it may be distributed under the project's [MIT license](LICENSE).
