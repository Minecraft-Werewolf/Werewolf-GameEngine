import { LeverActionAfterEvent, world } from "@minecraft/server";
import type { InGameEventManager } from "./InGameEventManager";
import { InGameEventHandler } from "./InGameEventHandler";

export class InGameLeverAction extends InGameEventHandler<undefined, LeverActionAfterEvent> {
    private constructor(private readonly inGameEventManager: InGameEventManager) {
        super(inGameEventManager);
    }
    public static create(inGameEventManager: InGameEventManager): InGameLeverAction {
        return new InGameLeverAction(inGameEventManager);
    }

    protected afterEvent = world.afterEvents.leverAction;
}
