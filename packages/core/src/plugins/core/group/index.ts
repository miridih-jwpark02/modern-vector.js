/**
 * 그룹 플러그인 모듈
 *
 * 이 모듈은 그룹 기능을 제공하는 플러그인을 내보냅니다.
 * @packageDocumentation
 * @module Plugins/Core/Group
 */

import { SceneNode } from '../../../core/types';
import { GroupOptions, Group } from './types';
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
     * 그룹 생성
     *
     * GroupPlugin이 설치되면 사용 가능한 메서드입니다.
     *
     * @param children - 초기 자식 노드 목록
     * @param options - 그룹 생성 옵션
     * @returns 생성된 Group 인스턴스
     */
    createGroup: ExtensionMethod<(children?: SceneNode[], options?: GroupOptions) => Group>;
  }
}

export * from './types';
export * from './group';
export * from './group-plugin';
