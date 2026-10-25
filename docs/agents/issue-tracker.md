# Issue tracker: GitHub

Issues and specs live in `janaagaard75/skoleglaede-nu-batteri`.
Use the `gh` CLI from this repository; the Git remote identifies the repository.

## Operations

- Publish a spec: create a GitHub issue with `gh issue create`.
- Read a ticket: `gh issue view <number> --comments`.
- List tickets: `gh issue list --state open`.
- Comment: `gh issue comment <number>`.
- Close: `gh issue close <number>`.
- For multiline issue bodies and comments, write the text to a temporary file
  and pass it with `--body-file`.

## Labels

This project uses no labels. Omit label creation, filtering and mutation even
when a skill requests them, including `ready-for-agent`. Describe readiness,
work type and outstanding questions in the issue body or comments. Use issue
links or task lists to record relationships without labels.

## Pull requests as a triage surface

**PRs as a request surface: no.**

Bare ticket numbers refer to issues. If a supplied number identifies a pull
request, handle it as a pull request when explicitly requested by the user.
