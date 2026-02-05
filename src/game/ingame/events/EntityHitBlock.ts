import { EntityHitBlockAfterEvent, world } from "@minecraft/server";
import type { InGameEventManager } from "./InGameEventManager";
import { InGameEventHandler } from "./InGameEventHandler";

export class InGameEntityHitBlock extends InGameEventHandler<undefined, EntityHitBlockAfterEvent> {
    private constructor(private readonly inGameEventManager: InGameEventManager) {
        super(inGameEventManager);
    }
    public static create(inGameEventManager: InGameEventManager): InGameEntityHitBlock {
        return new InGameEntityHitBlock(inGameEventManager);
    }

    protected afterEvent = world.afterEvents.entityHitBlock;
}
