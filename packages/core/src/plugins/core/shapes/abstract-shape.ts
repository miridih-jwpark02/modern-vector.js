import { SceneNode } from '../../../core/types';
import { EventEmitter } from '../../../core/types';
import { Matrix3x3 } from '../math/matrix';
import { Vector2D } from '../math/vector';
import { Shape, ShapeStyle, Bounds } from './types';
import { PathPoint } from './path/types';

/**
 * Scale 기준점 타입
 */
export type ScaleOrigin = 'center' | 'topLeft' | 'custom';

/**
 * AbstractShape 클래스는 모든 Shape 구현체의 기본이 되는 추상 클래스입니다.
 * SceneNode를 상속하여 장면 그래프의 노드로 동작합니다.
 * @abstract
 * @implements {Shape}
 * @implements {SceneNode}
 */
export abstract class AbstractShape implements Shape, SceneNode {
  /** Shape의 고유 식별자 */
  readonly id: string;

  /** Shape의 타입 */
  readonly type: string;

  /** Shape의 변환 행렬 */
  readonly transform: Matrix3x3;

  /** Shape의 경계 상자 */
  readonly _bounds: Bounds;

  /** Shape의 스타일 */
  readonly style: ShapeStyle;

  /** 부모 노드 */
  parent: SceneNode | null = null;

  /** 자식 노드 목록 */
  private _children: SceneNode[] = [];

  /** 노드에 연결된 데이터 */
  data: Record<string, any> = {};

  /** 이벤트 이미터 */
  private eventEmitter: EventEmitter;

  /**
   * Path가 닫혀있는지 여부
   * 기본적으로 모든 도형은 닫혀있지 않다고 가정합니다.
   * Path 클래스에서 오버라이드하여 사용합니다.
   */
  get isClosed(): boolean {
    return false;
  }

  constructor(
    id: string,
    type: string,
    transform: Matrix3x3,
    bounds: Bounds,
    style: ShapeStyle,
    eventEmitter: EventEmitter
  ) {
    this.id = id;
    this.type = type;
    this.transform = transform;
    this._bounds = bounds;
    this.style = style;
    this.eventEmitter = eventEmitter;
  }

  /**
   * 자식 노드 목록 getter
   * @returns {SceneNode[]} 자식 노드 목록
   */
  get children(): SceneNode[] {
    return [...this._children]; // 복사본 반환하여 직접 수정 방지
  }

  /**
   * 경계 상자 getter
   * @returns {Bounds} 경계 상자
   */
  get bounds(): Bounds {
    return { ...this._bounds };
  }

  /**
   * 자식 노드 추가
   * @param {SceneNode} child - 추가할 자식 노드
   * @returns {SceneNode} 추가된 자식 노드
   */
  addChild(child: SceneNode): SceneNode {
    // 이미 다른 부모가 있는 경우 제거
    if (child.parent) {
      child.parent.removeChild(child);
    }

    // 이미 자식으로 있는 경우 무시
    if (this._children.includes(child)) {
      return child;
    }

    // 자식으로 추가
    this._children.push(child);
    child.parent = this;

    // 이벤트 발생
    this.emit('childAdded', { child });

    return child;
  }

  /**
   * 자식 노드 제거
   * @param {SceneNode} child - 제거할 자식 노드
   * @returns {boolean} 제거 성공 여부
   */
  removeChild(child: SceneNode): boolean {
    const index = this._children.indexOf(child);

    if (index === -1) {
      return false;
    }

    // 자식에서 제거
    this._children.splice(index, 1);
    child.parent = null;

    // 이벤트 발생
    this.emit('childRemoved', { child });

    return true;
  }

  /**
   * 모든 자식 노드 제거
   */
  clearChildren(): void {
    // 모든 자식의 부모 참조 제거
    this._children.forEach(child => {
      child.parent = null;
    });

    // 자식 목록 초기화
    const oldChildren = [...this._children];
    this._children = [];

    // 이벤트 발생
    this.emit('childrenCleared', { children: oldChildren });
  }

  /**
   * ID로 자식 노드 찾기
   * @param {string} id - 찾을 노드의 ID
   * @returns {SceneNode | null} 찾은 노드 또는 null
   */
  findChildById(id: string): SceneNode | null {
    // 직접 자식 중에서 찾기
    for (const child of this._children) {
      if (child.id === id) {
        return child;
      }

      // 재귀적으로 자식의 자식에서 찾기
      const found = child.findChildById(id);
      if (found) {
        return found;
      }
    }

    return null;
  }

  /**
   * 이벤트 리스너 등록
   * @param {string} event - 이벤트 이름
   * @param {Function} handler - 이벤트 핸들러 함수
   */
  on(event: string, handler: (data: any) => void): void {
    this.eventEmitter.on(event, handler);
  }

  /**
   * 이벤트 리스너 제거
   * @param {string} event - 이벤트 이름
   * @param {Function} handler - 제거할 이벤트 핸들러 함수
   */
  off(event: string, handler: (data: any) => void): void {
    this.eventEmitter.off(event, handler);
  }

  /**
   * 이벤트 발생
   * @param {string} event - 발생시킬 이벤트 이름
   * @param {any} data - 이벤트와 함께 전달할 데이터
   */
  emit(event: string, data: any): void {
    this.eventEmitter.emit(event, data);
  }

  /**
   * Scale 기준점 설정
   * @param {ScaleOrigin} _origin - Scale 기준점 ('center', 'topLeft', 'custom')
   * @param {{ x: number; y: number }} [_point] - Custom 기준점일 경우 좌표
   */
  setScaleOrigin(_origin: ScaleOrigin, _point?: { x: number; y: number }): void {
    // Implementation needed
  }

  /**
   * Scale 기준점 가져오기
   * @returns Scale 기준점 좌표
   */
  protected getScaleOriginPoint(): { x: number; y: number } {
    // Implementation needed
    return { x: 0, y: 0 };
  }

  /**
   * Shape 복제
   */
  abstract clone(): Shape;

  /**
   * Shape에 변환 적용
   * @param matrix - 적용할 변환 행렬
   */
  abstract applyTransform(matrix: Matrix3x3): Shape;

  /**
   * Point가 Shape 내부에 있는지 확인
   * @param point - 확인할 점
   */
  abstract containsPoint(point: Vector2D): boolean;

  /**
   * Shape를 Path로 변환
   */
  abstract toPath(): PathPoint[];

  /**
   * 기본 충돌 검사 구현 (Bounds 기반)
   * @param other - 충돌 검사할 다른 Shape
   */
  abstract intersects(other: Shape): boolean;

  /**
   * Scale 행렬 추출
   * @param matrix - Scale을 추출할 행렬 (기본값: this.transform)
   */
  protected getTransformScale(matrix: Matrix3x3 = this.transform): {
    scaleX: number;
    scaleY: number;
  } {
    const scaleX = Math.sqrt(
      matrix.values[0] * matrix.values[0] + matrix.values[1] * matrix.values[1]
    );
    const scaleY = Math.sqrt(
      matrix.values[3] * matrix.values[3] + matrix.values[4] * matrix.values[4]
    );
    return { scaleX, scaleY };
  }

  /**
   * 지정된 기준점으로 변환 행렬 계산
   * @param matrix - 적용할 변환 행렬
   * @param originX - 기준점 X 좌표
   * @param originY - 기준점 Y 좌표
   */
  protected getTransformAroundPoint(
    matrix: Matrix3x3,
    originX: number,
    originY: number
  ): Matrix3x3 {
    const originTransform = Matrix3x3.translation(originX, originY);
    const inverseOriginTransform = Matrix3x3.translation(-originX, -originY);

    // 변환 순서: 기존 변환 -> 원점으로 이동 -> 스케일 적용 -> 원점 복귀
    return originTransform
      .multiply(matrix)
      .multiply(inverseOriginTransform)
      .multiply(this.transform);
  }
}
