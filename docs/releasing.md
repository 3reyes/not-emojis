# Release Guide

1. Update `CHANGELOG.md` with the release date and user-visible changes.
2. Update the version in `package.json` and regenerate `package-lock.json` with `npm install --package-lock-only`.
3. Run the repository CI workflow and build the action with `npm run build`.
4. Commit the version, changelog, lockfile, and generated files together.
5. Create and push an immutable release tag such as `v1.0.0`.
6. Create or move the major-version tag (`v1`) to the same release commit, then push it. This is the tag users can reference in workflows.
7. Publish a GitHub Release from the immutable version tag.

Use a patch version for compatible fixes, a minor version for backward-compatible functionality, and a major version for breaking changes. Never force-update a published full version tag. The major-version tag is intentionally movable so users can receive compatible updates.
