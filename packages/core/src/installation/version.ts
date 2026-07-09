declare global {
  const JARVIS_VERSION: string
  const JARVIS_CHANNEL: string
}

export const InstallationVersion = typeof JARVIS_VERSION === "string" ? JARVIS_VERSION : "local"
export const InstallationChannel = typeof JARVIS_CHANNEL === "string" ? JARVIS_CHANNEL : "local"
export const InstallationLocal = InstallationChannel === "local"
