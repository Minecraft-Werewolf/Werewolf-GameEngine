import { PlayerEmoteAfterEvent, world } from "@minecraft/server";
import type { InGameEventManager } from "./InGameEventManager";
import { InGameEventHandler } from "./InGameEventHandler";

export class InGamePlayerEmote extends InGameEventHandler<undefined, PlayerEmoteAfterEvent> {
    private constructor(private readonly inGameEventManager: InGameEventManager) {
        super(inGameEventManager);
    }
    public static create(inGameEventManager: InGameEventManager): InGamePlayerEmote {
        return new InGamePlayerEmote(inGameEventManager);
    }

    protected afterEvent = world.afterEvents.playerEmote;
}
