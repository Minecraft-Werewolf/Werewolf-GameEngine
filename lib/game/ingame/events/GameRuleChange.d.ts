import { GameRuleChangeAfterEvent } from "@minecraft/server";
import type { InGameEventManager } from "./InGameEventManager";
import { InGameEventHandler } from "./InGameEventHandler";
export declare class InGameGameRuleChange extends InGameEventHandler<undefined, GameRuleChangeAfterEvent> {
    private readonly inGameEventManager;
    private constructor();
    static create(inGameEventManager: InGameEventManager): InGameGameRuleChange;
    protected afterEvent: import("@minecraft/server").GameRuleChangeAfterEventSignal;
}
