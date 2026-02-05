import { EffectAddAfterEvent, EffectAddBeforeEvent, world } from "@minecraft/server";
import type { InGameEventManager } from "./InGameEventManager";
import { InGameEventHandler } from "./InGameEventHandler";

export class InGameEffectAdd extends InGameEventHandler<EffectAddBeforeEvent, EffectAddAfterEvent> {
    private constructor(private readonly inGameEventManager: InGameEventManager) {
        super(inGameEventManager);
    }
    public static create(inGameEventManager: InGameEventManager): InGameEffectAdd {
        return new InGameEffectAdd(inGameEventManager);
    }

    protected beforeEvent = world.beforeEvents.effectAdd;
    protected afterEvent = world.afterEvents.effectAdd;
}
