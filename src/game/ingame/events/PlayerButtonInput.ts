import { PlayerButtonInputAfterEvent, world } from "@minecraft/server";
import type { InGameEventManager } from "./InGameEventManager";
import { InGameEventHandler } from "./InGameEventHandler";

export class InGamePlayerButtonInput extends InGameEventHandler<
    undefined,
    PlayerButtonInputAfterEvent
> {
    private constructor(private readonly inGameEventManager: InGameEventManager) {
        super(inGameEventManager);
    }
    public static create(inGameEventManager: InGameEventManager): InGamePlayerButtonInput {
        return new InGamePlayerButtonInput(inGameEventManager);
    }

    protected afterEvent = world.afterEvents.playerButtonInput;
}
