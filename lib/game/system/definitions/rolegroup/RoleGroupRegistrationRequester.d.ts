import type { RoleGroupDefinition } from "../../../../constants/types";
import { BaseDefinitionRegistrationRequester } from "../BaseDefinitionRegistrationRequester";
import type { DefinitionManager } from "../DefinitionManager";
export declare class RoleGroupRegistrationRequester extends BaseDefinitionRegistrationRequester<RoleGroupDefinition> {
    private constructor();
    static create(definitionManager: DefinitionManager): RoleGroupRegistrationRequester;
    request(roleGroups: readonly RoleGroupDefinition[]): void;
}
