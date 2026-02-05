import { PlayerInventoryItemChangeAfterEvent } from "@minecraft/server";
import type { InGameEventManager } from "./InGameEventManager";
import { InGameEventHandler } from "./InGameEventHandler";
export declare class InGamePlayerInventoryItemChange extends InGameEventHandler<undefined, PlayerInventoryItemChangeAfterEvent> {
    private readonly inGameEventManager;
    private constructor();
    static create(inGameEventManager: InGameEventManager): InGamePlayerInventoryItemChange;
    protected afterEvent: import("@minecraft/server").PlayerInventoryItemChangeAfterEventSignal;
}
