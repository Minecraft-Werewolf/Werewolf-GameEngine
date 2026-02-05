import type { KairoCommand, KairoResponse } from "@kairo-ts/router";
import { type SystemManager } from "../SystemManager";
export declare class ScriptEventReceiver {
    private readonly systemManager;
    private constructor();
    static create(systemManager: SystemManager): ScriptEventReceiver;
    handleScriptEvent(command: KairoCommand): Promise<void | KairoResponse>;
    private handleWorldStateChange;
}
