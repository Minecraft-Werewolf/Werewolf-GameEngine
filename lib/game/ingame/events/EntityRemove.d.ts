import { EntityRemoveAfterEvent, EntityRemoveBeforeEvent } from "@minecraft/server";
import type { InGameEventManager } from "./InGameEventManager";
import { InGameEventHandler } from "./InGameEventHandler";
export declare class InGameEntityRemove extends InGameEventHandler<EntityRemoveBeforeEvent, EntityRemoveAfterEvent> {
    private readonly inGameEventManager;
    private constructor();
    static create(inGameEventManager: InGameEventManager): InGameEntityRemove;
    protected beforeEvent: import("@minecraft/server").EntityRemoveBeforeEventSignal;
    protected afterEvent: import("@minecraft/server").EntityRemoveAfterEventSignal;
}
