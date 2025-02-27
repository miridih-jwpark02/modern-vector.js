/**
 * Group 타입 정의
 *
 * @packageDocumentation
 * @module Group
 */

import { ShapeOptions } from '../shapes/types';
import { SceneNode } from '../../../core/types';
import { Matrix3x3 } from '../math/matrix';
import { Vector2D } from '../math/vector';
import { PathPoint } from '../shapes/path/types';

/**
 * Group 인터페이스
 *
 * 여러 SceneNode를 그룹화하는 인터페이스입니다.
 */
export interface Group extends SceneNode {
  /** 그룹의 타입 */
  readonly type: string;
  /** 그룹의 변환 행렬 */
  readonly transform: Matrix3x3;
  /** 그룹의 스타일 */
  readonly style: Record<string, any>;
  /** 그룹의 경계 상자 */
  readonly bounds: { x: number; y: number; width: number; height: number };
  /** 그룹에 포함된 노드 목록 */
  readonly children: SceneNode[];

  /**
   * 노드를 그룹에 추가
   *
   * @param node - 추가할 노드
   * @returns 추가된 노드
   */
  add(node: SceneNode): SceneNode;

  /**
   * 노드를 그룹에서 제거
   *
   * @param node - 제거할 노드
   * @returns 제거 성공 여부
   */
  remove(node: SceneNode): boolean;

  /**
   * 모든 노드를 그룹에서 제거
   */
  clear(): void;

  /**
   * ID로 노드 찾기
   *
   * @param id - 찾을 노드의 ID
   * @returns 찾은 노드 또는 null
   */
  findById(id: string): SceneNode | null;

  /**
   * Group 복제
   *
   * @returns 복제된 Group
   */
  clone(): Group;

  /**
   * Group 변환 적용
   *
   * @param matrix - 적용할 변환 행렬
   * @returns 변환이 적용된 새로운 Group
   */
  applyTransform(matrix: Matrix3x3): Group;

  /**
   * Point가 Group 내부에 있는지 확인
   *
   * @param point - 확인할 점
   * @returns 점이 Group 내부에 있으면 true, 아니면 false
   */
  containsPoint(point: Vector2D): boolean;

  /**
   * Group가 다른 노드와 겹치는지 확인
   *
   * @param other - 겹침을 확인할 다른 노드
   * @returns 두 노드가 겹치면 true, 아니면 false
   */
  intersects(other: SceneNode): boolean;

  /**
   * Scale 기준점 설정
   *
   * @param origin - Scale 기준점 ('center', 'topLeft', 'custom')
   * @param point - Custom 기준점일 경우 좌표
   */
  setScaleOrigin(origin: 'center' | 'topLeft' | 'custom', point?: { x: number; y: number }): void;

  /**
   * Group를 Path로 변환
   *
   * @returns Path 점들의 배열
   */
  toPath(): PathPoint[];
}

/**
 * Group 생성 옵션
 */
export interface GroupOptions extends ShapeOptions {
  /** 초기 자식 노드 목록 */
  children?: SceneNode[];
}

/**
 * Group 플러그인 인터페이스
 */
export interface GroupPlugin {
  /**
   * 그룹 생성
   *
   * @param children - 초기 자식 노드 목록 (optional)
   * @param options - 그룹 생성 옵션 (optional)
   * @returns 생성된 Group 인스턴스
   */
  createGroup(children?: SceneNode[], options?: GroupOptions): Group;
}
