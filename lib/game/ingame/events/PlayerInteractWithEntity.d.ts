import { PlayerInteractWithEntityAfterEvent, PlayerInteractWithEntityBeforeEvent } from "@minecraft/server";
import type { InGameEventManager } from "./InGameEventManager";
import { InGameEventHandler } from "./InGameEventHandler";
export declare class InGamePlayerInteractWithEntity extends InGameEventHandler<PlayerInteractWithEntityBeforeEvent, PlayerInteractWithEntityAfterEvent> {
    private readonly inGameEventManager;
    private constructor();
    static create(inGameEventManager: InGameEventManager): InGamePlayerInteractWithEntity;
    protected beforeEvent: import("@minecraft/server").PlayerInteractWithEntityBeforeEventSignal;
    protected afterEvent: import("@minecraft/server").PlayerInteractWithEntityAfterEventSignal;
}
