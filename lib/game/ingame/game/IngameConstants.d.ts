import type { FactionDefinition, RoleDefinition, RoleGroupDefinition, SettingDefinition } from "../../../constants/types";
import type { DefinitionType } from "../../system/definitions/DefinitionManager";
import type { InGameManager } from "../InGameManager";
export type RoleCountMap = Record<string, number>;
export type IngameConstantsDTO = {
    roleComposition: RoleCountMap;
    roleDefinitions: Record<string, RoleDefinition[]>;
    factionDefinitions: Record<string, FactionDefinition[]>;
    roleGroupDefinitions: Record<string, RoleGroupDefinition[]>;
    settingDefinitions: Record<string, SettingDefinition[]>;
};
export declare class IngameConstants {
    private readonly ingameManager;
    private readonly data;
    private constructor();
    static create(ingameManager: InGameManager, ingameConstantsDTO: IngameConstantsDTO): IngameConstants;
    getRoleCount(roleId: string): number;
    getEnabledRoleIds(): string[];
    getEnabledRoles(): RoleDefinition[];
    getDefinitions<T>(type: DefinitionType): readonly T[];
    getDefinitionsByAddon<T>(type: DefinitionType, addonId: string): readonly T[];
    getDefinitionsMap<T>(type: DefinitionType): ReadonlyMap<string, readonly T[]>;
    getDefinitionById<T extends {
        id: string;
    }>(type: DefinitionType, id: string): T | undefined;
    getRoleById(id: string): RoleDefinition | undefined;
    getFactionById(id: string): FactionDefinition | undefined;
    getRoleGroupById(id: string): RoleGroupDefinition | undefined;
    getSettingById(id: string): SettingDefinition | undefined;
    private toReadonlyMap;
}
