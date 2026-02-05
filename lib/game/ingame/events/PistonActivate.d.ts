import { PistonActivateAfterEvent } from "@minecraft/server";
import type { InGameEventManager } from "./InGameEventManager";
import { InGameEventHandler } from "./InGameEventHandler";
export declare class InGamePistonActivate extends InGameEventHandler<undefined, PistonActivateAfterEvent> {
    private readonly inGameEventManager;
    private constructor();
    static create(inGameEventManager: InGameEventManager): InGamePistonActivate;
    protected afterEvent: import("@minecraft/server").PistonActivateAfterEventSignal;
}
