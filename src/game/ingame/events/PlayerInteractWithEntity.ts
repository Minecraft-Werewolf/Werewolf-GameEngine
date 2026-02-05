import {
    PlayerInteractWithEntityAfterEvent,
    PlayerInteractWithEntityBeforeEvent,
    world,
} from "@minecraft/server";
import type { InGameEventManager } from "./InGameEventManager";
import { InGameEventHandler } from "./InGameEventHandler";

export class InGamePlayerInteractWithEntity extends InGameEventHandler<
    PlayerInteractWithEntityBeforeEvent,
    PlayerInteractWithEntityAfterEvent
> {
    private constructor(private readonly inGameEventManager: InGameEventManager) {
        super(inGameEventManager);
    }
    public static create(inGameEventManager: InGameEventManager): InGamePlayerInteractWithEntity {
        return new InGamePlayerInteractWithEntity(inGameEventManager);
    }

    protected beforeEvent = world.beforeEvents.playerInteractWithEntity;
    protected afterEvent = world.afterEvents.playerInteractWithEntity;
}
