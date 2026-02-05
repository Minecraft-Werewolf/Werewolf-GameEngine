import { PlayerHotbarSelectedSlotChangeAfterEvent } from "@minecraft/server";
import type { InGameEventManager } from "./InGameEventManager";
import { InGameEventHandler } from "./InGameEventHandler";
export declare class InGamePlayerHotbarSelectedSlotChange extends InGameEventHandler<undefined, PlayerHotbarSelectedSlotChangeAfterEvent> {
    private readonly inGameEventManager;
    private constructor();
    static create(inGameEventManager: InGameEventManager): InGamePlayerHotbarSelectedSlotChange;
    protected afterEvent: import("@minecraft/server").PlayerHotbarSelectedSlotChangeAfterEventSignal;
}
