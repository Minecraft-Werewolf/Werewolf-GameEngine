import { BaseEventHandler } from "../../events/BaseEventHandler";
import type { InGameEventManager } from "./InGameEventManager";
import { GamePhase } from "../GamePhase";
import type { SelfPlayerData } from "../PlayerData";
import type { WerewolfGameData } from "../game/WerewolfGameData";
import type { IngameConstants } from "../game/IngameConstants";

export type InGameEventContext = {
    readonly playersData: readonly SelfPlayerData[];
    readonly werewolfGameData: WerewolfGameData;
    readonly ingameConstants: IngameConstants;
};
export type InGameOnlyHook<TEvent> = (ev: TEvent, ctx: InGameEventContext) => void | Promise<void>;

export abstract class InGameEventHandler<
    TBefore = undefined,
    TAfter = undefined,
> extends BaseEventHandler<TBefore, TAfter, InGameEventManager> {
    private static afterHooks = new Map<Function, InGameOnlyHook<any>[]>();
    private static beforeHooks = new Map<Function, InGameOnlyHook<any>[]>();

    public static afterEvent<TEvent>(hook: InGameOnlyHook<TEvent>): void {
        const ctor = this as unknown as Function;
        const hooks = InGameEventHandler.afterHooks.get(ctor) ?? [];
        hooks.push(hook as InGameOnlyHook<any>);
        InGameEventHandler.afterHooks.set(ctor, hooks);
    }

    public static beforeEvent<TEvent>(hook: InGameOnlyHook<TEvent>): void {
        const ctor = this as unknown as Function;
        const hooks = InGameEventHandler.beforeHooks.get(ctor) ?? [];
        hooks.push(hook as InGameOnlyHook<any>);
        InGameEventHandler.beforeHooks.set(ctor, hooks);
    }

    protected override async _handleAfter(ev: TAfter): Promise<void> {
        await super._handleAfter(ev);

        const ctx = await this.buildContextIfInGame(ev);
        if (!ctx) return;

        const hooks = InGameEventHandler.afterHooks.get(this.constructor as Function) ?? [];

        for (const hook of hooks as InGameOnlyHook<TAfter>[]) {
            await hook(ev, ctx);
        }
    }

    protected override async _handleBefore(ev: TBefore): Promise<void> {
        await super._handleBefore(ev);

        const ctx = await this.buildContextIfInGame(ev);
        if (!ctx) return;

        const hooks = InGameEventHandler.beforeHooks.get(this.constructor as Function) ?? [];

        for (const hook of hooks as InGameOnlyHook<TBefore>[]) {
            await hook(ev, ctx);
        }
    }

    private async buildContextIfInGame(ev: TBefore | TAfter): Promise<InGameEventContext | null> {
        const mgr = this.eventManager.getInGameManager();

        if (mgr.getCurrentPhase() !== GamePhase.InGame) {
            return null;
        }

        const gameData = await mgr.getWerewolfGameData();
        if (!gameData) return null;

        return {
            playersData: mgr.getSelfPlayersData(),
            werewolfGameData: gameData,
            ingameConstants: mgr.getIngameConstants(),
        };
    }
}
