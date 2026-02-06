import type { SystemManager } from "../../SystemManager";
export declare const definitionTypeValues: readonly ["role", "faction", "roleGroup", "setting"];
export type DefinitionType = (typeof definitionTypeValues)[number];
export declare class DefinitionManager {
    private readonly systemManager;
    private readonly roleRegistrationRequester;
    private readonly factionRegistrationRequester;
    private readonly roleGroupRegistrationRequester;
    private readonly settingRegistrationRequester;
    private readonly registryManager;
    private constructor();
    static create(systemManager: SystemManager): DefinitionManager;
    requestDefinitionsRegistration(): void;
    getRegistryManager(): import("../../registry").DefinitionRegistryManager;
}
