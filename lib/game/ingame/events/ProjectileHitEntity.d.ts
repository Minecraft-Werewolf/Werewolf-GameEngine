import { ProjectileHitEntityAfterEvent } from "@minecraft/server";
import type { InGameEventManager } from "./InGameEventManager";
import { InGameEventHandler } from "./InGameEventHandler";
export declare class InGameProjectileHitEntity extends InGameEventHandler<undefined, ProjectileHitEntityAfterEvent> {
    private readonly inGameEventManager;
    private constructor();
    static create(inGameEventManager: InGameEventManager): InGameProjectileHitEntity;
    protected afterEvent: import("@minecraft/server").ProjectileHitEntityAfterEventSignal;
}
