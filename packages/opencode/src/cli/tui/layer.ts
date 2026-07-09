import { run as runTui, type TuiInput } from "@jarvis/tui"
import { Global } from "@jarvis/core/global"
import { AppNodeBuilder } from "@jarvis/core/effect/app-node-builder"
import { Effect } from "effect"

export function run(input: TuiInput) {
  return runTui(input).pipe(Effect.provide(AppNodeBuilder.build(Global.node)))
}
