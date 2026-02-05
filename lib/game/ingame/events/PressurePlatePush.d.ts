import { PressurePlatePushAfterEvent } from "@minecraft/server";
import type { InGameEventManager } from "./InGameEventManager";
import { InGameEventHandler } from "./InGameEventHandler";
export declare class InGamePressurePlatePush extends InGameEventHandler<undefined, PressurePlatePushAfterEvent> {
    private readonly inGameEventManager;
    private constructor();
    static create(inGameEventManager: InGameEventManager): InGamePressurePlatePush;
    protected afterEvent: import("@minecraft/server").PressurePlatePushAfterEventSignal;
}
