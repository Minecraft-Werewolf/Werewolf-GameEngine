import { EntitySpawnAfterEvent, world } from "@minecraft/server";
import type { InGameEventManager } from "./InGameEventManager";
import { InGameEventHandler } from "./InGameEventHandler";

export class InGameEntitySpawn extends InGameEventHandler<undefined, EntitySpawnAfterEvent> {
    private constructor(private readonly inGameEventManager: InGameEventManager) {
        super(inGameEventManager);
    }
    public static create(inGameEventManager: InGameEventManager): InGameEntitySpawn {
        return new InGameEntitySpawn(inGameEventManager);
    }

    protected afterEvent = world.afterEvents.entitySpawn;
}
