import { KairoUtils } from "@kairo-ts/router";
import { SCRIPT_EVENT_COMMAND_IDS } from "../../../constants/scriptevent";
import { KAIRO_COMMAND_TARGET_ADDON_IDS } from "../../../constants/systems";
import type { DefinitionManager, DefinitionType } from "./DefinitionManager";

export abstract class BaseDefinitionRegistrationRequester<T> {
    protected constructor(
        protected readonly definitionManager: DefinitionManager,
        private readonly definitionType: DefinitionType,
    ) {}

    protected request(definitions: readonly T[]): void {
        KairoUtils.sendKairoCommand(
            KAIRO_COMMAND_TARGET_ADDON_IDS.WEREWOLF_GAMEMANAGER,
            SCRIPT_EVENT_COMMAND_IDS.DEFINITIONS_REGISTRATION_REQUEST,
            {
                definitionType: this.definitionType,
                definitions,
            },
        );
    }
}
