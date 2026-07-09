export * as PublicEventManifest from "./public-event-manifest"

import { Event } from "@jarvis/schema/event"
import { EventManifest } from "@jarvis/schema/event-manifest"

export const Definitions = EventManifest.ServerDefinitions
export const Latest = Event.latest(Definitions)
