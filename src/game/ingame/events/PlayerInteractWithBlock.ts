import {
    PlayerInteractWithBlockAfterEvent,
    PlayerInteractWithBlockBeforeEvent,
    world,
} from "@minecraft/server";
import type { InGameEventManager } from "./InGameEventManager";
import { InGameEventHandler } from "./InGameEventHandler";

export class InGamePlayerInteractWithBlock extends InGameEventHandler<
    PlayerInteractWithBlockBeforeEvent,
    PlayerInteractWithBlockAfterEvent
> {
    private constructor(private readonly inGameEventManager: InGameEventManager) {
        super(inGameEventManager);
    }
    public static create(inGameEventManager: InGameEventManager): InGamePlayerInteractWithBlock {
        return new InGamePlayerInteractWithBlock(inGameEventManager);
    }

    protected beforeEvent = world.beforeEvents.playerInteractWithBlock;
    protected afterEvent = world.afterEvents.playerInteractWithBlock;
}
