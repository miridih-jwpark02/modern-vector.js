/**
 * Group 관련 타입 정의
 *
 * @packageDocumentation
 * @module Core/Types/Group
 */

import { Bounds, GroupID, NodeID, Style, Transform, TypedRecord } from './core-types';
import { BaseEventData, EventHandler } from './event-types';

// 기본 노드 필수 속성을 정의하는 베이스 인터페이스
interface NodeBase {
  /** 노드의 고유 ID */
  readonly id: NodeID;
  /** 노드에 연결된 데이터 */
  readonly data: TypedRecord<string, unknown>;

  // 이벤트 관련 메서드
  on(event: string, handler: EventHandler): void;
  off(event: string, handler: EventHandler): void;
  emit(event: string, data: BaseEventData): void;
}

/**
 * 그룹 옵션 인터페이스
 */
export interface GroupOptions {
  /** 그룹 ID (옵션) */
  readonly id?: string;
  /** 그룹 이름 */
  readonly name?: string;
  /** 그룹 메타데이터 */
  readonly metadata?: TypedRecord<string, unknown>;
}

/**
 * 노드 타입을 구별하기 위한 유니온 타입
 */
export type NodeType = 'group' | 'shape' | 'text' | 'image';

/**
 * 그룹 인터페이스
 * 자식 노드를 포함할 수 있는 특수한 노드 타입
 */
export interface Group extends NodeBase {
  /** 노드 타입 */
  readonly type: 'group';
  /** 부모 노드 */
  parent: Group | null;
  /** 자식 노드 목록 */
  readonly children: ReadonlyArray<Group>;
  /** 변환 매트릭스 */
  readonly transform: Transform;
  /** 스타일 속성 */
  readonly style: Style;
  /** 경계 상자 */
  readonly bounds: Bounds;

  // 자식 관리 메서드
  addChild(child: Group): Group;
  removeChild(child: Group): boolean;
  clearChildren(): void;
  findChildById(id: string): Group | null;
}

/**
 * 타입 가드: Group 타입 확인 함수
 *
 * @param node - 검사할 노드
 * @returns 노드가 Group 타입인지 여부
 */
export function isGroup(node: unknown): node is Group {
  return (
    typeof node === 'object' &&
    node !== null &&
    'type' in node &&
    (node as { type: string }).type === 'group'
  );
}

/**
 * Group 생성을 위한 팩토리 함수 타입
 */
export type GroupFactory = (options?: GroupOptions) => Group;

/**
 * Group 확장 기능 정의 타입
 * 플러그인 확장 시 사용
 */
export interface GroupExtensions {
  /**
   * 그룹 복제 메서드
   */
  clone(): Group;

  /**
   * 그룹 직렬화 메서드
   */
  serialize(): string;

  /**
   * 그룹 변환 적용 메서드
   */
  applyTransform(transform: Partial<Transform>): void;
}
