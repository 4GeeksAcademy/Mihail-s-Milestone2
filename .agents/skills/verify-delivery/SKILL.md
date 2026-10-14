---
name: verify-delivery
description: Verify a repository change with checks appropriate to each touched application and report concrete evidence before submission.
---

# Verify delivery

Use this skill before declaring a change complete, committing it, or opening a pull request.

## Inputs

- The requested behavior and changed file list.
- The relevant repository and application instructions.
- The app-specific validation commands documented in its README and `memory-bank/techContext.md`.

## Procedure

1. Map each changed runtime file to its application and identify the narrowest useful check for that application.
2. For root Next.js changes, run `npm run typecheck` and `npm run build` from the repository root.
3. For static website/backoffice changes, start the app using its documented command, request its entry page over HTTP, and verify every changed local script, stylesheet, and linked local page returns successfully. Inspect the rendered page at desktop and mobile widths when layout or interaction changed.
4. Run `git diff --check` and inspect `git status` plus the complete diff for scope, generated files, secrets, and stale documentation.
5. Update `memory-bank/progress.md` and other memory notes if verified architecture, commands, constraints, or milestone status changed.
6. Report each command/check and its result. Mark an inapplicable check as “not applicable” with the reason; never imply an unrun check passed.

## Acceptance criteria

Delivery is **verified** only when all applicable criteria pass:

- Every changed application has at least one behavior-scoped check; the root Next.js app also passes typecheck and production build when it is changed.
- Static app entry routes and changed local resources return HTTP 200, and rendered changes are visually checked at the affected viewports.
- `git diff --check` exits successfully, and review finds no accidental generated output, secrets, or unrelated changes.
- Durable project facts in the memory bank agree with the code and documentation.
- The completion report lists exact checks and results and identifies any remaining gap.

If any applicable criterion fails, do not call the delivery verified. Fix the defect or report the blocker and its impact.