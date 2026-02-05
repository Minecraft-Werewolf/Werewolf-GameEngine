import { EntityLoadAfterEvent } from "@minecraft/server";
import type { InGameEventManager } from "./InGameEventManager";
import { InGameEventHandler } from "./InGameEventHandler";
export declare class InGameEntityLoad extends InGameEventHandler<undefined, EntityLoadAfterEvent> {
    private readonly inGameEventManager;
    private constructor();
    static create(inGameEventManager: InGameEventManager): InGameEntityLoad;
    protected afterEvent: import("@minecraft/server").EntityLoadAfterEventSignal;
}
