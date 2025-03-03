/**
 * Plugin System Type Definitions
 * 플러그인 시스템의 타입 정의를 제공합니다.
 *
 * @packageDocumentation
 * @module Core/Types/PluginTypes
 */

import { DeepPartial, ID, TypedRecord } from './core-types';

/**
 * 그룹 노드 인터페이스
 * 그룹 기능을 위한 기본 인터페이스
 */
export interface GroupNode {
  /** 그룹 노드 ID */
  readonly id: ID<'Group'>;
  /** 그룹 이름 */
  readonly name: string;
  /** 자식 노드 배열 */
  readonly children: ReadonlyArray<unknown>;
  /** 그룹 메타데이터 */
  readonly metadata: TypedRecord<string, unknown>;
}

/**
 * 예제 실행 옵션 인터페이스
 * 타입 안전한 예제 파라미터 처리를 위한 제네릭 인터페이스
 */
export interface ExampleOptions<
  T extends TypedRecord<string, unknown> = TypedRecord<string, unknown>,
> {
  /** 예제 ID */
  readonly id: string;
  /** 예제 이름 */
  readonly name: string;
  /** 예제 파라미터 (타입 안전하게 정의 가능) */
  readonly params?: T;
}

/**
 * 예제 실행 결과 인터페이스
 * 타입 안전한 결과 데이터 처리를 위한 제네릭 인터페이스
 */
export interface ExampleResult<T = unknown> {
  /** 성공 여부 */
  readonly success: boolean;
  /** 실행 결과 (성공 시, 제네릭 타입 T로 정의) */
  readonly data?: T;
  /** 오류 메시지 (실패 시) */
  readonly error?: string;
}

/**
 * 플러그인 구성 옵션 인터페이스
 * 플러그인에 공통적으로 적용되는 옵션
 */
export interface PluginOptions {
  /** 디버그 모드 활성화 여부 */
  readonly debug?: boolean;
}

/**
 * 플러그인 상태 타입
 * 플러그인의 현재 생명주기 상태를 표현
 */
export type PluginState = 'inactive' | 'active' | 'error';

/**
 * 플러그인 설치 옵션
 * 플러그인 설치 시 전달할 수 있는 옵션
 */
export interface PluginInstallOptions<
  T extends TypedRecord<string, unknown> = TypedRecord<string, unknown>,
> {
  /** 플러그인별 커스텀 설정 */
  readonly config?: DeepPartial<T>;
  /** 기본 공통 옵션 */
  readonly options?: PluginOptions;
}
