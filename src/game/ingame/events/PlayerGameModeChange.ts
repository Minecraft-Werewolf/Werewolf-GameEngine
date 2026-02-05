import {
    PlayerGameModeChangeAfterEvent,
    PlayerGameModeChangeBeforeEvent,
    world,
} from "@minecraft/server";
import type { InGameEventManager } from "./InGameEventManager";
import { InGameEventHandler } from "./InGameEventHandler";

export class InGamePlayerGameModeChange extends InGameEventHandler<
    PlayerGameModeChangeBeforeEvent,
    PlayerGameModeChangeAfterEvent
> {
    private constructor(private readonly inGameEventManager: InGameEventManager) {
        super(inGameEventManager);
    }
    public static create(inGameEventManager: InGameEventManager): InGamePlayerGameModeChange {
        return new InGamePlayerGameModeChange(inGameEventManager);
    }

    protected beforeEvent = world.beforeEvents.playerGameModeChange;
    protected afterEvent = world.afterEvents.playerGameModeChange;
}
