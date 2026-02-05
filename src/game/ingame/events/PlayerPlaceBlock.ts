import { PlayerPlaceBlockAfterEvent, world } from "@minecraft/server";
import type { InGameEventManager } from "./InGameEventManager";
import { InGameEventHandler } from "./InGameEventHandler";

export class InGamePlayerPlaceBlock extends InGameEventHandler<
    undefined,
    PlayerPlaceBlockAfterEvent
> {
    private constructor(private readonly inGameEventManager: InGameEventManager) {
        super(inGameEventManager);
    }
    public static create(inGameEventManager: InGameEventManager): InGamePlayerPlaceBlock {
        return new InGamePlayerPlaceBlock(inGameEventManager);
    }

    protected afterEvent = world.afterEvents.playerPlaceBlock;
}
