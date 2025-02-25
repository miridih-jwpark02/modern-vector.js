/**
 * Path 타입 정의
 * 
 * @packageDocumentation
 * @module Shapes.Path
 */

/**
 * Path의 각 점을 표현하는 인터페이스
 * 
 * Path는 여러 점들의 연속으로 구성되며, 각 점은 위치와 타입을 가집니다.
 */
export interface PathPoint {
  /** 점의 x 좌표 */
  x: number;
  /** 점의 y 좌표 */
  y: number;
  /** 점의 타입 (이동 또는 선) */
  type: 'move' | 'line';
}

/**
 * Path Boolean Operation 타입
 * 
 * Path 간의 불리언 연산 타입을 정의합니다.
 */
export type PathBooleanOperation = 'union' | 'intersect' | 'subtract' | 'xor';

/**
 * Path Segment를 표현하는 인터페이스
 * 
 * Path의 한 선분을 나타냅니다.
 */
export interface PathSegment {
  /** 시작점 */
  start: PathPoint;
  /** 끝점 */
  end: PathPoint;
}

/**
 * Path Intersection Point를 표현하는 인터페이스
 * 
 * 두 Path 간의 교차점을 나타냅니다.
 */
export interface PathIntersectionPoint {
  /** 교차점의 x 좌표 */
  x: number;
  /** 교차점의 y 좌표 */
  y: number;
  /** 첫 번째 Path에서의 세그먼트 인덱스 */
  segmentIndex1: number;
  /** 두 번째 Path에서의 세그먼트 인덱스 */
  segmentIndex2: number;
  /** 첫 번째 세그먼트에서의 상대 위치 (0-1) */
  t1: number;
  /** 두 번째 세그먼트에서의 상대 위치 (0-1) */
  t2: number;
}

/**
 * Path Winding Direction
 * 
 * Path의 감기 방향을 나타냅니다.
 */
export type PathWindingDirection = 'clockwise' | 'counterclockwise'; 