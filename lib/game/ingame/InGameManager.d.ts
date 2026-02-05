import type { SystemManager } from "../SystemManager";
import { InGameEventManager } from "./events/InGameEventManager";
import type { WerewolfGameData } from "./game/WerewolfGameData";
import { GamePhase } from "./GamePhase";
import type { GameEventType, RoleDefinition } from "../../constants/types";
import { IngameConstants, type IngameConstantsDTO } from "./game/IngameConstants";
import { type KairoResponse } from "@kairo-ts/router";
import type { SelfPlayerData } from "./PlayerData";
export interface PlayerDataDTO {
    playerId: string;
    name: string;
    isAlive: boolean;
    isVictory: boolean;
    role: RoleDefinition | null;
}
export declare class InGameManager {
    private readonly systemManager;
    private currentPhase;
    private readonly inGameEventManager;
    private readonly ingameConstants;
    private readonly gameManager;
    private readonly skillManager;
    private readonly playerDataByPlayerId;
    private constructor();
    static create(systemManager: SystemManager, ingameConstants: IngameConstantsDTO): InGameManager;
    getInGameEventManager(): InGameEventManager;
    handlePlayerSkillTrigger(playerId: string, eventType: GameEventType): Promise<KairoResponse>;
    getWerewolfGameData(): Promise<WerewolfGameData | null>;
    getRoleDefinition(roleId: string): RoleDefinition | undefined;
    getIngameConstants(): IngameConstants;
    getCurrentPhase(): GamePhase;
    setCurrentPhase(newPhase: GamePhase): void;
    getSelfPlayerData(playerId: string): SelfPlayerData | undefined;
    getSelfPlayersData(): readonly SelfPlayerData[];
    private initSelfPlayersData;
}
