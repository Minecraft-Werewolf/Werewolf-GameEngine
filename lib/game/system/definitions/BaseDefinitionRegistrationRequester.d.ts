import type { DefinitionManager, DefinitionType } from "./DefinitionManager";
export declare abstract class BaseDefinitionRegistrationRequester<T> {
    protected readonly definitionManager: DefinitionManager;
    private readonly definitionType;
    protected constructor(definitionManager: DefinitionManager, definitionType: DefinitionType);
    protected request(definitions: readonly T[]): void;
}
