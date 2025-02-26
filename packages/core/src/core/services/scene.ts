import {
  SceneService,
  Scene,
  VectorEngine,
  EventEmitter,
  Plugin,
  Renderer,
  SceneNode,
} from '../types';
import { DefaultSceneNode } from './scene-node';

/**
 * Default Scene implementation
 */
class DefaultScene implements Scene {
  readonly root: SceneNode;
  readonly plugins: Map<string, Plugin>;
  private eventEmitter: EventEmitter;

  constructor(
    private engine: VectorEngine,
    eventEmitter: EventEmitter
  ) {
    this.root = new DefaultSceneNode('scene-root', eventEmitter);
    this.plugins = new Map();
    this.eventEmitter = eventEmitter;
  }

  get renderer(): Renderer {
    return this.engine.renderer as unknown as Renderer;
  }

  on(event: string, handler: (data: any) => void): void {
    this.eventEmitter.on(event, handler);
  }

  off(event: string, handler: (data: any) => void): void {
    this.eventEmitter.off(event, handler);
  }

  emit(event: string, data: any): void {
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
