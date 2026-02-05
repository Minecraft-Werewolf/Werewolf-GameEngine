import { PlayerLeaveAfterEvent, PlayerLeaveBeforeEvent } from "@minecraft/server";
import type { InGameEventManager } from "./InGameEventManager";
import { InGameEventHandler } from "./InGameEventHandler";
export declare class InGamePlayerLeave extends InGameEventHandler<PlayerLeaveBeforeEvent, PlayerLeaveAfterEvent> {
    private readonly inGameEventManager;
    private constructor();
    static create(inGameEventManager: InGameEventManager): InGamePlayerLeave;
    protected beforeEvent: import("@minecraft/server").PlayerLeaveBeforeEventSignal;
    protected afterEvent: import("@minecraft/server").PlayerLeaveAfterEventSignal;
}
