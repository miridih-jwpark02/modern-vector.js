/**
 * Core 타입 정의
 *
 * @packageDocumentation
 * @module Core
 */

// 기본 타입 시스템 export
export * from './core-types';

// 이벤트 시스템 타입 export
export * from './event-types';

// 플러그인 시스템 타입 export
export * from './plugin-types';

// 그룹 관련 타입 export - 필요한 것들만 명시적으로 가져오기
export { Group, GroupOptions, NodeType, isGroup } from './group';

// TypedEventEmitter는 TypedEventEmitter<EventMap>의 별칭
import { TypedEventEmitter as BaseTypedEventEmitter, EventMap } from './event-types';
import { NodeID, TypedRecord } from './core-types';
import { ExampleOptions, ExampleResult } from './plugin-types';
import { Group, GroupOptions } from './group';

export type TypedEventEmitter = BaseTypedEventEmitter<EventMap>;

// 플러그인 확장 타입 export (필요한 경우)
// export * from './extensions';

/**
 * Plugin interface for the vector graphics engine
 *
 * 벡터 그래픽 엔진을 위한 플러그인 인터페이스
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
   *
   * 엔진에 플러그인을 설치합니다.
   *
   * @param engine - The vector engine instance
   */
  install(engine: VectorEngine): void;

  /**
   * Uninstall the plugin from the engine
   *
   * 엔진에서 플러그인을 제거합니다.
   *
   * @param engine - The vector engine instance
   */
  uninstall(engine: VectorEngine): void;
}

/**
 * 플러그인 인스턴스와 함께 사용할 수 있는 타입
 */
export type PluginWithManipulators<T extends Plugin> = T & {
  /**
   * 플러그인 인스턴스
   */
  readonly plugin: T;
};

/**
 * SceneNode interface representing a node in the scene graph
 *
 * 장면 그래프의 노드를 나타내는 인터페이스입니다.
 */
export interface SceneNode extends TypedEventEmitter {
  /** 노드의 고유 ID */
  readonly id: NodeID;
  /** 부모 노드 */
  parent: SceneNode | null;
  /** 자식 노드 목록 */
  readonly children: ReadonlyArray<SceneNode>;
  /** 노드에 연결된 데이터 */
  readonly data: TypedRecord<string, unknown>;

  /**
   * 자식 노드 추가
   *
   * @param child - 추가할 자식 노드
   * @returns 추가된 자식 노드
   */
  addChild(child: SceneNode): SceneNode;

  /**
   * 자식 노드 제거
   *
   * @param child - 제거할 자식 노드
   * @returns 제거 성공 여부
   */
  removeChild(child: SceneNode): boolean;

  /**
   * 모든 자식 노드 제거
   */
  clearChildren(): void;

  /**
   * ID로 자식 노드 찾기
   *
   * @param id - 찾을 노드의 ID
   * @returns 찾은 노드 또는 null
   */
  findChildById(id: string): SceneNode | null;
}

/**
 * Service for managing renderers
 *
 * 렌더러를 관리하는 서비스 인터페이스입니다.
 */
export interface RendererService {
  /**
   * 렌더러 등록
   *
   * @param renderer - 등록할 렌더러
   */
  register(renderer: Renderer): void;

  /**
   * 활성 렌더러 설정
   *
   * @param rendererId - 활성화할 렌더러의 ID
   */
  setActive(rendererId: string): void;

  /**
   * 장면 렌더링
   *
   * @param scene - 렌더링할 장면
   */
  render(scene: Scene): void;
}

/**
 * Service for managing events with namespacing support
 *
 * 네임스페이스를 지원하는 이벤트 관리 서비스 인터페이스입니다.
 */
export interface EventService extends TypedEventEmitter {
  /**
   * 이벤트 네임스페이스 생성
   *
   * @param name - 네임스페이스 이름
   * @returns 생성된 이벤트 이미터
   */
  createNamespace(name: string): TypedEventEmitter;
}

/**
 * Service for managing scenes
 *
 * 장면을 관리하는 서비스 인터페이스입니다.
 */
export interface SceneService {
  /**
   * 새 장면 생성
   *
   * @returns 생성된 장면
   */
  create(): Scene;

  /**
   * 활성 장면 가져오기
   *
   * @returns 현재 활성화된 장면
   */
  getActive(): Scene;

  /**
   * 활성 장면 설정
   *
   * @param scene - 활성화할 장면
   */
  setActive(scene: Scene): void;
}

/**
 * Scene interface representing a container for shapes
 *
 * Shape들을 포함하는 장면 인터페이스입니다.
 */
export interface Scene extends TypedEventEmitter {
  /** 장면의 루트 노드 */
  readonly root: SceneNode;
  /** 장면의 렌더러 */
  readonly renderer: Renderer;
  /** 장면에 등록된 플러그인 맵 */
  readonly plugins: ReadonlyMap<string, Plugin>;
}

/**
 * Base renderer interface
 *
 * 다양한 렌더링 백엔드를 위한 기본 인터페이스입니다.
 */
export interface Renderer {
  /** Renderer의 고유 ID */
  readonly id: string;
  /** Renderer의 기능 */
  readonly capabilities: RendererCapabilities;

  /**
   * Scene 렌더링
   *
   * 주어진 Scene을 렌더링합니다.
   *
   * @param scene - 렌더링할 Scene
   */
  render(scene: Scene): void;

  /**
   * 리소스 정리
   *
   * Renderer가 사용한 리소스를 정리합니다.
   */
  dispose(): void;
}

/**
 * Renderer capabilities interface
 *
 * 렌더러의 기능과 제한사항을 정의하는 인터페이스입니다.
 */
export interface RendererCapabilities {
  /** 최대 텍스처 크기 */
  readonly maxTextureSize: number;
  /** SVG 지원 여부 */
  readonly supportsSVG: boolean;
  /** WebGL 지원 여부 */
  readonly supportsWebGL: boolean;
  /** 3D 지원 여부 */
  readonly supports3D: boolean;
}

/**
 * Core engine interface that manages plugins and essential services
 *
 * 플러그인과 필수 서비스를 관리하는 코어 엔진 인터페이스
 */
export interface VectorEngine {
  /**
   * Install a plugin into the engine
   *
   * 엔진에 플러그인을 설치합니다.
   *
   * @param plugin - The plugin to install
   */
  use(plugin: Plugin): void;

  /**
   * Remove a plugin from the engine
   *
   * 엔진에서 플러그인을 제거합니다.
   *
   * @param pluginId - ID of the plugin to remove
   */
  remove(pluginId: string): void;

  /**
   * Get a plugin by ID
   *
   * ID로 플러그인을 가져옵니다.
   *
   * @param id - Plugin ID
   * @returns The plugin instance or null if not found
   */
  getPlugin<T extends Plugin>(id: string): T | null;

  /** Renderer service */
  readonly renderer: RendererService;
  /** Event service */
  readonly events: EventService;
  /** Scene service */
  readonly scene: SceneService;

  /**
   * 그룹 생성 메서드 - GroupPlugin에 의해 런타임에 구현됨
   * @param children - 초기 자식 노드 목록
   * @param options - 그룹 생성 옵션
   * @throws Error if GroupPlugin is not installed
   */
  createGroup(children?: ReadonlyArray<SceneNode>, options?: GroupOptions): Group;

  /**
   * 예제 기능 실행
   *
   * ExamplePlugin이 설치되면 사용 가능한 메서드입니다.
   * 런타임에 동적으로 추가됩니다.
   *
   * @param options - 예제 옵션
   * @throws Error - ExamplePlugin이 설치되지 않은 경우
   */
  executeExample<T = unknown>(options: ExampleOptions): ExampleResult<T>;
}
