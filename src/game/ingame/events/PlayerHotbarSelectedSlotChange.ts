import { PlayerHotbarSelectedSlotChangeAfterEvent, world } from "@minecraft/server";
import type { InGameEventManager } from "./InGameEventManager";
import { InGameEventHandler } from "./InGameEventHandler";

export class InGamePlayerHotbarSelectedSlotChange extends InGameEventHandler<
    undefined,
    PlayerHotbarSelectedSlotChangeAfterEvent
> {
    private constructor(private readonly inGameEventManager: InGameEventManager) {
        super(inGameEventManager);
    }
    public static create(
        inGameEventManager: InGameEventManager,
    ): InGamePlayerHotbarSelectedSlotChange {
        return new InGamePlayerHotbarSelectedSlotChange(inGameEventManager);
    }

    protected afterEvent = world.afterEvents.playerHotbarSelectedSlotChange;
}
