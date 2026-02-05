import { PlayerSpawnAfterEvent, world } from "@minecraft/server";
import type { InGameEventManager } from "./InGameEventManager";
import { InGameEventHandler } from "./InGameEventHandler";

export class InGamePlayerSpawn extends InGameEventHandler<undefined, PlayerSpawnAfterEvent> {
    private constructor(private readonly inGameEventManager: InGameEventManager) {
        super(inGameEventManager);
    }
    public static create(inGameEventManager: InGameEventManager): InGamePlayerSpawn {
        return new InGamePlayerSpawn(inGameEventManager);
    }

    protected afterEvent = world.afterEvents.playerSpawn;
}
