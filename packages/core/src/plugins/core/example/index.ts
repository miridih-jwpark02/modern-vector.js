/**
 * 예제 플러그인 모듈
 *
 * 이 모듈은 예제 기능을 제공하는 플러그인을 내보냅니다.
 *
 * @packageDocumentation
 * @module Plugins/Core/Example
 */

import { ExtensionMethod } from '../../../core/types/extensions/plugin-extension';

/**
 * VectorEngine 인터페이스 확장
 *
 * 플러그인이 설치될 때 VectorEngine에 추가되는 메서드를 정의합니다.
 */
declare module '../../../core/types' {
  /**
   * 플러그인에 의해 확장된 VectorEngine 인터페이스
   */
  interface VectorEngine {
    /**
     * 예제 기능 실행
     *
     * ExamplePlugin이 설치되면 사용 가능한 메서드입니다.
     *
     * @param options - 예제 옵션
     * @returns 예제 결과
     */
    executeExample: ExtensionMethod<(...args: any[]) => any>;
  }
}

export * from './types';
export { ExamplePlugin } from './example-plugin';
