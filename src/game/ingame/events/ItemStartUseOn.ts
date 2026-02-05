import { ItemStartUseOnAfterEvent, world } from "@minecraft/server";
import type { InGameEventManager } from "./InGameEventManager";
import { InGameEventHandler } from "./InGameEventHandler";

export class InGameItemStartUseOn extends InGameEventHandler<undefined, ItemStartUseOnAfterEvent> {
    private constructor(private readonly inGameEventManager: InGameEventManager) {
        super(inGameEventManager);
    }
    public static create(inGameEventManager: InGameEventManager): InGameItemStartUseOn {
        return new InGameItemStartUseOn(inGameEventManager);
    }

    protected afterEvent = world.afterEvents.itemStartUseOn;
}
