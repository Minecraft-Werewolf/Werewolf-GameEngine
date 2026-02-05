import { TargetBlockHitAfterEvent } from "@minecraft/server";
import type { InGameEventManager } from "./InGameEventManager";
import { InGameEventHandler } from "./InGameEventHandler";
export declare class InGameTargetBlockHit extends InGameEventHandler<undefined, TargetBlockHitAfterEvent> {
    private readonly inGameEventManager;
    private constructor();
    static create(inGameEventManager: InGameEventManager): InGameTargetBlockHit;
    protected afterEvent: import("@minecraft/server").TargetBlockHitAfterEventSignal;
}
