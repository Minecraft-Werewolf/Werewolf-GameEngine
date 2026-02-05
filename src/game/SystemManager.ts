import { KairoUtils, type KairoCommand, type KairoResponse } from "@kairo-ts/router";
import type { GameEventType } from "../constants/types";
import type { IngameConstantsDTO } from "./ingame/game/IngameConstants";
import type { GamePhase } from "./ingame/GamePhase";
import { InGameManager } from "./ingame/InGameManager";
import { OutGameManager } from "./outgame/OutGameManager";
import { DefinitionManager } from "./system/definitions/DefinitionManager";
import { SystemEventManager } from "./system/events/SystemEventManager";
import { ScriptEventReceiver } from "./system/ScriptEventReceiver";
import { WorldStateChanger } from "./system/WorldStateChanger";
import { DefinitionRegistry } from "./system/definitions/DefinitionRegistry";

export enum GameWorldState {
    OutGame = "OutGame",
    InGame = "InGame",
}

export class SystemManager {
    private readonly scriptEventReceiver = ScriptEventReceiver.create(this);
    private readonly systemEventManager = SystemEventManager.create(this);
    private readonly worldStateChanger = WorldStateChanger.create(this);
    private readonly definitionManager = DefinitionManager.create(this);
    private readonly registry = DefinitionRegistry.create(this);
    private inGameManager: InGameManager | null = null;
    private outGameManager: OutGameManager | null = null;
    private currentWorldState: GameWorldState | null = null;

    private constructor() {}

    public init(): void {
        this.definitionManager.requestDefinitionsRegistration();

        // WorldState について GameManager に尋ねることと、
        // requestがちゃんと通ったかを GameManager から返してもらいたい。
    }

    private static instance: SystemManager | null = null;

    public static getInstance(): SystemManager {
        if (this.instance === null) {
            this.instance = new SystemManager();
        }
        return this.instance;
    }

    public async handleScriptEvent(data: KairoCommand): Promise<void | KairoResponse> {
        return this.scriptEventReceiver.handleScriptEvent(data);
    }

    public subscribeEvents(): void {
        this.systemEventManager.subscribeAll();
    }

    public unsubscribeEvents(): void {
        this.systemEventManager.unsubscribeAll();
    }
    public changeWorldState(nextState: GameWorldState, ingameConstants?: IngameConstantsDTO): void {
        this.worldStateChanger.change(nextState, ingameConstants);
    }

    public getWorldState(): GameWorldState | null {
        return this.currentWorldState;
    }
    public setWorldState(state: GameWorldState): void {
        this.currentWorldState = state;
    }

    public getInGameManager() {
        return this.inGameManager;
    }
    public setInGameManager(v: InGameManager | null) {
        this.inGameManager = v;
    }

    public getOutGameManager() {
        return this.outGameManager;
    }
    public setOutGameManager(v: OutGameManager | null) {
        this.outGameManager = v;
    }

    public getRegistry(): DefinitionRegistry {
        return this.registry;
    }

    public createInGameManager(ingameConstants: IngameConstantsDTO): InGameManager {
        return InGameManager.create(this, ingameConstants);
    }
    public createOutGameManager(): OutGameManager {
        return OutGameManager.create(this);
    }

    public setCurrentPhase(newPhase: GamePhase): void {
        if (!this.inGameManager) return;
        this.inGameManager.setCurrentPhase(newPhase);
    }

    public async handlePlayerSkillTrigger(
        playerId: string,
        eventType: GameEventType,
    ): Promise<KairoResponse> {
        if (!this.inGameManager)
            return KairoUtils.buildKairoResponse({}, false, "InGameManager is not initialized");
        return this.inGameManager.handlePlayerSkillTrigger(playerId, eventType);
    }
}
