---
name: studio-research
description: Discover article opportunities from configured sources or research a chosen topic for Studio editorial preparation.
---

# Studio research

Use the [Brand Agency Researcher](../../agents/brand-agency-researcher.md) role. When delegation is available, assign that role the relevant playbook and bounded input. Otherwise adopt the role in the current invocation. No additional agent hierarchy is required.

- Scheduled or requested opportunity discovery: read [Topic discovery](playbooks/topic-discovery.md).
- A selected topic needs argument/evidence development: read [Selected-topic research](playbooks/selected-topic-research.md).

Read [backend invocation](../../backend.md) for executable operations, schemas and private instance configuration. Resolve the package from that instance's packageRoot, not from the plugin cache or session cwd. A client unable to load plugin agents can read the same role and playbook directly.
