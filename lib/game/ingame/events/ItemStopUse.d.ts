import { ItemStopUseAfterEvent } from "@minecraft/server";
import type { InGameEventManager } from "./InGameEventManager";
import { InGameEventHandler } from "./InGameEventHandler";
export declare class InGameItemStopUse extends InGameEventHandler<undefined, ItemStopUseAfterEvent> {
    private readonly inGameEventManager;
    private constructor();
    static create(inGameEventManager: InGameEventManager): InGameItemStopUse;
    protected afterEvent: import("@minecraft/server").ItemStopUseAfterEventSignal;
}
