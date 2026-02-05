import { DataDrivenEntityTriggerAfterEvent } from "@minecraft/server";
import type { InGameEventManager } from "./InGameEventManager";
import { InGameEventHandler } from "./InGameEventHandler";
export declare class InGameDataDrivenEntityTrigger extends InGameEventHandler<undefined, DataDrivenEntityTriggerAfterEvent> {
    private readonly inGameEventManager;
    private constructor();
    static create(inGameEventManager: InGameEventManager): InGameDataDrivenEntityTrigger;
    protected afterEvent: import("@minecraft/server").DataDrivenEntityTriggerAfterEventSignal;
}
