import { Config } from "effect"

export function truthy(key: string) {
  const value = process.env[key]?.toLowerCase()
  return value === "true" || value === "1"
}

const copy = process.env["JARVIS_EXPERIMENTAL_DISABLE_COPY_ON_SELECT"]
const fff = process.env["JARVIS_DISABLE_FFF"]

function enabledByExperimental(key: string) {
  return process.env[key] === undefined ? truthy("JARVIS_EXPERIMENTAL") : truthy(key)
}

export const Flag = {
  OTEL_EXPORTER_OTLP_ENDPOINT: process.env["OTEL_EXPORTER_OTLP_ENDPOINT"],
  OTEL_EXPORTER_OTLP_HEADERS: process.env["OTEL_EXPORTER_OTLP_HEADERS"],

  JARVIS_AUTO_HEAP_SNAPSHOT: truthy("JARVIS_AUTO_HEAP_SNAPSHOT"),
  JARVIS_GIT_BASH_PATH: process.env["JARVIS_GIT_BASH_PATH"],
  JARVIS_CONFIG: process.env["JARVIS_CONFIG"],
  JARVIS_CONFIG_CONTENT: process.env["JARVIS_CONFIG_CONTENT"],
  JARVIS_DISABLE_AUTOUPDATE: truthy("JARVIS_DISABLE_AUTOUPDATE"),
  JARVIS_ALWAYS_NOTIFY_UPDATE: truthy("JARVIS_ALWAYS_NOTIFY_UPDATE"),
  JARVIS_DISABLE_PRUNE: truthy("JARVIS_DISABLE_PRUNE"),
  JARVIS_DISABLE_TERMINAL_TITLE: truthy("JARVIS_DISABLE_TERMINAL_TITLE"),
  JARVIS_SHOW_TTFD: truthy("JARVIS_SHOW_TTFD"),
  JARVIS_DISABLE_AUTOCOMPACT: truthy("JARVIS_DISABLE_AUTOCOMPACT"),
  JARVIS_DISABLE_MODELS_FETCH: truthy("JARVIS_DISABLE_MODELS_FETCH"),
  JARVIS_DISABLE_MOUSE: truthy("JARVIS_DISABLE_MOUSE"),
  JARVIS_FAKE_VCS: process.env["JARVIS_FAKE_VCS"],
  JARVIS_SERVER_PASSWORD: process.env["JARVIS_SERVER_PASSWORD"],
  JARVIS_SERVER_USERNAME: process.env["JARVIS_SERVER_USERNAME"],
  JARVIS_DISABLE_FFF: fff === undefined ? process.platform === "win32" : truthy("JARVIS_DISABLE_FFF"),

  // Experimental
  JARVIS_EXPERIMENTAL_FILEWATCHER: Config.boolean("JARVIS_EXPERIMENTAL_FILEWATCHER").pipe(
    Config.withDefault(false),
  ),
  JARVIS_EXPERIMENTAL_DISABLE_FILEWATCHER: Config.boolean("JARVIS_EXPERIMENTAL_DISABLE_FILEWATCHER").pipe(
    Config.withDefault(false),
  ),
  JARVIS_EXPERIMENTAL_DISABLE_COPY_ON_SELECT:
    copy === undefined ? process.platform === "win32" : truthy("JARVIS_EXPERIMENTAL_DISABLE_COPY_ON_SELECT"),
  JARVIS_MODELS_URL: process.env["JARVIS_MODELS_URL"],
  JARVIS_MODELS_PATH: process.env["JARVIS_MODELS_PATH"],
  JARVIS_DB: process.env["JARVIS_DB"],

  JARVIS_WORKSPACE_ID: process.env["JARVIS_WORKSPACE_ID"],
  JARVIS_EXPERIMENTAL_WORKSPACES: enabledByExperimental("JARVIS_EXPERIMENTAL_WORKSPACES"),

  // Evaluated at access time (not module load) because tests, the CLI, and
  // external tooling set these env vars at runtime.
  get JARVIS_DISABLE_PROJECT_CONFIG() {
    return truthy("JARVIS_DISABLE_PROJECT_CONFIG")
  },
  get JARVIS_EXPERIMENTAL_REFERENCES() {
    return enabledByExperimental("JARVIS_EXPERIMENTAL_REFERENCES")
  },
  get JARVIS_TUI_CONFIG() {
    return process.env["JARVIS_TUI_CONFIG"]
  },
  get JARVIS_CONFIG_DIR() {
    return process.env["JARVIS_CONFIG_DIR"]
  },
  get JARVIS_PURE() {
    return truthy("JARVIS_PURE")
  },
  get JARVIS_PERMISSION() {
    return process.env["JARVIS_PERMISSION"]
  },
  get JARVIS_PLUGIN_META_FILE() {
    return process.env["JARVIS_PLUGIN_META_FILE"]
  },
  get JARVIS_CLIENT() {
    return process.env["JARVIS_CLIENT"] ?? "cli"
  },
}
