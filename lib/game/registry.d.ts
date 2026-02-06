import type { FactionDefinition, RoleDefinition, RoleGroupDefinition, SettingDefinition } from "../constants/types";
import type { GameEventHandlerMap } from "./ingame/game/SkillManager";
import type { GameEventContext } from "./ingame/game/GameManager";
import type { SelfPlayerData } from "./ingame/PlayerData";
type GameEventHandler = (ev: GameEventContext) => void;
export type UpdateHandlers = {
    readonly onTickUpdate: GameEventHandler;
    readonly onSecondUpdate: GameEventHandler;
};
export type UpdateHandlerRegistration = Partial<UpdateHandlers>;
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
export type DefinitionRegistration = Partial<Pick<DefinitionRegistry, "roles" | "factions" | "roleGroups" | "settings">>;
export declare const registerDefinitions: (definitions: DefinitionRegistration) => void;
export declare const registerPlayerDataInRegistry: (data: SelfPlayerData) => void;
export declare const registerUpdateHandlers: (handlers: UpdateHandlerRegistration) => void;
export declare const registerRoleSkillHandlersInRegistry: (handlers: RoleSkillHandlers) => void;
export declare class DefinitionRegistry {
    private static instance;
    private readonly roleRegistry;
    private readonly factionRegistry;
    private readonly roleGroupRegistry;
    private readonly settingRegistry;
    private readonly playerRegistry;
    private readonly updateHandlerRegistry;
    private readonly roleSkillHandlerRegistry;
    private constructor();
    static getInstance(): DefinitionRegistry;
    static get roles(): {
        register(roles: RoleDefinition[]): void;
    };
    static get factions(): {
        register(factions: FactionDefinition[]): void;
    };
    static get roleGroups(): {
        register(roleGroups: RoleGroupDefinition[]): void;
    };
    static get settings(): {
        register(settings: SettingDefinition[]): void;
    };
    static get player(): {
        register(data: SelfPlayerData): void;
    };
    static get updateHandlers(): {
        register(handlers: UpdateHandlerRegistration): void;
    };
    static get roleSkillHandlers(): {
        register(handlers: RoleSkillHandlers): void;
    };
}
export declare const getRegisteredRoles: () => readonly RoleDefinition[];
export declare const getRegisteredFactions: () => readonly FactionDefinition[];
export declare const getRegisteredRoleGroups: () => readonly RoleGroupDefinition[];
export declare const getRegisteredSettings: () => readonly SettingDefinition[];
export declare const getRegisteredPlayerData: () => SelfPlayerData;
export declare const getRegisteredUpdateHandlers: () => UpdateHandlers;
export declare const getRegisteredRoleSkillHandlers: () => RoleSkillHandlers;
export {};
