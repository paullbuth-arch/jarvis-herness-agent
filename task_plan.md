# Task Plan: OpenCode-Derived Jarvis Mainline

## Goal

Build the next Jarvis Agent mainline by modifying a copied OpenCode source tree, while keeping
the existing WQ7036 harness backend and safety model.

## Current Phase

Phase 22A ready: fork workspace bootstrap

## Phases

### Phase 22A: Fork Workspace Bootstrap
- [x] Create `/home/ys/jarvis-opencode-fork`
- [x] Copy latest verified OpenCode source into the new directory
- [x] Record provenance and source version
- [x] Write migration plan
- [x] Initialize git in this fork workspace
- [ ] Verify install/build strategy in this workspace
- **Status:** in_progress

### Phase 22B: Branding And Entrypoints
- [ ] Rebrand visible product strings
- [ ] Add Jarvis/WQ7036 CLI entrypoints
- [ ] Keep upstream license/provenance visible
- [ ] Smoke-test first screen branding
- **Status:** pending

### Phase 22C: TUI/Dialog Direct Migration
- [ ] Use OpenCode TUI/dialog TSX components as the base
- [ ] Add WQ-specific help/status/session/authorization dialogs
- [ ] Verify OpenTUI/Solid rendering
- **Status:** pending

### Phase 22D: Tool Registry Integration
- [ ] Add WQ backend tools calling `/home/ys/wq7036-herness-agent/agent.py`
- [ ] Route protocol, feature trace, STTP, release, baseline, and edit guard requests
- [ ] Preserve JSON envelope summaries
- **Status:** pending

### Phase 22E: Permission And Authorization Flow
- [ ] Bind SDK edit approval to `sdk_edit_authorization` artifacts
- [ ] Refuse automatic `authorization approve`
- [ ] Gate or refuse `build --execute`
- [ ] Add refusal tests
- **Status:** pending

### Phase 22F: Provider And Agent Loop
- [ ] Copy/adapt OpenCode provider/session/message loop
- [ ] Keep provider configs external and uncommitted
- [ ] Add Jarvis/WQ7036 system context
- [ ] Ensure model cannot bypass backend guardrails
- **Status:** pending

### Phase 22G: Session And Artifact Bridge
- [ ] Bridge OpenCode sessions to Jarvis artifacts
- [ ] Record commands, results, findings, tests, risks, and authorization artifacts
- [ ] Add session summary UI
- **Status:** pending

### Phase 22H: Packaging And Fallback
- [ ] Keep lightweight runner fallback available
- [ ] Add experimental OpenCode-derived launcher
- [ ] Switch `wq7036` only after acceptance tests pass
- [ ] Document rollback path
- **Status:** pending

## Decisions

| Decision | Rationale |
|---|---|
| Use OpenCode source as mainline skeleton | Faster path to full TUI/provider/session/tool-loop parity. |
| Keep current lightweight Jarvis runner as fallback | Protects the working WQ tool flow while the OpenCode-derived fork is migrated. |
| Keep `agent.py` as WQ backend | Existing workflows, JSON envelopes, and authorization rules are already tested. |
| Prefer copy/modify over reimplementation | User wants OpenCode-derived product behavior, especially UI/dialog parity. |

## Open Questions

- Git has been initialized in `/home/ys/jarvis-opencode-fork`; baseline tag target is
  `jarvis-opencode-fork-v1.17.15-phase22a-20260709`.
- Should the first install/build use a narrowed workspace like the previous `/tmp` verification?
- Which provider should be the first real Jarvis LLM provider target?
