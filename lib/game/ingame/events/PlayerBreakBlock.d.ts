import { PlayerBreakBlockAfterEvent, PlayerBreakBlockBeforeEvent } from "@minecraft/server";
import type { InGameEventManager } from "./InGameEventManager";
import { InGameEventHandler } from "./InGameEventHandler";
export declare class InGamePlayerBreakBlock extends InGameEventHandler<PlayerBreakBlockBeforeEvent, PlayerBreakBlockAfterEvent> {
    private readonly inGameEventManager;
    private constructor();
    static create(inGameEventManager: InGameEventManager): InGamePlayerBreakBlock;
    protected beforeEvent: import("@minecraft/server").PlayerBreakBlockBeforeEventSignal;
    protected afterEvent: import("@minecraft/server").PlayerBreakBlockAfterEventSignal;
}
