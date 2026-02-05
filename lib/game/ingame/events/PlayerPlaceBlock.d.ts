import { PlayerPlaceBlockAfterEvent } from "@minecraft/server";
import type { InGameEventManager } from "./InGameEventManager";
import { InGameEventHandler } from "./InGameEventHandler";
export declare class InGamePlayerPlaceBlock extends InGameEventHandler<undefined, PlayerPlaceBlockAfterEvent> {
    private readonly inGameEventManager;
    private constructor();
    static create(inGameEventManager: InGameEventManager): InGamePlayerPlaceBlock;
    protected afterEvent: import("@minecraft/server").PlayerPlaceBlockAfterEventSignal;
}
