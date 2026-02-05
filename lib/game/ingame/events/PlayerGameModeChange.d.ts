import { PlayerGameModeChangeAfterEvent, PlayerGameModeChangeBeforeEvent } from "@minecraft/server";
import type { InGameEventManager } from "./InGameEventManager";
import { InGameEventHandler } from "./InGameEventHandler";
export declare class InGamePlayerGameModeChange extends InGameEventHandler<PlayerGameModeChangeBeforeEvent, PlayerGameModeChangeAfterEvent> {
    private readonly inGameEventManager;
    private constructor();
    static create(inGameEventManager: InGameEventManager): InGamePlayerGameModeChange;
    protected beforeEvent: import("@minecraft/server").PlayerGameModeChangeBeforeEventSignal;
    protected afterEvent: import("@minecraft/server").PlayerGameModeChangeAfterEventSignal;
}
