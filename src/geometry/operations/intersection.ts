/**
 * Path 교차점 계산 구현
 */
import { Vector2D } from '../../core/math/vector';
import { Path } from '../path';
import { PathSegment, Intersection } from './types';

/**
 * 베지어 곡선의 교차점 계산을 위한 상수
 */
const EPSILON = 1e-7;
const MAX_RECURSION_DEPTH = 8;

/**
 * 두 선분의 교차점 계산
 */
function lineIntersection(
  p1: Vector2D,
  p2: Vector2D,
  p3: Vector2D,
  p4: Vector2D
): Vector2D | null {
  const denominator = (p4.y - p3.y) * (p2.x - p1.x) - (p4.x - p3.x) * (p2.y - p1.y);
  
  if (Math.abs(denominator) < EPSILON) {
    return null; // 평행 또는 일치
  }

  const ua = ((p4.x - p3.x) * (p1.y - p3.y) - (p4.y - p3.y) * (p1.x - p3.x)) / denominator;
  const ub = ((p2.x - p1.x) * (p1.y - p3.y) - (p2.y - p1.y) * (p1.x - p3.x)) / denominator;

  if (ua < 0 || ua > 1 || ub < 0 || ub > 1) {
    return null; // 선분 외부의 교차점
  }

  return new Vector2D(
    p1.x + ua * (p2.x - p1.x),
    p1.y + ua * (p2.y - p1.y)
  );
}

/**
 * 베지어 곡선의 분할
 */
function subdivideBezier(
  p1: Vector2D,
  c1: Vector2D | null,
  c2: Vector2D | null,
  p2: Vector2D,
  t: number
): [Vector2D, Vector2D | null, Vector2D | null, Vector2D][] {
  if (!c1 && !c2) {
    // 직선의 경우
    const p = new Vector2D(
      p1.x + (p2.x - p1.x) * t,
      p1.y + (p2.y - p1.y) * t
    );
    return [
      [p1, null, null, p],
      [p, null, null, p2]
    ];
  }

  if (c1 && !c2) {
    // 2차 베지어 곡선의 경우
    const p11 = p1.lerp(c1, t);
    const p12 = c1.lerp(p2, t);
    const p = p11.lerp(p12, t);
    return [
      [p1, p11, null, p],
      [p, p12, null, p2]
    ];
  }

  // 3차 베지어 곡선의 경우
  if (!c1 || !c2) throw new Error('Invalid bezier curve');
  
  const p11 = p1.lerp(c1, t);
  const p12 = c1.lerp(c2, t);
  const p13 = c2.lerp(p2, t);
  const p21 = p11.lerp(p12, t);
  const p22 = p12.lerp(p13, t);
  const p = p21.lerp(p22, t);

  return [
    [p1, p11, p21, p],
    [p, p22, p13, p2]
  ];
}

/**
 * 베지어 곡선의 바운딩 박스 계산
 */
function getBezierBounds(
  p1: Vector2D,
  c1: Vector2D | null,
  c2: Vector2D | null,
  p2: Vector2D
): { minX: number; minY: number; maxX: number; maxY: number } {
  const points = [p1, p2];
  if (c1) points.push(c1);
  if (c2) points.push(c2);

  const xs = points.map(p => p.x);
  const ys = points.map(p => p.y);

  return {
    minX: Math.min(...xs),
    minY: Math.min(...ys),
    maxX: Math.max(...xs),
    maxY: Math.max(...ys)
  };
}

/**
 * 두 베지어 곡선의 교차점 계산
 */
function findBezierIntersections(
  p1: Vector2D,
  c1: Vector2D | null,
  c2: Vector2D | null,
  p2: Vector2D,
  p3: Vector2D,
  c3: Vector2D | null,
  c4: Vector2D | null,
  p4: Vector2D,
  depth: number = 0
): Intersection[] {
  // 바운딩 박스가 겹치지 않으면 교차점 없음
  const bounds1 = getBezierBounds(p1, c1, c2, p2);
  const bounds2 = getBezierBounds(p3, c3, c4, p4);

  if (bounds1.maxX < bounds2.minX || bounds2.maxX < bounds1.minX ||
      bounds1.maxY < bounds2.minY || bounds2.maxY < bounds1.minY) {
    return [];
  }

  // 직선인 경우 직선 교차점 계산
  if ((!c1 && !c2) && (!c3 && !c4)) {
    const point = lineIntersection(p1, p2, p3, p4);
    if (point) {
      const t1 = p1.subtract(point).length / p1.subtract(p2).length;
      const t2 = p3.subtract(point).length / p3.subtract(p4).length;
      const angle = Math.atan2(p2.y - p1.y, p2.x - p1.x) -
                   Math.atan2(p4.y - p3.y, p4.x - p3.x);
      
      return [{
        x: point.x,
        y: point.y,
        t1,
        t2,
        angle,
        entry: angle > 0
      }];
    }
    return [];
  }

  // 곡선이 충분히 평평해지면 직선으로 근사
  if (depth >= MAX_RECURSION_DEPTH) {
    const point = lineIntersection(p1, p2, p3, p4);
    if (point) {
      const t1 = p1.subtract(point).length / p1.subtract(p2).length;
      const t2 = p3.subtract(point).length / p3.subtract(p4).length;
      const angle = Math.atan2(p2.y - p1.y, p2.x - p1.x) -
                   Math.atan2(p4.y - p3.y, p4.x - p3.x);
      
      return [{
        x: point.x,
        y: point.y,
        t1,
        t2,
        angle,
        entry: angle > 0
      }];
    }
    return [];
  }

  // 곡선을 분할하여 재귀적으로 교차점 계산
  const curves1 = subdivideBezier(p1, c1, c2, p2, 0.5);
  const curves2 = subdivideBezier(p3, c3, c4, p4, 0.5);

  const intersections: Intersection[] = [];
  for (const [s1, c11, c12, e1] of curves1) {
    for (const [s2, c21, c22, e2] of curves2) {
      const subIntersections = findBezierIntersections(
        s1, c11, c12, e1,
        s2, c21, c22, e2,
        depth + 1
      );
      intersections.push(...subIntersections);
    }
  }

  return intersections;
}

/**
 * 두 Path의 교차점 계산
 */
export function findPathIntersections(path1: Path, path2: Path): Intersection[] {
  const segments1 = path1.getSegments();
  const segments2 = path2.getSegments();
  const intersections: Intersection[] = [];

  for (let i = 0; i < segments1.length; i++) {
    for (let j = 0; j < segments2.length; j++) {
      const seg1 = segments1[i];
      const seg2 = segments2[j];

      // 각 세그먼트 쌍의 교차점 계산
      const subIntersections = findBezierIntersections(
        seg1.point,
        'control1' in seg1 ? (seg1 as any).control1 : null,
        'control2' in seg1 ? (seg1 as any).control2 : null,
        segments1[(i + 1) % segments1.length].point,
        seg2.point,
        'control1' in seg2 ? (seg2 as any).control1 : null,
        'control2' in seg2 ? (seg2 as any).control2 : null,
        segments2[(j + 1) % segments2.length].point
      );

      intersections.push(...subIntersections);
    }
  }

  return intersections;
}