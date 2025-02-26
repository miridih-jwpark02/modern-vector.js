/**
 * Path Boolean Operations
 *
 * Path 간의 불리언 연산을 수행하는 함수들을 제공합니다.
 *
 * @packageDocumentation
 * @module Shapes.Path
 */

import {
  PathPoint,
  PathSegment,
  PathIntersectionPoint,
  PathBooleanOperation,
  PathWindingDirection,
} from './types';
import { Vector2D } from '../../math/vector';

/**
 * Path를 segments로 변환
 *
 * Path points 배열을 선분(segment)들의 배열로 변환합니다.
 *
 * @param points - Path points
 * @returns Path segments
 */
export function pathToSegments(points: PathPoint[]): PathSegment[] {
  const segments: PathSegment[] = [];
  let currentPoint: PathPoint | null = null;

  for (const point of points) {
    if (point.type === 'move') {
      currentPoint = point;
    } else if (currentPoint) {
      segments.push({
        start: currentPoint,
        end: point,
      });
      currentPoint = point;
    }
  }

  return segments;
}

/**
 * 두 선분의 교차점 계산
 *
 * 두 선분 간의 교차점을 계산합니다.
 *
 * @param seg1 - 첫 번째 선분
 * @param seg2 - 두 번째 선분
 * @returns 교차점 또는 null (교차하지 않는 경우)
 */
export function findSegmentIntersection(
  seg1: PathSegment,
  seg2: PathSegment
): PathIntersectionPoint | null {
  const x1 = seg1.start.x;
  const y1 = seg1.start.y;
  const x2 = seg1.end.x;
  const y2 = seg1.end.y;
  const x3 = seg2.start.x;
  const y3 = seg2.start.y;
  const x4 = seg2.end.x;
  const y4 = seg2.end.y;

  const denominator = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
  if (Math.abs(denominator) < 1e-10) return null; // 평행한 경우

  const t1 = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / denominator;
  const t2 = ((x1 - x3) * (y1 - y2) - (y1 - y3) * (x1 - x2)) / denominator;

  if (t1 < 0 || t1 > 1 || t2 < 0 || t2 > 1) return null; // 선분 밖의 교차점

  return {
    x: x1 + t1 * (x2 - x1),
    y: y1 + t1 * (y2 - y1),
    segmentIndex1: 0, // 호출자가 설정
    segmentIndex2: 0, // 호출자가 설정
    t1,
    t2,
  };
}

/**
 * 두 Path의 모든 교차점 찾기
 *
 * 두 Path 간의 모든 교차점을 찾습니다.
 *
 * @param path1 - 첫 번째 Path points
 * @param path2 - 두 번째 Path points
 * @returns 교차점 배열
 */
export function findPathIntersections(
  path1: PathPoint[],
  path2: PathPoint[]
): PathIntersectionPoint[] {
  const segments1 = pathToSegments(path1);
  const segments2 = pathToSegments(path2);
  const intersections: PathIntersectionPoint[] = [];

  segments1.forEach((seg1, i) => {
    segments2.forEach((seg2, j) => {
      const intersection = findSegmentIntersection(seg1, seg2);
      if (intersection) {
        intersection.segmentIndex1 = i;
        intersection.segmentIndex2 = j;
        intersections.push(intersection);
      }
    });
  });

  return intersections;
}

/**
 * Path의 winding direction 계산
 *
 * Path의 감기 방향(시계 방향 또는 반시계 방향)을 계산합니다.
 *
 * @param points - Path points
 * @returns Path의 winding direction
 */
export function getPathWindingDirection(points: PathPoint[]): PathWindingDirection {
  let area = 0;
  for (let i = 0; i < points.length; i++) {
    const j = (i + 1) % points.length;
    area += points[i].x * points[j].y;
    area -= points[j].x * points[i].y;
  }
  return area < 0 ? 'counterclockwise' : 'clockwise';
}

/**
 * Point가 Path 내부에 있는지 확인
 *
 * Ray casting 알고리즘을 사용하여 점이 Path 내부에 있는지 확인합니다.
 *
 * @param point - 확인할 점
 * @param path - Path points
 * @returns Point가 Path 내부에 있으면 true, 아니면 false
 */
export function isPointInPath(point: Vector2D, path: PathPoint[]): boolean {
  let inside = false;
  for (let i = 0, j = path.length - 1; i < path.length; j = i++) {
    const xi = path[i].x;
    const yi = path[i].y;
    const xj = path[j].x;
    const yj = path[j].y;

    const intersect =
      yi > point.y !== yj > point.y && point.x < ((xj - xi) * (point.y - yi)) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
}

/**
 * Path Boolean Operation 수행
 *
 * 두 Path 간의 불리언 연산(합집합, 교집합, 차집합, XOR)을 수행합니다.
 *
 * @param path1 - 첫 번째 Path points
 * @param path2 - 두 번째 Path points
 * @param operation - Boolean operation 타입
 * @returns 결과 Path points
 */
export function performPathBooleanOperation(
  path1: PathPoint[],
  path2: PathPoint[],
  operation: PathBooleanOperation
): PathPoint[] {
  const intersections = findPathIntersections(path1, path2);
  const dir1 = getPathWindingDirection(path1);
  const dir2 = getPathWindingDirection(path2);

  // 교차점이 없는 경우의 처리
  if (intersections.length === 0) {
    const p1InP2 = isPointInPath(Vector2D.create(path1[0].x, path1[0].y), path2);
    const p2InP1 = isPointInPath(Vector2D.create(path2[0].x, path2[0].y), path1);

    switch (operation) {
      case 'union':
        if (p1InP2) return path2;
        if (p2InP1) return path1;
        // 두 Path를 연결할 때는 첫 번째 Path의 마지막 점과 두 번째 Path의 첫 점을 연결
        return [...path1, { x: path2[0].x, y: path2[0].y, type: 'line' }, ...path2.slice(1)];
      case 'intersect':
        if (p1InP2) return path1;
        if (p2InP1) return path2;
        return [];
      case 'subtract':
        if (p1InP2) return [];
        return path1;
      case 'xor':
        if (p1InP2 || p2InP1) return [];
        // 두 Path를 연결할 때는 첫 번째 Path의 마지막 점과 두 번째 Path의 첫 점을 연결
        return [...path1, { x: path2[0].x, y: path2[0].y, type: 'line' }, ...path2.slice(1)];
    }
  }

  // 교차점이 있는 경우의 처리
  // 교차점을 기준으로 Path를 분할하고 재조합
  // TODO: 복잡한 교차 케이스 처리
  const result: PathPoint[] = [];
  let currentPoint = intersections[0];
  let inside1 = false;
  let inside2 = false;

  for (const intersection of intersections) {
    const segment1 = pathToSegments(path1)[intersection.segmentIndex1];
    const segment2 = pathToSegments(path2)[intersection.segmentIndex2];

    switch (operation) {
      case 'union':
        if (!inside1 && !inside2) {
          result.push({ x: intersection.x, y: intersection.y, type: 'move' });
        } else {
          result.push({ x: intersection.x, y: intersection.y, type: 'line' });
        }
        inside1 = !inside1;
        inside2 = !inside2;
        break;

      case 'intersect':
        if (inside1 && inside2) {
          result.push({ x: intersection.x, y: intersection.y, type: 'move' });
        } else {
          result.push({ x: intersection.x, y: intersection.y, type: 'line' });
        }
        inside1 = !inside1;
        inside2 = !inside2;
        break;

      case 'subtract':
        if (inside1 && !inside2) {
          result.push({ x: intersection.x, y: intersection.y, type: 'move' });
        } else {
          result.push({ x: intersection.x, y: intersection.y, type: 'line' });
        }
        inside1 = !inside1;
        inside2 = !inside2;
        break;

      case 'xor':
        if ((inside1 && !inside2) || (!inside1 && inside2)) {
          result.push({ x: intersection.x, y: intersection.y, type: 'move' });
        } else {
          result.push({ x: intersection.x, y: intersection.y, type: 'line' });
        }
        inside1 = !inside1;
        inside2 = !inside2;
        break;
    }

    currentPoint = intersection;
  }

  return result;
}
