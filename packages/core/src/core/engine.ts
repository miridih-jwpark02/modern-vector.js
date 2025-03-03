import {
  VectorEngine,
  Plugin,
  RendererService,
  EventService,
  SceneService,
  GroupOptions,
  ExampleOptions,
  ExampleResult,
  Group,
  SceneNode,
} from './types';
import { DefaultRendererService } from './services/renderer';
import { DefaultEventService } from './services/events';
import { DefaultSceneService } from './services/scene';

/**
 * Vector Graphics Engine implementation
 */
export class VectorEngineImpl implements VectorEngine {
  private readonly plugins: Map<string, Plugin> = new Map();

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

  /**
   * 그룹 생성 메서드 - GroupPlugin에 의해 런타임에 구현됨
   * @param _children - 초기 자식 노드 목록
   * @param _options - 그룹 생성 옵션
   * @throws Error if GroupPlugin is not installed
   */
  createGroup(_children?: ReadonlyArray<SceneNode>, _options?: GroupOptions): Group {
    throw new Error('GroupPlugin is not installed');
  }

  /**
   * 예제 실행 메서드 - ExamplePlugin에 의해 런타임에 구현됨
   * @param {ExampleOptions} _options - 예제 옵션 및 매개변수
   * @returns {ExampleResult<T>} 예제 실행 결과
   * @throws {Error} ExamplePlugin이 설치되지 않은 경우
   */
  executeExample<T = unknown>(_options: ExampleOptions): ExampleResult<T> {
    throw new Error(
      'executeExample() 메서드를 사용하려면 먼저 ExamplePlugin을 설치해야 합니다. engine.use(new ExamplePlugin())을 호출하세요.'
    );
  }
}
