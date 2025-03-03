/**
 * 플러그인 타입 확장 유틸리티
 *
 * 플러그인이 VectorEngine 인터페이스를 확장하는 데 사용되는 타입 유틸리티입니다.
 * @packageDocumentation
 * @module Core/Types/Extensions/PluginExtension
 */

import { VectorEngine } from '..';

/**
 * 플러그인 확장 메서드 타입
 *
 * 이 타입은 플러그인이 VectorEngine에 추가하는 메서드의 타입을 정의합니다.
 */
export type ExtensionMethod<T extends (...args: unknown[]) => unknown> = T;

/**
 * 플러그인 메서드 정의 타입
 *
 * 이 타입은 플러그인이 VectorEngine에 추가하는 메서드의 이름과 구현을 정의합니다.
 */
export interface PluginMethodDefinition<T extends (...args: unknown[]) => unknown> {
  /** 메서드 이름 */
  name: string;
  /** 메서드 구현 */
  method: T;
}

/**
 * 플러그인 확장 타입
 *
 * 이 타입은 플러그인이 VectorEngine에 추가하는 메서드들의 집합을 정의합니다.
 */
export type PluginExtension = {
  [key: string]: ExtensionMethod<(...args: unknown[]) => unknown>;
};

/**
 * VectorEngine 확장 타입
 *
 * 이 타입은 플러그인에 의해 확장된 VectorEngine 타입을 정의합니다.
 */
export type ExtendedEngine<T extends PluginExtension> = VectorEngine & T;
