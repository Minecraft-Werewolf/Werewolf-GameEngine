import type { RoleDefinition } from "../../../../constants/types";
import { BaseDefinitionRegistrationRequester } from "../BaseDefinitionRegistrationRequester";
import type { DefinitionManager } from "../DefinitionManager";

export class RoleRegistrationRequester extends BaseDefinitionRegistrationRequester<RoleDefinition> {
    private constructor(definitionManager: DefinitionManager) {
        super(definitionManager, "role");
    }

    public static create(definitionManager: DefinitionManager): RoleRegistrationRequester {
        return new RoleRegistrationRequester(definitionManager);
    }

    public request(roles: readonly RoleDefinition[]): void {
        super.request(roles);
    }
}
