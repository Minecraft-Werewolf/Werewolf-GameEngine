import { PlayerSpawnAfterEvent } from "@minecraft/server";
import type { InGameEventManager } from "./InGameEventManager";
import { InGameEventHandler } from "./InGameEventHandler";
export declare class InGamePlayerSpawn extends InGameEventHandler<undefined, PlayerSpawnAfterEvent> {
    private readonly inGameEventManager;
    private constructor();
    static create(inGameEventManager: InGameEventManager): InGamePlayerSpawn;
    protected afterEvent: import("@minecraft/server").PlayerSpawnAfterEventSignal;
}
