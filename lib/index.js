// node_modules/@kairo-ts/router/lib/index.js
import { system as system6 } from "@minecraft/server";
import { system } from "@minecraft/server";
import { system as system3 } from "@minecraft/server";
import { world } from "@minecraft/server";
import { system as system2, world as world2 } from "@minecraft/server";
import { system as system5 } from "@minecraft/server";
import {
  system as system4
} from "@minecraft/server";
import { ActionFormData } from "@minecraft/server-ui";
var SCRIPT_EVENT_ID_PREFIX = {
  KAIRO: "kairo"
};
var SCRIPT_EVENT_IDS = {
  BEHAVIOR_REGISTRATION_REQUEST: "kairo:registrationRequest",
  BEHAVIOR_REGISTRATION_RESPONSE: "kairo:registrationResponse",
  BEHAVIOR_INITIALIZE_REQUEST: "kairo:initializeRequest",
  BEHAVIOR_INITIALIZATION_COMPLETE_RESPONSE: "kairo:initializationCompleteResponse",
  UNSUBSCRIBE_INITIALIZE: "kairo:unsubscribeInitialize",
  REQUEST_RESEED_SESSION_ID: "kairo:reseedSessionId",
  SHOW_ADDON_LIST: "kairo:showAddonList"
};
var SCRIPT_EVENT_MESSAGES = {
  NONE: "",
  ACTIVATE_REQUEST: "activate request",
  DEACTIVATE_REQUEST: "deactivate request"
};
var SCRIPT_EVENT_COMMAND_TYPES = {
  KAIRO_ACK: "kairo_ack",
  KAIRO_RESPONSE: "kairo_response",
  SAVE_DATA: "save_data",
  LOAD_DATA: "load_data",
  DATA_LOADED: "data_loaded",
  GET_PLAYER_KAIRO_DATA: "getPlayerKairoData",
  GET_PLAYERS_KAIRO_DATA: "getPlayersKairoData"
};
var KAIRO_COMMAND_TARGET_ADDON_IDS = {
  BROADCAST: "_kBroadcast",
  KAIRO: "kairo",
  KAIRO_DATAVAULT: "kairo-datavault"
};
var KairoUtils = class _KairoUtils {
  static {
    this.properties = null;
  }
  static {
    this.pendingRequests = /* @__PURE__ */ new Map();
  }
  static init(properties) {
    if (this.properties) {
      throw new Error("[KairoUtils] Already initialized.");
    }
    this.properties = properties;
  }
  static requireInitialized() {
    if (!this.properties) {
      throw new Error(
        "[KairoUtils] KairoUtils is not initialized. Call KairoUtils.init({ addonId }) first."
      );
    }
    return this.properties;
  }
  static async sendKairoCommand(targetAddonId, commandType, data = {}, timeoutTicks = 20) {
    return this.sendInternal(
      targetAddonId,
      commandType,
      data,
      timeoutTicks,
      false
    );
  }
  static async sendKairoCommandAndWaitResponse(targetAddonId, commandType, data = {}, timeoutTicks = 20) {
    return this.sendInternal(
      targetAddonId,
      commandType,
      data,
      timeoutTicks,
      true
    );
  }
  static buildKairoResponse(data = {}, success = true, errorMessage) {
    return {
      sourceAddonId: this.requireInitialized().id,
      commandId: this.generateRandomId(16),
      commandType: SCRIPT_EVENT_COMMAND_TYPES.KAIRO_RESPONSE,
      data,
      success,
      ...errorMessage !== void 0 ? { errorMessage } : {}
    };
  }
  static {
    this.charset = [
      ..."abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
    ];
  }
  static generateRandomId(length = 8) {
    return Array.from(
      { length },
      () => this.charset[Math.floor(Math.random() * this.charset.length)]
    ).join("");
  }
  static async getPlayerKairoData(playerId) {
    const kairoResponse = await _KairoUtils.sendKairoCommandAndWaitResponse(
      KAIRO_COMMAND_TARGET_ADDON_IDS.KAIRO,
      SCRIPT_EVENT_COMMAND_TYPES.GET_PLAYER_KAIRO_DATA,
      {
        playerId
      }
    );
    return kairoResponse.data.playerKairoData;
  }
  static async getPlayersKairoData() {
    const kairoResponse = await _KairoUtils.sendKairoCommandAndWaitResponse(
      KAIRO_COMMAND_TARGET_ADDON_IDS.KAIRO,
      SCRIPT_EVENT_COMMAND_TYPES.GET_PLAYERS_KAIRO_DATA
    );
    return kairoResponse.data.playersKairoData;
  }
  static async saveToDataVault(key, value) {
    const type = value === null ? "null" : typeof value;
    if (type === "object" && !this.isVector3(value)) {
      throw new Error(
        `Invalid value type for saveToDataVault: expected Vector3 for object, got ${JSON.stringify(value)}`
      );
    }
    return _KairoUtils.sendKairoCommand(
      KAIRO_COMMAND_TARGET_ADDON_IDS.KAIRO_DATAVAULT,
      SCRIPT_EVENT_COMMAND_TYPES.SAVE_DATA,
      {
        type,
        key,
        value: JSON.stringify(value)
      }
    );
  }
  static async loadFromDataVault(key) {
    const kairoResponse = await _KairoUtils.sendKairoCommandAndWaitResponse(
      KAIRO_COMMAND_TARGET_ADDON_IDS.KAIRO_DATAVAULT,
      SCRIPT_EVENT_COMMAND_TYPES.LOAD_DATA,
      {
        key
      }
    );
    const { type, value } = kairoResponse.data.dataLoaded;
    if (value === null)
      return null;
    switch (type) {
      case "string":
        try {
          return JSON.parse(value);
        } catch {
          return value;
        }
      case "number":
      case "boolean":
        return JSON.parse(value);
      case "object":
        return JSON.parse(value);
      case "null":
        return null;
      default:
        throw new Error(`Unsupported DataVault value type: ${type}`);
    }
  }
  static resolvePendingRequest(commandId, response) {
    const pending = this.pendingRequests.get(commandId);
    if (!pending)
      return;
    this.pendingRequests.delete(commandId);
    if (pending.expectResponse && response === void 0) {
      pending.reject(
        new Error(
          `Kairo response expected but none received (commandId=${commandId})`
        )
      );
      return;
    }
    pending.resolve(response);
  }
  static rejectPendingRequest(commandId, error) {
    const pending = this.pendingRequests.get(commandId);
    if (!pending)
      return;
    this.pendingRequests.delete(commandId);
    pending.reject(error ?? new Error("Kairo request rejected"));
  }
  static async sendInternal(targetAddonId, commandType, data, timeoutTicks, expectResponse) {
    const kairoCommand = {
      sourceAddonId: this.requireInitialized().id,
      commandId: this.generateRandomId(16),
      commandType,
      data
    };
    return new Promise((resolve, reject) => {
      this.pendingRequests.set(kairoCommand.commandId, {
        expectResponse,
        resolve,
        reject,
        timeoutTick: system.currentTick + timeoutTicks
      });
      system.sendScriptEvent(
        `${SCRIPT_EVENT_ID_PREFIX.KAIRO}:${targetAddonId}`,
        JSON.stringify(kairoCommand)
      );
    });
  }
  static onTick() {
    this.requireInitialized();
    if (this.lastTick === system.currentTick)
      return;
    this.lastTick = system.currentTick;
    for (const [requestId, pending] of this.pendingRequests) {
      if (system.currentTick >= pending.timeoutTick) {
        this.pendingRequests.delete(requestId);
        pending.reject(new Error("Kairo command timeout"));
      }
    }
  }
  static isRawMessage(value) {
    if (value === null || typeof value !== "object")
      return false;
    const v = value;
    if (v.rawtext !== void 0) {
      if (!Array.isArray(v.rawtext))
        return false;
      for (const item of v.rawtext) {
        if (!this.isRawMessage(item))
          return false;
      }
    }
    if (v.score !== void 0) {
      const s = v.score;
      if (s === null || typeof s !== "object")
        return false;
      if (s.name !== void 0 && typeof s.name !== "string")
        return false;
      if (s.objective !== void 0 && typeof s.objective !== "string")
        return false;
    }
    if (v.text !== void 0 && typeof v.text !== "string") {
      return false;
    }
    if (v.translate !== void 0 && typeof v.translate !== "string") {
      return false;
    }
    if (v.with !== void 0) {
      const w = v.with;
      if (Array.isArray(w)) {
        if (!w.every((item) => typeof item === "string"))
          return false;
      } else if (!this.isRawMessage(w)) {
        return false;
      }
    }
    return true;
  }
  static isVector3(value) {
    return typeof value === "object" && value !== null && typeof value.x === "number" && typeof value.y === "number" && typeof value.z === "number" && Object.keys(value).length === 3;
  }
};
var AddonPropertyManager = class _AddonPropertyManager {
  constructor(kairo, properties) {
    this.kairo = kairo;
    this.charset = [
      ..."abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
    ];
    this.self = {
      id: properties.id,
      name: properties.header.name,
      description: properties.header.description,
      sessionId: KairoUtils.generateRandomId(8),
      version: properties.header.version,
      dependencies: properties.dependencies,
      requiredAddons: properties.requiredAddons,
      tags: properties.tags
    };
  }
  static create(kairo, properties) {
    return new _AddonPropertyManager(kairo, properties);
  }
  getSelfAddonProperty() {
    return this.self;
  }
  refreshSessionId() {
    this.self.sessionId = KairoUtils.generateRandomId(8);
  }
};
var ScoreboardManager = class {
  static ensureObjective(objectiveId) {
    return world.scoreboard.getObjective(objectiveId) ?? world.scoreboard.addObjective(objectiveId);
  }
};
var SCOREBOARD_NAMES = {
  ADDON_COUNTER: "AddonCounter"
};
var AddonInitializeReceive = class _AddonInitializeReceive {
  constructor(addonInitializer) {
    this.addonInitializer = addonInitializer;
    this.handleScriptEvent = (ev) => {
      const { id, message } = ev;
      const registrationNum = this.addonInitializer.getRegistrationNum();
      const isOwnMessage = message === registrationNum.toString();
      switch (id) {
        case SCRIPT_EVENT_IDS.BEHAVIOR_REGISTRATION_REQUEST:
          this.handleRegistrationRequest();
          break;
        case SCRIPT_EVENT_IDS.REQUEST_RESEED_SESSION_ID:
          if (isOwnMessage) {
            this.handleRequestReseedId();
          }
          break;
        case SCRIPT_EVENT_IDS.BEHAVIOR_INITIALIZE_REQUEST:
          if (isOwnMessage) {
            this.subscribeReceiverHooks();
            this.addonInitializer.sendInitializationCompleteResponse();
          }
          break;
        case SCRIPT_EVENT_IDS.UNSUBSCRIBE_INITIALIZE:
          this.addonInitializer.unsubscribeClientHooks();
          break;
      }
    };
  }
  static create(addonInitializer) {
    return new _AddonInitializeReceive(addonInitializer);
  }
  handleRegistrationRequest() {
    const addonCounter = ScoreboardManager.ensureObjective(SCOREBOARD_NAMES.ADDON_COUNTER);
    addonCounter.addScore(SCOREBOARD_NAMES.ADDON_COUNTER, 1);
    this.addonInitializer.setRegistrationNum(
      addonCounter.getScore(SCOREBOARD_NAMES.ADDON_COUNTER) ?? 0
    );
    this.addonInitializer.sendResponse();
  }
  handleRequestReseedId() {
    this.addonInitializer.refreshSessionId();
    this.addonInitializer.sendResponse();
  }
  subscribeReceiverHooks() {
    this.addonInitializer.subscribeReceiverHooks();
  }
};
var AddonInitializeResponse = class _AddonInitializeResponse {
  constructor(addonInitializer) {
    this.addonInitializer = addonInitializer;
  }
  static create(addonInitializer) {
    return new _AddonInitializeResponse(addonInitializer);
  }
  /**
   * scoreboard を使って登録用の識別番号も送信しておく
   * Also send the registration ID using the scoreboard
   */
  sendResponse(addonProperty) {
    system2.sendScriptEvent(
      SCRIPT_EVENT_IDS.BEHAVIOR_REGISTRATION_RESPONSE,
      JSON.stringify([
        addonProperty,
        world2.scoreboard.getObjective(SCOREBOARD_NAMES.ADDON_COUNTER)?.getScore(SCOREBOARD_NAMES.ADDON_COUNTER) ?? 0
      ])
    );
  }
  sendInitializationCompleteResponse() {
    system2.sendScriptEvent(
      SCRIPT_EVENT_IDS.BEHAVIOR_INITIALIZATION_COMPLETE_RESPONSE,
      SCRIPT_EVENT_MESSAGES.NONE
    );
  }
};
var AddonInitializer = class _AddonInitializer {
  constructor(kairo) {
    this.kairo = kairo;
    this.registrationNum = 0;
    this.receive = AddonInitializeReceive.create(this);
    this.response = AddonInitializeResponse.create(this);
  }
  static create(kairo) {
    return new _AddonInitializer(kairo);
  }
  subscribeClientHooks() {
    system3.afterEvents.scriptEventReceive.subscribe(
      this.receive.handleScriptEvent
    );
  }
  unsubscribeClientHooks() {
    system3.afterEvents.scriptEventReceive.unsubscribe(
      this.receive.handleScriptEvent
    );
  }
  getSelfAddonProperty() {
    return this.kairo.getSelfAddonProperty();
  }
  refreshSessionId() {
    return this.kairo.refreshSessionId();
  }
  sendResponse() {
    const selfAddonProperty = this.getSelfAddonProperty();
    this.response.sendResponse(selfAddonProperty);
  }
  setRegistrationNum(num) {
    this.registrationNum = num;
  }
  getRegistrationNum() {
    return this.registrationNum;
  }
  subscribeReceiverHooks() {
    this.kairo.subscribeReceiverHooks();
  }
  sendInitializationCompleteResponse() {
    this.response.sendInitializationCompleteResponse();
  }
};
var ConsoleManager = class {
  static {
    this.JST_OFFSET_MS = 9 * 60 * 60 * 1e3;
  }
  static {
    this.properties = null;
  }
  static init(properties) {
    if (this.properties) {
      throw new Error(
        "[ConsoleManager] ConsoleManager is already initialized."
      );
    }
    this.properties = properties;
  }
  static requireInitialized() {
    if (!this.properties) {
      throw new Error(
        "[ConsoleManager] ConsoleManager is not initialized. Call ConsoleManager.init(properties) first."
      );
    }
    return this.properties;
  }
  static getJstDate() {
    return new Date(Date.now() + this.JST_OFFSET_MS);
  }
  static pad(value, length = 2) {
    return value.toString().padStart(length, "0");
  }
  static formatTime(format) {
    if (format === "none")
      return "";
    const d = this.getJstDate();
    const date = `${d.getUTCFullYear()}/${this.pad(d.getUTCMonth() + 1)}/${this.pad(d.getUTCDate())}`;
    const time = `${this.pad(d.getUTCHours())}:${this.pad(d.getUTCMinutes())}:${this.pad(d.getUTCSeconds())}.${this.pad(d.getUTCMilliseconds(), 3)}`;
    switch (format) {
      case "datetime":
        return `${date} ${time}`;
      case "time":
      default:
        return time;
    }
  }
  static buildPrefix(level, timeFormat) {
    const properties = this.requireInitialized();
    const time = this.formatTime(timeFormat);
    return time ? `[${properties.header.name}][${time}][${level}]` : `[${properties.header.name}][${level}]`;
  }
  static log(message, timeFormat = "time") {
    console.log(`${this.buildPrefix("Log", timeFormat)} ${message}`);
  }
  static warn(message, timeFormat = "time") {
    console.warn(`${this.buildPrefix("Warning", timeFormat)} ${message}`);
  }
  static error(message, timeFormat = "time") {
    console.error(`${this.buildPrefix("Error", timeFormat)} ${message}`);
  }
};
var AddonReceiver = class _AddonReceiver {
  constructor(addonManager) {
    this.addonManager = addonManager;
    this.handleScriptEvent = async (ev) => {
      const { id, message } = ev;
      const addonProperty = this.addonManager.getSelfAddonProperty();
      if (id !== `${SCRIPT_EVENT_ID_PREFIX.KAIRO}:${addonProperty.sessionId}`)
        return;
      if (this.addonManager.isActive === false) {
        if (message !== SCRIPT_EVENT_MESSAGES.ACTIVATE_REQUEST)
          return;
      }
      switch (message) {
        case SCRIPT_EVENT_MESSAGES.ACTIVATE_REQUEST:
          this.addonManager._activateAddon();
          break;
        case SCRIPT_EVENT_MESSAGES.DEACTIVATE_REQUEST:
          this.addonManager._deactivateAddon();
          break;
        default:
          let data;
          try {
            data = JSON.parse(message);
          } catch (e) {
            ConsoleManager.warn(`[ScriptEventReceiver] Invalid JSON: ${message}`);
            return;
          }
          if (typeof data.sourceAddonId !== "string")
            return;
          if (typeof data.commandType !== "string")
            return;
          if (data.ackFor && typeof data.ackFor === "string") {
            KairoUtils.resolvePendingRequest(data.ackFor, data.response);
            return;
          }
          if (typeof data.commandId !== "string")
            return;
          if (!data || typeof data !== "object")
            return;
          const command = data;
          const response = await this.addonManager._scriptEvent(command);
          system4.sendScriptEvent(
            `${SCRIPT_EVENT_ID_PREFIX.KAIRO}:${command.sourceAddonId}`,
            JSON.stringify({
              sourceAddonId: this.addonManager.getProperties().id,
              commandType: SCRIPT_EVENT_COMMAND_TYPES.KAIRO_ACK,
              ackFor: command.commandId,
              response
            })
          );
          break;
      }
    };
  }
  static create(addonManager) {
    return new _AddonReceiver(addonManager);
  }
};
var AddonManager = class _AddonManager {
  constructor(kairo) {
    this.kairo = kairo;
    this._isActive = false;
    this.receiver = AddonReceiver.create(this);
  }
  static create(kairo) {
    return new _AddonManager(kairo);
  }
  getSelfAddonProperty() {
    return this.kairo.getSelfAddonProperty();
  }
  subscribeReceiverHooks() {
    system5.afterEvents.scriptEventReceive.subscribe(
      this.receiver.handleScriptEvent
    );
  }
  _activateAddon() {
    this.kairo._activateAddon();
  }
  _deactivateAddon() {
    this.kairo._deactivateAddon();
  }
  async _scriptEvent(data) {
    return this.kairo._scriptEvent(data);
  }
  get isActive() {
    return this._isActive;
  }
  setActiveState(state) {
    this._isActive = state;
  }
  getProperties() {
    return this.kairo.getProperties();
  }
};
var Kairo = class _Kairo {
  constructor(properties) {
    this.properties = properties;
    this.initialized = false;
    this.addonManager = AddonManager.create(this);
    this.addonPropertyManager = AddonPropertyManager.create(this, properties);
    this.addonInitializer = AddonInitializer.create(this);
  }
  static {
    this._initHooks = [];
  }
  static {
    this._deinitHooks = [];
  }
  static {
    this._seHooks = [];
  }
  static {
    this._tickHooks = [];
  }
  static {
    this._tickEnabled = false;
  }
  static getInstance(properties) {
    if (!this.instance && properties !== void 0) {
      this.instance = new _Kairo(properties);
    }
    return this.instance;
  }
  static init(properties) {
    const inst = this.getInstance(properties);
    if (inst.initialized)
      return;
    inst.initialized = true;
    inst.addonInitializer.subscribeClientHooks();
  }
  getProperties() {
    return this.properties;
  }
  getSelfAddonProperty() {
    return this.addonPropertyManager.getSelfAddonProperty();
  }
  refreshSessionId() {
    this.addonPropertyManager.refreshSessionId();
  }
  subscribeReceiverHooks() {
    this.addonManager.subscribeReceiverHooks();
  }
  static unsubscribeInitializeHooks() {
    this.getInstance().addonInitializer.unsubscribeClientHooks();
    system6.sendScriptEvent(SCRIPT_EVENT_IDS.UNSUBSCRIBE_INITIALIZE, "");
  }
  static set onActivate(val) {
    if (typeof val === "function")
      this._pushSorted(this._initHooks, val);
    else
      this._pushSorted(this._initHooks, val.run, val.options);
  }
  static set onDeactivate(val) {
    if (typeof val === "function")
      this._pushSorted(this._deinitHooks, val);
    else
      this._pushSorted(this._deinitHooks, val.run, val.options);
  }
  static set onScriptEvent(val) {
    if (this._commandHandler) {
      throw new Error("CommandHandler already registered");
    }
    this._commandHandler = val;
  }
  static set onTick(fn) {
    this.addTick(fn);
  }
  static addActivate(fn, opt) {
    this._pushSorted(this._initHooks, fn, opt);
  }
  static addDeactivate(fn, opt) {
    this._pushSorted(this._deinitHooks, fn, opt);
  }
  static addScriptEvent(fn, opt) {
    this._pushSorted(this._seHooks, fn, opt);
  }
  static addTick(fn, opt) {
    this._pushSorted(this._tickHooks, fn, opt);
  }
  async _scriptEvent(data) {
    return _Kairo._runScriptEvent(data);
  }
  _activateAddon() {
    void _Kairo._runActivateHooks();
  }
  _deactivateAddon() {
    void _Kairo._runDeactivateHooks();
  }
  static _pushSorted(arr, fn, opt) {
    arr.push({ fn, priority: opt?.priority ?? 0 });
    arr.sort((a, b) => b.priority - a.priority);
  }
  static async _runActivateHooks() {
    for (const { fn } of this._initHooks) {
      try {
        await fn();
      } catch (e) {
        system6.run(
          () => console.warn(
            `[Kairo.onActivate] ${e instanceof Error ? e.stack ?? e.message : String(e)}`
          )
        );
      }
    }
    this._enableTick();
    this.getInstance().addonManager.setActiveState(true);
  }
  static async _runDeactivateHooks() {
    for (const { fn } of [...this._deinitHooks].reverse()) {
      try {
        await fn();
      } catch (e) {
        system6.run(
          () => console.warn(
            `[Kairo.onDeactivate] ${e instanceof Error ? e.stack ?? e.message : String(e)}`
          )
        );
      }
    }
    this._disableTick();
    this.getInstance().addonManager.setActiveState(false);
  }
  static async _runScriptEvent(data) {
    let response = void 0;
    if (this._commandHandler) {
      try {
        response = await this._commandHandler(data);
      } catch (e) {
        system6.run(
          () => console.warn(
            `[Kairo.CommandHandler] ${e instanceof Error ? e.stack ?? e.message : String(e)}`
          )
        );
      }
    }
    for (const { fn } of this._seHooks) {
      try {
        await fn(data);
      } catch (e) {
        system6.run(
          () => console.warn(
            `[Kairo.onScriptEvent] ${e instanceof Error ? e.stack ?? e.message : String(e)}`
          )
        );
      }
    }
    return response;
  }
  static async _runTick() {
    if (!this._tickEnabled)
      return;
    for (const { fn } of this._tickHooks) {
      try {
        await fn();
      } catch (e) {
        system6.run(
          () => console.warn(
            `[Kairo.onTick] ${e instanceof Error ? e.stack ?? e.message : String(e)}`
          )
        );
      }
    }
  }
  static _enableTick() {
    if (this._tickIntervalId !== void 0)
      return;
    this._tickEnabled = true;
    this.addTick(
      () => {
        KairoUtils.onTick();
      },
      { priority: Number.MAX_SAFE_INTEGER }
    );
    this._tickIntervalId = system6.runInterval(() => {
      void this._runTick();
    }, 1);
  }
  static _disableTick() {
    if (this._tickIntervalId === void 0)
      return;
    system6.clearRun(this._tickIntervalId);
    this._tickIntervalId = void 0;
    this._tickEnabled = false;
  }
};

// src/constants/scriptevent.ts
var SCRIPT_EVENT_COMMAND_IDS = {
  WORLD_STATE_CHANGE: "world_state_change",
  DEFINITIONS_REGISTRATION_REQUEST: "definitions_registration_request",
  WEREWOLF_INGAME_PLAYER_SKILL_TRIGGER: "werewolf_ingame_player_skill_trigger",
  GET_WEREWOLF_GAME_DATA: "getWerewolfGameData",
  INGAME_PHASE_CHANGE: "ingame_phase_change"
};
var SCRIPT_EVENT_MESSAGES2 = {
  NONE: "",
  IN_GAME: "in_game",
  OUT_GAME: "out_game"
};

// src/constants/systems.ts
var KAIRO_COMMAND_TARGET_ADDON_IDS2 = {
  BROADCAST: "_kBroadcast",
  WEREWOLF_GAMEMANAGER: "werewolf-gamemanager"
};

// src/game/events/BaseEventManager.ts
var BaseEventManager = class {
  constructor() {
  }
};

// src/game/ingame/events/BlockExplode.ts
import { world as world3 } from "@minecraft/server";

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
    this.afterEvent = world3.afterEvents.blockExplode;
  }
  static create(inGameEventManager) {
    return new _InGameBlockExplode(inGameEventManager);
  }
};

// src/game/ingame/events/ButtonPush.ts
import { world as world4 } from "@minecraft/server";
var InGameButtonPush = class _InGameButtonPush extends InGameEventHandler {
  constructor(inGameEventManager) {
    super(inGameEventManager);
    this.inGameEventManager = inGameEventManager;
    this.afterEvent = world4.afterEvents.buttonPush;
  }
  static create(inGameEventManager) {
    return new _InGameButtonPush(inGameEventManager);
  }
};

// src/game/ingame/events/DataDrivenEntityTrigger.ts
import { world as world5 } from "@minecraft/server";
var InGameDataDrivenEntityTrigger = class _InGameDataDrivenEntityTrigger extends InGameEventHandler {
  constructor(inGameEventManager) {
    super(inGameEventManager);
    this.inGameEventManager = inGameEventManager;
    this.afterEvent = world5.afterEvents.dataDrivenEntityTrigger;
  }
  static create(inGameEventManager) {
    return new _InGameDataDrivenEntityTrigger(inGameEventManager);
  }
};

// src/game/ingame/events/EffectAdd.ts
import { world as world6 } from "@minecraft/server";
var InGameEffectAdd = class _InGameEffectAdd extends InGameEventHandler {
  constructor(inGameEventManager) {
    super(inGameEventManager);
    this.inGameEventManager = inGameEventManager;
    this.beforeEvent = world6.beforeEvents.effectAdd;
    this.afterEvent = world6.afterEvents.effectAdd;
  }
  static create(inGameEventManager) {
    return new _InGameEffectAdd(inGameEventManager);
  }
};

// src/game/ingame/events/EntityDie.ts
import { world as world7 } from "@minecraft/server";
var InGameEntityDie = class _InGameEntityDie extends InGameEventHandler {
  constructor(inGameEventManager) {
    super(inGameEventManager);
    this.inGameEventManager = inGameEventManager;
    this.afterEvent = world7.afterEvents.entityDie;
  }
  static create(inGameEventManager) {
    return new _InGameEntityDie(inGameEventManager);
  }
};

// src/game/ingame/events/EntityHealthChanged.ts
import { world as world8 } from "@minecraft/server";
var InGameEntityHealthChanged = class _InGameEntityHealthChanged extends InGameEventHandler {
  constructor(inGameEventManager) {
    super(inGameEventManager);
    this.inGameEventManager = inGameEventManager;
    this.afterEvent = world8.afterEvents.entityHealthChanged;
  }
  static create(inGameEventManager) {
    return new _InGameEntityHealthChanged(inGameEventManager);
  }
};

// src/game/ingame/events/EntityHitBlock.ts
import { world as world9 } from "@minecraft/server";
var InGameEntityHitBlock = class _InGameEntityHitBlock extends InGameEventHandler {
  constructor(inGameEventManager) {
    super(inGameEventManager);
    this.inGameEventManager = inGameEventManager;
    this.afterEvent = world9.afterEvents.entityHitBlock;
  }
  static create(inGameEventManager) {
    return new _InGameEntityHitBlock(inGameEventManager);
  }
};

// src/game/ingame/events/EntityHitEntity.ts
import { world as world10 } from "@minecraft/server";
var InGameEntityHitEntity = class _InGameEntityHitEntity extends InGameEventHandler {
  constructor(inGameEventManager) {
    super(inGameEventManager);
    this.inGameEventManager = inGameEventManager;
    this.afterEvent = world10.afterEvents.entityHitEntity;
  }
  static create(inGameEventManager) {
    return new _InGameEntityHitEntity(inGameEventManager);
  }
};

// src/game/ingame/events/EntityHurt.ts
import { world as world11 } from "@minecraft/server";
var InGameEntityHurt = class _InGameEntityHurt extends InGameEventHandler {
  constructor(inGameEventManager) {
    super(inGameEventManager);
    this.inGameEventManager = inGameEventManager;
    this.afterEvent = world11.afterEvents.entityHurt;
  }
  static create(inGameEventManager) {
    return new _InGameEntityHurt(inGameEventManager);
  }
};

// src/game/ingame/events/EntityLoad.ts
import { world as world12 } from "@minecraft/server";
var InGameEntityLoad = class _InGameEntityLoad extends InGameEventHandler {
  constructor(inGameEventManager) {
    super(inGameEventManager);
    this.inGameEventManager = inGameEventManager;
    this.afterEvent = world12.afterEvents.entityLoad;
  }
  static create(inGameEventManager) {
    return new _InGameEntityLoad(inGameEventManager);
  }
};

// src/game/ingame/events/EntityRemove.ts
import { world as world13 } from "@minecraft/server";
var InGameEntityRemove = class _InGameEntityRemove extends InGameEventHandler {
  constructor(inGameEventManager) {
    super(inGameEventManager);
    this.inGameEventManager = inGameEventManager;
    this.beforeEvent = world13.beforeEvents.entityRemove;
    this.afterEvent = world13.afterEvents.entityRemove;
  }
  static create(inGameEventManager) {
    return new _InGameEntityRemove(inGameEventManager);
  }
};

// src/game/ingame/events/EntitySpawn.ts
import { world as world14 } from "@minecraft/server";
var InGameEntitySpawn = class _InGameEntitySpawn extends InGameEventHandler {
  constructor(inGameEventManager) {
    super(inGameEventManager);
    this.inGameEventManager = inGameEventManager;
    this.afterEvent = world14.afterEvents.entitySpawn;
  }
  static create(inGameEventManager) {
    return new _InGameEntitySpawn(inGameEventManager);
  }
};

// src/game/ingame/events/Explosion.ts
import { world as world15 } from "@minecraft/server";
var InGameExplosion = class _InGameExplosion extends InGameEventHandler {
  constructor(inGameEventManager) {
    super(inGameEventManager);
    this.inGameEventManager = inGameEventManager;
    this.beforeEvent = world15.beforeEvents.explosion;
    this.afterEvent = world15.afterEvents.explosion;
  }
  static create(inGameEventManager) {
    return new _InGameExplosion(inGameEventManager);
  }
};

// src/game/ingame/events/GameRuleChange.ts
import { world as world16 } from "@minecraft/server";
var InGameGameRuleChange = class _InGameGameRuleChange extends InGameEventHandler {
  constructor(inGameEventManager) {
    super(inGameEventManager);
    this.inGameEventManager = inGameEventManager;
    this.afterEvent = world16.afterEvents.gameRuleChange;
  }
  static create(inGameEventManager) {
    return new _InGameGameRuleChange(inGameEventManager);
  }
};

// src/game/ingame/events/ItemCompleteUse.ts
import { world as world17 } from "@minecraft/server";
var InGameItemCompleteUse = class _InGameItemCompleteUse extends InGameEventHandler {
  constructor(inGameEventManager) {
    super(inGameEventManager);
    this.inGameEventManager = inGameEventManager;
    this.afterEvent = world17.afterEvents.itemCompleteUse;
  }
  static create(inGameEventManager) {
    return new _InGameItemCompleteUse(inGameEventManager);
  }
};

// src/game/ingame/events/ItemReleaseUse.ts
import { world as world18 } from "@minecraft/server";
var InGameItemReleaseUse = class _InGameItemReleaseUse extends InGameEventHandler {
  constructor(inGameEventManager) {
    super(inGameEventManager);
    this.inGameEventManager = inGameEventManager;
    this.afterEvent = world18.afterEvents.itemReleaseUse;
  }
  static create(inGameEventManager) {
    return new _InGameItemReleaseUse(inGameEventManager);
  }
};

// src/game/ingame/events/ItemStartUse.ts
import { world as world19 } from "@minecraft/server";
var InGameItemStartUse = class _InGameItemStartUse extends InGameEventHandler {
  constructor(inGameEventManager) {
    super(inGameEventManager);
    this.inGameEventManager = inGameEventManager;
    this.afterEvent = world19.afterEvents.itemStartUse;
  }
  static create(inGameEventManager) {
    return new _InGameItemStartUse(inGameEventManager);
  }
};

// src/game/ingame/events/ItemStartUseOn.ts
import { world as world20 } from "@minecraft/server";
var InGameItemStartUseOn = class _InGameItemStartUseOn extends InGameEventHandler {
  constructor(inGameEventManager) {
    super(inGameEventManager);
    this.inGameEventManager = inGameEventManager;
    this.afterEvent = world20.afterEvents.itemStartUseOn;
  }
  static create(inGameEventManager) {
    return new _InGameItemStartUseOn(inGameEventManager);
  }
};

// src/game/ingame/events/ItemStopUse.ts
import { world as world21 } from "@minecraft/server";
var InGameItemStopUse = class _InGameItemStopUse extends InGameEventHandler {
  constructor(inGameEventManager) {
    super(inGameEventManager);
    this.inGameEventManager = inGameEventManager;
    this.afterEvent = world21.afterEvents.itemStopUse;
  }
  static create(inGameEventManager) {
    return new _InGameItemStopUse(inGameEventManager);
  }
};

// src/game/ingame/events/ItemStopUseOn.ts
import { world as world22 } from "@minecraft/server";
var InGameItemStopUseOn = class _InGameItemStopUseOn extends InGameEventHandler {
  constructor(inGameEventManager) {
    super(inGameEventManager);
    this.inGameEventManager = inGameEventManager;
    this.afterEvent = world22.afterEvents.itemStopUseOn;
  }
  static create(inGameEventManager) {
    return new _InGameItemStopUseOn(inGameEventManager);
  }
};

// src/game/ingame/events/ItemUse.ts
import { world as world23 } from "@minecraft/server";
var InGameItemUse = class _InGameItemUse extends InGameEventHandler {
  constructor(inGameEventManager) {
    super(inGameEventManager);
    this.inGameEventManager = inGameEventManager;
    this.beforeEvent = world23.beforeEvents.itemUse;
    this.afterEvent = world23.afterEvents.itemUse;
  }
  static create(inGameEventManager) {
    return new _InGameItemUse(inGameEventManager);
  }
};

// src/game/ingame/events/LeverAction.ts
import { world as world24 } from "@minecraft/server";
var InGameLeverAction = class _InGameLeverAction extends InGameEventHandler {
  constructor(inGameEventManager) {
    super(inGameEventManager);
    this.inGameEventManager = inGameEventManager;
    this.afterEvent = world24.afterEvents.leverAction;
  }
  static create(inGameEventManager) {
    return new _InGameLeverAction(inGameEventManager);
  }
};

// src/game/ingame/events/PistonActivate.ts
import { world as world25 } from "@minecraft/server";
var InGamePistonActivate = class _InGamePistonActivate extends InGameEventHandler {
  constructor(inGameEventManager) {
    super(inGameEventManager);
    this.inGameEventManager = inGameEventManager;
    this.afterEvent = world25.afterEvents.pistonActivate;
  }
  static create(inGameEventManager) {
    return new _InGamePistonActivate(inGameEventManager);
  }
};

// src/game/ingame/events/PlayerBreakBlock.ts
import { world as world26 } from "@minecraft/server";
var InGamePlayerBreakBlock = class _InGamePlayerBreakBlock extends InGameEventHandler {
  constructor(inGameEventManager) {
    super(inGameEventManager);
    this.inGameEventManager = inGameEventManager;
    this.beforeEvent = world26.beforeEvents.playerBreakBlock;
    this.afterEvent = world26.afterEvents.playerBreakBlock;
  }
  static create(inGameEventManager) {
    return new _InGamePlayerBreakBlock(inGameEventManager);
  }
};

// src/game/ingame/events/PlayerButtonInput.ts
import { world as world27 } from "@minecraft/server";
var InGamePlayerButtonInput = class _InGamePlayerButtonInput extends InGameEventHandler {
  constructor(inGameEventManager) {
    super(inGameEventManager);
    this.inGameEventManager = inGameEventManager;
    this.afterEvent = world27.afterEvents.playerButtonInput;
  }
  static create(inGameEventManager) {
    return new _InGamePlayerButtonInput(inGameEventManager);
  }
};

// src/game/ingame/events/PlayerDimensionChange.ts
import { world as world28 } from "@minecraft/server";
var InGamePlayerDimensionChange = class _InGamePlayerDimensionChange extends InGameEventHandler {
  constructor(inGameEventManager) {
    super(inGameEventManager);
    this.inGameEventManager = inGameEventManager;
    this.afterEvent = world28.afterEvents.playerDimensionChange;
  }
  static create(inGameEventManager) {
    return new _InGamePlayerDimensionChange(inGameEventManager);
  }
};

// src/game/ingame/events/PlayerEmote.ts
import { world as world29 } from "@minecraft/server";
var InGamePlayerEmote = class _InGamePlayerEmote extends InGameEventHandler {
  constructor(inGameEventManager) {
    super(inGameEventManager);
    this.inGameEventManager = inGameEventManager;
    this.afterEvent = world29.afterEvents.playerEmote;
  }
  static create(inGameEventManager) {
    return new _InGamePlayerEmote(inGameEventManager);
  }
};

// src/game/ingame/events/PlayerGameModeChange.ts
import {
  world as world30
} from "@minecraft/server";
var InGamePlayerGameModeChange = class _InGamePlayerGameModeChange extends InGameEventHandler {
  constructor(inGameEventManager) {
    super(inGameEventManager);
    this.inGameEventManager = inGameEventManager;
    this.beforeEvent = world30.beforeEvents.playerGameModeChange;
    this.afterEvent = world30.afterEvents.playerGameModeChange;
  }
  static create(inGameEventManager) {
    return new _InGamePlayerGameModeChange(inGameEventManager);
  }
};

// src/game/ingame/events/PlayerHotbarSelectedSlotChange.ts
import { world as world31 } from "@minecraft/server";
var InGamePlayerHotbarSelectedSlotChange = class _InGamePlayerHotbarSelectedSlotChange extends InGameEventHandler {
  constructor(inGameEventManager) {
    super(inGameEventManager);
    this.inGameEventManager = inGameEventManager;
    this.afterEvent = world31.afterEvents.playerHotbarSelectedSlotChange;
  }
  static create(inGameEventManager) {
    return new _InGamePlayerHotbarSelectedSlotChange(inGameEventManager);
  }
};

// src/game/ingame/events/PlayerInputModeChange.ts
import { world as world32 } from "@minecraft/server";
var InGamePlayerInputModeChange = class _InGamePlayerInputModeChange extends InGameEventHandler {
  constructor(inGameEventManager) {
    super(inGameEventManager);
    this.inGameEventManager = inGameEventManager;
    this.afterEvent = world32.afterEvents.playerInputModeChange;
  }
  static create(inGameEventManager) {
    return new _InGamePlayerInputModeChange(inGameEventManager);
  }
};

// src/game/ingame/events/PlayerInputPermissionCategoryChange.ts
import { world as world33 } from "@minecraft/server";
var InGamePlayerInputPermissionCategoryChange = class _InGamePlayerInputPermissionCategoryChange extends InGameEventHandler {
  constructor(inGameEventManager) {
    super(inGameEventManager);
    this.inGameEventManager = inGameEventManager;
    this.afterEvent = world33.afterEvents.playerInputPermissionCategoryChange;
  }
  static create(inGameEventManager) {
    return new _InGamePlayerInputPermissionCategoryChange(inGameEventManager);
  }
};

// src/game/ingame/events/PlayerInteractWithBlock.ts
import {
  world as world34
} from "@minecraft/server";
var InGamePlayerInteractWithBlock = class _InGamePlayerInteractWithBlock extends InGameEventHandler {
  constructor(inGameEventManager) {
    super(inGameEventManager);
    this.inGameEventManager = inGameEventManager;
    this.beforeEvent = world34.beforeEvents.playerInteractWithBlock;
    this.afterEvent = world34.afterEvents.playerInteractWithBlock;
  }
  static create(inGameEventManager) {
    return new _InGamePlayerInteractWithBlock(inGameEventManager);
  }
};

// src/game/ingame/events/PlayerInteractWithEntity.ts
import {
  world as world35
} from "@minecraft/server";
var InGamePlayerInteractWithEntity = class _InGamePlayerInteractWithEntity extends InGameEventHandler {
  constructor(inGameEventManager) {
    super(inGameEventManager);
    this.inGameEventManager = inGameEventManager;
    this.beforeEvent = world35.beforeEvents.playerInteractWithEntity;
    this.afterEvent = world35.afterEvents.playerInteractWithEntity;
  }
  static create(inGameEventManager) {
    return new _InGamePlayerInteractWithEntity(inGameEventManager);
  }
};

// src/game/ingame/events/PlayerInventoryItemChange.ts
import { world as world36 } from "@minecraft/server";
var InGamePlayerInventoryItemChange = class _InGamePlayerInventoryItemChange extends InGameEventHandler {
  constructor(inGameEventManager) {
    super(inGameEventManager);
    this.inGameEventManager = inGameEventManager;
    this.afterEvent = world36.afterEvents.playerInventoryItemChange;
  }
  static create(inGameEventManager) {
    return new _InGamePlayerInventoryItemChange(inGameEventManager);
  }
};

// src/game/ingame/events/PlayerJoin.ts
import { world as world37 } from "@minecraft/server";
var InGamePlayerJoin = class _InGamePlayerJoin extends InGameEventHandler {
  constructor(inGameEventManager) {
    super(inGameEventManager);
    this.inGameEventManager = inGameEventManager;
    this.afterEvent = world37.afterEvents.playerJoin;
  }
  static create(inGameEventManager) {
    return new _InGamePlayerJoin(inGameEventManager);
  }
};

// src/game/ingame/events/PlayerLeave.ts
import { world as world38 } from "@minecraft/server";
var InGamePlayerLeave = class _InGamePlayerLeave extends InGameEventHandler {
  constructor(inGameEventManager) {
    super(inGameEventManager);
    this.inGameEventManager = inGameEventManager;
    this.beforeEvent = world38.beforeEvents.playerLeave;
    this.afterEvent = world38.afterEvents.playerLeave;
  }
  static create(inGameEventManager) {
    return new _InGamePlayerLeave(inGameEventManager);
  }
};

// src/game/ingame/events/PlayerPlaceBlock.ts
import { world as world39 } from "@minecraft/server";
var InGamePlayerPlaceBlock = class _InGamePlayerPlaceBlock extends InGameEventHandler {
  constructor(inGameEventManager) {
    super(inGameEventManager);
    this.inGameEventManager = inGameEventManager;
    this.afterEvent = world39.afterEvents.playerPlaceBlock;
  }
  static create(inGameEventManager) {
    return new _InGamePlayerPlaceBlock(inGameEventManager);
  }
};

// src/game/ingame/events/PlayerSpawn.ts
import { world as world40 } from "@minecraft/server";
var InGamePlayerSpawn = class _InGamePlayerSpawn extends InGameEventHandler {
  constructor(inGameEventManager) {
    super(inGameEventManager);
    this.inGameEventManager = inGameEventManager;
    this.afterEvent = world40.afterEvents.playerSpawn;
  }
  static create(inGameEventManager) {
    return new _InGamePlayerSpawn(inGameEventManager);
  }
};

// src/game/ingame/events/PressurePlatePop.ts
import { world as world41 } from "@minecraft/server";
var InGamePressurePlatePop = class _InGamePressurePlatePop extends InGameEventHandler {
  constructor(inGameEventManager) {
    super(inGameEventManager);
    this.inGameEventManager = inGameEventManager;
    this.afterEvent = world41.afterEvents.pressurePlatePop;
  }
  static create(inGameEventManager) {
    return new _InGamePressurePlatePop(inGameEventManager);
  }
};

// src/game/ingame/events/PressurePlatePush.ts
import { world as world42 } from "@minecraft/server";
var InGamePressurePlatePush = class _InGamePressurePlatePush extends InGameEventHandler {
  constructor(inGameEventManager) {
    super(inGameEventManager);
    this.inGameEventManager = inGameEventManager;
    this.afterEvent = world42.afterEvents.pressurePlatePush;
  }
  static create(inGameEventManager) {
    return new _InGamePressurePlatePush(inGameEventManager);
  }
};

// src/game/ingame/events/ProjectileHitBlock.ts
import { world as world43 } from "@minecraft/server";
var InGameProjectileHitBlock = class _InGameProjectileHitBlock extends InGameEventHandler {
  constructor(inGameEventManager) {
    super(inGameEventManager);
    this.inGameEventManager = inGameEventManager;
    this.afterEvent = world43.afterEvents.projectileHitBlock;
  }
  static create(inGameEventManager) {
    return new _InGameProjectileHitBlock(inGameEventManager);
  }
};

// src/game/ingame/events/ProjectileHitEntity.ts
import { world as world44 } from "@minecraft/server";
var InGameProjectileHitEntity = class _InGameProjectileHitEntity extends InGameEventHandler {
  constructor(inGameEventManager) {
    super(inGameEventManager);
    this.inGameEventManager = inGameEventManager;
    this.afterEvent = world44.afterEvents.projectileHitEntity;
  }
  static create(inGameEventManager) {
    return new _InGameProjectileHitEntity(inGameEventManager);
  }
};

// src/game/ingame/events/TargetBlockHit.ts
import { world as world45 } from "@minecraft/server";
var InGameTargetBlockHit = class _InGameTargetBlockHit extends InGameEventHandler {
  constructor(inGameEventManager) {
    super(inGameEventManager);
    this.inGameEventManager = inGameEventManager;
    this.afterEvent = world45.afterEvents.targetBlockHit;
  }
  static create(inGameEventManager) {
    return new _InGameTargetBlockHit(inGameEventManager);
  }
};

// src/game/ingame/events/WeatherChange.ts
import { world as world46 } from "@minecraft/server";
var InGameWeatherChange = class _InGameWeatherChange extends InGameEventHandler {
  constructor(inGameEventManager) {
    super(inGameEventManager);
    this.inGameEventManager = inGameEventManager;
    this.beforeEvent = world46.beforeEvents.weatherChange;
    this.afterEvent = world46.afterEvents.weatherChange;
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
import { world as world47 } from "@minecraft/server";

// src/game/ingame/game/GameManager.ts
import { system as system7 } from "@minecraft/server";
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
    this.tickIntervalId = system7.runInterval(() => {
      if (!this.isRunning)
        return;
      this.runTick();
    }, 1);
    this.secondIntervalId = system7.runInterval(() => {
      if (!this.isRunning)
        return;
      this.runSecond();
    }, 20);
  }
  finishGame() {
    if (!this.isRunning)
      return;
    if (this.tickIntervalId !== null) {
      system7.clearRun(this.tickIntervalId);
      this.tickIntervalId = null;
    }
    if (this.secondIntervalId !== null) {
      system7.clearRun(this.secondIntervalId);
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
    const kairoResponse = await KairoUtils.sendKairoCommandAndWaitResponse(
      KAIRO_COMMAND_TARGET_ADDON_IDS2.WEREWOLF_GAMEMANAGER,
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
    const players = world47.getPlayers();
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
import { system as system8 } from "@minecraft/server";
var OutGameScriptEventReceiveHandler = class _OutGameScriptEventReceiveHandler extends BaseEventHandler {
  constructor(outGameEventManager) {
    super(outGameEventManager);
    this.outGameEventManager = outGameEventManager;
    this.afterEvent = system8.afterEvents.scriptEventReceive;
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
var BaseDefinitionRegistrationRequester = class {
  constructor(definitionManager, definitionType) {
    this.definitionManager = definitionManager;
    this.definitionType = definitionType;
  }
  request(definitions) {
    KairoUtils.sendKairoCommand(
      KAIRO_COMMAND_TARGET_ADDON_IDS2.WEREWOLF_GAMEMANAGER,
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
      case SCRIPT_EVENT_MESSAGES2.IN_GAME:
        this.systemManager.changeWorldState("InGame" /* InGame */, ingameConstants);
        break;
      case SCRIPT_EVENT_MESSAGES2.OUT_GAME:
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
      return KairoUtils.buildKairoResponse({}, false, "InGameManager is not initialized");
    return this.inGameManager.handlePlayerSkillTrigger(playerId, eventType);
  }
};

// src/game/ingame/events/TripWireTrip.ts
import { world as world48 } from "@minecraft/server";
var InGameTripWireTrip = class _InGameTripWireTrip extends InGameEventHandler {
  constructor(inGameEventManager) {
    super(inGameEventManager);
    this.inGameEventManager = inGameEventManager;
    this.afterEvent = world48.afterEvents.tripWireTrip;
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
  SystemManager
};
