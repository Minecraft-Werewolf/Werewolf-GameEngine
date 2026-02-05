import { PlayerInputPermissionCategoryChangeAfterEvent } from "@minecraft/server";
import type { InGameEventManager } from "./InGameEventManager";
import { InGameEventHandler } from "./InGameEventHandler";
export declare class InGamePlayerInputPermissionCategoryChange extends InGameEventHandler<undefined, PlayerInputPermissionCategoryChangeAfterEvent> {
    private readonly inGameEventManager;
    private constructor();
    static create(inGameEventManager: InGameEventManager): InGamePlayerInputPermissionCategoryChange;
    protected afterEvent: import("@minecraft/server").PlayerInputPermissionCategoryChangeAfterEventSignal;
}
