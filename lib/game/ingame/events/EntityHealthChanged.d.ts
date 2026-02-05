import { EntityHealthChangedAfterEvent } from "@minecraft/server";
import type { InGameEventManager } from "./InGameEventManager";
import { InGameEventHandler } from "./InGameEventHandler";
export declare class InGameEntityHealthChanged extends InGameEventHandler<undefined, EntityHealthChangedAfterEvent> {
    private readonly inGameEventManager;
    private constructor();
    static create(inGameEventManager: InGameEventManager): InGameEntityHealthChanged;
    protected afterEvent: import("@minecraft/server").EntityHealthChangedAfterEventSignal;
}
