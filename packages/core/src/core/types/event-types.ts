/**
 * Event System Type Definitions
 * 이벤트 시스템의 타입 정의를 제공합니다.
 *
 * @packageDocumentation
 * @module Core/Types/EventTypes
 */

import { DeepReadonly, EventType, TypedRecord } from './core-types';

/**
 * 기본 이벤트 데이터 인터페이스
 * 모든 이벤트 데이터는 이 인터페이스를 확장해야 합니다.
 */
export interface BaseEventData {
  /** 이벤트 타입 */
  readonly type: string;
  /** 이벤트 발생 시간 */
  readonly timestamp: number;
}

/**
 * 타입 안전한 이벤트 데이터
 * 제네릭 T를 통해 구체적인 이벤트 타입 및 데이터를 정의합니다.
 */
export interface TypedEventData<T extends string> extends BaseEventData {
  readonly type: EventType<T>;
}

/**
 * 알 수 없는 이벤트 데이터 (타입이 명시되지 않은 경우)
 */
export type UnknownEventData = BaseEventData & TypedRecord<string, unknown>;

/**
 * 이벤트 핸들러 타입
 * 제네릭을 통해 다양한 이벤트 타입에 대한 타입 안전성 제공
 */
export type EventHandler<T extends BaseEventData = BaseEventData> = (data: DeepReadonly<T>) => void;

/**
 * 이벤트 핸들러 레지스트리 타입
 * 이벤트 타입별로 핸들러 집합을 저장하는 맵 구조
 */
export type EventHandlerRegistry = Map<string, Set<EventHandler>>;

/**
 * 이벤트 맵 타입
 * 이벤트 타입과 그에 대응하는 이벤트 데이터 타입을 연결
 */
export interface EventMap {
  [eventType: string]: BaseEventData;
}

/**
 * 타입 안전한 이벤트 이미터 인터페이스
 * 제네릭 타입을 통해 다양한 이벤트 및 데이터에 대한 타입 체크 제공
 */
export interface TypedEventEmitter<T extends EventMap = EventMap> {
  /**
   * 이벤트 리스너 등록
   *
   * @param event - 이벤트 이름
   * @param handler - 이벤트 핸들러 함수
   */
  on<K extends keyof T>(event: K, handler: EventHandler<T[K]>): void;

  /**
   * 이벤트 리스너 제거
   *
   * @param event - 이벤트 이름
   * @param handler - 제거할 이벤트 핸들러 함수
   */
  off<K extends keyof T>(event: K, handler: EventHandler<T[K]>): void;

  /**
   * 이벤트 발생
   *
   * @param event - 발생시킬 이벤트 이름
   * @param data - 이벤트와 함께 전달할 데이터
   */
  emit<K extends keyof T>(event: K, data: T[K]): void;
}
