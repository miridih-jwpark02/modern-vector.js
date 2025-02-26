import { Group as IGroup } from './types';
import { Shape, Bounds, ShapeStyle } from '../shapes/types';
import { Matrix3x3 } from '../math/matrix';
import { Vector2D } from '../math/vector';
import { PathPoint } from '../shapes/path/types';
import { v4 as uuidv4 } from 'uuid';

/**
 * Group 클래스
 *
 * 여러 Shape를 그룹화하는 클래스입니다.
 */
export class Group implements IGroup {
  /** Shape의 고유 ID */
  readonly id: string;

  /** Shape의 타입 */
  readonly type = 'group';

  /** Shape의 변환 행렬 */
  readonly transform: Matrix3x3;

  /** Shape의 style */
  readonly style: ShapeStyle;

  /** 그룹에 포함된 Shape 목록 */
  readonly children: Shape[] = [];

  /**
   * Group 생성자
   *
   * @param options - 그룹 생성 옵션
   */
  constructor(
    options: {
      id?: string;
      style?: ShapeStyle;
      transform?: Matrix3x3;
      children?: Shape[];
    } = {}
  ) {
    this.id = options.id || `group-${uuidv4()}`;
    this.style = options.style || {};
    this.transform = options.transform || Matrix3x3.create();

    // 초기 자식 Shape 추가
    if (options.children) {
      options.children.forEach(child => this.add(child));
    }
  }

  /**
   * Shape를 그룹에 추가
   *
   * @param shape - 추가할 Shape
   * @returns 추가된 Shape
   */
  add(shape: Shape): Shape {
    this.children.push(shape);
    return shape;
  }

  /**
   * Shape를 그룹에서 제거
   *
   * @param shape - 제거할 Shape
   * @returns 제거 성공 여부
   */
  remove(shape: Shape): boolean {
    const index = this.children.indexOf(shape);
    if (index !== -1) {
      this.children.splice(index, 1);
      return true;
    }
    return false;
  }

  /**
   * 모든 Shape를 그룹에서 제거
   */
  clear(): void {
    this.children.length = 0;
  }

  /**
   * ID로 Shape 찾기
   *
   * @param id - 찾을 Shape의 ID
   * @returns 찾은 Shape 또는 null
   */
  findById(id: string): Shape | null {
    for (const child of this.children) {
      if (child.id === id) {
        return child;
      }

      // 자식이 그룹인 경우 재귀적으로 검색
      if (child.type === 'group' && 'findById' in child) {
        const found = (child as unknown as Group).findById(id);
        if (found) {
          return found;
        }
      }
    }

    return null;
  }

  /**
   * Group 복제
   *
   * @returns 복제된 Group 인스턴스
   */
  clone(): Shape {
    const clonedChildren = this.children.map(child => child.clone());

    return new Group({
      id: `${this.id}-clone`,
      style: { ...this.style },
      transform: this.transform,
      children: clonedChildren,
    });
  }

  /**
   * Group 변환 적용
   *
   * @param matrix - 적용할 변환 행렬
   * @returns 변환이 적용된 새로운 Group 인스턴스
   */
  applyTransform(matrix: Matrix3x3): Shape {
    // 모든 자식에게 변환 적용
    const transformedChildren = this.children.map(child => child.applyTransform(matrix));

    return new Group({
      id: this.id,
      style: { ...this.style },
      transform: matrix, // 새 변환 행렬 적용
      children: transformedChildren,
    });
  }

  /**
   * Point가 Group 내부에 있는지 확인
   *
   * @param point - 확인할 점
   * @returns 점이 Group 내부에 있으면 true, 아니면 false
   */
  containsPoint(point: Vector2D): boolean {
    // 자식 중 하나라도 점을 포함하면 true
    return this.children.some(child => child.containsPoint(point));
  }

  /**
   * Group가 다른 Shape와 겹치는지 확인
   *
   * @param other - 겹침을 확인할 다른 Shape
   * @returns 두 Shape가 겹치면 true, 아니면 false
   */
  intersects(other: Shape): boolean {
    // 자식 중 하나라도 다른 Shape와 겹치면 true
    return this.children.some(child => child.intersects(other));
  }

  /**
   * Scale 기준점 설정
   *
   * @param origin - Scale 기준점 ('center', 'topLeft', 'custom')
   * @param point - Custom 기준점일 경우 좌표
   */
  setScaleOrigin(origin: 'center' | 'topLeft' | 'custom', point?: { x: number; y: number }): void {
    // 모든 자식에게 Scale 기준점 설정 전파
    this.children.forEach(child => child.setScaleOrigin(origin, point));
  }

  /**
   * Group를 Path로 변환
   *
   * @returns Path 점들의 배열
   */
  toPath(): PathPoint[] {
    // 모든 자식의 Path를 합침
    const paths: PathPoint[] = [];
    this.children.forEach(child => {
      paths.push(...child.toPath());
    });

    return paths;
  }

  /**
   * Group의 경계 상자 계산
   */
  get bounds(): Bounds {
    if (this.children.length === 0) {
      return { x: 0, y: 0, width: 0, height: 0 };
    }

    // 첫 번째 자식의 경계 상자로 초기화
    const firstBounds = this.children[0].bounds;
    let minX = firstBounds.x;
    let minY = firstBounds.y;
    let maxX = firstBounds.x + firstBounds.width;
    let maxY = firstBounds.y + firstBounds.height;

    // 나머지 자식들의 경계 상자를 고려하여 업데이트
    for (let i = 1; i < this.children.length; i++) {
      const bounds = this.children[i].bounds;
      minX = Math.min(minX, bounds.x);
      minY = Math.min(minY, bounds.y);
      maxX = Math.max(maxX, bounds.x + bounds.width);
      maxY = Math.max(maxY, bounds.y + bounds.height);
    }

    return {
      x: minX,
      y: minY,
      width: maxX - minX,
      height: maxY - minY,
    };
  }
}
