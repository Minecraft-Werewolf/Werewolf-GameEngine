import { ItemStopUseOnAfterEvent, world } from "@minecraft/server";
import type { InGameEventManager } from "./InGameEventManager";
import { InGameEventHandler } from "./InGameEventHandler";

export class InGameItemStopUseOn extends InGameEventHandler<undefined, ItemStopUseOnAfterEvent> {
    private constructor(private readonly inGameEventManager: InGameEventManager) {
        super(inGameEventManager);
    }
    public static create(inGameEventManager: InGameEventManager): InGameItemStopUseOn {
        return new InGameItemStopUseOn(inGameEventManager);
    }

    protected afterEvent = world.afterEvents.itemStopUseOn;
}
