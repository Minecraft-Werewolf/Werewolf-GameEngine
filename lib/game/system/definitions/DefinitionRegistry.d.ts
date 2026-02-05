import type { FactionDefinition, RoleDefinition, RoleGroupDefinition, SettingDefinition } from "../../../constants/types";
import type { GameEventContext } from "../../ingame/game/GameManager";
import type { GameEventHandlerMap } from "../../ingame/game/SkillManager";
import type { SelfPlayerData } from "../../ingame/PlayerData";
import type { SystemManager } from "../../SystemManager";
type GameEventHandler = (ev: GameEventContext) => void;
export type UpdateHandlers = {
    readonly onTickUpdate?: GameEventHandler;
    readonly onSecondUpdate?: GameEventHandler;
};
export type RoleSkillHandlers = Record<string, GameEventHandlerMap>;
type DefinitionRegistryState = {
    roles?: RoleDefinition[];
    factions?: FactionDefinition[];
    roleGroups?: RoleGroupDefinition[];
    settings?: SettingDefinition[];
    playerData?: SelfPlayerData;
    updateHandlers?: UpdateHandlers;
    roleSkillHandlers?: RoleSkillHandlers;
};
type DefinitionRegistration = Partial<Pick<DefinitionRegistryState, "roles" | "factions" | "roleGroups" | "settings">>;
type RegistryInitPayload = {
    definitions?: DefinitionRegistration;
    playerData?: SelfPlayerData;
    updateHandlers?: UpdateHandlers;
    roleSkillHandlers?: RoleSkillHandlers;
};
export declare class DefinitionRegistry {
    private readonly systemManager;
    private constructor();
    private state;
    static create(systemManager: SystemManager): DefinitionRegistry;
    init(payload: RegistryInitPayload): void;
    registerDefinitions(definitions: DefinitionRegistration): void;
    registerPlayerData(data: SelfPlayerData): void;
    registerUpdateHandlers(handlers: UpdateHandlers): void;
    registerRoleSkillHandlers(handlers: RoleSkillHandlers): void;
    getRoles(): readonly RoleDefinition[] | undefined;
    getFactions(): readonly FactionDefinition[] | undefined;
    getRoleGroups(): readonly RoleGroupDefinition[] | undefined;
    getSettings(): readonly SettingDefinition[] | undefined;
    getPlayerData(): SelfPlayerData;
    getUpdateHandlers(): UpdateHandlers | undefined;
    getRoleSkillHandlers(): RoleSkillHandlers | undefined;
}
export {};
