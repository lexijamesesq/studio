---
tags:
  - type/claude-repo
description: "Studio's reusable plugin: skills and agents for a personal brand agency."
docs_home: "{workspace_root}/Projects/Studio"
---

# Studio

This repository ships Studio's reusable Claude Code plugin, packaged through the marketplace entry at `.claude-plugin/marketplace.json`. Intent, design decisions, and personal material live in the paired vault project at `docs_home`; nothing personal is committed here.

## Setup

Node 22+ and npm. From a fresh clone run `npm ci`.

## Configuration

None. Configuration a consumer must supply ships as a `*.sample.*` template when the plugin first needs it.

## Build / Test

- `npm run check`: Biome lint and format check.
- `npm test`: Vitest; passes with no test files until the package has code.

## CI

Every pull request runs the estate's shared checks and Margot review through `.github/workflows/ci.yml`; Ollie's merge workflows live beside it. A pull request merges only after the required checks pass.

## Conventions

- Personal paths, vault content, and credentials never enter the repository.
- A skill is added only once its service is designed and validated.
