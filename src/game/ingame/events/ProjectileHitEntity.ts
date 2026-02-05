import { ProjectileHitEntityAfterEvent, world } from "@minecraft/server";
import type { InGameEventManager } from "./InGameEventManager";
import { InGameEventHandler } from "./InGameEventHandler";

export class InGameProjectileHitEntity extends InGameEventHandler<
    undefined,
    ProjectileHitEntityAfterEvent
> {
    private constructor(private readonly inGameEventManager: InGameEventManager) {
        super(inGameEventManager);
    }
    public static create(inGameEventManager: InGameEventManager): InGameProjectileHitEntity {
        return new InGameProjectileHitEntity(inGameEventManager);
    }

    protected afterEvent = world.afterEvents.projectileHitEntity;
}
