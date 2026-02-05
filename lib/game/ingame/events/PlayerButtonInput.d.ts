import { PlayerButtonInputAfterEvent } from "@minecraft/server";
import type { InGameEventManager } from "./InGameEventManager";
import { InGameEventHandler } from "./InGameEventHandler";
export declare class InGamePlayerButtonInput extends InGameEventHandler<undefined, PlayerButtonInputAfterEvent> {
    private readonly inGameEventManager;
    private constructor();
    static create(inGameEventManager: InGameEventManager): InGamePlayerButtonInput;
    protected afterEvent: import("@minecraft/server").PlayerButtonInputAfterEventSignal;
}
