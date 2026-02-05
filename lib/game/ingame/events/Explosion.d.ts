import { ExplosionAfterEvent, ExplosionBeforeEvent } from "@minecraft/server";
import type { InGameEventManager } from "./InGameEventManager";
import { InGameEventHandler } from "./InGameEventHandler";
export declare class InGameExplosion extends InGameEventHandler<ExplosionBeforeEvent, ExplosionAfterEvent> {
    private readonly inGameEventManager;
    private constructor();
    static create(inGameEventManager: InGameEventManager): InGameExplosion;
    protected beforeEvent: import("@minecraft/server").ExplosionBeforeEventSignal;
    protected afterEvent: import("@minecraft/server").ExplosionAfterEventSignal;
}
