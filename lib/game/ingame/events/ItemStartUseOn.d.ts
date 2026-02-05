import { ItemStartUseOnAfterEvent } from "@minecraft/server";
import type { InGameEventManager } from "./InGameEventManager";
import { InGameEventHandler } from "./InGameEventHandler";
export declare class InGameItemStartUseOn extends InGameEventHandler<undefined, ItemStartUseOnAfterEvent> {
    private readonly inGameEventManager;
    private constructor();
    static create(inGameEventManager: InGameEventManager): InGameItemStartUseOn;
    protected afterEvent: import("@minecraft/server").ItemStartUseOnAfterEventSignal;
}
