import { PressurePlatePopAfterEvent, world } from "@minecraft/server";
import type { InGameEventManager } from "./InGameEventManager";
import { InGameEventHandler } from "./InGameEventHandler";

export class InGamePressurePlatePop extends InGameEventHandler<
    undefined,
    PressurePlatePopAfterEvent
> {
    private constructor(private readonly inGameEventManager: InGameEventManager) {
        super(inGameEventManager);
    }
    public static create(inGameEventManager: InGameEventManager): InGamePressurePlatePop {
        return new InGamePressurePlatePop(inGameEventManager);
    }

    protected afterEvent = world.afterEvents.pressurePlatePop;
}
