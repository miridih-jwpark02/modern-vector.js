import { Vector2D } from '../math/vector';
import { Matrix3x3 } from '../math/matrix';
import { ScaleOrigin } from './abstract-shape';
import { PathPoint } from './path';

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
  /** 테두리 점선 패턴 */
  strokeDashArray?: number[];
  /** 테두리 점선 시작 위치 */
  strokeDashOffset?: number;
  /** 테두리 선 끝 모양 */
  strokeLineCap?: 'butt' | 'round' | 'square';
  /** 테두리 선 연결 모양 */
  strokeLineJoin?: 'miter' | 'round' | 'bevel';
  /** 테두리 선 연결 제한 */
  strokeMiterLimit?: number;
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
  /** Shape의 점들 (Path shape에서만 사용) */
  readonly points?: PathPoint[];
  
  /** Shape 복제 */
  clone(): Shape;
  /** Shape 변환 적용 */
  applyTransform(matrix: Matrix3x3): Shape;
  /** Point가 Shape 내부에 있는지 확인 */
  containsPoint(point: Vector2D): boolean;
  /** Shape가 다른 Shape와 겹치는지 확인 */
  intersects(other: Shape): boolean;
  /** Scale 기준점 설정 */
  setScaleOrigin(origin: 'center' | 'topLeft' | 'custom', point?: { x: number; y: number }): void;
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
  /** Scale 변환의 기준점 타입 */
  scaleOrigin?: ScaleOrigin;
  /** Custom scale 기준점 좌표 */
  customScaleOriginPoint?: { x: number; y: number };
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