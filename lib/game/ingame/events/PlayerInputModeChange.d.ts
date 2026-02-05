import { PlayerInputModeChangeAfterEvent } from "@minecraft/server";
import type { InGameEventManager } from "./InGameEventManager";
import { InGameEventHandler } from "./InGameEventHandler";
export declare class InGamePlayerInputModeChange extends InGameEventHandler<undefined, PlayerInputModeChangeAfterEvent> {
    private readonly inGameEventManager;
    private constructor();
    static create(inGameEventManager: InGameEventManager): InGamePlayerInputModeChange;
    protected afterEvent: import("@minecraft/server").PlayerInputModeChangeAfterEventSignal;
}
