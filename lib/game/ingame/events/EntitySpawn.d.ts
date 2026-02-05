import { EntitySpawnAfterEvent } from "@minecraft/server";
import type { InGameEventManager } from "./InGameEventManager";
import { InGameEventHandler } from "./InGameEventHandler";
export declare class InGameEntitySpawn extends InGameEventHandler<undefined, EntitySpawnAfterEvent> {
    private readonly inGameEventManager;
    private constructor();
    static create(inGameEventManager: InGameEventManager): InGameEntitySpawn;
    protected afterEvent: import("@minecraft/server").EntitySpawnAfterEventSignal;
}
