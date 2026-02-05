import type { BaseEventManager } from "./BaseEventManager";
export declare abstract class BaseEventHandler<TBefore = undefined, TAfter = undefined, TManager extends BaseEventManager = BaseEventManager> {
    protected readonly eventManager: TManager;
    protected isSubscribed: boolean;
    private boundBefore?;
    private boundAfter?;
    protected constructor(eventManager: TManager);
    protected beforeEvent?: {
        subscribe(cb: (ev: TBefore) => void): void;
        unsubscribe(cb: (ev: TBefore) => void): void;
    };
    protected afterEvent?: {
        subscribe(cb: (ev: TAfter) => void): void;
        unsubscribe(cb: (ev: TAfter) => void): void;
    };
    protected handleBefore?(ev: TBefore): void | Promise<void>;
    protected handleAfter?(ev: TAfter): void | Promise<void>;
    protected _handleBefore(ev: TBefore): Promise<void>;
    protected _handleAfter(ev: TAfter): Promise<void>;
    subscribe(): void;
    unsubscribe(): void;
}
