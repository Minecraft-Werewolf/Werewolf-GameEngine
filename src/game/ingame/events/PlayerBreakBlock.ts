import { PlayerBreakBlockAfterEvent, PlayerBreakBlockBeforeEvent, world } from "@minecraft/server";
import type { InGameEventManager } from "./InGameEventManager";
import { InGameEventHandler } from "./InGameEventHandler";

export class InGamePlayerBreakBlock extends InGameEventHandler<
    PlayerBreakBlockBeforeEvent,
    PlayerBreakBlockAfterEvent
> {
    private constructor(private readonly inGameEventManager: InGameEventManager) {
        super(inGameEventManager);
    }
    public static create(inGameEventManager: InGameEventManager): InGamePlayerBreakBlock {
        return new InGamePlayerBreakBlock(inGameEventManager);
    }

    protected beforeEvent = world.beforeEvents.playerBreakBlock;
    protected afterEvent = world.afterEvents.playerBreakBlock;
}
