import { ItemCompleteUseAfterEvent, world } from "@minecraft/server";
import type { InGameEventManager } from "./InGameEventManager";
import { InGameEventHandler } from "./InGameEventHandler";

export class InGameItemCompleteUse extends InGameEventHandler<
    undefined,
    ItemCompleteUseAfterEvent
> {
    private constructor(private readonly inGameEventManager: InGameEventManager) {
        super(inGameEventManager);
    }
    public static create(inGameEventManager: InGameEventManager): InGameItemCompleteUse {
        return new InGameItemCompleteUse(inGameEventManager);
    }

    protected afterEvent = world.afterEvents.itemCompleteUse;
}
