import { Effect, Schema } from "effect"
import * as Tool from "./tool"
import { writeFileSync, mkdirSync, existsSync } from "fs"
import path from "path"

/**
 * Session-to-artifact bridge: writes Jarvis-compatible artifact files
 * from within the OpenCode tool system. This provides continuity with the
 * lightweight runner's artifact format (conversation.md, findings.md, etc.).
 */
const SESSION_ARTIFACTS_DIR = "/home/ys/wq7036-herness-agent/sessions"

function ensureDir(dir: string) {
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true })
}

// ---------------------------------------------------------------------------
// wq_session_record
// ---------------------------------------------------------------------------

const SessionRecordParams = Schema.Struct({
  session_id: Schema.String.annotate({ description: "Session ID" }),
  artifact_type: Schema.Literal("conversation", "commands", "findings", "tests", "risks").annotate({
    description: "Artifact type to record",
  }),
  content: Schema.String.annotate({ description: "Content to append to the artifact" }),
})

export const WqSessionRecordTool = Tool.define(
  "wq_session_record",
  Effect.gen(function* () {
    return {
      description:
        "Record a Jarvis-format session artifact (conversation.md, commands.log, findings.md, tests.md, risks.md). " +
        "Bridges OpenCode sessions to the Jarvis harness artifact format.",
      parameters: SessionRecordParams,
      execute: (params: Schema.Schema.Type<typeof SessionRecordParams>, _ctx: Tool.Context) =>
        Effect.sync(() => {
          const sessionDir = path.join(SESSION_ARTIFACTS_DIR, params.session_id)
          ensureDir(sessionDir)

          const filename =
            params.artifact_type === "conversation" ? "conversation.md" :
            params.artifact_type === "commands" ? "commands.log" :
            params.artifact_type === "findings" ? "findings.md" :
            params.artifact_type === "tests" ? "tests.md" :
            "risks.md"

          const filepath = path.join(sessionDir, filename)
          const timestamp = new Date().toISOString()
          const entry = `\n--- ${timestamp} ---\n${params.content}\n`

          writeFileSync(filepath, entry, { flag: "a" })

          return {
            title: `Recorded ${params.artifact_type}`,
            output: `Appended to ${filepath}`,
            metadata: { session_id: params.session_id, artifact_type: params.artifact_type },
          }
        }),
    }
  }),
)

// ---------------------------------------------------------------------------
// wq_session_summary
// ---------------------------------------------------------------------------

const SessionSummaryParams = Schema.Struct({
  session_id: Schema.optional(Schema.String).annotate({
    description: "Session ID (defaults to current)",
  }),
})

export const WqSessionSummaryTool = Tool.define(
  "wq_session_summary",
  Effect.gen(function* () {
    return {
      description:
        "Get a summary of all Jarvis artifacts for a session. Shows what was recorded, " +
        "including conversation summaries, findings, tests, and authorization state.",
      parameters: SessionSummaryParams,
      execute: (params: Schema.Schema.Type<typeof SessionSummaryParams>, _ctx: Tool.Context) =>
        Effect.sync(() => {
          const sessionId = params.session_id || "current"
          const sessionDir = path.join(SESSION_ARTIFACTS_DIR, sessionId)

          if (!existsSync(sessionDir)) {
            return {
              title: "Session Summary",
              output: `No artifacts found for session ${sessionId} at ${sessionDir}.`,
              metadata: { session_id: sessionId },
            }
          }

          const artifacts: string[] = []
          for (const [type, file] of Object.entries({
            conversation: "conversation.md",
            commands: "commands.log",
            findings: "findings.md",
            tests: "tests.md",
            risks: "risks.md",
          })) {
            const fp = path.join(sessionDir, file as string)
            if (existsSync(fp)) {
              artifacts.push(`  - ${type}: ${fp}`)
            }
          }

          const authDir = path.join(sessionDir, "authorization")
          if (existsSync(authDir)) {
            artifacts.push(`  - authorization/: present`)
          }

          return {
            title: "Session Summary",
            output: artifacts.length > 0
              ? `Session ${sessionId} artifacts:\n${artifacts.join("\n")}`
              : `Session ${sessionId} has no recorded artifacts yet.`,
            metadata: { session_id: sessionId },
          }
        }),
    }
  }),
)
