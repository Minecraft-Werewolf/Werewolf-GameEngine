import { DataDrivenEntityTriggerAfterEvent, world } from "@minecraft/server";
import type { InGameEventManager } from "./InGameEventManager";
import { InGameEventHandler } from "./InGameEventHandler";

export class InGameDataDrivenEntityTrigger extends InGameEventHandler<
    undefined,
    DataDrivenEntityTriggerAfterEvent
> {
    private constructor(private readonly inGameEventManager: InGameEventManager) {
        super(inGameEventManager);
    }
    public static create(inGameEventManager: InGameEventManager): InGameDataDrivenEntityTrigger {
        return new InGameDataDrivenEntityTrigger(inGameEventManager);
    }

    protected afterEvent = world.afterEvents.dataDrivenEntityTrigger;
}
