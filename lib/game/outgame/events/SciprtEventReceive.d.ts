import { type ScriptEventCommandMessageAfterEvent } from "@minecraft/server";
import { BaseEventHandler } from "../../events/BaseEventHandler";
import type { OutGameEventManager } from "./OutGameEventManager";
export declare class OutGameScriptEventReceiveHandler extends BaseEventHandler<undefined, ScriptEventCommandMessageAfterEvent> {
    private readonly outGameEventManager;
    private constructor();
    static create(outGameEventManager: OutGameEventManager): OutGameScriptEventReceiveHandler;
    protected afterEvent: import("@minecraft/server").ScriptEventCommandMessageAfterEventSignal;
    protected handleAfter(ev: ScriptEventCommandMessageAfterEvent): void;
}
