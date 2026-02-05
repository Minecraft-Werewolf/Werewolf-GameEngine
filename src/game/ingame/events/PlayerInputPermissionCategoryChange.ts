import { PlayerInputPermissionCategoryChangeAfterEvent, world } from "@minecraft/server";
import type { InGameEventManager } from "./InGameEventManager";
import { InGameEventHandler } from "./InGameEventHandler";

export class InGamePlayerInputPermissionCategoryChange extends InGameEventHandler<
    undefined,
    PlayerInputPermissionCategoryChangeAfterEvent
> {
    private constructor(private readonly inGameEventManager: InGameEventManager) {
        super(inGameEventManager);
    }
    public static create(
        inGameEventManager: InGameEventManager,
    ): InGamePlayerInputPermissionCategoryChange {
        return new InGamePlayerInputPermissionCategoryChange(inGameEventManager);
    }

    protected afterEvent = world.afterEvents.playerInputPermissionCategoryChange;
}
