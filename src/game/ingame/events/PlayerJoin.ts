import { PlayerJoinAfterEvent, world } from "@minecraft/server";
import type { InGameEventManager } from "./InGameEventManager";
import { InGameEventHandler } from "./InGameEventHandler";

export class InGamePlayerJoin extends InGameEventHandler<undefined, PlayerJoinAfterEvent> {
    private constructor(private readonly inGameEventManager: InGameEventManager) {
        super(inGameEventManager);
    }
    public static create(inGameEventManager: InGameEventManager): InGamePlayerJoin {
        return new InGamePlayerJoin(inGameEventManager);
    }

    protected afterEvent = world.afterEvents.playerJoin;
}
