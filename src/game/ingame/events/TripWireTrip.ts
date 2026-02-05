import { TripWireTripAfterEvent, world } from "@minecraft/server";
import type { InGameEventManager } from "./InGameEventManager";
import { InGameEventHandler } from "./InGameEventHandler";

export class InGameTripWireTrip extends InGameEventHandler<undefined, TripWireTripAfterEvent> {
    private constructor(private readonly inGameEventManager: InGameEventManager) {
        super(inGameEventManager);
    }
    public static create(inGameEventManager: InGameEventManager): InGameTripWireTrip {
        return new InGameTripWireTrip(inGameEventManager);
    }

    protected afterEvent = world.afterEvents.tripWireTrip;
}
