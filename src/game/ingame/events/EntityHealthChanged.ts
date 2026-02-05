import { EntityHealthChangedAfterEvent, world } from "@minecraft/server";
import type { InGameEventManager } from "./InGameEventManager";
import { InGameEventHandler } from "./InGameEventHandler";

export class InGameEntityHealthChanged extends InGameEventHandler<
    undefined,
    EntityHealthChangedAfterEvent
> {
    private constructor(private readonly inGameEventManager: InGameEventManager) {
        super(inGameEventManager);
    }
    public static create(inGameEventManager: InGameEventManager): InGameEntityHealthChanged {
        return new InGameEntityHealthChanged(inGameEventManager);
    }

    protected afterEvent = world.afterEvents.entityHealthChanged;
}
