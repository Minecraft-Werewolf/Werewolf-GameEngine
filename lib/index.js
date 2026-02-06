// src/game/SystemManager.ts
import { KairoUtils as KairoUtils4 } from "@kairo-ts/router";

// src/constants/scriptevent.ts
var SCRIPT_EVENT_COMMAND_IDS = {
  WORLD_STATE_CHANGE: "world_state_change",
  DEFINITIONS_REGISTRATION_REQUEST: "definitions_registration_request",
  WEREWOLF_INGAME_PLAYER_SKILL_TRIGGER: "werewolf_ingame_player_skill_trigger",
  GET_WEREWOLF_GAME_DATA: "getWerewolfGameData",
  INGAME_PHASE_CHANGE: "ingame_phase_change"
};
var SCRIPT_EVENT_MESSAGES = {
  NONE: "",
  IN_GAME: "in_game",
  OUT_GAME: "out_game"
};

// src/constants/systems.ts
var KAIRO_COMMAND_TARGET_ADDON_IDS = {
  BROADCAST: "_kBroadcast",
  WEREWOLF_GAMEMANAGER: "werewolf-gamemanager"
};

// src/game/events/BaseEventManager.ts
var BaseEventManager = class {
  constructor() {
  }
};

// src/game/ingame/events/BlockExplode.ts
import { world } from "@minecraft/server";

// src/game/events/BaseEventHandler.ts
var BaseEventHandler = class {
  constructor(eventManager) {
    this.eventManager = eventManager;
    this.isSubscribed = false;
  }
  async _handleBefore(ev) {
    await this.handleBefore?.(ev);
  }
  async _handleAfter(ev) {
    await this.handleAfter?.(ev);
  }
  subscribe() {
    if (this.isSubscribed)
      return;
    if (this.beforeEvent) {
      this.boundBefore = (ev) => void this._handleBefore(ev);
      this.beforeEvent.subscribe(this.boundBefore);
    }
    if (this.afterEvent) {
      this.boundAfter = (ev) => void this._handleAfter(ev);
      this.afterEvent.subscribe(this.boundAfter);
    }
    this.isSubscribed = true;
  }
  unsubscribe() {
    if (!this.isSubscribed)
      return;
    if (this.beforeEvent && this.boundBefore) {
      this.beforeEvent.unsubscribe(this.boundBefore);
    }
    if (this.afterEvent && this.boundAfter) {
      this.afterEvent.unsubscribe(this.boundAfter);
    }
    this.isSubscribed = false;
  }
};

// src/game/ingame/events/InGameEventHandler.ts
var InGameEventHandler = class _InGameEventHandler extends BaseEventHandler {
  static {
    this.afterHooks = /* @__PURE__ */ new Map();
  }
  static {
    this.beforeHooks = /* @__PURE__ */ new Map();
  }
  static afterEvent(hook) {
    const ctor = this;
    const hooks = _InGameEventHandler.afterHooks.get(ctor) ?? [];
    hooks.push(hook);
    _InGameEventHandler.afterHooks.set(ctor, hooks);
  }
  static beforeEvent(hook) {
    const ctor = this;
    const hooks = _InGameEventHandler.beforeHooks.get(ctor) ?? [];
    hooks.push(hook);
    _InGameEventHandler.beforeHooks.set(ctor, hooks);
  }
  async _handleAfter(ev) {
    await super._handleAfter(ev);
    const ctx = await this.buildContextIfInGame(ev);
    if (!ctx)
      return;
    const hooks = _InGameEventHandler.afterHooks.get(this.constructor) ?? [];
    for (const hook of hooks) {
      await hook(ev, ctx);
    }
  }
  async _handleBefore(ev) {
    await super._handleBefore(ev);
    const ctx = await this.buildContextIfInGame(ev);
    if (!ctx)
      return;
    const hooks = _InGameEventHandler.beforeHooks.get(this.constructor) ?? [];
    for (const hook of hooks) {
      await hook(ev, ctx);
    }
  }
  async buildContextIfInGame(ev) {
    const mgr = this.eventManager.getInGameManager();
    if (mgr.getCurrentPhase() !== "InGame" /* InGame */) {
      return null;
    }
    const gameData = await mgr.getWerewolfGameData();
    if (!gameData)
      return null;
    return {
      playersData: mgr.getSelfPlayersData(),
      werewolfGameData: gameData,
      ingameConstants: mgr.getIngameConstants()
    };
  }
};

// src/game/ingame/events/BlockExplode.ts
var InGameBlockExplode = class _InGameBlockExplode extends InGameEventHandler {
  constructor(inGameEventManager) {
    super(inGameEventManager);
    this.inGameEventManager = inGameEventManager;
    this.afterEvent = world.afterEvents.blockExplode;
  }
  static create(inGameEventManager) {
    return new _InGameBlockExplode(inGameEventManager);
  }
};

// src/game/ingame/events/ButtonPush.ts
import { world as world2 } from "@minecraft/server";
var InGameButtonPush = class _InGameButtonPush extends InGameEventHandler {
  constructor(inGameEventManager) {
    super(inGameEventManager);
    this.inGameEventManager = inGameEventManager;
    this.afterEvent = world2.afterEvents.buttonPush;
  }
  static create(inGameEventManager) {
    return new _InGameButtonPush(inGameEventManager);
  }
};

// src/game/ingame/events/DataDrivenEntityTrigger.ts
import { world as world3 } from "@minecraft/server";
var InGameDataDrivenEntityTrigger = class _InGameDataDrivenEntityTrigger extends InGameEventHandler {
  constructor(inGameEventManager) {
    super(inGameEventManager);
    this.inGameEventManager = inGameEventManager;
    this.afterEvent = world3.afterEvents.dataDrivenEntityTrigger;
  }
  static create(inGameEventManager) {
    return new _InGameDataDrivenEntityTrigger(inGameEventManager);
  }
};

// src/game/ingame/events/EffectAdd.ts
import { world as world4 } from "@minecraft/server";
var InGameEffectAdd = class _InGameEffectAdd extends InGameEventHandler {
  constructor(inGameEventManager) {
    super(inGameEventManager);
    this.inGameEventManager = inGameEventManager;
    this.beforeEvent = world4.beforeEvents.effectAdd;
    this.afterEvent = world4.afterEvents.effectAdd;
  }
  static create(inGameEventManager) {
    return new _InGameEffectAdd(inGameEventManager);
  }
};

// src/game/ingame/events/EntityDie.ts
import { world as world5 } from "@minecraft/server";
var InGameEntityDie = class _InGameEntityDie extends InGameEventHandler {
  constructor(inGameEventManager) {
    super(inGameEventManager);
    this.inGameEventManager = inGameEventManager;
    this.afterEvent = world5.afterEvents.entityDie;
  }
  static create(inGameEventManager) {
    return new _InGameEntityDie(inGameEventManager);
  }
};

// src/game/ingame/events/EntityHealthChanged.ts
import { world as world6 } from "@minecraft/server";
var InGameEntityHealthChanged = class _InGameEntityHealthChanged extends InGameEventHandler {
  constructor(inGameEventManager) {
    super(inGameEventManager);
    this.inGameEventManager = inGameEventManager;
    this.afterEvent = world6.afterEvents.entityHealthChanged;
  }
  static create(inGameEventManager) {
    return new _InGameEntityHealthChanged(inGameEventManager);
  }
};

// src/game/ingame/events/EntityHitBlock.ts
import { world as world7 } from "@minecraft/server";
var InGameEntityHitBlock = class _InGameEntityHitBlock extends InGameEventHandler {
  constructor(inGameEventManager) {
    super(inGameEventManager);
    this.inGameEventManager = inGameEventManager;
    this.afterEvent = world7.afterEvents.entityHitBlock;
  }
  static create(inGameEventManager) {
    return new _InGameEntityHitBlock(inGameEventManager);
  }
};

// src/game/ingame/events/EntityHitEntity.ts
import { world as world8 } from "@minecraft/server";
var InGameEntityHitEntity = class _InGameEntityHitEntity extends InGameEventHandler {
  constructor(inGameEventManager) {
    super(inGameEventManager);
    this.inGameEventManager = inGameEventManager;
    this.afterEvent = world8.afterEvents.entityHitEntity;
  }
  static create(inGameEventManager) {
    return new _InGameEntityHitEntity(inGameEventManager);
  }
};

// src/game/ingame/events/EntityHurt.ts
import { world as world9 } from "@minecraft/server";
var InGameEntityHurt = class _InGameEntityHurt extends InGameEventHandler {
  constructor(inGameEventManager) {
    super(inGameEventManager);
    this.inGameEventManager = inGameEventManager;
    this.afterEvent = world9.afterEvents.entityHurt;
  }
  static create(inGameEventManager) {
    return new _InGameEntityHurt(inGameEventManager);
  }
};

// src/game/ingame/events/EntityLoad.ts
import { world as world10 } from "@minecraft/server";
var InGameEntityLoad = class _InGameEntityLoad extends InGameEventHandler {
  constructor(inGameEventManager) {
    super(inGameEventManager);
    this.inGameEventManager = inGameEventManager;
    this.afterEvent = world10.afterEvents.entityLoad;
  }
  static create(inGameEventManager) {
    return new _InGameEntityLoad(inGameEventManager);
  }
};

// src/game/ingame/events/EntityRemove.ts
import { world as world11 } from "@minecraft/server";
var InGameEntityRemove = class _InGameEntityRemove extends InGameEventHandler {
  constructor(inGameEventManager) {
    super(inGameEventManager);
    this.inGameEventManager = inGameEventManager;
    this.beforeEvent = world11.beforeEvents.entityRemove;
    this.afterEvent = world11.afterEvents.entityRemove;
  }
  static create(inGameEventManager) {
    return new _InGameEntityRemove(inGameEventManager);
  }
};

// src/game/ingame/events/EntitySpawn.ts
import { world as world12 } from "@minecraft/server";
var InGameEntitySpawn = class _InGameEntitySpawn extends InGameEventHandler {
  constructor(inGameEventManager) {
    super(inGameEventManager);
    this.inGameEventManager = inGameEventManager;
    this.afterEvent = world12.afterEvents.entitySpawn;
  }
  static create(inGameEventManager) {
    return new _InGameEntitySpawn(inGameEventManager);
  }
};

// src/game/ingame/events/Explosion.ts
import { world as world13 } from "@minecraft/server";
var InGameExplosion = class _InGameExplosion extends InGameEventHandler {
  constructor(inGameEventManager) {
    super(inGameEventManager);
    this.inGameEventManager = inGameEventManager;
    this.beforeEvent = world13.beforeEvents.explosion;
    this.afterEvent = world13.afterEvents.explosion;
  }
  static create(inGameEventManager) {
    return new _InGameExplosion(inGameEventManager);
  }
};

// src/game/ingame/events/GameRuleChange.ts
import { world as world14 } from "@minecraft/server";
var InGameGameRuleChange = class _InGameGameRuleChange extends InGameEventHandler {
  constructor(inGameEventManager) {
    super(inGameEventManager);
    this.inGameEventManager = inGameEventManager;
    this.afterEvent = world14.afterEvents.gameRuleChange;
  }
  static create(inGameEventManager) {
    return new _InGameGameRuleChange(inGameEventManager);
  }
};

// src/game/ingame/events/ItemCompleteUse.ts
import { world as world15 } from "@minecraft/server";
var InGameItemCompleteUse = class _InGameItemCompleteUse extends InGameEventHandler {
  constructor(inGameEventManager) {
    super(inGameEventManager);
    this.inGameEventManager = inGameEventManager;
    this.afterEvent = world15.afterEvents.itemCompleteUse;
  }
  static create(inGameEventManager) {
    return new _InGameItemCompleteUse(inGameEventManager);
  }
};

// src/game/ingame/events/ItemReleaseUse.ts
import { world as world16 } from "@minecraft/server";
var InGameItemReleaseUse = class _InGameItemReleaseUse extends InGameEventHandler {
  constructor(inGameEventManager) {
    super(inGameEventManager);
    this.inGameEventManager = inGameEventManager;
    this.afterEvent = world16.afterEvents.itemReleaseUse;
  }
  static create(inGameEventManager) {
    return new _InGameItemReleaseUse(inGameEventManager);
  }
};

// src/game/ingame/events/ItemStartUse.ts
import { world as world17 } from "@minecraft/server";
var InGameItemStartUse = class _InGameItemStartUse extends InGameEventHandler {
  constructor(inGameEventManager) {
    super(inGameEventManager);
    this.inGameEventManager = inGameEventManager;
    this.afterEvent = world17.afterEvents.itemStartUse;
  }
  static create(inGameEventManager) {
    return new _InGameItemStartUse(inGameEventManager);
  }
};

// src/game/ingame/events/ItemStartUseOn.ts
import { world as world18 } from "@minecraft/server";
var InGameItemStartUseOn = class _InGameItemStartUseOn extends InGameEventHandler {
  constructor(inGameEventManager) {
    super(inGameEventManager);
    this.inGameEventManager = inGameEventManager;
    this.afterEvent = world18.afterEvents.itemStartUseOn;
  }
  static create(inGameEventManager) {
    return new _InGameItemStartUseOn(inGameEventManager);
  }
};

// src/game/ingame/events/ItemStopUse.ts
import { world as world19 } from "@minecraft/server";
var InGameItemStopUse = class _InGameItemStopUse extends InGameEventHandler {
  constructor(inGameEventManager) {
    super(inGameEventManager);
    this.inGameEventManager = inGameEventManager;
    this.afterEvent = world19.afterEvents.itemStopUse;
  }
  static create(inGameEventManager) {
    return new _InGameItemStopUse(inGameEventManager);
  }
};

// src/game/ingame/events/ItemStopUseOn.ts
import { world as world20 } from "@minecraft/server";
var InGameItemStopUseOn = class _InGameItemStopUseOn extends InGameEventHandler {
  constructor(inGameEventManager) {
    super(inGameEventManager);
    this.inGameEventManager = inGameEventManager;
    this.afterEvent = world20.afterEvents.itemStopUseOn;
  }
  static create(inGameEventManager) {
    return new _InGameItemStopUseOn(inGameEventManager);
  }
};

// src/game/ingame/events/ItemUse.ts
import { world as world21 } from "@minecraft/server";
var InGameItemUse = class _InGameItemUse extends InGameEventHandler {
  constructor(inGameEventManager) {
    super(inGameEventManager);
    this.inGameEventManager = inGameEventManager;
    this.beforeEvent = world21.beforeEvents.itemUse;
    this.afterEvent = world21.afterEvents.itemUse;
  }
  static create(inGameEventManager) {
    return new _InGameItemUse(inGameEventManager);
  }
};

// src/game/ingame/events/LeverAction.ts
import { world as world22 } from "@minecraft/server";
var InGameLeverAction = class _InGameLeverAction extends InGameEventHandler {
  constructor(inGameEventManager) {
    super(inGameEventManager);
    this.inGameEventManager = inGameEventManager;
    this.afterEvent = world22.afterEvents.leverAction;
  }
  static create(inGameEventManager) {
    return new _InGameLeverAction(inGameEventManager);
  }
};

// src/game/ingame/events/PistonActivate.ts
import { world as world23 } from "@minecraft/server";
var InGamePistonActivate = class _InGamePistonActivate extends InGameEventHandler {
  constructor(inGameEventManager) {
    super(inGameEventManager);
    this.inGameEventManager = inGameEventManager;
    this.afterEvent = world23.afterEvents.pistonActivate;
  }
  static create(inGameEventManager) {
    return new _InGamePistonActivate(inGameEventManager);
  }
};

// src/game/ingame/events/PlayerBreakBlock.ts
import { world as world24 } from "@minecraft/server";
var InGamePlayerBreakBlock = class _InGamePlayerBreakBlock extends InGameEventHandler {
  constructor(inGameEventManager) {
    super(inGameEventManager);
    this.inGameEventManager = inGameEventManager;
    this.beforeEvent = world24.beforeEvents.playerBreakBlock;
    this.afterEvent = world24.afterEvents.playerBreakBlock;
  }
  static create(inGameEventManager) {
    return new _InGamePlayerBreakBlock(inGameEventManager);
  }
};

// src/game/ingame/events/PlayerButtonInput.ts
import { world as world25 } from "@minecraft/server";
var InGamePlayerButtonInput = class _InGamePlayerButtonInput extends InGameEventHandler {
  constructor(inGameEventManager) {
    super(inGameEventManager);
    this.inGameEventManager = inGameEventManager;
    this.afterEvent = world25.afterEvents.playerButtonInput;
  }
  static create(inGameEventManager) {
    return new _InGamePlayerButtonInput(inGameEventManager);
  }
};

// src/game/ingame/events/PlayerDimensionChange.ts
import { world as world26 } from "@minecraft/server";
var InGamePlayerDimensionChange = class _InGamePlayerDimensionChange extends InGameEventHandler {
  constructor(inGameEventManager) {
    super(inGameEventManager);
    this.inGameEventManager = inGameEventManager;
    this.afterEvent = world26.afterEvents.playerDimensionChange;
  }
  static create(inGameEventManager) {
    return new _InGamePlayerDimensionChange(inGameEventManager);
  }
};

// src/game/ingame/events/PlayerEmote.ts
import { world as world27 } from "@minecraft/server";
var InGamePlayerEmote = class _InGamePlayerEmote extends InGameEventHandler {
  constructor(inGameEventManager) {
    super(inGameEventManager);
    this.inGameEventManager = inGameEventManager;
    this.afterEvent = world27.afterEvents.playerEmote;
  }
  static create(inGameEventManager) {
    return new _InGamePlayerEmote(inGameEventManager);
  }
};

// src/game/ingame/events/PlayerGameModeChange.ts
import {
  world as world28
} from "@minecraft/server";
var InGamePlayerGameModeChange = class _InGamePlayerGameModeChange extends InGameEventHandler {
  constructor(inGameEventManager) {
    super(inGameEventManager);
    this.inGameEventManager = inGameEventManager;
    this.beforeEvent = world28.beforeEvents.playerGameModeChange;
    this.afterEvent = world28.afterEvents.playerGameModeChange;
  }
  static create(inGameEventManager) {
    return new _InGamePlayerGameModeChange(inGameEventManager);
  }
};

// src/game/ingame/events/PlayerHotbarSelectedSlotChange.ts
import { world as world29 } from "@minecraft/server";
var InGamePlayerHotbarSelectedSlotChange = class _InGamePlayerHotbarSelectedSlotChange extends InGameEventHandler {
  constructor(inGameEventManager) {
    super(inGameEventManager);
    this.inGameEventManager = inGameEventManager;
    this.afterEvent = world29.afterEvents.playerHotbarSelectedSlotChange;
  }
  static create(inGameEventManager) {
    return new _InGamePlayerHotbarSelectedSlotChange(inGameEventManager);
  }
};

// src/game/ingame/events/PlayerInputModeChange.ts
import { world as world30 } from "@minecraft/server";
var InGamePlayerInputModeChange = class _InGamePlayerInputModeChange extends InGameEventHandler {
  constructor(inGameEventManager) {
    super(inGameEventManager);
    this.inGameEventManager = inGameEventManager;
    this.afterEvent = world30.afterEvents.playerInputModeChange;
  }
  static create(inGameEventManager) {
    return new _InGamePlayerInputModeChange(inGameEventManager);
  }
};

// src/game/ingame/events/PlayerInputPermissionCategoryChange.ts
import { world as world31 } from "@minecraft/server";
var InGamePlayerInputPermissionCategoryChange = class _InGamePlayerInputPermissionCategoryChange extends InGameEventHandler {
  constructor(inGameEventManager) {
    super(inGameEventManager);
    this.inGameEventManager = inGameEventManager;
    this.afterEvent = world31.afterEvents.playerInputPermissionCategoryChange;
  }
  static create(inGameEventManager) {
    return new _InGamePlayerInputPermissionCategoryChange(inGameEventManager);
  }
};

// src/game/ingame/events/PlayerInteractWithBlock.ts
import {
  world as world32
} from "@minecraft/server";
var InGamePlayerInteractWithBlock = class _InGamePlayerInteractWithBlock extends InGameEventHandler {
  constructor(inGameEventManager) {
    super(inGameEventManager);
    this.inGameEventManager = inGameEventManager;
    this.beforeEvent = world32.beforeEvents.playerInteractWithBlock;
    this.afterEvent = world32.afterEvents.playerInteractWithBlock;
  }
  static create(inGameEventManager) {
    return new _InGamePlayerInteractWithBlock(inGameEventManager);
  }
};

// src/game/ingame/events/PlayerInteractWithEntity.ts
import {
  world as world33
} from "@minecraft/server";
var InGamePlayerInteractWithEntity = class _InGamePlayerInteractWithEntity extends InGameEventHandler {
  constructor(inGameEventManager) {
    super(inGameEventManager);
    this.inGameEventManager = inGameEventManager;
    this.beforeEvent = world33.beforeEvents.playerInteractWithEntity;
    this.afterEvent = world33.afterEvents.playerInteractWithEntity;
  }
  static create(inGameEventManager) {
    return new _InGamePlayerInteractWithEntity(inGameEventManager);
  }
};

// src/game/ingame/events/PlayerInventoryItemChange.ts
import { world as world34 } from "@minecraft/server";
var InGamePlayerInventoryItemChange = class _InGamePlayerInventoryItemChange extends InGameEventHandler {
  constructor(inGameEventManager) {
    super(inGameEventManager);
    this.inGameEventManager = inGameEventManager;
    this.afterEvent = world34.afterEvents.playerInventoryItemChange;
  }
  static create(inGameEventManager) {
    return new _InGamePlayerInventoryItemChange(inGameEventManager);
  }
};

// src/game/ingame/events/PlayerJoin.ts
import { world as world35 } from "@minecraft/server";
var InGamePlayerJoin = class _InGamePlayerJoin extends InGameEventHandler {
  constructor(inGameEventManager) {
    super(inGameEventManager);
    this.inGameEventManager = inGameEventManager;
    this.afterEvent = world35.afterEvents.playerJoin;
  }
  static create(inGameEventManager) {
    return new _InGamePlayerJoin(inGameEventManager);
  }
};

// src/game/ingame/events/PlayerLeave.ts
import { world as world36 } from "@minecraft/server";
var InGamePlayerLeave = class _InGamePlayerLeave extends InGameEventHandler {
  constructor(inGameEventManager) {
    super(inGameEventManager);
    this.inGameEventManager = inGameEventManager;
    this.beforeEvent = world36.beforeEvents.playerLeave;
    this.afterEvent = world36.afterEvents.playerLeave;
  }
  static create(inGameEventManager) {
    return new _InGamePlayerLeave(inGameEventManager);
  }
};

// src/game/ingame/events/PlayerPlaceBlock.ts
import { world as world37 } from "@minecraft/server";
var InGamePlayerPlaceBlock = class _InGamePlayerPlaceBlock extends InGameEventHandler {
  constructor(inGameEventManager) {
    super(inGameEventManager);
    this.inGameEventManager = inGameEventManager;
    this.afterEvent = world37.afterEvents.playerPlaceBlock;
  }
  static create(inGameEventManager) {
    return new _InGamePlayerPlaceBlock(inGameEventManager);
  }
};

// src/game/ingame/events/PlayerSpawn.ts
import { world as world38 } from "@minecraft/server";
var InGamePlayerSpawn = class _InGamePlayerSpawn extends InGameEventHandler {
  constructor(inGameEventManager) {
    super(inGameEventManager);
    this.inGameEventManager = inGameEventManager;
    this.afterEvent = world38.afterEvents.playerSpawn;
  }
  static create(inGameEventManager) {
    return new _InGamePlayerSpawn(inGameEventManager);
  }
};

// src/game/ingame/events/PressurePlatePop.ts
import { world as world39 } from "@minecraft/server";
var InGamePressurePlatePop = class _InGamePressurePlatePop extends InGameEventHandler {
  constructor(inGameEventManager) {
    super(inGameEventManager);
    this.inGameEventManager = inGameEventManager;
    this.afterEvent = world39.afterEvents.pressurePlatePop;
  }
  static create(inGameEventManager) {
    return new _InGamePressurePlatePop(inGameEventManager);
  }
};

// src/game/ingame/events/PressurePlatePush.ts
import { world as world40 } from "@minecraft/server";
var InGamePressurePlatePush = class _InGamePressurePlatePush extends InGameEventHandler {
  constructor(inGameEventManager) {
    super(inGameEventManager);
    this.inGameEventManager = inGameEventManager;
    this.afterEvent = world40.afterEvents.pressurePlatePush;
  }
  static create(inGameEventManager) {
    return new _InGamePressurePlatePush(inGameEventManager);
  }
};

// src/game/ingame/events/ProjectileHitBlock.ts
import { world as world41 } from "@minecraft/server";
var InGameProjectileHitBlock = class _InGameProjectileHitBlock extends InGameEventHandler {
  constructor(inGameEventManager) {
    super(inGameEventManager);
    this.inGameEventManager = inGameEventManager;
    this.afterEvent = world41.afterEvents.projectileHitBlock;
  }
  static create(inGameEventManager) {
    return new _InGameProjectileHitBlock(inGameEventManager);
  }
};

// src/game/ingame/events/ProjectileHitEntity.ts
import { world as world42 } from "@minecraft/server";
var InGameProjectileHitEntity = class _InGameProjectileHitEntity extends InGameEventHandler {
  constructor(inGameEventManager) {
    super(inGameEventManager);
    this.inGameEventManager = inGameEventManager;
    this.afterEvent = world42.afterEvents.projectileHitEntity;
  }
  static create(inGameEventManager) {
    return new _InGameProjectileHitEntity(inGameEventManager);
  }
};

// src/game/ingame/events/TargetBlockHit.ts
import { world as world43 } from "@minecraft/server";
var InGameTargetBlockHit = class _InGameTargetBlockHit extends InGameEventHandler {
  constructor(inGameEventManager) {
    super(inGameEventManager);
    this.inGameEventManager = inGameEventManager;
    this.afterEvent = world43.afterEvents.targetBlockHit;
  }
  static create(inGameEventManager) {
    return new _InGameTargetBlockHit(inGameEventManager);
  }
};

// src/game/ingame/events/WeatherChange.ts
import { world as world44 } from "@minecraft/server";
var InGameWeatherChange = class _InGameWeatherChange extends InGameEventHandler {
  constructor(inGameEventManager) {
    super(inGameEventManager);
    this.inGameEventManager = inGameEventManager;
    this.beforeEvent = world44.beforeEvents.weatherChange;
    this.afterEvent = world44.afterEvents.weatherChange;
  }
  static create(inGameEventManager) {
    return new _InGameWeatherChange(inGameEventManager);
  }
};

// src/game/ingame/events/InGameEventManager.ts
var InGameEventManager = class _InGameEventManager extends BaseEventManager {
  constructor(inGameManager) {
    super();
    this.inGameManager = inGameManager;
    this.blockExplode = InGameBlockExplode.create(this);
    this.buttonPush = InGameButtonPush.create(this);
    this.dataDrivenEntityTrigger = InGameDataDrivenEntityTrigger.create(this);
    this.effectAdd = InGameEffectAdd.create(this);
    this.entityDie = InGameEntityDie.create(this);
    this.entityHealthChanged = InGameEntityHealthChanged.create(this);
    this.entityHitBlock = InGameEntityHitBlock.create(this);
    this.entityHitEntity = InGameEntityHitEntity.create(this);
    this.entityHurt = InGameEntityHurt.create(this);
    this.entityLoad = InGameEntityLoad.create(this);
    this.entityRemove = InGameEntityRemove.create(this);
    this.entitySpawn = InGameEntitySpawn.create(this);
    this.explosion = InGameExplosion.create(this);
    this.gameRuleChange = InGameGameRuleChange.create(this);
    this.itemCompleteUse = InGameItemCompleteUse.create(this);
    this.itemReleaseUse = InGameItemReleaseUse.create(this);
    this.itemStartUse = InGameItemStartUse.create(this);
    this.itemStartUseOn = InGameItemStartUseOn.create(this);
    this.itemStopUse = InGameItemStopUse.create(this);
    this.itemStopUseOn = InGameItemStopUseOn.create(this);
    this.itemUse = InGameItemUse.create(this);
    this.leverAction = InGameLeverAction.create(this);
    this.pistonActivate = InGamePistonActivate.create(this);
    this.playerBreakBlock = InGamePlayerBreakBlock.create(this);
    this.playerButtonInput = InGamePlayerButtonInput.create(this);
    this.playerDimensionChange = InGamePlayerDimensionChange.create(this);
    this.playerEmote = InGamePlayerEmote.create(this);
    this.playerGameModeChange = InGamePlayerGameModeChange.create(this);
    this.playerHotbarSelectedSlotChange = InGamePlayerHotbarSelectedSlotChange.create(this);
    this.playerInputModeChange = InGamePlayerInputModeChange.create(this);
    this.playerInputPermissionCategoryChange = InGamePlayerInputPermissionCategoryChange.create(this);
    this.playerInteractWithBlock = InGamePlayerInteractWithBlock.create(this);
    this.playerInteractWithEntity = InGamePlayerInteractWithEntity.create(this);
    this.playerInventoryItemChange = InGamePlayerInventoryItemChange.create(this);
    this.playerJoin = InGamePlayerJoin.create(this);
    this.playerLeave = InGamePlayerLeave.create(this);
    this.playerPlaceBlock = InGamePlayerPlaceBlock.create(this);
    this.playerSpawn = InGamePlayerSpawn.create(this);
    this.pressurePlatePop = InGamePressurePlatePop.create(this);
    this.pressurePlatePush = InGamePressurePlatePush.create(this);
    this.projectileHitBlock = InGameProjectileHitBlock.create(this);
    this.projectileHitEntity = InGameProjectileHitEntity.create(this);
    this.targetBlockHit = InGameTargetBlockHit.create(this);
    this.weatherChange = InGameWeatherChange.create(this);
  }
  static create(inGameManager) {
    return new _InGameEventManager(inGameManager);
  }
  subscribeAll() {
    this.blockExplode.subscribe();
    this.buttonPush.subscribe();
    this.dataDrivenEntityTrigger.subscribe();
    this.effectAdd.subscribe();
    this.entityDie.subscribe();
    this.entityHealthChanged.subscribe();
    this.entityHitBlock.subscribe();
    this.entityHitEntity.subscribe();
    this.entityHurt.subscribe();
    this.entityLoad.subscribe();
    this.entityRemove.subscribe();
    this.entitySpawn.subscribe();
    this.explosion.subscribe();
    this.gameRuleChange.subscribe();
    this.itemCompleteUse.subscribe();
    this.itemReleaseUse.subscribe();
    this.itemStartUse.subscribe();
    this.itemStartUseOn.subscribe();
    this.itemStopUse.subscribe();
    this.itemStopUseOn.subscribe();
    this.itemUse.subscribe();
    this.leverAction.subscribe();
    this.pistonActivate.subscribe();
    this.playerBreakBlock.subscribe();
    this.playerButtonInput.subscribe();
    this.playerDimensionChange.subscribe();
    this.playerEmote.subscribe();
    this.playerGameModeChange.subscribe();
    this.playerHotbarSelectedSlotChange.subscribe();
    this.playerInputModeChange.subscribe();
    this.playerInputPermissionCategoryChange.subscribe();
    this.playerInteractWithBlock.subscribe();
    this.playerInteractWithEntity.subscribe();
    this.playerInventoryItemChange.subscribe();
    this.playerJoin.subscribe();
    this.playerLeave.subscribe();
    this.playerPlaceBlock.subscribe();
    this.playerSpawn.subscribe();
    this.pressurePlatePop.subscribe();
    this.pressurePlatePush.subscribe();
    this.projectileHitBlock.subscribe();
    this.projectileHitEntity.subscribe();
    this.targetBlockHit.subscribe();
    this.weatherChange.subscribe();
  }
  unsubscribeAll() {
    this.blockExplode.unsubscribe();
    this.buttonPush.unsubscribe();
    this.dataDrivenEntityTrigger.unsubscribe();
    this.effectAdd.unsubscribe();
    this.entityDie.unsubscribe();
    this.entityHealthChanged.unsubscribe();
    this.entityHitBlock.unsubscribe();
    this.entityHitEntity.unsubscribe();
    this.entityHurt.unsubscribe();
    this.entityLoad.unsubscribe();
    this.entityRemove.unsubscribe();
    this.entitySpawn.unsubscribe();
    this.explosion.unsubscribe();
    this.gameRuleChange.unsubscribe();
    this.itemCompleteUse.unsubscribe();
    this.itemReleaseUse.unsubscribe();
    this.itemStartUse.unsubscribe();
    this.itemStartUseOn.unsubscribe();
    this.itemStopUse.unsubscribe();
    this.itemStopUseOn.unsubscribe();
    this.itemUse.unsubscribe();
    this.leverAction.unsubscribe();
    this.pistonActivate.unsubscribe();
    this.playerBreakBlock.unsubscribe();
    this.playerButtonInput.unsubscribe();
    this.playerDimensionChange.unsubscribe();
    this.playerEmote.unsubscribe();
    this.playerGameModeChange.unsubscribe();
    this.playerHotbarSelectedSlotChange.unsubscribe();
    this.playerInputModeChange.unsubscribe();
    this.playerInputPermissionCategoryChange.unsubscribe();
    this.playerInteractWithBlock.unsubscribe();
    this.playerInteractWithEntity.unsubscribe();
    this.playerInventoryItemChange.unsubscribe();
    this.playerJoin.unsubscribe();
    this.playerLeave.unsubscribe();
    this.playerPlaceBlock.unsubscribe();
    this.playerSpawn.unsubscribe();
    this.pressurePlatePop.unsubscribe();
    this.pressurePlatePush.unsubscribe();
    this.projectileHitBlock.unsubscribe();
    this.projectileHitEntity.unsubscribe();
    this.targetBlockHit.unsubscribe();
    this.weatherChange.unsubscribe();
  }
  getInGameManager() {
    return this.inGameManager;
  }
};

// src/game/ingame/game/SkillManager.ts
import { KairoUtils } from "@kairo-ts/router";

// src/game/registry.ts
var defaultUpdateHandlers = {
  onTickUpdate: () => {
  },
  onSecondUpdate: () => {
  }
};
var registry = {
  roles: [],
  factions: [],
  roleGroups: [],
  settings: [],
  playerData: { playerId: "" },
  updateHandlers: defaultUpdateHandlers,
  roleSkillHandlers: {}
};
var registerDefinitions = (definitions) => {
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
var registerPlayerDataInRegistry = (data) => {
  registry.playerData = data;
};
var registerUpdateHandlers = (handlers) => {
  registry.updateHandlers = { ...registry.updateHandlers, ...handlers };
};
var registerRoleSkillHandlersInRegistry = (handlers) => {
  registry.roleSkillHandlers = {
    ...registry.roleSkillHandlers,
    ...handlers
  };
};
var RoleRegistry = class {
  constructor() {
  }
  static create() {
    return new RoleRegistry();
  }
  register(roles) {
    registerDefinitions({ roles });
  }
};
var FactionRegistry = class {
  constructor() {
  }
  static create() {
    return new FactionRegistry();
  }
  register(factions) {
    registerDefinitions({ factions });
  }
};
var RoleGroupRegistry = class {
  constructor() {
  }
  static create() {
    return new RoleGroupRegistry();
  }
  register(roleGroups) {
    registerDefinitions({ roleGroups });
  }
};
var SettingRegistry = class {
  constructor() {
  }
  static create() {
    return new SettingRegistry();
  }
  register(settings) {
    registerDefinitions({ settings });
  }
};
var PlayerRegistry = class {
  constructor() {
  }
  static create() {
    return new PlayerRegistry();
  }
  register(data) {
    registerPlayerDataInRegistry(data);
  }
};
var UpdateHandlerRegistry = class {
  constructor() {
  }
  static create() {
    return new UpdateHandlerRegistry();
  }
  register(handlers) {
    registerUpdateHandlers(handlers);
  }
};
var RoleSkillHandlerRegistry = class {
  constructor() {
  }
  static create() {
    return new RoleSkillHandlerRegistry();
  }
  register(handlers) {
    registerRoleSkillHandlersInRegistry(handlers);
  }
};
var DefinitionRegistry = class _DefinitionRegistry {
  constructor() {
    this.roleRegistry = RoleRegistry.create();
    this.factionRegistry = FactionRegistry.create();
    this.roleGroupRegistry = RoleGroupRegistry.create();
    this.settingRegistry = SettingRegistry.create();
    this.playerRegistry = PlayerRegistry.create();
    this.updateHandlerRegistry = UpdateHandlerRegistry.create();
    this.roleSkillHandlerRegistry = RoleSkillHandlerRegistry.create();
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new _DefinitionRegistry();
    }
    return this.instance;
  }
  static get roles() {
    return this.getInstance().roleRegistry;
  }
  static get factions() {
    return this.getInstance().factionRegistry;
  }
  static get roleGroups() {
    return this.getInstance().roleGroupRegistry;
  }
  static get settings() {
    return this.getInstance().settingRegistry;
  }
  static get player() {
    return this.getInstance().playerRegistry;
  }
  static get updateHandlers() {
    return this.getInstance().updateHandlerRegistry;
  }
  static get roleSkillHandlers() {
    return this.getInstance().roleSkillHandlerRegistry;
  }
};
DefinitionRegistry.instance = null;
var getRegisteredRoles = () => registry.roles;
var getRegisteredFactions = () => registry.factions;
var getRegisteredRoleGroups = () => registry.roleGroups;
var getRegisteredSettings = () => registry.settings;
var getRegisteredPlayerData = () => registry.playerData;
var getRegisteredUpdateHandlers = () => registry.updateHandlers;
var getRegisteredRoleSkillHandlers = () => registry.roleSkillHandlers;

// src/game/ingame/game/SkillManager.ts
var SkillManager = class _SkillManager {
  constructor(inGameManager, roles) {
    this.inGameManager = inGameManager;
    this.handlersByRoleId = /* @__PURE__ */ new Map();
    const roleSkillHandlers = getRegisteredRoleSkillHandlers();
    for (const role of roles) {
      const skillHandlers = roleSkillHandlers[role.id];
      if (!skillHandlers)
        continue;
      const map = /* @__PURE__ */ new Map();
      for (const [skillId, handler] of Object.entries(skillHandlers)) {
        if (!handler)
          continue;
        map.set(skillId, handler);
      }
      this.handlersByRoleId.set(role.id, map);
    }
  }
  static create(inGameManager, roles) {
    return new _SkillManager(inGameManager, roles);
  }
  async emitPlayerEvent(playerId, eventType) {
    const werewolfGameData = await this.inGameManager.getWerewolfGameData();
    if (!werewolfGameData) {
      return KairoUtils.buildKairoResponse({}, false, "No game data");
    }
    const playerData = werewolfGameData.playersData.find((pd) => pd.player.id === playerId);
    if (!playerData?.role) {
      return KairoUtils.buildKairoResponse({}, false, "Player has no role");
    }
    const binding = playerData.role.handleGameEvents?.[eventType];
    if (!binding) {
      return KairoUtils.buildKairoResponse(
        { success: false },
        false,
        "No skill bound to this event"
      );
    }
    const handlerMap = this.handlersByRoleId.get(playerData.role.id);
    if (!handlerMap) {
      return KairoUtils.buildKairoResponse(
        { success: false },
        false,
        "No handlers for this role"
      );
    }
    const handler = handlerMap.get(binding.skillId);
    if (!handler) {
      return KairoUtils.buildKairoResponse(
        { success: false },
        false,
        `No handler for skill: ${binding.skillId}`
      );
    }
    const selfPlayerData = this.inGameManager.getSelfPlayerData(playerId);
    if (!selfPlayerData) {
      return KairoUtils.buildKairoResponse({}, false, "No self player data");
    }
    const ev = {
      playerData: selfPlayerData,
      playersData: this.inGameManager.getSelfPlayersData(),
      werewolfGameData,
      ingameConstants: this.inGameManager.getIngameConstants()
    };
    const success = await handler(ev);
    return KairoUtils.buildKairoResponse({ success });
  }
};

// src/game/ingame/InGameManager.ts
import { world as world45 } from "@minecraft/server";

// src/game/ingame/game/GameManager.ts
import { system } from "@minecraft/server";
var GameManager = class _GameManager {
  constructor(inGameManager, onTickHandler, onSecondHandler) {
    this.inGameManager = inGameManager;
    this.onTickHandler = onTickHandler;
    this.onSecondHandler = onSecondHandler;
    this.isRunning = false;
    this.tickIntervalId = null;
    this.secondIntervalId = null;
  }
  static create(inGameManager, handlers) {
    return new _GameManager(inGameManager, handlers.onTickUpdate, handlers.onSecondUpdate);
  }
  startGame() {
    if (this.isRunning)
      return;
    this.isRunning = true;
    this.tickIntervalId = system.runInterval(() => {
      if (!this.isRunning)
        return;
      this.runTick();
    }, 1);
    this.secondIntervalId = system.runInterval(() => {
      if (!this.isRunning)
        return;
      this.runSecond();
    }, 20);
  }
  finishGame() {
    if (!this.isRunning)
      return;
    if (this.tickIntervalId !== null) {
      system.clearRun(this.tickIntervalId);
      this.tickIntervalId = null;
    }
    if (this.secondIntervalId !== null) {
      system.clearRun(this.secondIntervalId);
      this.secondIntervalId = null;
    }
    this.isRunning = false;
  }
  runTick() {
    if (!this.onTickHandler)
      return;
    const ingameConstants = this.inGameManager.getIngameConstants();
    const playersData = this.inGameManager.getSelfPlayersData();
    for (const playerData of playersData) {
      this.onTickHandler({
        playerData,
        playersData,
        ingameConstants
      });
    }
  }
  runSecond() {
    if (!this.onSecondHandler)
      return;
    const ingameConstants = this.inGameManager.getIngameConstants();
    const playersData = this.inGameManager.getSelfPlayersData();
    for (const playerData of playersData) {
      this.onSecondHandler({
        playerData,
        playersData,
        ingameConstants
      });
    }
  }
};

// src/game/ingame/game/IngameConstants.ts
var IngameConstants = class _IngameConstants {
  constructor(ingameManager, ingameConstantsDTO) {
    this.ingameManager = ingameManager;
    this.data = ingameConstantsDTO;
  }
  static create(ingameManager, ingameConstantsDTO) {
    return new _IngameConstants(ingameManager, ingameConstantsDTO);
  }
  getRoleCount(roleId) {
    return this.data.roleComposition[roleId] ?? 0;
  }
  getEnabledRoleIds() {
    return Object.keys(this.data.roleComposition);
  }
  getEnabledRoles() {
    return this.getEnabledRoleIds().map((id) => this.getRoleById(id)).filter((r) => r !== void 0);
  }
  getDefinitions(type) {
    switch (type) {
      case "role":
        return Object.values(this.data.roleDefinitions).flat();
      case "faction":
        return Object.values(this.data.factionDefinitions).flat();
      case "roleGroup":
        return Object.values(this.data.roleGroupDefinitions).flat();
      case "setting":
        return Object.values(this.data.settingDefinitions).flat();
    }
  }
  getDefinitionsByAddon(type, addonId) {
    switch (type) {
      case "role":
        return this.data.roleDefinitions[addonId] ?? [];
      case "faction":
        return this.data.factionDefinitions[addonId] ?? [];
      case "roleGroup":
        return this.data.roleGroupDefinitions[addonId] ?? [];
      case "setting":
        return this.data.settingDefinitions[addonId] ?? [];
    }
  }
  getDefinitionsMap(type) {
    switch (type) {
      case "role":
        return this.toReadonlyMap(this.data.roleDefinitions);
      case "faction":
        return this.toReadonlyMap(this.data.factionDefinitions);
      case "roleGroup":
        return this.toReadonlyMap(this.data.roleGroupDefinitions);
      case "setting":
        return this.toReadonlyMap(this.data.settingDefinitions);
    }
  }
  getDefinitionById(type, id) {
    return this.getDefinitions(type).find((d) => d.id === id);
  }
  getRoleById(id) {
    return this.getDefinitionById("role", id);
  }
  getFactionById(id) {
    return this.getDefinitionById("faction", id);
  }
  getRoleGroupById(id) {
    return this.getDefinitionById("roleGroup", id);
  }
  getSettingById(id) {
    return this.getDefinitionById("setting", id);
  }
  toReadonlyMap(record) {
    return new Map(
      Object.entries(record).map(([addonId, defs]) => [addonId, defs])
    );
  }
};

// src/game/ingame/InGameManager.ts
import { KairoUtils as KairoUtils2 } from "@kairo-ts/router";
var InGameManager = class _InGameManager {
  constructor(systemManager, ingameConstantsDTO) {
    this.systemManager = systemManager;
    this.currentPhase = "Waiting" /* Waiting */;
    this.playerDataByPlayerId = /* @__PURE__ */ new Map();
    this.inGameEventManager = InGameEventManager.create(this);
    this.ingameConstants = IngameConstants.create(this, ingameConstantsDTO);
    const updateHandlers = getRegisteredUpdateHandlers();
    this.gameManager = GameManager.create(this, {
      onTickUpdate: updateHandlers.onTickUpdate,
      onSecondUpdate: updateHandlers.onSecondUpdate
    });
    this.skillManager = SkillManager.create(this, getRegisteredRoles());
    this.initSelfPlayersData();
  }
  static create(systemManager, ingameConstants) {
    return new _InGameManager(systemManager, ingameConstants);
  }
  getInGameEventManager() {
    return this.inGameEventManager;
  }
  async handlePlayerSkillTrigger(playerId, eventType) {
    return this.skillManager.emitPlayerEvent(playerId, eventType);
  }
  async getWerewolfGameData() {
    const kairoResponse = await KairoUtils2.sendKairoCommandAndWaitResponse(
      KAIRO_COMMAND_TARGET_ADDON_IDS.WEREWOLF_GAMEMANAGER,
      SCRIPT_EVENT_COMMAND_IDS.GET_WEREWOLF_GAME_DATA,
      {}
    );
    if (!kairoResponse.success)
      return null;
    return kairoResponse.data;
  }
  getRoleDefinition(roleId) {
    return getRegisteredRoles().find((role) => role.id === roleId);
  }
  getIngameConstants() {
    return this.ingameConstants;
  }
  getCurrentPhase() {
    return this.currentPhase;
  }
  setCurrentPhase(newPhase) {
    this.currentPhase = newPhase;
    switch (newPhase) {
      case "InGame" /* InGame */:
        this.gameManager.startGame();
        break;
      case "Result" /* Result */:
        this.gameManager.finishGame();
        break;
    }
  }
  getSelfPlayerData(playerId) {
    return this.playerDataByPlayerId.get(playerId);
  }
  getSelfPlayersData() {
    return Array.from(this.playerDataByPlayerId.values());
  }
  initSelfPlayersData() {
    const players = world45.getPlayers();
    const defaultPlayerData = getRegisteredPlayerData();
    for (const player of players) {
      this.playerDataByPlayerId.set(player.id, {
        ...defaultPlayerData,
        playerId: player.id
      });
    }
  }
};

// src/game/outgame/events/SciprtEventReceive.ts
import { system as system2 } from "@minecraft/server";
var OutGameScriptEventReceiveHandler = class _OutGameScriptEventReceiveHandler extends BaseEventHandler {
  constructor(outGameEventManager) {
    super(outGameEventManager);
    this.outGameEventManager = outGameEventManager;
    this.afterEvent = system2.afterEvents.scriptEventReceive;
  }
  static create(outGameEventManager) {
    return new _OutGameScriptEventReceiveHandler(outGameEventManager);
  }
  handleAfter(ev) {
    const { id, initiator, message, sourceBlock, sourceEntity, sourceType } = ev;
  }
};

// src/game/outgame/events/OutGameEventManager.ts
var OutGameEventManager = class _OutGameEventManager extends BaseEventManager {
  constructor(outGameManager) {
    super();
    this.outGameManager = outGameManager;
    this.scriptEventReceive = OutGameScriptEventReceiveHandler.create(this);
  }
  static create(outGameManager) {
    return new _OutGameEventManager(outGameManager);
  }
  subscribeAll() {
    this.scriptEventReceive.subscribe();
  }
  unsubscribeAll() {
    this.scriptEventReceive.unsubscribe();
  }
  getOutGameManager() {
    return this.outGameManager;
  }
};

// src/game/outgame/OutGameManager.ts
var OutGameManager = class _OutGameManager {
  constructor(systemManager) {
    this.systemManager = systemManager;
    this.outGameEventManager = OutGameEventManager.create(this);
  }
  static create(systemManager) {
    return new _OutGameManager(systemManager);
  }
  getOutGameEventManager() {
    return this.outGameEventManager;
  }
};

// src/game/system/definitions/BaseDefinitionRegistrationRequester.ts
import { KairoUtils as KairoUtils3 } from "@kairo-ts/router";
var BaseDefinitionRegistrationRequester = class {
  constructor(definitionManager, definitionType) {
    this.definitionManager = definitionManager;
    this.definitionType = definitionType;
  }
  request(definitions) {
    if (definitions.length === 0) {
      return;
    }
    KairoUtils3.sendKairoCommand(
      KAIRO_COMMAND_TARGET_ADDON_IDS.WEREWOLF_GAMEMANAGER,
      SCRIPT_EVENT_COMMAND_IDS.DEFINITIONS_REGISTRATION_REQUEST,
      {
        definitionType: this.definitionType,
        definitions
      }
    );
  }
};

// src/game/system/definitions/factions/FactionRegistrationRequester.ts
var FactionRegistrationRequester = class _FactionRegistrationRequester extends BaseDefinitionRegistrationRequester {
  constructor(definitionManager) {
    super(definitionManager, "faction");
  }
  static create(definitionManager) {
    return new _FactionRegistrationRequester(definitionManager);
  }
  request(factions) {
    super.request(factions);
  }
};

// src/game/system/definitions/rolegroup/RoleGroupRegistrationRequester.ts
var RoleGroupRegistrationRequester = class _RoleGroupRegistrationRequester extends BaseDefinitionRegistrationRequester {
  constructor(definitionManager) {
    super(definitionManager, "roleGroup");
  }
  static create(definitionManager) {
    return new _RoleGroupRegistrationRequester(definitionManager);
  }
  request(roleGroups) {
    super.request(roleGroups);
  }
};

// src/game/system/definitions/roles/RoleRegistrationRequester.ts
var RoleRegistrationRequester = class _RoleRegistrationRequester extends BaseDefinitionRegistrationRequester {
  constructor(definitionManager) {
    super(definitionManager, "role");
  }
  static create(definitionManager) {
    return new _RoleRegistrationRequester(definitionManager);
  }
  request(roles) {
    super.request(roles);
  }
};

// src/game/system/definitions/settings/SettingRegistrationRequester.ts
var SettingRegistrationRequester = class _SettingRegistrationRequester extends BaseDefinitionRegistrationRequester {
  constructor(definitionManager) {
    super(definitionManager, "setting");
  }
  static create(definitionManager) {
    return new _SettingRegistrationRequester(definitionManager);
  }
  request(settings) {
    super.request(settings);
  }
};

// src/game/system/definitions/DefinitionManager.ts
var DefinitionManager = class _DefinitionManager {
  constructor(systemManager) {
    this.systemManager = systemManager;
    this.roleRegistrationRequester = RoleRegistrationRequester.create(this);
    this.factionRegistrationRequester = FactionRegistrationRequester.create(this);
    this.roleGroupRegistrationRequester = RoleGroupRegistrationRequester.create(this);
    this.settingRegistrationRequester = SettingRegistrationRequester.create(this);
    this.registryManager = DefinitionRegistry.getInstance();
  }
  static create(systemManager) {
    return new _DefinitionManager(systemManager);
  }
  requestDefinitionsRegistration() {
    this.roleRegistrationRequester.request(getRegisteredRoles());
    this.factionRegistrationRequester.request(getRegisteredFactions());
    this.roleGroupRegistrationRequester.request(getRegisteredRoleGroups());
    this.settingRegistrationRequester.request(getRegisteredSettings());
  }
  getRegistryManager() {
    return this.registryManager;
  }
};

// src/game/system/events/SystemEventManager.ts
var SystemEventManager = class _SystemEventManager extends BaseEventManager {
  constructor(systemManager) {
    super();
    this.systemManager = systemManager;
  }
  static create(systemManager) {
    return new _SystemEventManager(systemManager);
  }
  subscribeAll() {
  }
  unsubscribeAll() {
  }
  getSystemManager() {
    return this.systemManager;
  }
};

// src/game/system/ScriptEventReceiver.ts
var ScriptEventReceiver = class _ScriptEventReceiver {
  constructor(systemManager) {
    this.systemManager = systemManager;
  }
  static create(systemManager) {
    return new _ScriptEventReceiver(systemManager);
  }
  async handleScriptEvent(command) {
    switch (command.commandType) {
      case SCRIPT_EVENT_COMMAND_IDS.WORLD_STATE_CHANGE:
        this.handleWorldStateChange(
          command.data.newState,
          command.data.ingameConstants
        );
        return;
      case SCRIPT_EVENT_COMMAND_IDS.INGAME_PHASE_CHANGE:
        this.systemManager.setCurrentPhase(command.data.newPhase);
        return;
      case SCRIPT_EVENT_COMMAND_IDS.WEREWOLF_INGAME_PLAYER_SKILL_TRIGGER:
        return this.systemManager.handlePlayerSkillTrigger(
          command.data.playerId,
          command.data.eventType
        );
      default:
        return;
    }
  }
  handleWorldStateChange(newState, ingameConstants) {
    switch (newState) {
      case SCRIPT_EVENT_MESSAGES.IN_GAME:
        this.systemManager.changeWorldState("InGame" /* InGame */, ingameConstants);
        break;
      case SCRIPT_EVENT_MESSAGES.OUT_GAME:
        this.systemManager.changeWorldState("OutGame" /* OutGame */);
        break;
    }
  }
};

// src/game/system/WorldStateChanger.ts
var WorldStateChanger = class _WorldStateChanger {
  constructor(systemManager) {
    this.systemManager = systemManager;
  }
  static create(systemManager) {
    return new _WorldStateChanger(systemManager);
  }
  change(next, ingameConstants) {
    const current = this.systemManager.getWorldState();
    if (current === next)
      return;
    switch (next) {
      case "InGame" /* InGame */:
        this.toInGame(ingameConstants);
        break;
      case "OutGame" /* OutGame */:
        this.toOutGame();
        break;
    }
  }
  toInGame(ingameConstants) {
    this.systemManager.getOutGameManager()?.getOutGameEventManager().unsubscribeAll();
    this.systemManager.setOutGameManager(null);
    const InGameManager2 = this.systemManager.createInGameManager(ingameConstants);
    InGameManager2.getInGameEventManager().subscribeAll();
    this.systemManager.setInGameManager(InGameManager2);
    this.systemManager.setWorldState("InGame" /* InGame */);
  }
  toOutGame() {
    this.systemManager.getInGameManager()?.getInGameEventManager().unsubscribeAll();
    this.systemManager.setInGameManager(null);
    const OutGameManager2 = this.systemManager.createOutGameManager();
    OutGameManager2.getOutGameEventManager().subscribeAll();
    this.systemManager.setOutGameManager(OutGameManager2);
    this.systemManager.setWorldState("OutGame" /* OutGame */);
  }
};

// src/game/system/definitions/DefinitionRegistry.ts
var DefinitionRegistry = class _DefinitionRegistry {
  constructor(systemManager) {
    this.systemManager = systemManager;
    this.state = {};
  }
  static create(systemManager) {
    return new _DefinitionRegistry(systemManager);
  }
  init(payload) {
    if (payload.definitions) {
      this.registerDefinitions(payload.definitions);
    }
    if (payload.playerData) {
      this.registerPlayerData(payload.playerData);
    }
    if (payload.updateHandlers) {
      this.registerUpdateHandlers(payload.updateHandlers);
    }
    if (payload.roleSkillHandlers) {
      this.registerRoleSkillHandlers(payload.roleSkillHandlers);
    }
  }
  registerDefinitions(definitions) {
    if (definitions.roles) {
      this.state.roles = [...definitions.roles];
    }
    if (definitions.factions) {
      this.state.factions = [...definitions.factions];
    }
    if (definitions.roleGroups) {
      this.state.roleGroups = [...definitions.roleGroups];
    }
    if (definitions.settings) {
      this.state.settings = [...definitions.settings];
    }
  }
  registerPlayerData(data) {
    this.state.playerData = data;
  }
  registerUpdateHandlers(handlers) {
    this.state.updateHandlers = handlers;
  }
  registerRoleSkillHandlers(handlers) {
    this.state.roleSkillHandlers = {
      ...this.state.roleSkillHandlers ?? {},
      ...handlers
    };
  }
  getRoles() {
    return this.state.roles;
  }
  getFactions() {
    return this.state.factions;
  }
  getRoleGroups() {
    return this.state.roleGroups;
  }
  getSettings() {
    return this.state.settings;
  }
  getPlayerData() {
    return this.state.playerData ?? { playerId: "" };
  }
  getUpdateHandlers() {
    return this.state.updateHandlers;
  }
  getRoleSkillHandlers() {
    return this.state.roleSkillHandlers;
  }
};

// src/game/SystemManager.ts
var SystemManager = class _SystemManager {
  constructor() {
    this.scriptEventReceiver = ScriptEventReceiver.create(this);
    this.systemEventManager = SystemEventManager.create(this);
    this.worldStateChanger = WorldStateChanger.create(this);
    this.definitionManager = DefinitionManager.create(this);
    this.registry = DefinitionRegistry.create(this);
    this.inGameManager = null;
    this.outGameManager = null;
    this.currentWorldState = null;
  }
  init() {
    this.definitionManager.requestDefinitionsRegistration();
  }
  static {
    this.instance = null;
  }
  static getInstance() {
    if (this.instance === null) {
      this.instance = new _SystemManager();
    }
    return this.instance;
  }
  async handleScriptEvent(data) {
    return this.scriptEventReceiver.handleScriptEvent(data);
  }
  subscribeEvents() {
    this.systemEventManager.subscribeAll();
  }
  unsubscribeEvents() {
    this.systemEventManager.unsubscribeAll();
  }
  changeWorldState(nextState, ingameConstants) {
    this.worldStateChanger.change(nextState, ingameConstants);
  }
  getWorldState() {
    return this.currentWorldState;
  }
  setWorldState(state) {
    this.currentWorldState = state;
  }
  getInGameManager() {
    return this.inGameManager;
  }
  setInGameManager(v) {
    this.inGameManager = v;
  }
  getOutGameManager() {
    return this.outGameManager;
  }
  setOutGameManager(v) {
    this.outGameManager = v;
  }
  getRegistry() {
    return this.registry;
  }
  createInGameManager(ingameConstants) {
    return InGameManager.create(this, ingameConstants);
  }
  createOutGameManager() {
    return OutGameManager.create(this);
  }
  setCurrentPhase(newPhase) {
    if (!this.inGameManager)
      return;
    this.inGameManager.setCurrentPhase(newPhase);
  }
  async handlePlayerSkillTrigger(playerId, eventType) {
    if (!this.inGameManager)
      return KairoUtils4.buildKairoResponse({}, false, "InGameManager is not initialized");
    return this.inGameManager.handlePlayerSkillTrigger(playerId, eventType);
  }
};

// src/game/ingame/events/TripWireTrip.ts
import { world as world46 } from "@minecraft/server";
var InGameTripWireTrip = class _InGameTripWireTrip extends InGameEventHandler {
  constructor(inGameEventManager) {
    super(inGameEventManager);
    this.inGameEventManager = inGameEventManager;
    this.afterEvent = world46.afterEvents.tripWireTrip;
  }
  static create(inGameEventManager) {
    return new _InGameTripWireTrip(inGameEventManager);
  }
};
export {
  InGameBlockExplode,
  InGameButtonPush,
  InGameDataDrivenEntityTrigger,
  InGameEffectAdd,
  InGameEntityDie,
  InGameEntityHealthChanged,
  InGameEntityHitBlock,
  InGameEntityHitEntity,
  InGameEntityHurt,
  InGameEntityLoad,
  InGameEntityRemove,
  InGameEntitySpawn,
  InGameExplosion,
  InGameGameRuleChange,
  InGameItemCompleteUse,
  InGameItemReleaseUse,
  InGameItemStartUse,
  InGameItemStartUseOn,
  InGameItemStopUse,
  InGameItemStopUseOn,
  InGameItemUse,
  InGameLeverAction,
  InGamePistonActivate,
  InGamePlayerBreakBlock,
  InGamePlayerButtonInput,
  InGamePlayerDimensionChange,
  InGamePlayerEmote,
  InGamePlayerGameModeChange,
  InGamePlayerHotbarSelectedSlotChange,
  InGamePlayerInputModeChange,
  InGamePlayerInputPermissionCategoryChange,
  InGamePlayerInteractWithBlock,
  InGamePlayerInteractWithEntity,
  InGamePlayerInventoryItemChange,
  InGamePlayerJoin,
  InGamePlayerLeave,
  InGamePlayerPlaceBlock,
  InGamePlayerSpawn,
  InGamePressurePlatePop,
  InGamePressurePlatePush,
  InGameProjectileHitBlock,
  InGameProjectileHitEntity,
  InGameTargetBlockHit,
  InGameTripWireTrip,
  InGameWeatherChange,
  DefinitionRegistry,
  SystemManager
};
