import { Plugin, VectorEngine, SceneNode } from '../../../core/types';
import { GroupOptions, GroupPlugin, Group } from './types';
import { DefaultGroup } from './group';
import { v4 as uuidv4 } from 'uuid';
import { addTypedEngineMethod, removeEngineMethod } from '../../../core/utils/plugin-utils';
import { PluginMethodDefinition } from '../../../core/types/extensions/plugin-extension';

/**
 * GroupPlugin 클래스는 그룹 기능을 제공하는 플러그인입니다.
 * @implements {GroupPlugin}
 */
export class DefaultGroupPlugin implements Plugin, GroupPlugin {
  /** 플러그인 ID */
  readonly id = 'group-plugin';
  /** 플러그인 이름 */
  readonly name = 'Group Plugin';
  /** 플러그인 버전 */
  readonly version = '1.0.0';
  /** 플러그인 설명 */
  readonly description = '여러 SceneNode를 그룹화하는 기능을 제공하는 플러그인';
  /** 플러그인 의존성 */
  readonly dependencies = ['shape-plugin'];
  /** 엔진 인스턴스 */
  private engine: VectorEngine | null = null;

  /**
   * 플러그인 설치
   * @param {VectorEngine} engine - 벡터 엔진 인스턴스
   */
  install(engine: VectorEngine): void {
    if (this.engine) {
      console.warn('GroupPlugin is already installed');
      return;
    }

    this.engine = engine;

    // 엔진에 그룹 생성 메서드 추가
    // TypeScript의 interface 확장을 통해 타입이 정의되어 있으므로
    // 런타임에만 메서드를 추가합니다.
    const createGroupMethod: PluginMethodDefinition<
      (children?: SceneNode[], options?: GroupOptions) => Group
    > = {
      name: 'createGroup',
      method: this.createGroup.bind(this),
    };

    addTypedEngineMethod(engine, createGroupMethod);
  }

  /**
   * 플러그인 제거
   * @param {VectorEngine} engine - 벡터 엔진 인스턴스
   */
  uninstall(engine: VectorEngine): void {
    if (!this.engine) {
      console.warn('GroupPlugin is not installed');
      return;
    }

    // 엔진에서 그룹 생성 메서드 제거
    removeEngineMethod(engine, 'createGroup');
    this.engine = null;
  }

  /**
   * 그룹 생성
   * @param {SceneNode[]} [children] - 초기 자식 노드 목록
   * @param {GroupOptions} [options] - 그룹 생성 옵션
   * @returns {Group} 생성된 Group 인스턴스
   */
  createGroup(children?: SceneNode[], options?: GroupOptions): Group {
    if (!this.engine) {
      throw new Error('GroupPlugin is not installed');
    }

    // 고유 ID 생성
    const id = options?.id || `group-${uuidv4()}`;

    // 그룹 인스턴스 생성
    const group = new DefaultGroup(
      id,
      {
        ...options,
        children,
      },
      this.engine.events
    );

    return group;
  }
}
