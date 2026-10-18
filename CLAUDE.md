---
tags:
  - type/claude-repo
description: "Studio's reusable plugin: skills and agents for a personal brand agency."
docs_home: "{workspace_root}/Projects/Studio"
---

# Studio

This repository ships Studio's reusable plugin. Intent, design decisions, and personal material live in the vault project at `docs_home`; nothing personal is committed here.

## State

The plugin has no skills yet. Earlier implementations were removed and are not a foundation to restore. A skill is added only once its service is designed and validated.

## Setup

Node 22+ and npm: `npm ci`, `npm run check`, `npm test`.

## Conventions

- Personal paths, vault content, and credentials never enter the repository. Configuration a consumer must supply ships as a `*.sample.*` template.
- Estate CI and Margot review gate every pull request.
