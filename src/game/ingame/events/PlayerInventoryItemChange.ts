import { PlayerInventoryItemChangeAfterEvent, world } from "@minecraft/server";
import type { InGameEventManager } from "./InGameEventManager";
import { InGameEventHandler } from "./InGameEventHandler";

export class InGamePlayerInventoryItemChange extends InGameEventHandler<
    undefined,
    PlayerInventoryItemChangeAfterEvent
> {
    private constructor(private readonly inGameEventManager: InGameEventManager) {
        super(inGameEventManager);
    }
    public static create(inGameEventManager: InGameEventManager): InGamePlayerInventoryItemChange {
        return new InGamePlayerInventoryItemChange(inGameEventManager);
    }

    protected afterEvent = world.afterEvents.playerInventoryItemChange;
}
