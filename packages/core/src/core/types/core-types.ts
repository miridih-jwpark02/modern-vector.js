/**
 * Core Type System
 * 벡터 그래픽 엔진의 기본 타입 시스템을 정의합니다.
 *
 * @packageDocumentation
 * @module Core/Types/CoreTypes
 */

/**
 * Primitive 타입들을 유니온으로 정의
 */
export type Primitive = string | number | boolean | undefined | null;

/**
 * 깊이 재귀적인 Readonly 타입 (DeepReadonly)
 */
export type DeepReadonly<T> = T extends Primitive
  ? T
  : T extends Array<infer U>
    ? ReadonlyArray<DeepReadonly<U>>
    : T extends Map<infer K, infer V>
      ? ReadonlyMap<DeepReadonly<K>, DeepReadonly<V>>
      : T extends Set<infer U>
        ? ReadonlySet<DeepReadonly<U>>
        : { readonly [K in keyof T]: DeepReadonly<T[K]> };

/**
 * 객체의 모든 속성을 옵셔널로 만드는 타입 (Partial의 깊은 버전)
 */
export type DeepPartial<T> = T extends Primitive
  ? T
  : T extends Array<infer U>
    ? Array<DeepPartial<U>>
    : T extends Map<infer K, infer V>
      ? Map<DeepPartial<K>, DeepPartial<V>>
      : T extends Set<infer U>
        ? Set<DeepPartial<U>>
        : { [K in keyof T]?: DeepPartial<T[K]> };

/**
 * ID 생성을 위한 타입 (브랜딩 패턴)
 */
export type ID<T extends string> = string & { __brand: T };

/**
 * 노드 ID 타입
 */
export type NodeID = ID<'Node'>;

/**
 * 그룹 ID 타입
 */
export type GroupID = ID<'Group'>;

/**
 * 타입 안전한 이벤트 타입 정의
 */
export type EventType<T extends string> = T & { __eventType: true };

/**
 * 데이터 구조 변환 유틸리티 타입
 */
export type ValueOf<T> = T[keyof T];

/**
 * Record의 값 타입에 제한을 두는 안전한 Record 타입
 */
export type TypedRecord<K extends string | number | symbol, T> = Record<K, T>;

/**
 * 2D 좌표 타입
 */
export interface Point2D {
  readonly x: number;
  readonly y: number;
}

/**
 * 2D 크기 타입
 */
export interface Size2D {
  readonly width: number;
  readonly height: number;
}

/**
 * 경계 상자 (Bounds) 타입
 */
export interface Bounds extends Point2D, Size2D {}

/**
 * 변환 매트릭스 타입
 */
export interface Transform extends Point2D {
  readonly scaleX: number;
  readonly scaleY: number;
  readonly rotation: number;
}

/**
 * 스타일 속성 타입
 */
export interface Style {
  readonly fillColor?: string;
  readonly strokeColor?: string;
  readonly strokeWidth?: number;
  readonly opacity?: number;
}
