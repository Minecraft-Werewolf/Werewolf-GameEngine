import type { IngameConstantsDTO } from "../ingame/game/IngameConstants";
import { GameWorldState, type SystemManager } from "../SystemManager";
export declare class WorldStateChanger {
    private readonly systemManager;
    private constructor();
    static create(systemManager: SystemManager): WorldStateChanger;
    change(next: GameWorldState, ingameConstants?: IngameConstantsDTO): void;
    private toInGame;
    private toOutGame;
}
