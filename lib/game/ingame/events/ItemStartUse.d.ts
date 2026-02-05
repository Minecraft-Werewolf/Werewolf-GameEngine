import { ItemStartUseAfterEvent } from "@minecraft/server";
import type { InGameEventManager } from "./InGameEventManager";
import { InGameEventHandler } from "./InGameEventHandler";
export declare class InGameItemStartUse extends InGameEventHandler<undefined, ItemStartUseAfterEvent> {
    private readonly inGameEventManager;
    private constructor();
    static create(inGameEventManager: InGameEventManager): InGameItemStartUse;
    protected afterEvent: import("@minecraft/server").ItemStartUseAfterEventSignal;
}
