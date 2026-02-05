import { PressurePlatePopAfterEvent } from "@minecraft/server";
import type { InGameEventManager } from "./InGameEventManager";
import { InGameEventHandler } from "./InGameEventHandler";
export declare class InGamePressurePlatePop extends InGameEventHandler<undefined, PressurePlatePopAfterEvent> {
    private readonly inGameEventManager;
    private constructor();
    static create(inGameEventManager: InGameEventManager): InGamePressurePlatePop;
    protected afterEvent: import("@minecraft/server").PressurePlatePopAfterEventSignal;
}
