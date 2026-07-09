# Jarvis OpenCode Fork Migration Plan

Generated: 2026-07-09

## Goal

Turn this copied OpenCode source tree into the mainline WQ7036AX Jarvis Agent.
The target product should feel like a real OpenCode/Claude-Code-class agent, not a lightweight
wrapper. The existing `/home/ys/wq7036-herness-agent` runner remains the stable fallback and
`agent.py` remains the source of truth for WQ-specific tools and guardrails.

## Strategy

Use this OpenCode source tree as the product skeleton. Prefer copying and modifying upstream
OpenCode code in place instead of rebuilding UI, dialogs, provider loops, session management, and
tool orchestration from scratch.

## Non-Negotiable Guardrails

- No WQ SDK edits without `sdk-edit-guard` and an approved authorization artifact.
- No automatic `authorization approve`.
- No direct `build --execute` from the chat loop without a separate explicit authorization flow.
- No committed provider config, tokens, credentials, auth state, or debug dumps.
- Do not modify `/home/ys/wq7036a/wq-audio`, `/home/ys/aiglass/reglasses`, or
  `/home/ys/aiglass/tina-v861` from this fork unless explicitly requested.

## Phase Plan

### Phase 22A: Fork Workspace Bootstrap

- Keep this copied source tree isolated at `/home/ys/jarvis-opencode-fork`.
- Record provenance and upstream version.
- Git repository initialized here after user requested saving a version and tag.
- Baseline tag: `jarvis-opencode-fork-v1.17.15-phase22a-20260709`.
- Narrow workspaces for install/build if the full upstream dependency graph still hits unrelated
  `packages/app` dependencies such as `ghostty-web`.
- Verify `bun install` and CLI/TUI build in this new fork tree.

### Phase 22B: Branding And Entrypoints

- Rename visible product strings from OpenCode to Jarvis/WQ7036AX.
- Add `wq7036` and `jarvis` CLI entrypoints in the OpenCode-derived CLI package.
- Keep an explicit upstream provenance file and retain MIT license notices.
- Make first screen show Jarvis identity, not stock OpenCode.

### Phase 22C: TUI/Dialog Direct Migration

- Copy and keep upstream TUI dialog components as the base:
  - `packages/tui/src/ui/dialog.tsx`
  - `packages/tui/src/ui/dialog-select.tsx`
  - `packages/tui/src/ui/dialog-help.tsx`
  - `packages/tui/src/ui/dialog-prompt.tsx`
  - `packages/tui/src/ui/dialog-confirm.tsx`
  - `packages/tui/src/ui/dialog-alert.tsx`
- Replace generic OpenCode command labels with Jarvis/WQ7036 commands.
- Add WQ-specific status, session, authorization, and tool-result dialogs.

### Phase 22D: Tool Registry Integration

- Copy/modify OpenCode tool registry structure.
- Add first-class Jarvis tools backed by:
  - `/home/ys/wq7036-herness-agent/agent.py workflow protocol-audit --format json`
  - `workflow feature-trace ... --format json`
  - `workflow sttp-debug --format json`
  - `workflow release-check --format json`
  - `workflow sdk-edit-guard ... --authorization-output ...`
  - `baseline changed --format json`
  - `authorization check`
  - session artifact commands
- Do not expose raw shell access as the default WQ tool path.

### Phase 22E: Permission And Authorization Flow

- Reuse OpenCode permission UI concepts, but bind WQ SDK edit approval to existing
  `sdk_edit_authorization` artifacts.
- Edit intent should create pending artifacts only.
- Approval requires the exact acknowledgement:
  `I authorize edits only to the target_paths listed in this artifact.`
- Even after approval, edits must stay scoped to the artifact target paths.

### Phase 22F: Provider And Agent Loop

- Copy OpenCode provider/session/message loop code as the base.
- Keep provider configs external and uncommitted.
- Add a Jarvis system prompt/context layer that explains WQ7036 boundaries and available tools.
- Ensure model output cannot bypass `agent.py` guardrails.

### Phase 22G: Session And Artifact Bridge

- Map OpenCode sessions to Jarvis session artifact folders or create a bridge that writes:
  - `conversation.md`
  - `commands.log`
  - `findings.md`
  - `tests.md`
  - `risks.md`
  - `authorization/`
- Preserve existing JSON envelope summaries from `agent.py`.

### Phase 22H: Packaging And Fallback

- Keep `/home/ys/wq7036-herness-agent` lightweight runner available as fallback.
- Add a separate launcher for the OpenCode-derived fork first, then switch `wq7036` only after
  smoke tests are equivalent or better than the fallback.
- Document rollback steps.

## Acceptance Criteria

- `wq7036` enters a Jarvis-branded OpenTUI/Solid interface.
- Help/dialog/session UI comes from the copied OpenCode TUI structure.
- Asking `protocol audit` runs the WQ backend workflow and summarizes the JSON envelope.
- Asking to edit a WQ SDK path creates a pending authorization artifact and does not edit source.
- `authorization approve` is not run automatically by the agent loop.
- `build --execute` remains refused or separately gated.
- No SDK/V861 source trees are modified during runner migration.
- Provider configs and auth data remain untracked.

## First Commands For Implementation

```bash
cd /home/ys/jarvis-opencode-fork
BUN_INSTALL="$HOME/.bun" PATH="$HOME/.bun/bin:$PATH" bun --version
node -e "for (const f of ['package.json','packages/opencode/package.json','packages/tui/package.json']) console.log(f, require('./'+f).version || require('./'+f).name)"
```

If doing install/build, first consider narrowing workspaces away from unrelated `packages/app`
dependencies as previously done in `/tmp/opencode-v1.17.15-herness-check`.
