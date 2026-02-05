import type { SettingDefinition } from "../../../../constants/types";
import { BaseDefinitionRegistrationRequester } from "../BaseDefinitionRegistrationRequester";
import type { DefinitionManager } from "../DefinitionManager";
export declare class SettingRegistrationRequester extends BaseDefinitionRegistrationRequester<SettingDefinition> {
    private constructor();
    static create(definitionManager: DefinitionManager): SettingRegistrationRequester;
    request(settings: readonly SettingDefinition[]): void;
}
