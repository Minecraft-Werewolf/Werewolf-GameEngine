import type { FactionDefinition } from "../../../../constants/types";
import { BaseDefinitionRegistrationRequester } from "../BaseDefinitionRegistrationRequester";
import type { DefinitionManager } from "../DefinitionManager";
export declare class FactionRegistrationRequester extends BaseDefinitionRegistrationRequester<FactionDefinition> {
    private constructor();
    static create(definitionManager: DefinitionManager): FactionRegistrationRequester;
    request(factions: readonly FactionDefinition[]): void;
}
