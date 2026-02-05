import { PlayerInteractWithBlockAfterEvent, PlayerInteractWithBlockBeforeEvent } from "@minecraft/server";
import type { InGameEventManager } from "./InGameEventManager";
import { InGameEventHandler } from "./InGameEventHandler";
export declare class InGamePlayerInteractWithBlock extends InGameEventHandler<PlayerInteractWithBlockBeforeEvent, PlayerInteractWithBlockAfterEvent> {
    private readonly inGameEventManager;
    private constructor();
    static create(inGameEventManager: InGameEventManager): InGamePlayerInteractWithBlock;
    protected beforeEvent: import("@minecraft/server").PlayerInteractWithBlockBeforeEventSignal;
    protected afterEvent: import("@minecraft/server").PlayerInteractWithBlockAfterEventSignal;
}
