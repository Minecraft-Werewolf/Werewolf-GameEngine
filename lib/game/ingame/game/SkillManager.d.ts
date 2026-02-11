import { type KairoResponse } from "@kairo-js/router";
import type { SelfPlayerData } from "../PlayerData";
import type { GameEventType, RoleDefinition } from "../../../constants/types";
import type { InGameManager } from "../InGameManager";
import type { IngameConstants } from "./IngameConstants";
import type { WerewolfGameData } from "./WerewolfGameData";
export type RoleSkillHandler = (ev: SkillEventContext) => Promise<boolean> | boolean;
export type GameEventHandlerMap = Partial<Record<string, RoleSkillHandler>>;
export type SkillEventContext = {
    readonly playerData: SelfPlayerData;
    readonly playersData: readonly SelfPlayerData[];
    readonly werewolfGameData: WerewolfGameData;
    readonly ingameConstants: IngameConstants;
};
export declare class SkillManager {
    private readonly inGameManager;
    private readonly handlersByRoleId;
    private constructor();
    static create(inGameManager: InGameManager, roles: readonly RoleDefinition[]): SkillManager;
    emitPlayerEvent(playerId: string, eventType: GameEventType): Promise<KairoResponse>;
}
