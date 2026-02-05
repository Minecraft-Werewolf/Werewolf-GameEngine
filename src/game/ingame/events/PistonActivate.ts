import { PistonActivateAfterEvent, world } from "@minecraft/server";
import type { InGameEventManager } from "./InGameEventManager";
import { InGameEventHandler } from "./InGameEventHandler";

export class InGamePistonActivate extends InGameEventHandler<undefined, PistonActivateAfterEvent> {
    private constructor(private readonly inGameEventManager: InGameEventManager) {
        super(inGameEventManager);
    }
    public static create(inGameEventManager: InGameEventManager): InGamePistonActivate {
        return new InGamePistonActivate(inGameEventManager);
    }

    protected afterEvent = world.afterEvents.pistonActivate;
}
