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
 * @param {(...args: any[]) => any} method - 추가할 메서드 구현
 */
export function addEngineMethod(
  engine: VectorEngine,
  methodName: string,
  method: (...args: any[]) => any
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return Reflect.deleteProperty(engine as Record<string, any>, methodName);
  }
  return false;
}

/**
 * 타입 안전한 메서드 추가
 * @param {VectorEngine} engine - 메서드를 추가할 엔진 인스턴스
 * @param {PluginMethodDefinition<T>} methodDef - 메서드 정의
 */
export function addTypedEngineMethod<T extends (...args: any[]) => any>(
  engine: VectorEngine,
  methodDef: PluginMethodDefinition<T>
): void {
  addEngineMethod(engine, methodDef.name, methodDef.method);
}

/**
 * 여러 메서드 한번에 추가
 * @param {VectorEngine} engine - 메서드를 추가할 엔진 인스턴스
 * @param {PluginMethodDefinition<any>[]} methodDefs - 메서드 정의 배열
 */
export function addEngineExtensions(
  engine: VectorEngine,
  methodDefs: PluginMethodDefinition<any>[]
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
