import { BlockExplodeAfterEvent } from "@minecraft/server";
import type { InGameEventManager } from "./InGameEventManager";
import { InGameEventHandler } from "./InGameEventHandler";
export declare class InGameBlockExplode extends InGameEventHandler<undefined, BlockExplodeAfterEvent> {
    private readonly inGameEventManager;
    private constructor();
    static create(inGameEventManager: InGameEventManager): InGameBlockExplode;
    protected afterEvent: import("@minecraft/server").BlockExplodeAfterEventSignal;
}
