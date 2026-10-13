# Monorepo conventions

**Scope:** All repository work (`**/*`). More specific project instructions take precedence for their files.

- Read `CONTEXT.md`, the relevant `memory-bank/` notes, and the owning folder README before changing a project.
- Put public UI in `uis/website`, internal UI in `uis/backoffice`, backend services in `services/`, and company-product agents in `agents/`.
- Keep `.agents/rules/` and `.agents/skills/` reserved for instructions that configure coding agents. Do not put runtime product code there.
- Keep unrelated milestone examples in their current locations unless the task explicitly migrates them.
- Follow the local stack and existing naming, accessibility, error-handling, and documentation patterns. Avoid new dependencies when the existing platform is sufficient.
- Treat the company context and verified API contracts as authoritative. Mark conflicts as unresolved and ask before making country-, compliance-, or policy-specific assumptions.
- Validate changes with the narrowest relevant check, then inspect the full diff and update memory when durable project facts change.
- Do not claim a check passed unless it ran successfully; disclose unavailable checks and their impact.