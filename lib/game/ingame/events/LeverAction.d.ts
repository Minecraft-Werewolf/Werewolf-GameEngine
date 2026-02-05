import { LeverActionAfterEvent } from "@minecraft/server";
import type { InGameEventManager } from "./InGameEventManager";
import { InGameEventHandler } from "./InGameEventHandler";
export declare class InGameLeverAction extends InGameEventHandler<undefined, LeverActionAfterEvent> {
    private readonly inGameEventManager;
    private constructor();
    static create(inGameEventManager: InGameEventManager): InGameLeverAction;
    protected afterEvent: import("@minecraft/server").LeverActionAfterEventSignal;
}
