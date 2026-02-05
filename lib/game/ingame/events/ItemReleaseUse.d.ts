import { ItemReleaseUseAfterEvent } from "@minecraft/server";
import type { InGameEventManager } from "./InGameEventManager";
import { InGameEventHandler } from "./InGameEventHandler";
export declare class InGameItemReleaseUse extends InGameEventHandler<undefined, ItemReleaseUseAfterEvent> {
    private readonly inGameEventManager;
    private constructor();
    static create(inGameEventManager: InGameEventManager): InGameItemReleaseUse;
    protected afterEvent: import("@minecraft/server").ItemReleaseUseAfterEventSignal;
}
