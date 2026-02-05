import type { RoleDefinition } from "../../../../constants/types";
import { BaseDefinitionRegistrationRequester } from "../BaseDefinitionRegistrationRequester";
import type { DefinitionManager } from "../DefinitionManager";
export declare class RoleRegistrationRequester extends BaseDefinitionRegistrationRequester<RoleDefinition> {
    private constructor();
    static create(definitionManager: DefinitionManager): RoleRegistrationRequester;
    request(roles: readonly RoleDefinition[]): void;
}
