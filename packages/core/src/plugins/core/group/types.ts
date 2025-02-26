/**
 * Group 타입 정의
 *
 * @packageDocumentation
 * @module Group
 */

import { Shape, ShapeOptions } from '../shapes/types';

/**
 * Group 인터페이스
 *
 * 여러 Shape를 그룹화하는 인터페이스입니다.
 */
export interface Group extends Shape {
  /** 그룹에 포함된 Shape 목록 */
  readonly children: Shape[];

  /**
   * Shape를 그룹에 추가
   *
   * @param shape - 추가할 Shape
   * @returns 추가된 Shape
   */
  add(shape: Shape): Shape;

  /**
   * Shape를 그룹에서 제거
   *
   * @param shape - 제거할 Shape
   * @returns 제거 성공 여부
   */
  remove(shape: Shape): boolean;

  /**
   * 모든 Shape를 그룹에서 제거
   */
  clear(): void;

  /**
   * ID로 Shape 찾기
   *
   * @param id - 찾을 Shape의 ID
   * @returns 찾은 Shape 또는 null
   */
  findById(id: string): Shape | null;
}

/**
 * Group 생성 옵션
 */
export interface GroupOptions extends ShapeOptions {
  /** 초기 자식 Shape 목록 */
  children?: Shape[];
}

/**
 * Group 플러그인 인터페이스
 */
export interface GroupPlugin {
  /**
   * 그룹 생성
   *
   * @param children - 초기 자식 Shape 목록 (optional)
   * @param options - 그룹 생성 옵션 (optional)
   * @returns 생성된 Group 인스턴스
   */
  createGroup(children?: Shape[], options?: GroupOptions): Group;
}
