/**
 * 플러그인 확장 타입 정의
 *
 * 이 파일은 플러그인이 VectorEngine에 추가하는 기능들의 타입 정의를 중앙 집중화합니다.
 * 각 플러그인은 이 파일을 import하고 필요한 타입을 확장할 수 있습니다.
 *
 * @packageDocumentation
 * @module Core/Types/Extensions
 */

export * from './plugin-extension';
export * from './plugin-registry';

/**
 * 플러그인 확장 메서드 타입
 *
 * 이 타입은 플러그인이 VectorEngine에 추가하는 메서드의 타입을 정의합니다.
 */
export type ExtensionMethod<T extends (...args: any[]) => any> = T;

// 플러그인 확장 타입 정의를 위한 예제
// 각 플러그인은 이 패턴을 따라 VectorEngine 인터페이스를 확장할 수 있습니다.
/*
import { VectorEngine } from '../../types';
import { ExtensionMethod } from './plugin-extension';

// 플러그인 관련 타입 정의
export interface MyPluginOptions {
  // 옵션 정의
}

// VectorEngine 인터페이스 확장
declare module '../../types' {
  interface VectorEngine {
    // 플러그인이 추가하는 메서드 정의
    myPluginMethod: ExtensionMethod<
      (options?: MyPluginOptions) => void
    >;
  }
}
*/
