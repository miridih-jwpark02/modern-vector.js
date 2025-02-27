import { VectorEngine } from '../../../core/types';
import { ExampleOptions, ExamplePluginManipulators, ExampleResult } from './types';
import { v4 as uuidv4 } from 'uuid';
import { addTypedEngineMethod, removeEngineMethod } from '../../../core/utils/plugin-utils';
import {
  PluginMethodDefinition,
  PluginExtension,
} from '../../../core/types/extensions/plugin-extension';
import { DefaultPluginRegistry } from '../../../core/types/extensions/plugin-registry';

/**
 * 예제 플러그인 클래스
 * @implements {ExamplePluginManipulators}
 */
export class ExamplePlugin implements ExamplePluginManipulators {
  /** 플러그인 ID */
  readonly id = 'example-plugin';
  /** 플러그인 이름 */
  readonly name = 'Example Plugin';
  /** 플러그인 버전 */
  readonly version = '1.0.0';
  /** 플러그인 설명 */
  readonly description = '예제 기능을 제공하는 플러그인';
  /** 플러그인 의존성 */
  readonly dependencies = [];
  /** 엔진 인스턴스 */
  private engine: VectorEngine | null = null;
  /** 플러그인 레지스트리 */
  private static registry = new DefaultPluginRegistry();

  /**
   * 플러그인 설치
   * @param {VectorEngine} engine - 벡터 엔진 인스턴스
   */
  install(engine: VectorEngine): void {
    if (this.engine) {
      console.warn('ExamplePlugin is already installed');
      return;
    }

    this.engine = engine;

    // 플러그인 확장 정의
    const extension: PluginExtension = {
      executeExample: this.executeExample.bind(this),
    };

    // 플러그인 레지스트리에 등록
    ExamplePlugin.registry.register(this.id, extension);

    // 엔진에 예제 기능 메서드 추가 (기존 방식)
    const executeExampleMethod: PluginMethodDefinition<
      (options?: ExampleOptions) => ExampleResult
    > = {
      name: 'executeExample',
      method: this.executeExample.bind(this),
    };

    addTypedEngineMethod(engine, executeExampleMethod);

    // 또는 레지스트리를 통해 확장 적용 (대체 방식)
    // ExamplePlugin.registry.applyToEngine(engine);
  }

  /**
   * 플러그인 제거
   * @param {VectorEngine} engine - 벡터 엔진 인스턴스
   */
  uninstall(engine: VectorEngine): void {
    if (!this.engine) {
      console.warn('ExamplePlugin is not installed');
      return;
    }

    // 엔진에서 예제 기능 메서드 제거
    removeEngineMethod(engine, 'executeExample');

    // 플러그인 레지스트리에서 제거
    ExamplePlugin.registry.unregister(this.id);

    this.engine = null;
  }

  /**
   * 예제 기능 실행
   * @param {ExampleOptions} [options] - 예제 옵션
   * @returns {ExampleResult} 예제 결과
   */
  executeExample(options?: ExampleOptions): ExampleResult {
    if (!this.engine) {
      throw new Error('ExamplePlugin is not installed');
    }

    // 예제 기능 구현
    return {
      id: uuidv4(),
      data: options?.value || 'default',
      createdAt: new Date(),
    };
  }
}
