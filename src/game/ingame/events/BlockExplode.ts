import { BlockExplodeAfterEvent, world } from "@minecraft/server";
import type { InGameEventManager } from "./InGameEventManager";
import { InGameEventHandler } from "./InGameEventHandler";

export class InGameBlockExplode extends InGameEventHandler<undefined, BlockExplodeAfterEvent> {
    private constructor(private readonly inGameEventManager: InGameEventManager) {
        super(inGameEventManager);
    }
    public static create(inGameEventManager: InGameEventManager): InGameBlockExplode {
        return new InGameBlockExplode(inGameEventManager);
    }

    protected afterEvent = world.afterEvents.blockExplode;
}
