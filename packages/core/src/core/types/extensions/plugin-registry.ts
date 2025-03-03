/**
 * 플러그인 확장 레지스트리
 *
 * 이 모듈은 플러그인 확장을 중앙에서 관리하는 레지스트리를 제공합니다.
 * @packageDocumentation
 * @module Core/Types/Extensions/PluginRegistry
 */

import { VectorEngine } from '..';
import { PluginExtension, ExtendedEngine } from './plugin-extension';

/**
 * 플러그인 확장 레지스트리 인터페이스
 *
 * 이 인터페이스는 플러그인 확장을 등록하고 관리하는 레지스트리를 정의합니다.
 */
export interface PluginRegistry {
  /**
   * 플러그인 확장 등록
   * @param name - 플러그인 이름
   * @param extension - 플러그인 확장
   */
  register<T extends PluginExtension>(name: string, extension: T): void;

  /**
   * 플러그인 확장 제거
   * @param name - 플러그인 이름
   */
  unregister(name: string): void;

  /**
   * 플러그인 확장 가져오기
   * @param name - 플러그인 이름
   * @returns 플러그인 확장 또는 undefined
   */
  get<T extends PluginExtension>(name: string): T | undefined;

  /**
   * 모든 플러그인 확장 가져오기
   * @returns 모든 플러그인 확장
   */
  getAll(): Record<string, PluginExtension>;

  /**
   * 엔진에 모든 플러그인 확장 적용
   * @param {VectorEngine} engine - 벡터 엔진 인스턴스
   * @returns {ExtendedEngine<T>} 확장된 엔진 인스턴스
   */
  applyToEngine<T extends PluginExtension>(engine: VectorEngine): ExtendedEngine<T>;
}

/**
 * 플러그인 확장 레지스트리 구현
 */
export class DefaultPluginRegistry implements PluginRegistry {
  private extensions: Record<string, PluginExtension> = {};

  /**
   * 플러그인 확장 등록
   * @param name - 플러그인 이름
   * @param extension - 플러그인 확장
   */
  register<T extends PluginExtension>(name: string, extension: T): void {
    this.extensions[name] = extension;
  }

  /**
   * 플러그인 확장 제거
   * @param name - 플러그인 이름
   */
  unregister(name: string): void {
    delete this.extensions[name];
  }

  /**
   * 플러그인 확장 가져오기
   * @param name - 플러그인 이름
   * @returns 플러그인 확장 또는 undefined
   */
  get<T extends PluginExtension>(name: string): T | undefined {
    return this.extensions[name] as T;
  }

  /**
   * 모든 플러그인 확장 가져오기
   * @returns 모든 플러그인 확장
   */
  getAll(): Record<string, PluginExtension> {
    return { ...this.extensions };
  }

  /**
   * 엔진에 모든 플러그인 확장 적용
   * @param {VectorEngine} engine - 벡터 엔진 인스턴스
   * @returns {ExtendedEngine<T>} 확장된 엔진 인스턴스
   */
  applyToEngine<T extends PluginExtension>(engine: VectorEngine): ExtendedEngine<T> {
    // 모든 확장을 엔진에 적용
    Object.entries(this.extensions).forEach(([_name, extension]) => {
      Object.entries(extension).forEach(([methodName, method]) => {
        Object.defineProperty(engine, methodName, {
          value: method,
          configurable: true,
          enumerable: true,
          writable: false,
        });
      });
    });

    // any 대신 타입 단언을 사용
    return engine as ExtendedEngine<T>;
  }
}
