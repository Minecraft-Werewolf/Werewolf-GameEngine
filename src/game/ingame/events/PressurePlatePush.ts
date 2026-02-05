import { PressurePlatePushAfterEvent, world } from "@minecraft/server";
import type { InGameEventManager } from "./InGameEventManager";
import { InGameEventHandler } from "./InGameEventHandler";

export class InGamePressurePlatePush extends InGameEventHandler<
    undefined,
    PressurePlatePushAfterEvent
> {
    private constructor(private readonly inGameEventManager: InGameEventManager) {
        super(inGameEventManager);
    }
    public static create(inGameEventManager: InGameEventManager): InGamePressurePlatePush {
        return new InGamePressurePlatePush(inGameEventManager);
    }

    protected afterEvent = world.afterEvents.pressurePlatePush;
}
