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
type DefinitionRegistryState = {
    roles: RoleDefinition[];
    factions: FactionDefinition[];
    roleGroups: RoleGroupDefinition[];
    settings: SettingDefinition[];
    playerData: SelfPlayerData;
    updateHandlers: UpdateHandlers;
    roleSkillHandlers: RoleSkillHandlers;
};
export type DefinitionRegistration = Partial<Pick<DefinitionRegistryState, "roles" | "factions" | "roleGroups" | "settings">>;
export declare const registerDefinitions: (definitions: DefinitionRegistration) => void;
export declare const registerPlayerDataInRegistry: (data: SelfPlayerData) => void;
export declare const registerUpdateHandlers: (handlers: UpdateHandlerRegistration) => void;
export declare const registerRoleSkillHandlersInRegistry: (handlers: RoleSkillHandlers) => void;
declare class RoleRegistry {
    private constructor();
    static create(): RoleRegistry;
    register(roles: RoleDefinition[]): void;
}
declare class FactionRegistry {
    private constructor();
    static create(): FactionRegistry;
    register(factions: FactionDefinition[]): void;
}
declare class RoleGroupRegistry {
    private constructor();
    static create(): RoleGroupRegistry;
    register(roleGroups: RoleGroupDefinition[]): void;
}
declare class SettingRegistry {
    private constructor();
    static create(): SettingRegistry;
    register(settings: SettingDefinition[]): void;
}
declare class PlayerRegistry {
    private constructor();
    static create(): PlayerRegistry;
    register(data: SelfPlayerData): void;
}
declare class UpdateHandlerRegistry {
    private constructor();
    static create(): UpdateHandlerRegistry;
    register(handlers: UpdateHandlerRegistration): void;
}
declare class RoleSkillHandlerRegistry {
    private constructor();
    static create(): RoleSkillHandlerRegistry;
    register(handlers: RoleSkillHandlers): void;
}
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
    static get roles(): RoleRegistry;
    static get factions(): FactionRegistry;
    static get roleGroups(): RoleGroupRegistry;
    static get settings(): SettingRegistry;
    static get player(): PlayerRegistry;
    static get updateHandlers(): UpdateHandlerRegistry;
    static get roleSkillHandlers(): RoleSkillHandlerRegistry;
}
export declare const getRegisteredRoles: () => readonly RoleDefinition[];
export declare const getRegisteredFactions: () => readonly FactionDefinition[];
export declare const getRegisteredRoleGroups: () => readonly RoleGroupDefinition[];
export declare const getRegisteredSettings: () => readonly SettingDefinition[];
export declare const getRegisteredPlayerData: () => SelfPlayerData;
export declare const getRegisteredUpdateHandlers: () => UpdateHandlers;
export declare const getRegisteredRoleSkillHandlers: () => RoleSkillHandlers;
export {};
