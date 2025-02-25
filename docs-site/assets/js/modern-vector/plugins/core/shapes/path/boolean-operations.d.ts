import { PathPoint, PathSegment, PathIntersectionPoint, PathBooleanOperation, PathWindingDirection } from './types';
import { Vector2D } from '../../math/vector';

/**
 * Path를 segments로 변환
 * 연속된 점들을 선분으로 변환하여 반환
 * @param points - Path points
 * @returns Path segments
 */
export declare function pathToSegments(points: PathPoint[]): PathSegment[];
/**
 * 두 선분의 교차점 계산
 * 선분의 교차점이 없거나 선분 밖에 있는 경우 null 반환
 * @param seg1 - 첫 번째 선분
 * @param seg2 - 두 번째 선분
 * @returns 교차점 또는 null
 */
export declare function findSegmentIntersection(seg1: PathSegment, seg2: PathSegment): PathIntersectionPoint | null;
/**
 * 두 Path의 모든 교차점 찾기
 * 각 선분 쌍의 교차점을 모두 찾아서 반환
 * @param path1 - 첫 번째 Path points
 * @param path2 - 두 번째 Path points
 * @returns 교차점 배열
 */
export declare function findPathIntersections(path1: PathPoint[], path2: PathPoint[]): PathIntersectionPoint[];
/**
 * Path의 winding direction 계산
 * Path의 점들을 순회하면서 면적을 계산하여 방향 결정
 * @param points - Path points
 * @returns Path의 winding direction
 */
export declare function getPathWindingDirection(points: PathPoint[]): PathWindingDirection;
/**
 * Point가 Path 내부에 있는지 확인
 * Ray casting algorithm 사용
 * @param point - 확인할 점
 * @param path - Path points
 * @returns Point가 Path 내부에 있으면 true
 */
export declare function isPointInPath(point: Vector2D, path: PathPoint[]): boolean;
/**
 * Path Boolean Operation 수행
 * 두 Path에 대해 지정된 Boolean Operation을 수행
 * @param path1 - 첫 번째 Path points
 * @param path2 - 두 번째 Path points
 * @param operation - Boolean operation 타입
 * @returns 결과 Path points
 */
export declare function performPathBooleanOperation(path1: PathPoint[], path2: PathPoint[], operation: PathBooleanOperation): PathPoint[];
//# sourceMappingURL=boolean-operations.d.ts.map