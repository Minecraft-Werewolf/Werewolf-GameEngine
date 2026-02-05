import { EntityLoadAfterEvent, world } from "@minecraft/server";
import type { InGameEventManager } from "./InGameEventManager";
import { InGameEventHandler } from "./InGameEventHandler";

export class InGameEntityLoad extends InGameEventHandler<undefined, EntityLoadAfterEvent> {
    private constructor(private readonly inGameEventManager: InGameEventManager) {
        super(inGameEventManager);
    }
    public static create(inGameEventManager: InGameEventManager): InGameEntityLoad {
        return new InGameEntityLoad(inGameEventManager);
    }

    protected afterEvent = world.afterEvents.entityLoad;
}
