/**
 * 플러그인 유틸리티 함수
 *
 * 플러그인이 엔진에 메서드를 추가하고 제거하는 기능을 캡슐화합니다.
 * @packageDocumentation
 * @module Core/Utils/PluginUtils
 */

import { VectorEngine } from '../types';
import { PluginMethodDefinition } from '../types/extensions/plugin-extension';

/**
 * 엔진에 메서드 추가
 * @param {VectorEngine} engine - 메서드를 추가할 엔진 인스턴스
 * @param {string} methodName - 추가할 메서드 이름
 * @param {Function} method - 추가할 메서드 구현
 */
export function addEngineMethod(
  engine: VectorEngine,
  methodName: string,
  method: (...args: unknown[]) => unknown
): void {
  Object.defineProperty(engine, methodName, {
    value: method,
    configurable: true,
    enumerable: true,
    writable: false,
  });
}

/**
 * 엔진에서 메서드 제거
 * @param {VectorEngine} engine - 메서드를 제거할 엔진 인스턴스
 * @param {string} methodName - 제거할 메서드 이름
 * @returns {boolean} 제거 성공 여부
 */
export function removeEngineMethod(engine: VectorEngine, methodName: string): boolean {
  if (Object.prototype.hasOwnProperty.call(engine, methodName)) {
    // 먼저 엔진을 unknown으로 캐스팅한 후 Record<string, unknown>으로 변환
    return Reflect.deleteProperty(engine as unknown as Record<string, unknown>, methodName);
  }
  return false;
}

type MethodFunction = (...args: unknown[]) => unknown;

/**
 * 타입 안전한 메서드 추가
 * @param {VectorEngine} engine - 메서드를 추가할 엔진 인스턴스
 * @param {PluginMethodDefinition<T>} methodDef - 메서드 정의
 */
export function addTypedEngineMethod<T extends MethodFunction>(
  engine: VectorEngine,
  methodDef: PluginMethodDefinition<T>
): void {
  addEngineMethod(engine, methodDef.name, methodDef.method);
}

/**
 * 여러 메서드 한번에 추가
 * @param {VectorEngine} engine - 메서드를 추가할 엔진 인스턴스
 * @param {PluginMethodDefinition<T>[]} methodDefs - 메서드 정의 배열
 */
export function addEngineExtensions<T extends MethodFunction>(
  engine: VectorEngine,
  methodDefs: PluginMethodDefinition<T>[]
): void {
  methodDefs.forEach(def => addTypedEngineMethod(engine, def));
}

/**
 * 여러 메서드 한번에 제거
 * @param {VectorEngine} engine - 메서드를 제거할 엔진 인스턴스
 * @param {string[]} methodNames - 제거할 메서드 이름 배열
 */
export function removeEngineExtensions(engine: VectorEngine, methodNames: string[]): void {
  methodNames.forEach(name => removeEngineMethod(engine, name));
}
