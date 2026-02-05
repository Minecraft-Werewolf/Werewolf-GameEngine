import { EffectAddAfterEvent, EffectAddBeforeEvent } from "@minecraft/server";
import type { InGameEventManager } from "./InGameEventManager";
import { InGameEventHandler } from "./InGameEventHandler";
export declare class InGameEffectAdd extends InGameEventHandler<EffectAddBeforeEvent, EffectAddAfterEvent> {
    private readonly inGameEventManager;
    private constructor();
    static create(inGameEventManager: InGameEventManager): InGameEffectAdd;
    protected beforeEvent: import("@minecraft/server").EffectAddBeforeEventSignal;
    protected afterEvent: import("@minecraft/server").EffectAddAfterEventSignal;
}
