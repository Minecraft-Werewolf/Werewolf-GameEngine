import type {
  FactionDefinition,
  RoleDefinition,
  RoleGroupDefinition,
  SettingDefinition,
} from "../constants/types";
import type { GameEventHandlerMap } from "./ingame/game/SkillManager";
import type { GameEventContext } from "./ingame/game/GameManager";
import type { SelfPlayerData } from "./ingame/PlayerData";

type GameEventHandler = (ev: GameEventContext) => void;

export type UpdateHandlers = {
  readonly onTickUpdate: GameEventHandler;
  readonly onSecondUpdate: GameEventHandler;
};

export type UpdateHandlerRegistration = Partial<UpdateHandlers>;

export type RoleSkillHandlers = Record<string, GameEventHandlerMap>;

type DefinitionRegistry = {
  roles: RoleDefinition[];
  factions: FactionDefinition[];
  roleGroups: RoleGroupDefinition[];
  settings: SettingDefinition[];
  playerData: SelfPlayerData;
  updateHandlers: UpdateHandlers;
  roleSkillHandlers: RoleSkillHandlers;
};

const defaultUpdateHandlers: UpdateHandlers = {
  onTickUpdate: () => {},
  onSecondUpdate: () => {},
};

const registry: DefinitionRegistry = {
  roles: [],
  factions: [],
  roleGroups: [],
  settings: [],
  playerData: { playerId: "" },
  updateHandlers: defaultUpdateHandlers,
  roleSkillHandlers: {},
};

export type DefinitionRegistration = Partial<
  Pick<DefinitionRegistry, "roles" | "factions" | "roleGroups" | "settings">
>;

export const registerDefinitions = (
  definitions: DefinitionRegistration,
): void => {
  if (definitions.roles) {
    registry.roles = [...definitions.roles];
  }
  if (definitions.factions) {
    registry.factions = [...definitions.factions];
  }
  if (definitions.roleGroups) {
    registry.roleGroups = [...definitions.roleGroups];
  }
  if (definitions.settings) {
    registry.settings = [...definitions.settings];
  }
};

export const registerPlayerDataInRegistry = (data: SelfPlayerData): void => {
  registry.playerData = data;
};

export const registerUpdateHandlers = (
  handlers: UpdateHandlerRegistration,
): void => {
  registry.updateHandlers = { ...registry.updateHandlers, ...handlers };
};

export const registerRoleSkillHandlersInRegistry = (
  handlers: RoleSkillHandlers,
): void => {
  registry.roleSkillHandlers = {
    ...registry.roleSkillHandlers,
    ...handlers,
  };
};

class RoleRegistry {
  private constructor() {}

  public static create(): RoleRegistry {
    return new RoleRegistry();
  }

  public register(roles: RoleDefinition[]): void {
    registerDefinitions({ roles });
  }
}

class FactionRegistry {
  private constructor() {}

  public static create(): FactionRegistry {
    return new FactionRegistry();
  }

  public register(factions: FactionDefinition[]): void {
    registerDefinitions({ factions });
  }
}

class RoleGroupRegistry {
  private constructor() {}

  public static create(): RoleGroupRegistry {
    return new RoleGroupRegistry();
  }

  public register(roleGroups: RoleGroupDefinition[]): void {
    registerDefinitions({ roleGroups });
  }
}

class SettingRegistry {
  private constructor() {}

  public static create(): SettingRegistry {
    return new SettingRegistry();
  }

  public register(settings: SettingDefinition[]): void {
    registerDefinitions({ settings });
  }
}

class PlayerRegistry {
  private constructor() {}

  public static create(): PlayerRegistry {
    return new PlayerRegistry();
  }

  public register(data: SelfPlayerData): void {
    registerPlayerDataInRegistry(data);
  }
}

class UpdateHandlerRegistry {
  private constructor() {}

  public static create(): UpdateHandlerRegistry {
    return new UpdateHandlerRegistry();
  }

  public register(handlers: UpdateHandlerRegistration): void {
    registerUpdateHandlers(handlers);
  }
}

class RoleSkillHandlerRegistry {
  private constructor() {}

  public static create(): RoleSkillHandlerRegistry {
    return new RoleSkillHandlerRegistry();
  }

  public register(handlers: RoleSkillHandlers): void {
    registerRoleSkillHandlersInRegistry(handlers);
  }
}

export class DefinitionRegistryManager {
  private static instance: DefinitionRegistryManager | null = null;
  public readonly roles = RoleRegistry.create();
  public readonly factions = FactionRegistry.create();
  public readonly roleGroups = RoleGroupRegistry.create();
  public readonly settings = SettingRegistry.create();
  public readonly player = PlayerRegistry.create();
  public readonly updateHandlers = UpdateHandlerRegistry.create();
  public readonly roleSkillHandlers = RoleSkillHandlerRegistry.create();

  private constructor() {}

  public static create(): DefinitionRegistryManager {
    if (!this.instance) {
      this.instance = new DefinitionRegistryManager();
    }
    return this.instance;
  }
}

export const getRegisteredRoles = (): readonly RoleDefinition[] =>
  registry.roles;
export const getRegisteredFactions = (): readonly FactionDefinition[] =>
  registry.factions;
export const getRegisteredRoleGroups = (): readonly RoleGroupDefinition[] =>
  registry.roleGroups;
export const getRegisteredSettings = (): readonly SettingDefinition[] =>
  registry.settings;
export const getRegisteredPlayerData = (): SelfPlayerData =>
  registry.playerData;
export const getRegisteredUpdateHandlers = (): UpdateHandlers =>
  registry.updateHandlers;
export const getRegisteredRoleSkillHandlers = (): RoleSkillHandlers =>
  registry.roleSkillHandlers;
