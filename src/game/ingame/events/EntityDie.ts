import { EntityDieAfterEvent, world } from "@minecraft/server";
import type { InGameEventManager } from "./InGameEventManager";
import { InGameEventHandler } from "./InGameEventHandler";

export class InGameEntityDie extends InGameEventHandler<undefined, EntityDieAfterEvent> {
    private constructor(private readonly inGameEventManager: InGameEventManager) {
        super(inGameEventManager);
    }
    public static create(inGameEventManager: InGameEventManager): InGameEntityDie {
        return new InGameEntityDie(inGameEventManager);
    }

    protected afterEvent = world.afterEvents.entityDie;
}
