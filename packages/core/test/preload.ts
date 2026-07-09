import path from "path"

process.env.JARVIS_DB = ":memory:"
process.env.JARVIS_MODELS_PATH = path.join(import.meta.dir, "plugin", "fixtures", "models-dev.json")
process.env.JARVIS_DISABLE_MODELS_FETCH = "true"
