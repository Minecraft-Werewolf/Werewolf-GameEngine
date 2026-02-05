import { ExplosionAfterEvent, ExplosionBeforeEvent, world } from "@minecraft/server";
import type { InGameEventManager } from "./InGameEventManager";
import { InGameEventHandler } from "./InGameEventHandler";

export class InGameExplosion extends InGameEventHandler<ExplosionBeforeEvent, ExplosionAfterEvent> {
    private constructor(private readonly inGameEventManager: InGameEventManager) {
        super(inGameEventManager);
    }
    public static create(inGameEventManager: InGameEventManager): InGameExplosion {
        return new InGameExplosion(inGameEventManager);
    }

    protected beforeEvent = world.beforeEvents.explosion;
    protected afterEvent = world.afterEvents.explosion;
}
