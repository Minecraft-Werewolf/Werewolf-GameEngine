import { TripWireTripAfterEvent } from "@minecraft/server";
import type { InGameEventManager } from "./InGameEventManager";
import { InGameEventHandler } from "./InGameEventHandler";
export declare class InGameTripWireTrip extends InGameEventHandler<undefined, TripWireTripAfterEvent> {
    private readonly inGameEventManager;
    private constructor();
    static create(inGameEventManager: InGameEventManager): InGameTripWireTrip;
    protected afterEvent: import("@minecraft/server").TripWireTripAfterEventSignal;
}
