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

type DefinitionRegistryState = {
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

const registry: DefinitionRegistryState = {
  roles: [],
  factions: [],
  roleGroups: [],
  settings: [],
  playerData: { playerId: "" },
  updateHandlers: defaultUpdateHandlers,
  roleSkillHandlers: {},
};

export type DefinitionRegistration = Partial<
  Pick<DefinitionRegistryState, "roles" | "factions" | "roleGroups" | "settings">
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

export class DefinitionRegistry {
  private static instance: DefinitionRegistry | null = null;
  private readonly roleRegistry = RoleRegistry.create();
  private readonly factionRegistry = FactionRegistry.create();
  private readonly roleGroupRegistry = RoleGroupRegistry.create();
  private readonly settingRegistry = SettingRegistry.create();
  private readonly playerRegistry = PlayerRegistry.create();
  private readonly updateHandlerRegistry = UpdateHandlerRegistry.create();
  private readonly roleSkillHandlerRegistry = RoleSkillHandlerRegistry.create();

  private constructor() {}

  public static getInstance(): DefinitionRegistry {
    if (!this.instance) {
      this.instance = new DefinitionRegistry();
    }
    return this.instance;
  }

  public static get roles(): RoleRegistry {
    return this.getInstance().roleRegistry;
  }

  public static get factions(): FactionRegistry {
    return this.getInstance().factionRegistry;
  }

  public static get roleGroups(): RoleGroupRegistry {
    return this.getInstance().roleGroupRegistry;
  }

  public static get settings(): SettingRegistry {
    return this.getInstance().settingRegistry;
  }

  public static get player(): PlayerRegistry {
    return this.getInstance().playerRegistry;
  }

  public static get updateHandlers(): UpdateHandlerRegistry {
    return this.getInstance().updateHandlerRegistry;
  }

  public static get roleSkillHandlers(): RoleSkillHandlerRegistry {
    return this.getInstance().roleSkillHandlerRegistry;
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
