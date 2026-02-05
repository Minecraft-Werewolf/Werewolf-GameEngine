import { ItemUseAfterEvent, ItemUseBeforeEvent } from "@minecraft/server";
import type { InGameEventManager } from "./InGameEventManager";
import { InGameEventHandler } from "./InGameEventHandler";
export declare class InGameItemUse extends InGameEventHandler<ItemUseBeforeEvent, ItemUseAfterEvent> {
    private readonly inGameEventManager;
    private constructor();
    static create(inGameEventManager: InGameEventManager): InGameItemUse;
    protected beforeEvent: import("@minecraft/server").ItemUseBeforeEventSignal;
    protected afterEvent: import("@minecraft/server").ItemUseAfterEventSignal;
}
