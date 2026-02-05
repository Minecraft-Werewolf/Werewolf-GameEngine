import { system } from "@minecraft/server";
import type { InGameManager } from "../InGameManager";
import type { SelfPlayerData } from "../PlayerData";
import type { IngameConstants } from "./IngameConstants";

export type GameEventContext = {
    readonly playerData: SelfPlayerData;
    readonly playersData: readonly SelfPlayerData[];
    readonly ingameConstants: IngameConstants;
};

type GameEventHandler = (ev: GameEventContext) => void;

export class GameManager {
    private isRunning = false;

    private tickIntervalId: number | null = null;
    private secondIntervalId: number | null = null;

    private constructor(
        private readonly inGameManager: InGameManager,
        private readonly onTickHandler?: GameEventHandler,
        private readonly onSecondHandler?: GameEventHandler,
    ) {}

    public static create(
        inGameManager: InGameManager,
        handlers: {
            onTickUpdate?: GameEventHandler;
            onSecondUpdate?: GameEventHandler;
        },
    ): GameManager {
        return new GameManager(inGameManager, handlers.onTickUpdate, handlers.onSecondUpdate);
    }

    public startGame(): void {
        if (this.isRunning) return;
        this.isRunning = true;

        this.tickIntervalId = system.runInterval(() => {
            if (!this.isRunning) return;
            this.runTick();
        }, 1);

        this.secondIntervalId = system.runInterval(() => {
            if (!this.isRunning) return;
            this.runSecond();
        }, 20);
    }

    public finishGame(): void {
        if (!this.isRunning) return;

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

    private runTick(): void {
        if (!this.onTickHandler) return;

        const ingameConstants = this.inGameManager.getIngameConstants();
        const playersData = this.inGameManager.getSelfPlayersData();

        for (const playerData of playersData) {
            this.onTickHandler({
                playerData,
                playersData,
                ingameConstants,
            });
        }
    }

    private runSecond(): void {
        if (!this.onSecondHandler) return;

        const ingameConstants = this.inGameManager.getIngameConstants();
        const playersData = this.inGameManager.getSelfPlayersData();

        for (const playerData of playersData) {
            this.onSecondHandler({
                playerData,
                playersData,
                ingameConstants,
            });
        }
    }
}
