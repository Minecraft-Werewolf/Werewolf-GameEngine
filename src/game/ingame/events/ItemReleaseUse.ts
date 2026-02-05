import { ItemReleaseUseAfterEvent, world } from "@minecraft/server";
import type { InGameEventManager } from "./InGameEventManager";
import { InGameEventHandler } from "./InGameEventHandler";

export class InGameItemReleaseUse extends InGameEventHandler<undefined, ItemReleaseUseAfterEvent> {
    private constructor(private readonly inGameEventManager: InGameEventManager) {
        super(inGameEventManager);
    }
    public static create(inGameEventManager: InGameEventManager): InGameItemReleaseUse {
        return new InGameItemReleaseUse(inGameEventManager);
    }

    protected afterEvent = world.afterEvents.itemReleaseUse;
}
