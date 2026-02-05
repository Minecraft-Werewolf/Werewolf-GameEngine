import { system, type ScriptEventCommandMessageAfterEvent } from "@minecraft/server";
import { BaseEventHandler } from "../../events/BaseEventHandler";
import type { OutGameEventManager } from "./OutGameEventManager";

export class OutGameScriptEventReceiveHandler extends BaseEventHandler<
    undefined,
    ScriptEventCommandMessageAfterEvent
> {
    private constructor(private readonly outGameEventManager: OutGameEventManager) {
        super(outGameEventManager);
    }
    public static create(
        outGameEventManager: OutGameEventManager,
    ): OutGameScriptEventReceiveHandler {
        return new OutGameScriptEventReceiveHandler(outGameEventManager);
    }

    protected afterEvent = system.afterEvents.scriptEventReceive;

    protected handleAfter(ev: ScriptEventCommandMessageAfterEvent): void {
        const { id, initiator, message, sourceBlock, sourceEntity, sourceType } = ev;
    }
}
