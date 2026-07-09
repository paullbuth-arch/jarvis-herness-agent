# Jarvis OpenCode Source Provenance

Generated: 2026-07-09

## Source

- Upstream repository: `https://github.com/anomalyco/opencode`
- Copied release/tag: `v1.17.15`
- Tag commit verified locally: `5fb0d1cdb363ecafd55402c451c6634ed15b74b1`
- Local source copied from:
  `/home/ys/wq7036-herness-agent/upstream/opencode-v1.17.15`
- Local archive:
  `/home/ys/wq7036-herness-agent/upstream/opencode-v1.17.15.tar.gz`
- Archive SHA-256:
  `8787e6344cd10c1217705839f1ea4cf4ea68b7c9f8ce913ef31cb6275fd0dd42`
- New Jarvis fork workspace:
  `/home/ys/jarvis-opencode-fork`

## Version Checks

- Root package: `opencode`, license `MIT`
- CLI package: `packages/opencode`, version `1.17.15`, license `MIT`
- TUI package: `packages/tui`, version `1.17.15`, license `MIT`

## Copy Policy

This workspace is intended to become the OpenCode-derived Jarvis mainline.
Prefer copying upstream OpenCode source directly when it is practical, especially:

- `packages/tui/src/ui/dialog*.tsx`
- `packages/tui/src/ui/dialog-select.tsx`
- `packages/tui/src/ui/dialog-prompt.tsx`
- `packages/tui/src/component/prompt/`
- `packages/tui/src/routes/session/`
- `packages/opencode/src/tool/`
- `packages/opencode/src/session/`
- provider/model/tool-loop code used by the CLI/TUI runtime

Do not copy local provider configs, credentials, tokens, auth state, or debug dumps.

## WQ/Jarvis Boundaries

- `agent.py` in `/home/ys/wq7036-herness-agent` remains the deterministic WQ7036 backend.
- Jarvis must not auto-run `authorization approve`.
- Jarvis must refuse or separately gate `build --execute`.
- SDK source edits require explicit user authorization artifacts and exact target paths.
- V861/reGlasses/tina-v861 sources remain paired-system context unless explicitly requested.
