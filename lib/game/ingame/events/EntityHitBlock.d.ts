import { EntityHitBlockAfterEvent } from "@minecraft/server";
import type { InGameEventManager } from "./InGameEventManager";
import { InGameEventHandler } from "./InGameEventHandler";
export declare class InGameEntityHitBlock extends InGameEventHandler<undefined, EntityHitBlockAfterEvent> {
    private readonly inGameEventManager;
    private constructor();
    static create(inGameEventManager: InGameEventManager): InGameEntityHitBlock;
    protected afterEvent: import("@minecraft/server").EntityHitBlockAfterEventSignal;
}
