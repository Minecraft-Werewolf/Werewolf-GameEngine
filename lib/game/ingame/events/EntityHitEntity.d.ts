import { EntityHitEntityAfterEvent } from "@minecraft/server";
import type { InGameEventManager } from "./InGameEventManager";
import { InGameEventHandler } from "./InGameEventHandler";
export declare class InGameEntityHitEntity extends InGameEventHandler<undefined, EntityHitEntityAfterEvent> {
    private readonly inGameEventManager;
    private constructor();
    static create(inGameEventManager: InGameEventManager): InGameEntityHitEntity;
    protected afterEvent: import("@minecraft/server").EntityHitEntityAfterEventSignal;
}
