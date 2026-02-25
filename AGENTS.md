# AGENTS: pkgo

Public repository for project bootstrap and run orchestration.

## Core Commands

- `deno check ./entrypoint.ts`
- `deno run --check --ext=ts ./entrypoint.ts --help`

## Always Do

- Keep repository detection and manifest mapping behavior deterministic.
- Keep sandbox profile behavior explicit and reviewable.

## Ask First

- Sandbox policy changes.
- Any change that alters default command execution permissions.

## Never Do

- Never broaden write access defaults without explicit approval.
- Never hide failure paths in repository/manifest resolution.
