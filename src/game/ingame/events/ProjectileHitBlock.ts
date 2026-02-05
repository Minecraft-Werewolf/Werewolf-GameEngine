import { ProjectileHitBlockAfterEvent, world } from "@minecraft/server";
import type { InGameEventManager } from "./InGameEventManager";
import { InGameEventHandler } from "./InGameEventHandler";

export class InGameProjectileHitBlock extends InGameEventHandler<
    undefined,
    ProjectileHitBlockAfterEvent
> {
    private constructor(private readonly inGameEventManager: InGameEventManager) {
        super(inGameEventManager);
    }
    public static create(inGameEventManager: InGameEventManager): InGameProjectileHitBlock {
        return new InGameProjectileHitBlock(inGameEventManager);
    }

    protected afterEvent = world.afterEvents.projectileHitBlock;
}
