# Cryage - Git Branching Strategy

This document outlines the branching strategy for the Cryage project.

## Branch Types

The project uses the following branch types:

### Main Branches

- `main` - The production-ready branch. This branch should always be deployable.
- `development` - The main development branch. Features are merged here before going to production.

### Supporting Branches

- `feature/name-of-feature` - For developing new features
- `fix/issue-description` - For bug fixes
- `docs/description` - For documentation updates
- `refactor/description` - For code refactoring without changing functionality
- `perf/description` - For performance improvements

## Workflow

1. Create a branch from `development` using the appropriate naming convention
2. Implement your changes with regular commits
3. Create a pull request to merge your branch into `development`
4. After review and approval, merge the changes
5. Delete the feature branch after merging
6. Periodically, create a release from `development` to `main`

## Commit Message Guidelines

- Use present tense ("Add feature" not "Added feature")
- First line is a summary (50 chars or less)
- Reference issue numbers if applicable
- Consider using conventional commit prefixes:
  - `feat:` for new features
  - `fix:` for bug fixes
  - `docs:` for documentation
  - `style:` for formatting changes
  - `refactor:` for refactoring existing code
  - `test:` for adding tests
  - `perf:` for performance improvements
  - `chore:` for general maintenance tasks

## Release Process

1. Ensure all desired changes are merged into `development`
2. Create a release branch `release/vX.Y.Z` from `development`
3. Make any release-specific changes on this branch
4. Merge the release branch into both `main` and `development`
5. Tag the release in `main` with a version number 