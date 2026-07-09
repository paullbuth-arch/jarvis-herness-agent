# Findings: OpenCode-Derived Jarvis Mainline

## Source Findings

- Latest verified OpenCode release copied for this workspace: `v1.17.15`.
- Tag commit: `5fb0d1cdb363ecafd55402c451c6634ed15b74b1`.
- Archive SHA-256: `8787e6344cd10c1217705839f1ea4cf4ea68b7c9f8ce913ef31cb6275fd0dd42`.
- Root package is `opencode`, license `MIT`.
- `packages/opencode` is version `1.17.15`, license `MIT`.
- `packages/tui` is version `1.17.15`, license `MIT`.
- New copied tree size at creation: about `121M`.
- The copied source tree has no `.git` directory.

## Migration Findings

- The previous lightweight Jarvis runner is useful as a fallback but will not reach full
  OpenCode/Claude-Code-class parity efficiently.
- Direct OpenCode fork modification is the better mainline for:
  - OpenTUI/Solid UI
  - dialog system
  - command palette
  - provider/session/message loop
  - tool registry and permission flow
- Existing WQ guardrails should not be reimplemented from scratch; this fork should call
  `/home/ys/wq7036-herness-agent/agent.py` for deterministic WQ workflows.
- The current preferred user command is `jarvis`; `wq7036` and `herness` remain compatibility
  launchers in the fallback repo.

## Safety Findings

- Do not copy provider configs or credentials.
- Do not modify WQ SDK/V861 source trees during runner migration.
- Do not bypass existing SDK edit authorization artifacts.
- Do not enable unrestricted shell/build execution by default.
