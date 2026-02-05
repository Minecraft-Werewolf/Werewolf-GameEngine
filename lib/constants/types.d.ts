import type { RawMessage } from "@minecraft/server";
export declare const GameEventTypeValues: readonly ["AfterGameStart", "BeforeMeetingStart", "AfterMeetingStart", "SkillUse", "SkillUseInMeeting", "SkillUseOutMeeting", "Death"];
export type GameEventType = (typeof GameEventTypeValues)[number];
interface RoleKey {
    readonly addonId: string;
    readonly roleId: string;
}
type RoleRef = RoleKey;
export interface BaseDefinition {
    readonly id: string;
}
export interface SettingDefinition extends BaseDefinition {
}
export interface RoleGroupDefinition extends BaseDefinition {
}
export interface RoleDefinition extends BaseDefinition {
    readonly name: RawMessage;
    readonly description: RawMessage;
    readonly factionId: string;
    readonly roleGroup?: {
        id: string;
        name: RawMessage;
        color: string;
    };
    readonly isExcludedFromSurvivalCheck?: boolean;
    readonly count?: {
        max?: number;
        step?: number;
    };
    readonly color?: string;
    readonly divinationResult?: string;
    readonly clairvoyanceResult?: string;
    readonly revealTo?: {
        readonly roles?: readonly string[];
        readonly factions?: readonly string[];
        readonly roleGroups?: readonly string[];
    };
    readonly skills?: SkillDefinition[];
    readonly handleGameEvents?: RoleSkillEvents;
    readonly appearance?: {
        readonly toSelf?: RoleRef;
        readonly toOthers?: RoleRef;
        readonly toWerewolves?: RoleRef;
    };
    readonly sortIndex: number;
}
export type SkillValue = number | string;
export interface SkillDefinition {
    id: string;
    name: RawMessage;
    cooldown?: SkillValue;
    maxUses?: SkillValue;
}
export interface SkillEventBinding {
    skillId: string;
}
export type RoleSkillEvents = Partial<Record<GameEventType, SkillEventBinding>>;
export interface FactionDefinition extends BaseDefinition {
    readonly defaultRoleId: string;
    readonly type: FactionCategory;
    readonly name: RawMessage;
    readonly description: RawMessage;
    readonly defaultColor: string;
    readonly victoryCondition: VictoryCondition;
    readonly sortIndex: number;
}
export type FactionCategory = "standard" | "independent" | "neutral";
interface VictoryCondition {
    priority: number;
    condition: Condition;
    description: RawMessage;
    presentation: {
        title: RawMessage;
        message: RawMessage;
    };
}
type GameVariableKey = "remainingTime" | "alivePlayerCount";
type NumericValue = number | GameVariableKey | {
    factionAliveCount: string;
};
type Condition = StandardFactionVictoryCondition | ComparisonCondition | FactionAliveCountComparison | PlayerAliveCountComparison | RemainingTimeComparison | AndCondition | OrCondition | NotCondition;
export interface StandardFactionVictoryCondition {
    type: "standardFactionVictory";
}
interface ComparisonCondition {
    type: "comparison";
    operator: "==" | "!=" | "<" | "<=" | ">" | ">=";
    left: NumericValue;
    right: NumericValue;
}
interface FactionAliveCountComparison {
    type: "factionAliveCount";
    factionId: string;
    operator: "==" | "!=" | "<" | "<=" | ">" | ">=";
    value: NumericValue;
}
interface PlayerAliveCountComparison {
    type: "playerAliveCount";
    operator: "==" | "!=" | "<" | "<=" | ">" | ">=";
    value: NumericValue;
}
interface RemainingTimeComparison {
    type: "remainingTime";
    operator: "==" | "!=" | "<" | "<=" | ">" | ">=";
    value: NumericValue;
}
interface AndCondition {
    type: "and";
    conditions: Condition[];
}
interface OrCondition {
    type: "or";
    conditions: Condition[];
}
interface NotCondition {
    type: "not";
    condition: Condition;
}
export {};
