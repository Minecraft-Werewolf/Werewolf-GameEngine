import { EntityDieAfterEvent } from "@minecraft/server";
import type { InGameEventManager } from "./InGameEventManager";
import { InGameEventHandler } from "./InGameEventHandler";
export declare class InGameEntityDie extends InGameEventHandler<undefined, EntityDieAfterEvent> {
    private readonly inGameEventManager;
    private constructor();
    static create(inGameEventManager: InGameEventManager): InGameEntityDie;
    protected afterEvent: import("@minecraft/server").EntityDieAfterEventSignal;
}
