import { VectorEngine, Plugin, RendererService, EventService, SceneService } from './types';
import { DefaultRendererService } from './services/renderer';
import { DefaultEventService } from './services/events';
import { DefaultSceneService } from './services/scene';

/**
 * Vector Graphics Engine implementation
 */
export class VectorEngineImpl implements VectorEngine {
  private plugins: Map<string, Plugin> = new Map();

  readonly renderer: RendererService;
  readonly events: EventService;
  readonly scene: SceneService;

  constructor() {
    this.renderer = new DefaultRendererService();
    this.events = new DefaultEventService();
    this.scene = new DefaultSceneService(this);
  }

  /**
   * Install a plugin into the engine
   * @param plugin - The plugin to install
   * @throws Error if plugin dependencies are not met
   */
  use(plugin: Plugin): void {
    // Check dependencies
    if (plugin.dependencies) {
      for (const dep of plugin.dependencies) {
        if (!this.plugins.has(dep)) {
          throw new Error(`Plugin ${plugin.id} requires ${dep} to be installed first`);
        }
      }
    }

    // Install plugin
    plugin.install(this);
    this.plugins.set(plugin.id, plugin);
  }

  /**
   * Remove a plugin from the engine
   * @param pluginId - ID of the plugin to remove
   */
  remove(pluginId: string): void {
    const plugin = this.plugins.get(pluginId);
    if (plugin) {
      // Check if other plugins depend on this one
      for (const [id, p] of this.plugins) {
        if (p.dependencies?.includes(pluginId)) {
          throw new Error(`Cannot remove plugin ${pluginId}: plugin ${id} depends on it`);
        }
      }

      plugin.uninstall(this);
      this.plugins.delete(pluginId);
    }
  }

  /**
   * Get a plugin by ID
   * @param id - Plugin ID
   * @returns The plugin instance or null if not found
   */
  getPlugin<T extends Plugin>(id: string): T | null {
    return (this.plugins.get(id) as T) || null;
  }
}
