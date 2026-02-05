import { TargetBlockHitAfterEvent, world } from "@minecraft/server";
import type { InGameEventManager } from "./InGameEventManager";
import { InGameEventHandler } from "./InGameEventHandler";

export class InGameTargetBlockHit extends InGameEventHandler<undefined, TargetBlockHitAfterEvent> {
    private constructor(private readonly inGameEventManager: InGameEventManager) {
        super(inGameEventManager);
    }
    public static create(inGameEventManager: InGameEventManager): InGameTargetBlockHit {
        return new InGameTargetBlockHit(inGameEventManager);
    }

    protected afterEvent = world.afterEvents.targetBlockHit;
}
