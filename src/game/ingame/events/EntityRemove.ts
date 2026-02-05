import { EntityRemoveAfterEvent, EntityRemoveBeforeEvent, world } from "@minecraft/server";
import type { InGameEventManager } from "./InGameEventManager";
import { InGameEventHandler } from "./InGameEventHandler";

export class InGameEntityRemove extends InGameEventHandler<
    EntityRemoveBeforeEvent,
    EntityRemoveAfterEvent
> {
    private constructor(private readonly inGameEventManager: InGameEventManager) {
        super(inGameEventManager);
    }
    public static create(inGameEventManager: InGameEventManager): InGameEntityRemove {
        return new InGameEntityRemove(inGameEventManager);
    }

    protected beforeEvent = world.beforeEvents.entityRemove;
    protected afterEvent = world.afterEvents.entityRemove;
}
