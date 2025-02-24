/**
 * Path의 각 점을 표현하는 인터페이스
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
 */
export type PathBooleanOperation = 'union' | 'intersect' | 'subtract' | 'xor';

/**
 * Path Segment를 표현하는 인터페이스
 */
export interface PathSegment {
  /** 시작점 */
  start: PathPoint;
  /** 끝점 */
  end: PathPoint;
}

/**
 * Path Intersection Point를 표현하는 인터페이스
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
 */
export type PathWindingDirection = 'clockwise' | 'counterclockwise'; 