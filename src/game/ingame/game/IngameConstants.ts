import type {
    FactionDefinition,
    RoleDefinition,
    RoleGroupDefinition,
    SettingDefinition,
} from "../../../constants/types";
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

export class IngameConstants {
    private readonly data: IngameConstantsDTO;

    private constructor(
        private readonly ingameManager: InGameManager,
        ingameConstantsDTO: IngameConstantsDTO,
    ) {
        this.data = ingameConstantsDTO;
    }

    public static create(
        ingameManager: InGameManager,
        ingameConstantsDTO: IngameConstantsDTO,
    ): IngameConstants {
        return new IngameConstants(ingameManager, ingameConstantsDTO);
    }

    public getRoleCount(roleId: string): number {
        return this.data.roleComposition[roleId] ?? 0;
    }

    public getEnabledRoleIds(): string[] {
        return Object.keys(this.data.roleComposition);
    }

    public getEnabledRoles(): RoleDefinition[] {
        return this.getEnabledRoleIds()
            .map((id) => this.getRoleById(id))
            .filter((r): r is RoleDefinition => r !== undefined);
    }

    public getDefinitions<T>(type: DefinitionType): readonly T[] {
        switch (type) {
            case "role":
                return Object.values(this.data.roleDefinitions).flat() as T[];
            case "faction":
                return Object.values(this.data.factionDefinitions).flat() as T[];
            case "roleGroup":
                return Object.values(this.data.roleGroupDefinitions).flat() as T[];
            case "setting":
                return Object.values(this.data.settingDefinitions).flat() as T[];
        }
    }

    public getDefinitionsByAddon<T>(type: DefinitionType, addonId: string): readonly T[] {
        switch (type) {
            case "role":
                return (this.data.roleDefinitions[addonId] ?? []) as T[];
            case "faction":
                return (this.data.factionDefinitions[addonId] ?? []) as T[];
            case "roleGroup":
                return (this.data.roleGroupDefinitions[addonId] ?? []) as T[];
            case "setting":
                return (this.data.settingDefinitions[addonId] ?? []) as T[];
        }
    }

    public getDefinitionsMap<T>(type: DefinitionType): ReadonlyMap<string, readonly T[]> {
        switch (type) {
            case "role":
                return this.toReadonlyMap(this.data.roleDefinitions) as ReadonlyMap<
                    string,
                    readonly T[]
                >;
            case "faction":
                return this.toReadonlyMap(this.data.factionDefinitions) as ReadonlyMap<
                    string,
                    readonly T[]
                >;
            case "roleGroup":
                return this.toReadonlyMap(this.data.roleGroupDefinitions) as ReadonlyMap<
                    string,
                    readonly T[]
                >;
            case "setting":
                return this.toReadonlyMap(this.data.settingDefinitions) as ReadonlyMap<
                    string,
                    readonly T[]
                >;
        }
    }

    public getDefinitionById<T extends { id: string }>(
        type: DefinitionType,
        id: string,
    ): T | undefined {
        return this.getDefinitions<T>(type).find((d) => d.id === id);
    }

    public getRoleById(id: string): RoleDefinition | undefined {
        return this.getDefinitionById<RoleDefinition>("role", id);
    }

    public getFactionById(id: string): FactionDefinition | undefined {
        return this.getDefinitionById<FactionDefinition>("faction", id);
    }

    public getRoleGroupById(id: string): RoleGroupDefinition | undefined {
        return this.getDefinitionById<RoleGroupDefinition>("roleGroup", id);
    }

    public getSettingById(id: string): SettingDefinition | undefined {
        return this.getDefinitionById<SettingDefinition>("setting", id);
    }

    private toReadonlyMap<T>(record: Record<string, T[]>): ReadonlyMap<string, readonly T[]> {
        return new Map(
            Object.entries(record).map(([addonId, defs]) => [addonId, defs as readonly T[]]),
        );
    }
}
