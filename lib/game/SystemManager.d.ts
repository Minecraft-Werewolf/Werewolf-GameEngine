import { type KairoCommand, type KairoResponse } from "@kairo-ts/router";
import type { GameEventType } from "../constants/types";
import type { IngameConstantsDTO } from "./ingame/game/IngameConstants";
import type { GamePhase } from "./ingame/GamePhase";
import { InGameManager } from "./ingame/InGameManager";
import { OutGameManager } from "./outgame/OutGameManager";
import { DefinitionRegistry } from "./system/definitions/DefinitionRegistry";
export declare enum GameWorldState {
    OutGame = "OutGame",
    InGame = "InGame"
}
export declare class SystemManager {
    private readonly scriptEventReceiver;
    private readonly systemEventManager;
    private readonly worldStateChanger;
    private readonly definitionManager;
    private readonly registry;
    private inGameManager;
    private outGameManager;
    private currentWorldState;
    private constructor();
    init(): void;
    private static instance;
    static getInstance(): SystemManager;
    handleScriptEvent(data: KairoCommand): Promise<void | KairoResponse>;
    subscribeEvents(): void;
    unsubscribeEvents(): void;
    changeWorldState(nextState: GameWorldState, ingameConstants?: IngameConstantsDTO): void;
    getWorldState(): GameWorldState | null;
    setWorldState(state: GameWorldState): void;
    getInGameManager(): InGameManager | null;
    setInGameManager(v: InGameManager | null): void;
    getOutGameManager(): OutGameManager | null;
    setOutGameManager(v: OutGameManager | null): void;
    getRegistry(): DefinitionRegistry;
    createInGameManager(ingameConstants: IngameConstantsDTO): InGameManager;
    createOutGameManager(): OutGameManager;
    setCurrentPhase(newPhase: GamePhase): void;
    handlePlayerSkillTrigger(playerId: string, eventType: GameEventType): Promise<KairoResponse>;
}
