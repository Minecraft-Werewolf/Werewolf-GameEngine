import { SCRIPT_EVENT_COMMAND_IDS } from "../../constants/scriptevent";
import { KAIRO_COMMAND_TARGET_ADDON_IDS } from "../../constants/systems";
import type { SystemManager } from "../SystemManager";
import { InGameEventManager } from "./events/InGameEventManager";
import type { WerewolfGameData } from "./game/WerewolfGameData";
import { SkillManager } from "./game/SkillManager";
import { world } from "@minecraft/server";
import { GameManager } from "./game/GameManager";
import { GamePhase } from "./GamePhase";
import type { GameEventType, RoleDefinition } from "../../constants/types";
import { IngameConstants, type IngameConstantsDTO } from "./game/IngameConstants";
import { KairoUtils, type KairoResponse } from "@kairo-ts/router";
import type { SelfPlayerData } from "./PlayerData";
import {
    getRegisteredPlayerData,
    getRegisteredRoles,
    getRegisteredUpdateHandlers,
} from "../registry";

export interface PlayerDataDTO {
    playerId: string;
    name: string;
    isAlive: boolean;
    isVictory: boolean;
    role: RoleDefinition | null;
}

export class InGameManager {
    private currentPhase: GamePhase = GamePhase.Waiting;

    private readonly inGameEventManager: InGameEventManager;
    private readonly ingameConstants: IngameConstants;
    private readonly gameManager: GameManager;
    private readonly skillManager: SkillManager;

    private readonly playerDataByPlayerId = new Map<string, SelfPlayerData>();

    private constructor(
        private readonly systemManager: SystemManager,
        ingameConstantsDTO: IngameConstantsDTO,
    ) {
        this.inGameEventManager = InGameEventManager.create(this);
        this.ingameConstants = IngameConstants.create(this, ingameConstantsDTO);
        const updateHandlers = getRegisteredUpdateHandlers();
        this.gameManager = GameManager.create(this, {
            onTickUpdate: updateHandlers.onTickUpdate,
            onSecondUpdate: updateHandlers.onSecondUpdate,
        });
        this.skillManager = SkillManager.create(this, getRegisteredRoles());
        this.initSelfPlayersData();
    }

    public static create(
        systemManager: SystemManager,
        ingameConstants: IngameConstantsDTO,
    ): InGameManager {
        return new InGameManager(systemManager, ingameConstants);
    }

    public getInGameEventManager(): InGameEventManager {
        return this.inGameEventManager;
    }

    public async handlePlayerSkillTrigger(
        playerId: string,
        eventType: GameEventType,
    ): Promise<KairoResponse> {
        return this.skillManager.emitPlayerEvent(playerId, eventType);
    }

    public async getWerewolfGameData(): Promise<WerewolfGameData | null> {
        const kairoResponse = await KairoUtils.sendKairoCommandAndWaitResponse(
            KAIRO_COMMAND_TARGET_ADDON_IDS.WEREWOLF_GAMEMANAGER,
            SCRIPT_EVENT_COMMAND_IDS.GET_WEREWOLF_GAME_DATA,
            {},
        );

        if (!kairoResponse.success) return null;
        return kairoResponse.data as WerewolfGameData;
    }

    public getRoleDefinition(roleId: string): RoleDefinition | undefined {
        return getRegisteredRoles().find((role) => role.id === roleId);
    }

    public getIngameConstants(): IngameConstants {
        return this.ingameConstants;
    }

    public getCurrentPhase(): GamePhase {
        return this.currentPhase;
    }

    public setCurrentPhase(newPhase: GamePhase): void {
        this.currentPhase = newPhase;

        switch (newPhase) {
            case GamePhase.InGame:
                this.gameManager.startGame();
                break;
            case GamePhase.Result:
                this.gameManager.finishGame();
                break;
        }
    }

    public getSelfPlayerData(playerId: string): SelfPlayerData | undefined {
        return this.playerDataByPlayerId.get(playerId);
    }

    public getSelfPlayersData(): readonly SelfPlayerData[] {
        return Array.from(this.playerDataByPlayerId.values());
    }

    private initSelfPlayersData(): void {
        const players = world.getPlayers();
        const defaultPlayerData = getRegisteredPlayerData();

        for (const player of players) {
            this.playerDataByPlayerId.set(player.id, {
                ...defaultPlayerData,
                playerId: player.id,
            });
        }
    }
}
