import { Vector2D } from '../math/vector';
import { Matrix3x3 } from '../math/matrix';

/**
 * Shape의 경계 상자를 나타내는 interface
 */
export interface Bounds {
  /** 좌상단 x 좌표 */
  x: number;
  /** 좌상단 y 좌표 */
  y: number;
  /** 너비 */
  width: number;
  /** 높이 */
  height: number;
}

/**
 * Shape의 style 속성을 나타내는 interface
 */
export interface ShapeStyle {
  /** Fill color */
  fillColor?: string;
  /** Stroke color */
  strokeColor?: string;
  /** Stroke width */
  strokeWidth?: number;
  /** Fill opacity (0-1) */
  fillOpacity?: number;
  /** Stroke opacity (0-1) */
  strokeOpacity?: number;
}

/**
 * Shape의 기본 interface
 */
export interface Shape {
  /** Shape의 고유 ID */
  readonly id: string;
  /** Shape의 타입 */
  readonly type: string;
  /** Shape의 변환 행렬 */
  readonly transform: Matrix3x3;
  /** Shape의 경계 상자 */
  readonly bounds: Bounds;
  /** Shape의 style */
  readonly style: ShapeStyle;
  
  /** Shape 복제 */
  clone(): Shape;
  /** Shape 변환 적용 */
  applyTransform(matrix: Matrix3x3): Shape;
  /** Point가 Shape 내부에 있는지 확인 */
  containsPoint(point: Vector2D): boolean;
  /** Shape가 다른 Shape와 겹치는지 확인 */
  intersects(other: Shape): boolean;
}

/**
 * Shape 생성을 위한 factory interface
 */
export interface ShapeFactory<T extends Shape = Shape> {
  /** Shape 생성 */
  create(options: ShapeOptions): T;
}

/**
 * Shape 생성 옵션
 */
export interface ShapeOptions {
  /** Shape의 ID (optional) */
  id?: string;
  /** Shape의 style */
  style?: ShapeStyle;
  /** Shape의 초기 변환 행렬 */
  transform?: Matrix3x3;
  /** Shape별 추가 속성 */
  [key: string]: any;
}

/**
 * Shape plugin interface
 */
export interface ShapePlugin {
  /** Shape 등록 */
  registerShape<T extends Shape>(type: string, factory: ShapeFactory<T>): void;
  /** Shape 생성 */
  createShape<T extends Shape>(type: string, options: ShapeOptions): T;
  /** 등록된 Shape 타입 확인 */
  hasShape(type: string): boolean;
} 