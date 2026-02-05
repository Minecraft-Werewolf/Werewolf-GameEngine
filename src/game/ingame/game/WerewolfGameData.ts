import type { RoleDefinition } from "../../../constants/types";

export type WerewolfGameData = {
    remainingTicks: number;
    playersData: PlayerData[];
};

export type PlayerData = {
    player: {
        id: string;
        name: string;
    };
    role: RoleDefinition | null;
    isAlive: boolean;
    isLeave: boolean;
    isVictory: boolean;
};
