import { KairoUtils, type KairoResponse } from "@kairo-ts/router";
import type { SelfPlayerData } from "../PlayerData";
import type { GameEventType, RoleDefinition } from "../../../constants/types";
import type { InGameManager } from "../InGameManager";
import type { IngameConstants } from "./IngameConstants";
import type { WerewolfGameData } from "./WerewolfGameData";
import { getRegisteredRoleSkillHandlers } from "../../registry";

export type RoleSkillHandler = (ev: SkillEventContext) => Promise<boolean> | boolean;

export type GameEventHandlerMap = Partial<Record<string, RoleSkillHandler>>;

export type SkillEventContext = {
    readonly playerData: SelfPlayerData;
    readonly playersData: readonly SelfPlayerData[];
    readonly werewolfGameData: WerewolfGameData;
    readonly ingameConstants: IngameConstants;
};

export class SkillManager {
    private readonly handlersByRoleId = new Map<string, Map<string, RoleSkillHandler>>();

    private constructor(
        private readonly inGameManager: InGameManager,
        roles: readonly RoleDefinition[],
    ) {
        const roleSkillHandlers = getRegisteredRoleSkillHandlers();
        for (const role of roles) {
            const skillHandlers = roleSkillHandlers[role.id];
            if (!skillHandlers) continue;

            const map = new Map<string, RoleSkillHandler>();

            for (const [skillId, handler] of Object.entries(skillHandlers)) {
                if (!handler) continue;
                map.set(skillId, handler);
            }

            this.handlersByRoleId.set(role.id, map);
        }
    }

    public static create(
        inGameManager: InGameManager,
        roles: readonly RoleDefinition[],
    ): SkillManager {
        return new SkillManager(inGameManager, roles);
    }

    public async emitPlayerEvent(
        playerId: string,
        eventType: GameEventType,
    ): Promise<KairoResponse> {
        const werewolfGameData = await this.inGameManager.getWerewolfGameData();
        if (!werewolfGameData) {
            return KairoUtils.buildKairoResponse({}, false, "No game data");
        }

        const playerData = werewolfGameData.playersData.find((pd) => pd.player.id === playerId);
        if (!playerData?.role) {
            return KairoUtils.buildKairoResponse({}, false, "Player has no role");
        }

        const binding = playerData.role.handleGameEvents?.[eventType];
        if (!binding) {
            return KairoUtils.buildKairoResponse(
                { success: false },
                false,
                "No skill bound to this event",
            );
        }

        const handlerMap = this.handlersByRoleId.get(playerData.role.id);
        if (!handlerMap) {
            return KairoUtils.buildKairoResponse(
                { success: false },
                false,
                "No handlers for this role",
            );
        }

        const handler = handlerMap.get(binding.skillId);
        if (!handler) {
            return KairoUtils.buildKairoResponse(
                { success: false },
                false,
                `No handler for skill: ${binding.skillId}`,
            );
        }

        const selfPlayerData = this.inGameManager.getSelfPlayerData(playerId);
        if (!selfPlayerData) {
            return KairoUtils.buildKairoResponse({}, false, "No self player data");
        }

        const ev: SkillEventContext = {
            playerData: selfPlayerData,
            playersData: this.inGameManager.getSelfPlayersData(),
            werewolfGameData: werewolfGameData,
            ingameConstants: this.inGameManager.getIngameConstants(),
        };

        const success = await handler(ev);

        return KairoUtils.buildKairoResponse({ success });
    }
}
