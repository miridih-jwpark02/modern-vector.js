/**
 * 기하학적 요소들의 기본 타입 정의
 */
import { Vector2D } from '../core/math/vector';

/**
 * Path segment의 타입을 정의하는 enum
 */
export enum SegmentType {
  MOVE = 'move',
  LINE = 'line',
  CUBIC = 'cubic',
  QUAD = 'quad',
  CLOSE = 'close'
}

/**
 * Path segment의 기본 인터페이스
 */
export interface PathSegment {
  readonly type: SegmentType;
  readonly point: Vector2D;
  clone(): PathSegment;
}

/**
 * Move to 세그먼트
 */
export interface MoveSegment extends PathSegment {
  readonly type: SegmentType.MOVE;
}

/**
 * Line to 세그먼트
 */
export interface LineSegment extends PathSegment {
  readonly type: SegmentType.LINE;
}

/**
 * Cubic bezier curve 세그먼트
 */
export interface CubicSegment extends PathSegment {
  readonly type: SegmentType.CUBIC;
  readonly control1: Vector2D;
  readonly control2: Vector2D;
}

/**
 * Quadratic bezier curve 세그먼트
 */
export interface QuadSegment extends PathSegment {
  readonly type: SegmentType.QUAD;
  readonly control: Vector2D;
}

/**
 * Close path 세그먼트
 */
export interface CloseSegment extends PathSegment {
  readonly type: SegmentType.CLOSE;
}

/**
 * Path의 fill rule을 정의하는 enum
 */
export enum FillRule {
  NONZERO = 'nonzero',
  EVENODD = 'evenodd'
}

/**
 * Path의 join style을 정의하는 enum
 */
export enum LineJoin {
  MITER = 'miter',
  ROUND = 'round',
  BEVEL = 'bevel'
}

/**
 * Path의 cap style을 정의하는 enum
 */
export enum LineCap {
  BUTT = 'butt',
  ROUND = 'round',
  SQUARE = 'square'
}

/**
 * Path style 속성
 */
export interface PathStyle {
  fillColor?: string;
  strokeColor?: string;
  strokeWidth?: number;
  fillRule?: FillRule;
  lineJoin?: LineJoin;
  lineCap?: LineCap;
  miterLimit?: number;
}