import { PlayerDimensionChangeAfterEvent } from "@minecraft/server";
import type { InGameEventManager } from "./InGameEventManager";
import { InGameEventHandler } from "./InGameEventHandler";
export declare class InGamePlayerDimensionChange extends InGameEventHandler<undefined, PlayerDimensionChangeAfterEvent> {
    private readonly inGameEventManager;
    private constructor();
    static create(inGameEventManager: InGameEventManager): InGamePlayerDimensionChange;
    protected afterEvent: import("@minecraft/server").PlayerDimensionChangeAfterEventSignal;
}
