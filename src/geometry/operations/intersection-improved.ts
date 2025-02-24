/**
 * 개선된 교차점 계산 구현
 */
import { Vector2D } from '../../core/math/vector';
import { Path } from '../path';
import { PathSegment, Intersection } from './types';
import {
  EPSILON,
  isAlmostEqual,
  isAlmostZero,
  isPointOnLine,
  isBezierFlat,
  solveCubic
} from './numerical';

/**
 * 베지어 곡선의 특이점 검사
 */
function checkSingularity(
  x1: number, y1: number,
  x2: number, y2: number,
  x3: number, y3: number,
  x4: number, y4: number
): boolean {
  // 시작점과 끝점이 같은 경우
  if (isAlmostEqual(x1, x4) && isAlmostEqual(y1, y4)) {
    return true;
  }

  // 제어점들이 한 점에 모여있는 경우
  if (isAlmostEqual(x1, x2) && isAlmostEqual(y1, y2) &&
      isAlmostEqual(x2, x3) && isAlmostEqual(y2, y3) &&
      isAlmostEqual(x3, x4) && isAlmostEqual(y3, y4)) {
    return true;
  }

  return false;
}

/**
 * 베지어 곡선의 자체 교차 검사
 */
function checkSelfIntersection(
  x1: number, y1: number,
  x2: number, y2: number,
  x3: number, y3: number,
  x4: number, y4: number
): Intersection[] {
  // 곡선이 충분히 평평하면 자체 교차 없음
  if (isBezierFlat(x1, y1, x2, y2, x3, y3, x4, y4)) {
    return [];
  }

  // 특이점이 있는 경우 처리
  if (checkSingularity(x1, y1, x2, y2, x3, y3, x4, y4)) {
    return [{
      x: x1,
      y: y1,
      t1: 0,
      t2: 1,
      angle: 0,
      entry: true
    }];
  }

  // 자체 교차를 찾기 위한 방정식 계수 계산
  const ax = -x1 + 3 * x2 - 3 * x3 + x4;
  const ay = -y1 + 3 * y2 - 3 * y3 + y4;
  const bx = 3 * x1 - 6 * x2 + 3 * x3;
  const by = 3 * y1 - 6 * y2 + 3 * y3;
  const cx = -3 * x1 + 3 * x2;
  const cy = -3 * y1 + 3 * y2;

  // 자체 교차점을 찾기 위한 방정식 풀이
  const roots = solveCubic(
    ax * by - ay * bx,
    ax * cy - ay * cx,
    bx * cy - by * cx,
    0
  );

  const intersections: Intersection[] = [];
  for (const t of roots) {
    if (t > EPSILON && t < 1 - EPSILON) {
      const x = ((ax * t + bx) * t + cx) * t + x1;
      const y = ((ay * t + by) * t + cy) * t + y1;
      
      // 교차점에서의 각도 계산
      const dx1 = (3 * ax * t + 2 * bx) * t + cx;
      const dy1 = (3 * ay * t + 2 * by) * t + cy;
      const dx2 = -(3 * ax * t + 2 * bx) * t - cx;
      const dy2 = -(3 * ay * t + 2 * by) * t - cy;
      const angle = Math.atan2(dy2, dx2) - Math.atan2(dy1, dx1);

      intersections.push({
        x,
        y,
        t1: t,
        t2: t,
        angle,
        entry: angle > 0
      });
    }
  }

  return intersections;
}

/**
 * 개선된 베지어 곡선 교차점 계산
 */
function findBezierIntersectionsImproved(
  x1: number, y1: number,
  x2: number, y2: number,
  x3: number, y3: number,
  x4: number, y4: number,
  x5: number, y5: number,
  x6: number, y6: number,
  x7: number, y7: number,
  x8: number, y8: number
): Intersection[] {
  // 바운딩 박스가 겹치지 않으면 교차점 없음
  const minX1 = Math.min(x1, x2, x3, x4);
  const maxX1 = Math.max(x1, x2, x3, x4);
  const minY1 = Math.min(y1, y2, y3, y4);
  const maxY1 = Math.max(y1, y2, y3, y4);
  const minX2 = Math.min(x5, x6, x7, x8);
  const maxX2 = Math.max(x5, x6, x7, x8);
  const minY2 = Math.min(y5, y6, y7, y8);
  const maxY2 = Math.max(y5, y6, y7, y8);

  if (maxX1 < minX2 - EPSILON || minX1 > maxX2 + EPSILON ||
      maxY1 < minY2 - EPSILON || minY1 > maxY2 + EPSILON) {
    return [];
  }

  // 두 곡선이 모두 충분히 평평하면 선분으로 근사
  if (isBezierFlat(x1, y1, x2, y2, x3, y3, x4, y4) &&
      isBezierFlat(x5, y5, x6, y6, x7, y7, x8, y8)) {
    if (isPointOnLine(x1, y1, x5, y5, x8, y8) ||
        isPointOnLine(x4, y4, x5, y5, x8, y8) ||
        isPointOnLine(x5, y5, x1, y1, x4, y4) ||
        isPointOnLine(x8, y8, x1, y1, x4, y4)) {
      // 선분이 겹치는 경우
      const t1 = 0.5;
      const t2 = 0.5;
      const x = (x1 + x4) / 2;
      const y = (y1 + y4) / 2;
      const angle = Math.atan2(y4 - y1, x4 - x1) -
                   Math.atan2(y8 - y5, x8 - x5);
      
      return [{
        x,
        y,
        t1,
        t2,
        angle,
        entry: angle > 0
      }];
    }
    return [];
  }

  // 곡선을 분할하여 재귀적으로 교차점 계산
  const t = 0.5;
  const u = 1 - t;
  const x12 = (x1 * u + x2 * t);
  const y12 = (y1 * u + y2 * t);
  const x23 = (x2 * u + x3 * t);
  const y23 = (y2 * u + y3 * t);
  const x34 = (x3 * u + x4 * t);
  const y34 = (y3 * u + y4 * t);
  const x123 = (x12 * u + x23 * t);
  const y123 = (y12 * u + y23 * t);
  const x234 = (x23 * u + x34 * t);
  const y234 = (y23 * u + y34 * t);
  const x1234 = (x123 * u + x234 * t);
  const y1234 = (y123 * u + y234 * t);

  const x56 = (x5 * u + x6 * t);
  const y56 = (y5 * u + y6 * t);
  const x67 = (x6 * u + x7 * t);
  const y67 = (y6 * u + y7 * t);
  const x78 = (x7 * u + x8 * t);
  const y78 = (y7 * u + y8 * t);
  const x567 = (x56 * u + x67 * t);
  const y567 = (y56 * u + y67 * t);
  const x678 = (x67 * u + x78 * t);
  const y678 = (y67 * u + y78 * t);
  const x5678 = (x567 * u + x678 * t);
  const y5678 = (y567 * u + y678 * t);

  const intersections: Intersection[] = [];

  // 왼쪽 반쪽과 왼쪽 반쪽
  const left1 = findBezierIntersectionsImproved(
    x1, y1, x12, y12, x123, y123, x1234, y1234,
    x5, y5, x56, y56, x567, y567, x5678, y5678
  );
  for (const int of left1) {
    int.t1 *= 0.5;
    int.t2 *= 0.5;
    intersections.push(int);
  }

  // 왼쪽 반쪽과 오른쪽 반쪽
  const leftRight = findBezierIntersectionsImproved(
    x1, y1, x12, y12, x123, y123, x1234, y1234,
    x5678, y5678, x678, y678, x78, y78, x8, y8
  );
  for (const int of leftRight) {
    int.t1 *= 0.5;
    int.t2 = 0.5 + int.t2 * 0.5;
    intersections.push(int);
  }

  // 오른쪽 반쪽과 왼쪽 반쪽
  const rightLeft = findBezierIntersectionsImproved(
    x1234, y1234, x234, y234, x34, y34, x4, y4,
    x5, y5, x56, y56, x567, y567, x5678, y5678
  );
  for (const int of rightLeft) {
    int.t1 = 0.5 + int.t1 * 0.5;
    int.t2 *= 0.5;
    intersections.push(int);
  }

  // 오른쪽 반쪽과 오른쪽 반쪽
  const right = findBezierIntersectionsImproved(
    x1234, y1234, x234, y234, x34, y34, x4, y4,
    x5678, y5678, x678, y678, x78, y78, x8, y8
  );
  for (const int of right) {
    int.t1 = 0.5 + int.t1 * 0.5;
    int.t2 = 0.5 + int.t2 * 0.5;
    intersections.push(int);
  }

  return intersections;
}

/**
 * 개선된 Path 교차점 계산
 */
export function findPathIntersectionsImproved(
  path1: Path,
  path2: Path
): Intersection[] {
  const segments1 = path1.getSegments();
  const segments2 = path2.getSegments();
  const intersections: Intersection[] = [];

  // 자체 교차 검사
  for (let i = 0; i < segments1.length; i++) {
    const seg = segments1[i];
    if ('control1' in seg && 'control2' in seg) {
      const selfInts = checkSelfIntersection(
        seg.point.x, seg.point.y,
        (seg as any).control1.x, (seg as any).control1.y,
        (seg as any).control2.x, (seg as any).control2.y,
        segments1[(i + 1) % segments1.length].point.x,
        segments1[(i + 1) % segments1.length].point.y
      );
      intersections.push(...selfInts);
    }
  }

  // 두 Path 간의 교차점 계산
  for (let i = 0; i < segments1.length; i++) {
    for (let j = 0; j < segments2.length; j++) {
      const seg1 = segments1[i];
      const seg2 = segments2[j];
      const next1 = segments1[(i + 1) % segments1.length];
      const next2 = segments2[(j + 1) % segments2.length];

      const ints = findBezierIntersectionsImproved(
        seg1.point.x, seg1.point.y,
        'control1' in seg1 ? (seg1 as any).control1.x : seg1.point.x,
        'control1' in seg1 ? (seg1 as any).control1.y : seg1.point.y,
        'control2' in seg1 ? (seg1 as any).control2.x : next1.point.x,
        'control2' in seg1 ? (seg1 as any).control2.y : next1.point.y,
        next1.point.x, next1.point.y,
        seg2.point.x, seg2.point.y,
        'control1' in seg2 ? (seg2 as any).control1.x : seg2.point.x,
        'control1' in seg2 ? (seg2 as any).control1.y : seg2.point.y,
        'control2' in seg2 ? (seg2 as any).control2.x : next2.point.x,
        'control2' in seg2 ? (seg2 as any).control2.y : next2.point.y,
        next2.point.x, next2.point.y
      );

      intersections.push(...ints);
    }
  }

  return intersections;
}