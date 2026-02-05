import { PlayerJoinAfterEvent } from "@minecraft/server";
import type { InGameEventManager } from "./InGameEventManager";
import { InGameEventHandler } from "./InGameEventHandler";
export declare class InGamePlayerJoin extends InGameEventHandler<undefined, PlayerJoinAfterEvent> {
    private readonly inGameEventManager;
    private constructor();
    static create(inGameEventManager: InGameEventManager): InGamePlayerJoin;
    protected afterEvent: import("@minecraft/server").PlayerJoinAfterEventSignal;
}
