import { BaseEventManager } from "../../events/BaseEventManager";
import type { SystemManager } from "../../SystemManager";
export declare class SystemEventManager extends BaseEventManager {
    private readonly systemManager;
    private constructor();
    static create(systemManager: SystemManager): SystemEventManager;
    subscribeAll(): void;
    unsubscribeAll(): void;
    getSystemManager(): SystemManager;
}
