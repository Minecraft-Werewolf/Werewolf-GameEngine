import { WeatherChangeAfterEvent, WeatherChangeBeforeEvent, world } from "@minecraft/server";
import type { InGameEventManager } from "./InGameEventManager";
import { InGameEventHandler } from "./InGameEventHandler";

export class InGameWeatherChange extends InGameEventHandler<
    WeatherChangeBeforeEvent,
    WeatherChangeAfterEvent
> {
    private constructor(private readonly inGameEventManager: InGameEventManager) {
        super(inGameEventManager);
    }
    public static create(inGameEventManager: InGameEventManager): InGameWeatherChange {
        return new InGameWeatherChange(inGameEventManager);
    }

    protected beforeEvent = world.beforeEvents.weatherChange;
    protected afterEvent = world.afterEvents.weatherChange;
}
