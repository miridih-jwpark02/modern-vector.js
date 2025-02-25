/**
 * Shape 타입 정의
 * 
 * @packageDocumentation
 * @module Shapes
 */

import { Vector2D } from '../math/vector';
import { Matrix3x3 } from '../math/matrix';
import { ScaleOrigin } from './abstract-shape';
import { PathPoint } from './path/types';

/**
 * Shape의 경계 상자를 나타내는 interface
 * 
 * 모든 Shape는 경계 상자를 가지며, 이는 Shape의 위치와 크기를 나타냅니다.
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
 * 
 * Shape의 시각적 표현을 정의하는 속성들을 포함합니다.
 */
export interface ShapeStyle {
  /** Fill color - 채우기 색상 */
  fillColor?: string;
  /** Stroke color - 테두리 색상 */
  strokeColor?: string;
  /** Stroke width - 테두리 두께 */
  strokeWidth?: number;
  /** Fill opacity (0-1) - 채우기 투명도 */
  fillOpacity?: number;
  /** Stroke opacity (0-1) - 테두리 투명도 */
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
 * 
 * 모든 도형 타입의 기본이 되는 인터페이스입니다.
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
  /** Text의 내용 (Text shape에서만 사용) */
  readonly text?: string;
  /** Text의 폰트 (Text shape에서만 사용) */
  readonly font?: string;
  /** Text의 크기 (Text shape에서만 사용) */
  readonly fontSize?: number;
  /** Text의 정렬 (Text shape에서만 사용) */
  readonly textAlign?: 'left' | 'center' | 'right';
  /** Text의 기준선 (Text shape에서만 사용) */
  readonly textBaseline?: 'top' | 'middle' | 'bottom';
  
  /**
   * Shape 복제
   * 
   * 현재 Shape와 동일한 속성을 가진 새로운 Shape 인스턴스를 생성합니다.
   * 
   * @returns 복제된 Shape 인스턴스
   */
  clone(): Shape;
  
  /**
   * Shape 변환 적용
   * 
   * 주어진 변환 행렬을 Shape에 적용합니다.
   * 
   * @param matrix - 적용할 변환 행렬
   * @returns 변환이 적용된 새로운 Shape 인스턴스
   */
  applyTransform(matrix: Matrix3x3): Shape;
  
  /**
   * Point가 Shape 내부에 있는지 확인
   * 
   * @param point - 확인할 점
   * @returns 점이 Shape 내부에 있으면 true, 아니면 false
   */
  containsPoint(point: Vector2D): boolean;
  
  /**
   * Shape가 다른 Shape와 겹치는지 확인
   * 
   * @param other - 겹침을 확인할 다른 Shape
   * @returns 두 Shape가 겹치면 true, 아니면 false
   */
  intersects(other: Shape): boolean;
  
  /**
   * Scale 기준점 설정
   * 
   * Scale 변환 시 사용할 기준점을 설정합니다.
   * 
   * @param origin - Scale 기준점 ('center', 'topLeft', 'custom')
   * @param point - Custom 기준점일 경우 좌표
   */
  setScaleOrigin(origin: 'center' | 'topLeft' | 'custom', point?: { x: number; y: number }): void;
  
  /**
   * Shape를 Path로 변환
   * 
   * 현재 Shape를 Path 점들의 배열로 변환합니다.
   * 
   * @returns Path 점들의 배열
   */
  toPath(): PathPoint[];
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