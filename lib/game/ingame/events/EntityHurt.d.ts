import { type EntityHurtAfterEvent } from "@minecraft/server";
import type { InGameEventManager } from "./InGameEventManager";
import { InGameEventHandler } from "./InGameEventHandler";
export declare class InGameEntityHurt extends InGameEventHandler<undefined, EntityHurtAfterEvent> {
    private readonly inGameEventManager;
    private constructor();
    static create(inGameEventManager: InGameEventManager): InGameEntityHurt;
    protected afterEvent: import("@minecraft/server").EntityHurtAfterEventSignal;
}
