import { GameRuleChangeAfterEvent, world } from "@minecraft/server";
import type { InGameEventManager } from "./InGameEventManager";
import { InGameEventHandler } from "./InGameEventHandler";

export class InGameGameRuleChange extends InGameEventHandler<undefined, GameRuleChangeAfterEvent> {
    private constructor(private readonly inGameEventManager: InGameEventManager) {
        super(inGameEventManager);
    }
    public static create(inGameEventManager: InGameEventManager): InGameGameRuleChange {
        return new InGameGameRuleChange(inGameEventManager);
    }

    protected afterEvent = world.afterEvents.gameRuleChange;
}
