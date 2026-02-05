import type { IngameConstantsDTO } from "../ingame/game/IngameConstants";
import { GameWorldState, type SystemManager } from "../SystemManager";

export class WorldStateChanger {
    private constructor(private readonly systemManager: SystemManager) {}
    public static create(systemManager: SystemManager): WorldStateChanger {
        return new WorldStateChanger(systemManager);
    }

    public change(next: GameWorldState, ingameConstants?: IngameConstantsDTO): void {
        const current = this.systemManager.getWorldState();
        if (current === next) return;

        switch (next) {
            case GameWorldState.InGame:
                this.toInGame(ingameConstants!);
                break;

            case GameWorldState.OutGame:
                this.toOutGame();
                break;
        }
    }

    private toInGame(ingameConstants: IngameConstantsDTO): void {
        this.systemManager.getOutGameManager()?.getOutGameEventManager().unsubscribeAll();
        this.systemManager.setOutGameManager(null);

        const InGameManager = this.systemManager.createInGameManager(ingameConstants);
        InGameManager.getInGameEventManager().subscribeAll();
        this.systemManager.setInGameManager(InGameManager);

        this.systemManager.setWorldState(GameWorldState.InGame);
    }

    private toOutGame(): void {
        this.systemManager.getInGameManager()?.getInGameEventManager().unsubscribeAll();
        this.systemManager.setInGameManager(null);

        const OutGameManager = this.systemManager.createOutGameManager();
        OutGameManager.getOutGameEventManager().subscribeAll();
        this.systemManager.setOutGameManager(OutGameManager);

        this.systemManager.setWorldState(GameWorldState.OutGame);
    }
}
