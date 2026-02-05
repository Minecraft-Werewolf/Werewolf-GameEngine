import type { FactionDefinition } from "../../../../constants/types";
import { BaseDefinitionRegistrationRequester } from "../BaseDefinitionRegistrationRequester";
import type { DefinitionManager } from "../DefinitionManager";

export class FactionRegistrationRequester extends BaseDefinitionRegistrationRequester<FactionDefinition> {
    private constructor(definitionManager: DefinitionManager) {
        super(definitionManager, "faction");
    }

    public static create(definitionManager: DefinitionManager): FactionRegistrationRequester {
        return new FactionRegistrationRequester(definitionManager);
    }

    public request(factions: readonly FactionDefinition[]): void {
        super.request(factions);
    }
}
