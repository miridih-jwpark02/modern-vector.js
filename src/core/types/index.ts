/**
 * Plugin interface for the vector graphics engine
 */
export interface Plugin {
  /** Unique identifier for the plugin */
  readonly id: string;
  /** Semantic version of the plugin */
  readonly version: string;
  /** Optional array of plugin IDs that this plugin depends on */
  readonly dependencies?: string[];
  
  /**
   * Install the plugin into the engine
   * @param engine - The vector engine instance
   */
  install(engine: VectorEngine): void;
  
  /**
   * Uninstall the plugin from the engine
   * @param engine - The vector engine instance
   */
  uninstall(engine: VectorEngine): void;
}

/**
 * Core engine interface that manages plugins and essential services
 */
export interface VectorEngine {
  /** Plugin management methods */
  use(plugin: Plugin): void;
  remove(pluginId: string): void;
  getPlugin<T extends Plugin>(id: string): T | null;
  
  /** Essential services */
  readonly renderer: RendererService;
  readonly events: EventService;
  readonly scene: SceneService;
}

/**
 * Event handler type definition
 */
export type EventHandler = (data: any) => void;

/**
 * Event emitter interface for handling events
 */
export interface EventEmitter {
  on(event: string, handler: EventHandler): void;
  off(event: string, handler: EventHandler): void;
  emit(event: string, data: any): void;
}

/**
 * Service for managing renderers
 */
export interface RendererService {
  register(renderer: Renderer): void;
  setActive(rendererId: string): void;
  render(scene: Scene): void;
}

/**
 * Service for managing events with namespacing support
 */
export interface EventService extends EventEmitter {
  createNamespace(name: string): EventEmitter;
}

/**
 * Service for managing scenes
 */
export interface SceneService {
  create(): Scene;
  getActive(): Scene;
  setActive(scene: Scene): void;
}

/**
 * Scene interface representing a container for shapes
 */
export interface Scene extends EventEmitter {
  readonly root: Node;
  readonly renderer: Renderer;
  readonly plugins: Map<string, Plugin>;
}

/**
 * Base renderer interface
 */
export interface Renderer {
  readonly id: string;
  readonly capabilities: RendererCapabilities;
  render(scene: Scene): void;
  dispose(): void;
}

/**
 * Renderer capabilities interface
 */
export interface RendererCapabilities {
  readonly maxTextureSize: number;
  readonly supportsSVG: boolean;
  readonly supportsWebGL: boolean;
  readonly supports3D: boolean;
} 