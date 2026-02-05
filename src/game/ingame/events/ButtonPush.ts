import { ButtonPushAfterEvent, world } from "@minecraft/server";
import type { InGameEventManager } from "./InGameEventManager";
import { InGameEventHandler } from "./InGameEventHandler";

export class InGameButtonPush extends InGameEventHandler<undefined, ButtonPushAfterEvent> {
    private constructor(private readonly inGameEventManager: InGameEventManager) {
        super(inGameEventManager);
    }
    public static create(inGameEventManager: InGameEventManager): InGameButtonPush {
        return new InGameButtonPush(inGameEventManager);
    }

    protected afterEvent = world.afterEvents.buttonPush;
}
