import { BaseEventHandler } from "../../events/BaseEventHandler";
import type { InGameEventManager } from "./InGameEventManager";
import type { SelfPlayerData } from "../PlayerData";
import type { WerewolfGameData } from "../game/WerewolfGameData";
import type { IngameConstants } from "../game/IngameConstants";
export type InGameEventContext = {
    readonly playersData: readonly SelfPlayerData[];
    readonly werewolfGameData: WerewolfGameData;
    readonly ingameConstants: IngameConstants;
};
export type InGameOnlyHook<TEvent> = (ev: TEvent, ctx: InGameEventContext) => void | Promise<void>;
export declare abstract class InGameEventHandler<TBefore = undefined, TAfter = undefined> extends BaseEventHandler<TBefore, TAfter, InGameEventManager> {
    private static afterHooks;
    private static beforeHooks;
    static afterEvent<TEvent>(hook: InGameOnlyHook<TEvent>): void;
    static beforeEvent<TEvent>(hook: InGameOnlyHook<TEvent>): void;
    protected _handleAfter(ev: TAfter): Promise<void>;
    protected _handleBefore(ev: TBefore): Promise<void>;
    private buildContextIfInGame;
}
