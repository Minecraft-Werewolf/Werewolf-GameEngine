import { ItemStopUseAfterEvent, world } from "@minecraft/server";
import type { InGameEventManager } from "./InGameEventManager";
import { InGameEventHandler } from "./InGameEventHandler";

export class InGameItemStopUse extends InGameEventHandler<undefined, ItemStopUseAfterEvent> {
    private constructor(private readonly inGameEventManager: InGameEventManager) {
        super(inGameEventManager);
    }
    public static create(inGameEventManager: InGameEventManager): InGameItemStopUse {
        return new InGameItemStopUse(inGameEventManager);
    }

    protected afterEvent = world.afterEvents.itemStopUse;
}
