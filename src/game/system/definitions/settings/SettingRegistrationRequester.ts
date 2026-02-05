import type { SettingDefinition } from "../../../../constants/types";
import { BaseDefinitionRegistrationRequester } from "../BaseDefinitionRegistrationRequester";
import type { DefinitionManager } from "../DefinitionManager";

export class SettingRegistrationRequester extends BaseDefinitionRegistrationRequester<SettingDefinition> {
    private constructor(definitionManager: DefinitionManager) {
        super(definitionManager, "setting");
    }

    public static create(definitionManager: DefinitionManager): SettingRegistrationRequester {
        return new SettingRegistrationRequester(definitionManager);
    }

    public request(settings: readonly SettingDefinition[]): void {
        super.request(settings);
    }
}
