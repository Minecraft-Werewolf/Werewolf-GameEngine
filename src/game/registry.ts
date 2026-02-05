import type {
    FactionDefinition,
    RoleDefinition,
    RoleGroupDefinition,
    SettingDefinition,
} from "../constants/types";
import type { GameEventHandlerMap } from "./ingame/game/SkillManager";
import type { GameEventContext } from "./ingame/game/GameManager";
import type { SelfPlayerData } from "./ingame/PlayerData";

type GameEventHandler = (ev: GameEventContext) => void;

export type UpdateHandlers = {
    readonly onTickUpdate: GameEventHandler;
    readonly onSecondUpdate: GameEventHandler;
};

type UpdateHandlerRegistration = Partial<UpdateHandlers>;

export type RoleSkillHandlers = Record<string, GameEventHandlerMap>;

type DefinitionRegistry = {
    roles: RoleDefinition[];
    factions: FactionDefinition[];
    roleGroups: RoleGroupDefinition[];
    settings: SettingDefinition[];
    playerData: SelfPlayerData;
    updateHandlers: UpdateHandlers;
    roleSkillHandlers: RoleSkillHandlers;
};

const defaultUpdateHandlers: UpdateHandlers = {
    onTickUpdate: () => {},
    onSecondUpdate: () => {},
};

const registry: DefinitionRegistry = {
    roles: [],
    factions: [],
    roleGroups: [],
    settings: [],
    playerData: { playerId: "" },
    updateHandlers: defaultUpdateHandlers,
    roleSkillHandlers: {},
};

export type DefinitionRegistration = Partial<
    Pick<DefinitionRegistry, "roles" | "factions" | "roleGroups" | "settings">
>;

export const registerDefinitions = (definitions: DefinitionRegistration): void => {
    if (definitions.roles) {
        registry.roles = [...definitions.roles];
    }
    if (definitions.factions) {
        registry.factions = [...definitions.factions];
    }
    if (definitions.roleGroups) {
        registry.roleGroups = [...definitions.roleGroups];
    }
    if (definitions.settings) {
        registry.settings = [...definitions.settings];
    }
};

export const registerPlayerData = (data: SelfPlayerData): void => {
    registry.playerData = data;
};

export const registerUpdateHandlers = (handlers: UpdateHandlerRegistration): void => {
    registry.updateHandlers = { ...registry.updateHandlers, ...handlers };
};

export const registerRoleSkillHandlers = (handlers: RoleSkillHandlers): void => {
    registry.roleSkillHandlers = {
        ...registry.roleSkillHandlers,
        ...handlers,
    };
};

export const getRegisteredRoles = (): readonly RoleDefinition[] => registry.roles;
export const getRegisteredFactions = (): readonly FactionDefinition[] => registry.factions;
export const getRegisteredRoleGroups = (): readonly RoleGroupDefinition[] => registry.roleGroups;
export const getRegisteredSettings = (): readonly SettingDefinition[] => registry.settings;
export const getRegisteredPlayerData = (): SelfPlayerData => registry.playerData;
export const getRegisteredUpdateHandlers = (): UpdateHandlers => registry.updateHandlers;
export const getRegisteredRoleSkillHandlers = (): RoleSkillHandlers => registry.roleSkillHandlers;
