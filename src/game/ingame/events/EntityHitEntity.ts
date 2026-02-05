import { EntityHitEntityAfterEvent, world } from "@minecraft/server";
import type { InGameEventManager } from "./InGameEventManager";
import { InGameEventHandler } from "./InGameEventHandler";

export class InGameEntityHitEntity extends InGameEventHandler<
    undefined,
    EntityHitEntityAfterEvent
> {
    private constructor(private readonly inGameEventManager: InGameEventManager) {
        super(inGameEventManager);
    }
    public static create(inGameEventManager: InGameEventManager): InGameEntityHitEntity {
        return new InGameEntityHitEntity(inGameEventManager);
    }

    protected afterEvent = world.afterEvents.entityHitEntity;
}
