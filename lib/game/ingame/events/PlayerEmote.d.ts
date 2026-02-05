import { PlayerEmoteAfterEvent } from "@minecraft/server";
import type { InGameEventManager } from "./InGameEventManager";
import { InGameEventHandler } from "./InGameEventHandler";
export declare class InGamePlayerEmote extends InGameEventHandler<undefined, PlayerEmoteAfterEvent> {
    private readonly inGameEventManager;
    private constructor();
    static create(inGameEventManager: InGameEventManager): InGamePlayerEmote;
    protected afterEvent: import("@minecraft/server").PlayerEmoteAfterEventSignal;
}
