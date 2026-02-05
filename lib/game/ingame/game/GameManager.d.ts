import type { InGameManager } from "../InGameManager";
import type { SelfPlayerData } from "../PlayerData";
import type { IngameConstants } from "./IngameConstants";
export type GameEventContext = {
    readonly playerData: SelfPlayerData;
    readonly playersData: readonly SelfPlayerData[];
    readonly ingameConstants: IngameConstants;
};
type GameEventHandler = (ev: GameEventContext) => void;
export declare class GameManager {
    private readonly inGameManager;
    private readonly onTickHandler?;
    private readonly onSecondHandler?;
    private isRunning;
    private tickIntervalId;
    private secondIntervalId;
    private constructor();
    static create(inGameManager: InGameManager, handlers: {
        onTickUpdate?: GameEventHandler;
        onSecondUpdate?: GameEventHandler;
    }): GameManager;
    startGame(): void;
    finishGame(): void;
    private runTick;
    private runSecond;
}
export {};
