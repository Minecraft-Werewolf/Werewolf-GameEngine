import { WeatherChangeAfterEvent, WeatherChangeBeforeEvent } from "@minecraft/server";
import type { InGameEventManager } from "./InGameEventManager";
import { InGameEventHandler } from "./InGameEventHandler";
export declare class InGameWeatherChange extends InGameEventHandler<WeatherChangeBeforeEvent, WeatherChangeAfterEvent> {
    private readonly inGameEventManager;
    private constructor();
    static create(inGameEventManager: InGameEventManager): InGameWeatherChange;
    protected beforeEvent: import("@minecraft/server").WeatherChangeBeforeEventSignal;
    protected afterEvent: import("@minecraft/server").WeatherChangeAfterEventSignal;
}
