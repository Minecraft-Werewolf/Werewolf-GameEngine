import { ProjectileHitBlockAfterEvent } from "@minecraft/server";
import type { InGameEventManager } from "./InGameEventManager";
import { InGameEventHandler } from "./InGameEventHandler";
export declare class InGameProjectileHitBlock extends InGameEventHandler<undefined, ProjectileHitBlockAfterEvent> {
    private readonly inGameEventManager;
    private constructor();
    static create(inGameEventManager: InGameEventManager): InGameProjectileHitBlock;
    protected afterEvent: import("@minecraft/server").ProjectileHitBlockAfterEventSignal;
}
