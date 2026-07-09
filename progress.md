# Progress: OpenCode-Derived Jarvis Mainline

## 2026-07-09: Fork Workspace Created

- Created `/home/ys/jarvis-opencode-fork`.
- Copied OpenCode `v1.17.15` source from:
  `/home/ys/wq7036-herness-agent/upstream/opencode-v1.17.15`
- Verified key package files exist:
  - `/home/ys/jarvis-opencode-fork/package.json`
  - `/home/ys/jarvis-opencode-fork/packages/opencode/package.json`
  - `/home/ys/jarvis-opencode-fork/packages/tui/package.json`
- Verified tag commit through `git ls-remote`:
  `5fb0d1cdb363ecafd55402c451c6634ed15b74b1 refs/tags/v1.17.15`
- Verified local archive SHA-256:
  `8787e6344cd10c1217705839f1ea4cf4ea68b7c9f8ce913ef31cb6275fd0dd42`
- Confirmed copied workspace has no `.git` directory.
- Added:
  - `JARVIS_SOURCE_PROVENANCE.md`
  - `JARVIS_MIGRATION_PLAN.md`
  - `task_plan.md`
  - `findings.md`
  - `progress.md`

## Current Status

Phase 22A is partially complete. The source is copied and the migration plan is written. Remaining
bootstrap work is to verify install/build strategy inside this workspace.

## 2026-07-09: Jarvis Naming Synced To Lightweight Runner

- Main agent repo now has a preferred `jarvis` launcher, plus compatibility `wq7036` and `herness`.
- Lightweight fallback runner visible UI is now `WQ7036AX Jarvis TUI` with prompt `jarvis>`.
- This fork remains the planned OpenCode-derived Jarvis mainline; no SDK/V861 source files were
  modified during naming alignment.

## 2026-07-09: Git Baseline Saved

- Initialized git in `/home/ys/jarvis-opencode-fork` on branch `main`.
- Baseline tag target: `jarvis-opencode-fork-v1.17.15-phase22a-20260709`.
- `node_modules` directories remain ignored by the upstream `.gitignore` and should not be
  committed.
