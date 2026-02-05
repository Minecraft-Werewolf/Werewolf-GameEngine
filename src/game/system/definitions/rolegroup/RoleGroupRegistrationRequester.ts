import type { RoleGroupDefinition } from "../../../../constants/types";
import { BaseDefinitionRegistrationRequester } from "../BaseDefinitionRegistrationRequester";
import type { DefinitionManager } from "../DefinitionManager";

export class RoleGroupRegistrationRequester extends BaseDefinitionRegistrationRequester<RoleGroupDefinition> {
    private constructor(definitionManager: DefinitionManager) {
        super(definitionManager, "roleGroup");
    }

    public static create(definitionManager: DefinitionManager): RoleGroupRegistrationRequester {
        return new RoleGroupRegistrationRequester(definitionManager);
    }

    public request(roleGroups: readonly RoleGroupDefinition[]): void {
        super.request(roleGroups);
    }
}
