import { ItemStartUseAfterEvent, world } from "@minecraft/server";
import type { InGameEventManager } from "./InGameEventManager";
import { InGameEventHandler } from "./InGameEventHandler";

export class InGameItemStartUse extends InGameEventHandler<undefined, ItemStartUseAfterEvent> {
    private constructor(private readonly inGameEventManager: InGameEventManager) {
        super(inGameEventManager);
    }
    public static create(inGameEventManager: InGameEventManager): InGameItemStartUse {
        return new InGameItemStartUse(inGameEventManager);
    }

    protected afterEvent = world.afterEvents.itemStartUse;
}
