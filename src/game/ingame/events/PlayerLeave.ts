import { PlayerLeaveAfterEvent, PlayerLeaveBeforeEvent, world } from "@minecraft/server";
import type { InGameEventManager } from "./InGameEventManager";
import { InGameEventHandler } from "./InGameEventHandler";

export class InGamePlayerLeave extends InGameEventHandler<
    PlayerLeaveBeforeEvent,
    PlayerLeaveAfterEvent
> {
    private constructor(private readonly inGameEventManager: InGameEventManager) {
        super(inGameEventManager);
    }
    public static create(inGameEventManager: InGameEventManager): InGamePlayerLeave {
        return new InGamePlayerLeave(inGameEventManager);
    }

    protected beforeEvent = world.beforeEvents.playerLeave;
    protected afterEvent = world.afterEvents.playerLeave;
}
