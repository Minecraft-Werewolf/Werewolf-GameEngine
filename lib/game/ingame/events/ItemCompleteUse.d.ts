import { ItemCompleteUseAfterEvent } from "@minecraft/server";
import type { InGameEventManager } from "./InGameEventManager";
import { InGameEventHandler } from "./InGameEventHandler";
export declare class InGameItemCompleteUse extends InGameEventHandler<undefined, ItemCompleteUseAfterEvent> {
    private readonly inGameEventManager;
    private constructor();
    static create(inGameEventManager: InGameEventManager): InGameItemCompleteUse;
    protected afterEvent: import("@minecraft/server").ItemCompleteUseAfterEventSignal;
}
