import {
  SceneService,
  Scene,
  VectorEngine,
  TypedEventEmitter,
  Plugin,
  Renderer,
  SceneNode,
  EventMap,
  EventHandler,
  BaseEventData,
} from '../types';
import { DefaultSceneNode } from './scene-node';

/**
 * Default Scene implementation
 */
class DefaultScene implements Scene {
  readonly root: SceneNode;
  readonly plugins: Map<string, Plugin>;
  private eventEmitter: TypedEventEmitter;

  constructor(
    private engine: VectorEngine,
    eventEmitter: TypedEventEmitter
  ) {
    this.root = new DefaultSceneNode('scene-root', eventEmitter);
    this.plugins = new Map();
    this.eventEmitter = eventEmitter;
  }

  get renderer(): Renderer {
    return this.engine.renderer as unknown as Renderer;
  }

  on<K extends keyof EventMap>(event: K, handler: EventHandler<EventMap[K]>): void {
    this.eventEmitter.on(event, handler);
  }

  off<K extends keyof EventMap>(event: K, handler: EventHandler<EventMap[K]>): void {
    this.eventEmitter.off(event, handler);
  }

  emit<K extends keyof EventMap>(event: K, data: EventMap[K]): void {
    this.eventEmitter.emit(event, data);
  }
}

/**
 * Default implementation of SceneService
 */
export class DefaultSceneService implements SceneService {
  private scenes: Set<Scene> = new Set();
  private activeScene: Scene | null = null;

  constructor(private engine: VectorEngine) {}

  /**
   * Create a new scene
   * @returns The newly created scene
   */
  create(): Scene {
    const scene = new DefaultScene(this.engine, this.engine.events.createNamespace('scene'));
    this.scenes.add(scene);

    // Set as active if it's the first scene
    if (!this.activeScene) {
      this.activeScene = scene;
    }

    return scene;
  }

  /**
   * Get the active scene
   * @returns The active scene
   */
  getActive(): Scene {
    if (!this.activeScene) {
      throw new Error('No active scene available');
    }
    return this.activeScene;
  }

  /**
   * Set the active scene
   * @param scene - The scene to set as active
   */
  setActive(scene: Scene): void {
    if (!this.scenes.has(scene)) {
      throw new Error('Scene is not managed by this service');
    }
    this.activeScene = scene;
  }
}
