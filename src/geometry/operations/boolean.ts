/**
 * Path Boolean 연산 구현
 */
import { Path } from '../path';
import { Vector2D } from '../../core/math/vector';
import { PathOperation, PathSegment, Intersection, WindingResult } from './types';
import { findPathIntersections } from './intersection';

/**
 * Winding number 계산
 */
function calculateWinding(point: Vector2D, path: Path): WindingResult {
  let winding = 0;
  const segments = path.getSegments();

  for (let i = 0; i < segments.length; i++) {
    const seg1 = segments[i];
    const seg2 = segments[(i + 1) % segments.length];

    // 점이 선분의 y 범위 내에 있는지 확인
    const minY = Math.min(seg1.point.y, seg2.point.y);
    const maxY = Math.max(seg1.point.y, seg2.point.y);
    
    if (point.y >= minY && point.y < maxY) {
      // 점이 선분의 왼쪽에 있는지 확인
      const x = seg1.point.x + 
        (point.y - seg1.point.y) * 
        (seg2.point.x - seg1.point.x) / 
        (seg2.point.y - seg1.point.y);

      if (point.x < x) {
        // 선분이 위로 향하는지 아래로 향하는지에 따라 winding 증감
        winding += seg1.point.y < seg2.point.y ? 1 : -1;
      }
    }
  }

  return {
    winding,
    inside: winding !== 0
  };
}

/**
 * Path를 교차점에서 분할
 */
function splitPath(path: Path, intersections: Intersection[]): PathSegment[] {
  const segments: PathSegment[] = [];
  const pathSegments = path.getSegments();

  let currentSegment = 0;
  let currentT = 0;

  // 교차점들을 t값 기준으로 정렬
  intersections.sort((a, b) => a.t1 - b.t1);

  for (const intersection of intersections) {
    // 현재 세그먼트에서 교차점까지의 부분을 추가
    const seg1 = pathSegments[currentSegment];
    const seg2 = pathSegments[(currentSegment + 1) % pathSegments.length];

    segments.push({
      start: {
        x: seg1.point.x + (seg2.point.x - seg1.point.x) * currentT,
        y: seg1.point.y + (seg2.point.y - seg1.point.y) * currentT
      },
      end: {
        x: intersection.x,
        y: intersection.y
      },
      t: currentT,
      clockwise: true, // 임시값, 나중에 계산
      inside: false   // 임시값, 나중에 계산
    });

    currentT = intersection.t1;
    if (currentT >= 1) {
      currentSegment++;
      currentT = 0;
    }
  }

  return segments;
}

/**
 * 분할된 세그먼트들을 결합하여 새로운 Path 생성
 */
function combinePath(segments: PathSegment[], operation: PathOperation): Path {
  const path = new Path();
  let current = segments[0];

  path.moveTo(current.start.x, current.start.y);

  for (const segment of segments) {
    if (segment.control1 && segment.control2) {
      path.cubicCurveTo(
        segment.end.x, segment.end.y,
        segment.control1.x, segment.control1.y,
        segment.control2.x, segment.control2.y
      );
    } else if (segment.control1) {
      path.quadCurveTo(
        segment.end.x, segment.end.y,
        segment.control1.x, segment.control1.y
      );
    } else {
      path.lineTo(segment.end.x, segment.end.y);
    }
  }

  path.closePath();
  return path;
}

/**
 * Boolean 연산 수행
 */
export function booleanOperation(
  path1: Path,
  path2: Path,
  operation: PathOperation
): Path {
  // 교차점 찾기
  const intersections = findPathIntersections(path1, path2);

  // 교차점이 없는 경우의 처리
  if (intersections.length === 0) {
    const point1Inside2 = calculateWinding(path1.getSegments()[0].point, path2).inside;
    const point2Inside1 = calculateWinding(path2.getSegments()[0].point, path1).inside;

    switch (operation) {
      case PathOperation.UNION:
        return point1Inside2 ? path2.clone() : 
               point2Inside1 ? path1.clone() : 
               path1.clone(); // 겹치지 않는 경우

      case PathOperation.INTERSECTION:
        return point1Inside2 ? path1.clone() :
               point2Inside1 ? path2.clone() :
               new Path(); // 겹치지 않는 경우

      case PathOperation.DIFFERENCE:
        return point1Inside2 ? new Path() : path1.clone();

      case PathOperation.XOR:
        return point1Inside2 || point2Inside1 ? new Path() :
               path1.clone(); // 겹치지 않는 경우
    }
  }

  // Path 분할
  const segments1 = splitPath(path1, intersections);
  const segments2 = splitPath(path2, intersections);

  // 각 세그먼트의 내부/외부 판정
  for (const segment of segments1) {
    const midPoint = new Vector2D(
      (segment.start.x + segment.end.x) / 2,
      (segment.start.y + segment.end.y) / 2
    );
    segment.inside = calculateWinding(midPoint, path2).inside;
  }

  for (const segment of segments2) {
    const midPoint = new Vector2D(
      (segment.start.x + segment.end.x) / 2,
      (segment.start.y + segment.end.y) / 2
    );
    segment.inside = calculateWinding(midPoint, path1).inside;
  }

  // 연산에 따라 세그먼트 선택
  let resultSegments: PathSegment[] = [];
  switch (operation) {
    case PathOperation.UNION:
      resultSegments = [
        ...segments1.filter(s => !s.inside),
        ...segments2.filter(s => !s.inside)
      ];
      break;

    case PathOperation.INTERSECTION:
      resultSegments = [
        ...segments1.filter(s => s.inside),
        ...segments2.filter(s => s.inside)
      ];
      break;

    case PathOperation.DIFFERENCE:
      resultSegments = [
        ...segments1.filter(s => !s.inside),
        ...segments2.filter(s => s.inside)
      ];
      break;

    case PathOperation.XOR:
      resultSegments = [
        ...segments1.filter(s => !s.inside),
        ...segments2.filter(s => !s.inside)
      ];
      break;
  }

  // 결과 Path 생성
  return combinePath(resultSegments, operation);
}

/**
 * Union 연산
 */
export function union(path1: Path, path2: Path): Path {
  return booleanOperation(path1, path2, PathOperation.UNION);
}

/**
 * Intersection 연산
 */
export function intersection(path1: Path, path2: Path): Path {
  return booleanOperation(path1, path2, PathOperation.INTERSECTION);
}

/**
 * Difference 연산
 */
export function difference(path1: Path, path2: Path): Path {
  return booleanOperation(path1, path2, PathOperation.DIFFERENCE);
}

/**
 * XOR 연산
 */
export function xor(path1: Path, path2: Path): Path {
  return booleanOperation(path1, path2, PathOperation.XOR);
}