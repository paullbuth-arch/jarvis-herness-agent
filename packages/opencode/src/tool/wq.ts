import { Effect, Schema } from "effect"
import * as Tool from "./tool"
import { spawnSync } from "child_process"
import path from "path"

const AGENT_PY = "/home/ys/wq7036-herness-agent/agent.py"
const AGENT_DIR = path.dirname(AGENT_PY)
const PYENV: Record<string, string> = { PYTHONPYCACHEPREFIX: "/tmp/wq-jarvis-pycache" }

function runAgent(args: string[], timeoutMs = 60_000): Effect.Effect<{ stdout: string; stderr: string; status: number }> {
  return Effect.try({
    try: () => {
      const result = spawnSync("python3", [AGENT_PY, ...args], {
        cwd: AGENT_DIR,
        env: { ...process.env, ...PYENV },
        timeout: timeoutMs,
        encoding: "utf-8",
        maxBuffer: 10 * 1024 * 1024,
      })
      return {
        stdout: (result.stdout || "").trim(),
        stderr: (result.stderr || "").trim(),
        status: result.status ?? 1,
      }
    },
    catch: (error) => ({
      stdout: "",
      stderr: `agent.py execution failed: ${error instanceof Error ? error.message : String(error)}`,
      status: 1,
    }),
  })
}

// ---------------------------------------------------------------------------
// wq_protocol_audit
// ---------------------------------------------------------------------------

const ProtocolAuditParams = Schema.Struct({
  target: Schema.optional(Schema.String).annotate({
    description: "Optional target filter (e.g. 'wq-adk', 'v861')",
  }),
})

export const WqProtocolAuditTool = Tool.define(
  "wq_protocol_audit",
  Effect.gen(function* () {
    return {
      description:
        "Compare WQ7036AX SDK and V861 reGlasses protocol headers for consistency. " +
        "Reports protocol mismatches, gaps, and recommendations.",
      parameters: ProtocolAuditParams,
      execute: (params: Schema.Schema.Type<typeof ProtocolAuditParams>, ctx: Tool.Context) =>
        Effect.gen(function* () {
          const args = ["workflow", "protocol-audit", "--format", "json"]
          if (params.target) args.push("--target", params.target)

          const result = yield* runAgent(args)
          return {
            title: "Protocol Audit",
            output: result.stdout || result.stderr || "(no output)",
            metadata: {},
          }
        }).pipe(Effect.orDie),
    }
  }),
)

// ---------------------------------------------------------------------------
// wq_feature_trace
// ---------------------------------------------------------------------------

const FeatureTraceParams = Schema.Struct({
  feature: Schema.String.annotate({ description: "Feature name or symbol to trace" }),
})

export const WqFeatureTraceTool = Tool.define(
  "wq_feature_trace",
  Effect.gen(function* () {
    return {
      description:
        "Trace a feature through the WQ7036AX SDK codebase. Reports ownership, symbol " +
        "hits, build targets, and dependencies.",
      parameters: FeatureTraceParams,
      execute: (params: Schema.Schema.Type<typeof FeatureTraceParams>, ctx: Tool.Context) =>
        Effect.gen(function* () {
          const result = yield* runAgent(["workflow", "feature-trace", "--format", "json", params.feature])
          return {
            title: `Feature Trace: ${params.feature}`,
            output: result.stdout || result.stderr || "(no output)",
            metadata: {},
          }
        }).pipe(Effect.orDie),
    }
  }),
)

// ---------------------------------------------------------------------------
// wq_sttp_debug
// ---------------------------------------------------------------------------

const SttpDebugParams = Schema.Struct({
  endpoint: Schema.optional(Schema.String).annotate({
    description: "Optional STTP endpoint to focus debug on",
  }),
})

export const WqSttpDebugTool = Tool.define(
  "wq_sttp_debug",
  Effect.gen(function* () {
    return {
      description:
        "Generate WQ7036AX/V861 STTP debug checklist and anchors. Reports connection state, " +
        "protocol handshake, and data path diagnostics.",
      parameters: SttpDebugParams,
      execute: (params: Schema.Schema.Type<typeof SttpDebugParams>, ctx: Tool.Context) =>
        Effect.gen(function* () {
          const args = ["workflow", "sttp-debug", "--format", "json"]
          if (params.endpoint) args.push("--endpoint", params.endpoint)

          const result = yield* runAgent(args)
          return {
            title: "STTP Debug",
            output: result.stdout || result.stderr || "(no output)",
            metadata: {},
          }
        }).pipe(Effect.orDie),
    }
  }),
)

// ---------------------------------------------------------------------------
// wq_release_check
// ---------------------------------------------------------------------------

const ReleaseCheckParams = Schema.Struct({
  scope: Schema.optional(Schema.Literal("full", "quick", "protocol")).annotate({
    description: "Scope: full (all checks), quick (critical only), protocol (headers only)",
  }),
})

export const WqReleaseCheckTool = Tool.define(
  "wq_release_check",
  Effect.gen(function* () {
    return {
      description:
        "Run release-oriented checks across WQ7036AX SDK: protocol headers, diff analysis, " +
        "WPK validation, and log integrity.",
      parameters: ReleaseCheckParams,
      execute: (params: Schema.Schema.Type<typeof ReleaseCheckParams>, ctx: Tool.Context) =>
        Effect.gen(function* () {
          const args = ["workflow", "release-check", "--format", "json", "--scope", params.scope ?? "full"]

          const result = yield* runAgent(args, 120_000)
          return {
            title: `Release Check (${params.scope ?? "full"})`,
            output: result.stdout || result.stderr || "(no output)",
            metadata: {},
          }
        }).pipe(Effect.orDie),
    }
  }),
)

// ---------------------------------------------------------------------------
// wq_sdk_edit_guard
// ---------------------------------------------------------------------------

const SdkEditGuardParams = Schema.Struct({
  paths: Schema.mutable(Schema.Array(Schema.String)).annotate({
    description: "File paths proposed for editing",
  }),
  reason: Schema.String.annotate({ description: "Why the edit is needed" }),
})

export const WqSdkEditGuardTool = Tool.define(
  "wq_sdk_edit_guard",
  Effect.gen(function* () {
    return {
      description:
        "Pre-edit guard for WQ7036AX SDK files. Creates a pending authorization artifact. " +
        "SDK path edits MUST pass through this guard. Does NOT edit files — only creates " +
        "an authorization artifact. Jarvis never auto-approves authorization.",
      parameters: SdkEditGuardParams,
      execute: (params: Schema.Schema.Type<typeof SdkEditGuardParams>, ctx: Tool.Context) =>
        Effect.gen(function* () {
          const result = yield* runAgent([
            "workflow",
            "sdk-edit-guard",
            "--format", "json",
            "--reason", params.reason,
            "--",
            ...params.paths,
          ])

          return {
            title: "SDK Edit Guard",
            output:
              `Guard report for proposed SDK edits.\n\n` +
              `Target paths:\n${params.paths.map((p) => `  - ${p}`).join("\n")}\n` +
              `Reason: ${params.reason}\n\n` +
              `${result.stdout || result.stderr || "(no output)"}\n\n` +
              `Jarvis will NOT auto-approve authorization. Edits require explicit user approval ` +
              `with: "I authorize edits only to the target_paths listed in this artifact."`,
            metadata: {},
          }
        }).pipe(Effect.orDie),
    }
  }),
)

// ---------------------------------------------------------------------------
// wq_baseline
// ---------------------------------------------------------------------------

const BaselineParams = Schema.Struct({
  action: Schema.Literal("changed", "diff", "status").annotate({
    description: "changed (list changed files), diff (show diff), status (full status)",
  }),
})

export const WqBaselineTool = Tool.define(
  "wq_baseline",
  Effect.gen(function* () {
    return {
      description:
        "Check WQ7036AX SDK baseline state: changed files, git diff, or full status " +
        "compared to the last saved baseline snapshot.",
      parameters: BaselineParams,
      execute: (params: Schema.Schema.Type<typeof BaselineParams>, ctx: Tool.Context) =>
        Effect.gen(function* () {
          const result = yield* runAgent(["baseline", params.action, "--format", "json"], 30_000)

          return {
            title: `Baseline: ${params.action}`,
            output: result.stdout || result.stderr || "(no output)",
            metadata: {},
          }
        }).pipe(Effect.orDie),
    }
  }),
)

// ---------------------------------------------------------------------------
// wq_authorization
// ---------------------------------------------------------------------------

const AuthCheckParams = Schema.Struct({
  session_id: Schema.optional(Schema.String).annotate({
    description: "Session ID to check (defaults to current)",
  }),
})

export const WqAuthorizationCheckTool = Tool.define(
  "wq_authorization",
  Effect.gen(function* () {
    return {
      description:
        "Check authorization state for the current session. Reports whether SDK edits " +
        "are approved and what target paths are authorized.",
      parameters: AuthCheckParams,
      execute: (params: Schema.Schema.Type<typeof AuthCheckParams>, ctx: Tool.Context) =>
        Effect.gen(function* () {
          const args = ["authorization", "check"]
          if (params.session_id) args.push("--session", params.session_id)

          const result = yield* runAgent(args, 15_000)

          return {
            title: "Authorization",
            output: result.stdout || result.stderr || "(no output)",
            metadata: {},
          }
        }).pipe(Effect.orDie),
    }
  }),
)

// ---------------------------------------------------------------------------
// Refusal guard tools
// ---------------------------------------------------------------------------

export const WqBuildExecuteRefusalTool = Tool.define(
  "wq_build_execute",
  Effect.gen(function* () {
    return {
      description: "BUILD EXECUTION IS REFUSED. Jarvis requires a separate explicit authorization flow.",
      parameters: Schema.Struct({
        target: Schema.String.annotate({ description: "Build target" }),
      }),
      execute: (_params: Schema.Schema.Type<{ target: string }>, _ctx: Tool.Context) =>
        Effect.succeed({
          title: "Build Refused",
          output: "Jarvis refuses build --execute without a separate explicit authorization flow. " +
            "This tool is only available through the guarded build authorization path.",
          metadata: {},
        }),
    }
  }),
)

export const WqAuthApproveRefusalTool = Tool.define(
  "wq_auth_approve_refusal",
  Effect.gen(function* () {
    return {
      description: "AUTHORIZATION APPROVE IS REFUSED. Jarvis never auto-runs authorization approve.",
      parameters: Schema.Struct({
        artifact: Schema.String.annotate({ description: "Authorization artifact path" }),
      }),
      execute: (_params: Schema.Schema.Type<{ artifact: string }>, _ctx: Tool.Context) =>
        Effect.succeed({
          title: "Authorization Refused",
          output: "Jarvis will not run authorization approve automatically. " +
            "The user must explicitly authorize edits through the interactive authorization flow.",
          metadata: {},
        }),
    }
  }),
)

// ---------------------------------------------------------------------------
// Collection
// ---------------------------------------------------------------------------

export const WqToolInfos = [
  WqProtocolAuditTool,
  WqFeatureTraceTool,
  WqSttpDebugTool,
  WqReleaseCheckTool,
  WqSdkEditGuardTool,
  WqBaselineTool,
  WqAuthorizationCheckTool,
  WqBuildExecuteRefusalTool,
  WqAuthApproveRefusalTool,
] as const
