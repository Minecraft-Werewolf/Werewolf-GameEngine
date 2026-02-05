import { world, type EntityHurtAfterEvent } from "@minecraft/server";
import type { InGameEventManager } from "./InGameEventManager";
import { InGameEventHandler } from "./InGameEventHandler";

export class InGameEntityHurt extends InGameEventHandler<undefined, EntityHurtAfterEvent> {
    private constructor(private readonly inGameEventManager: InGameEventManager) {
        super(inGameEventManager);
    }
    public static create(inGameEventManager: InGameEventManager): InGameEntityHurt {
        return new InGameEntityHurt(inGameEventManager);
    }

    protected afterEvent = world.afterEvents.entityHurt;
}
