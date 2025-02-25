import { VectorEngine, Plugin, RendererService, EventService, SceneService } from './types';

/**
 * Vector Graphics Engine implementation
 */
export declare class VectorEngineImpl implements VectorEngine {
    private plugins;
    readonly renderer: RendererService;
    readonly events: EventService;
    readonly scene: SceneService;
    constructor();
    /**
     * Install a plugin into the engine
     * @param plugin - The plugin to install
     * @throws Error if plugin dependencies are not met
     */
    use(plugin: Plugin): void;
    /**
     * Remove a plugin from the engine
     * @param pluginId - ID of the plugin to remove
     */
    remove(pluginId: string): void;
    /**
     * Get a plugin by ID
     * @param id - Plugin ID
     * @returns The plugin instance or null if not found
     */
    getPlugin<T extends Plugin>(id: string): T | null;
}
//# sourceMappingURL=engine.d.ts.map