/**
 * Path 연산 관련 타입 정의
 */

/**
 * Path 연산 타입
 */
export enum PathOperation {
  UNION = 'union',           // 합집합
  INTERSECTION = 'intersect', // 교집합
  DIFFERENCE = 'subtract',    // 차집합
  XOR = 'xor'               // 배타적 합집합
}

/**
 * 교차점 정보
 */
export interface Intersection {
  /** 교차점의 x 좌표 */
  x: number;
  /** 교차점의 y 좌표 */
  y: number;
  /** 첫 번째 path에서의 교차점 위치 (0~1) */
  t1: number;
  /** 두 번째 path에서의 교차점 위치 (0~1) */
  t2: number;
  /** 교차 각도 (라디안) */
  angle: number;
  /** 진입/진출 여부 (true: 진입, false: 진출) */
  entry: boolean;
}

/**
 * Path 분할 결과
 */
export interface SplitResult {
  /** 분할된 path 조각들 */
  segments: PathSegment[];
  /** 교차점 정보들 */
  intersections: Intersection[];
}

/**
 * Path 조각 정보
 */
export interface PathSegment {
  /** 시작점 */
  start: { x: number; y: number };
  /** 끝점 */
  end: { x: number; y: number };
  /** 제어점1 (베지어 곡선인 경우) */
  control1?: { x: number; y: number };
  /** 제어점2 (3차 베지어 곡선인 경우) */
  control2?: { x: number; y: number };
  /** 원본 path에서의 위치 (0~1) */
  t: number;
  /** 진행 방향 (시계/반시계) */
  clockwise: boolean;
  /** 내부/외부 여부 */
  inside: boolean;
}

/**
 * Winding number 계산 결과
 */
export interface WindingResult {
  /** Winding number */
  winding: number;
  /** 내부 여부 */
  inside: boolean;
}