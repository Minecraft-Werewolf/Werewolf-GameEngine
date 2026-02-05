import type { SystemManager } from "../SystemManager";
import { OutGameEventManager } from "./events/OutGameEventManager";
export declare class OutGameManager {
    private readonly systemManager;
    private readonly outGameEventManager;
    private constructor();
    static create(systemManager: SystemManager): OutGameManager;
    getOutGameEventManager(): OutGameEventManager;
}
