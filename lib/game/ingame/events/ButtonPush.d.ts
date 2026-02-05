import { ButtonPushAfterEvent } from "@minecraft/server";
import type { InGameEventManager } from "./InGameEventManager";
import { InGameEventHandler } from "./InGameEventHandler";
export declare class InGameButtonPush extends InGameEventHandler<undefined, ButtonPushAfterEvent> {
    private readonly inGameEventManager;
    private constructor();
    static create(inGameEventManager: InGameEventManager): InGameButtonPush;
    protected afterEvent: import("@minecraft/server").ButtonPushAfterEventSignal;
}
