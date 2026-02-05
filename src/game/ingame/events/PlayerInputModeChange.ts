import { PlayerInputModeChangeAfterEvent, world } from "@minecraft/server";
import type { InGameEventManager } from "./InGameEventManager";
import { InGameEventHandler } from "./InGameEventHandler";

export class InGamePlayerInputModeChange extends InGameEventHandler<
    undefined,
    PlayerInputModeChangeAfterEvent
> {
    private constructor(private readonly inGameEventManager: InGameEventManager) {
        super(inGameEventManager);
    }
    public static create(inGameEventManager: InGameEventManager): InGamePlayerInputModeChange {
        return new InGamePlayerInputModeChange(inGameEventManager);
    }

    protected afterEvent = world.afterEvents.playerInputModeChange;
}
