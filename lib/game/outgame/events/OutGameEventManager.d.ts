import { BaseEventManager } from "../../events/BaseEventManager";
import type { OutGameManager } from "../OutGameManager";
export declare class OutGameEventManager extends BaseEventManager {
    private readonly outGameManager;
    private readonly scriptEventReceive;
    private constructor();
    static create(outGameManager: OutGameManager): OutGameEventManager;
    subscribeAll(): void;
    unsubscribeAll(): void;
    getOutGameManager(): OutGameManager;
}
