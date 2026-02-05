import { PlayerDimensionChangeAfterEvent, world } from "@minecraft/server";
import type { InGameEventManager } from "./InGameEventManager";
import { InGameEventHandler } from "./InGameEventHandler";

export class InGamePlayerDimensionChange extends InGameEventHandler<
    undefined,
    PlayerDimensionChangeAfterEvent
> {
    private constructor(private readonly inGameEventManager: InGameEventManager) {
        super(inGameEventManager);
    }
    public static create(inGameEventManager: InGameEventManager): InGamePlayerDimensionChange {
        return new InGamePlayerDimensionChange(inGameEventManager);
    }

    protected afterEvent = world.afterEvents.playerDimensionChange;
}
