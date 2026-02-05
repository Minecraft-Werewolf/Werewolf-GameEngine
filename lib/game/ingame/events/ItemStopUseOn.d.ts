import { ItemStopUseOnAfterEvent } from "@minecraft/server";
import type { InGameEventManager } from "./InGameEventManager";
import { InGameEventHandler } from "./InGameEventHandler";
export declare class InGameItemStopUseOn extends InGameEventHandler<undefined, ItemStopUseOnAfterEvent> {
    private readonly inGameEventManager;
    private constructor();
    static create(inGameEventManager: InGameEventManager): InGameItemStopUseOn;
    protected afterEvent: import("@minecraft/server").ItemStopUseOnAfterEventSignal;
}
