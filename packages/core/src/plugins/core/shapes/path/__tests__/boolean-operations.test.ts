import { describe, it, expect } from 'vitest';
import { PathPoint, PathSegment } from '../types';
import {
  pathToSegments,
  findSegmentIntersection,
  findPathIntersections,
  getPathWindingDirection,
  isPointInPath,
  performPathBooleanOperation,
} from '../boolean-operations';
import { Vector2D } from '../../../math/vector';

describe('Path Boolean Operations', () => {
  describe('pathToSegments', () => {
    it('should convert path points to segments', () => {
      const points: PathPoint[] = [
        { x: 0, y: 0, type: 'move' },
        { x: 100, y: 0, type: 'line' },
        { x: 100, y: 100, type: 'line' },
        { x: 0, y: 100, type: 'line' },
      ];

      const segments = pathToSegments(points);
      expect(segments).toHaveLength(3);
      expect(segments[0]).toEqual({
        start: { x: 0, y: 0, type: 'move' },
        end: { x: 100, y: 0, type: 'line' },
      });
    });

    it('should handle multiple move commands', () => {
      const points: PathPoint[] = [
        { x: 0, y: 0, type: 'move' },
        { x: 100, y: 0, type: 'line' },
        { x: 200, y: 0, type: 'move' },
        { x: 300, y: 0, type: 'line' },
      ];

      const segments = pathToSegments(points);
      expect(segments).toHaveLength(2);
    });
  });

  describe('findSegmentIntersection', () => {
    it('should find intersection between two segments', () => {
      const seg1: PathSegment = {
        start: { x: 0, y: 0, type: 'move' as const },
        end: { x: 100, y: 100, type: 'line' as const },
      };
      const seg2: PathSegment = {
        start: { x: 0, y: 100, type: 'move' as const },
        end: { x: 100, y: 0, type: 'line' as const },
      };

      const intersection = findSegmentIntersection(seg1, seg2);
      expect(intersection).toBeDefined();
      expect(intersection?.x).toBe(50);
      expect(intersection?.y).toBe(50);
    });

    it('should return null for parallel segments', () => {
      const seg1: PathSegment = {
        start: { x: 0, y: 0, type: 'move' as const },
        end: { x: 100, y: 0, type: 'line' as const },
      };
      const seg2: PathSegment = {
        start: { x: 0, y: 100, type: 'move' as const },
        end: { x: 100, y: 100, type: 'line' as const },
      };

      const intersection = findSegmentIntersection(seg1, seg2);
      expect(intersection).toBeNull();
    });

    it('should return null for non-intersecting segments', () => {
      const seg1: PathSegment = {
        start: { x: 0, y: 0, type: 'move' as const },
        end: { x: 50, y: 50, type: 'line' as const },
      };
      const seg2: PathSegment = {
        start: { x: 60, y: 60, type: 'move' as const },
        end: { x: 100, y: 100, type: 'line' as const },
      };

      const intersection = findSegmentIntersection(seg1, seg2);
      expect(intersection).toBeNull();
    });
  });

  describe('findPathIntersections', () => {
    it('should find all intersections between two paths', () => {
      const path1: PathPoint[] = [
        { x: 0, y: 0, type: 'move' },
        { x: 100, y: 100, type: 'line' },
      ];
      const path2: PathPoint[] = [
        { x: 0, y: 100, type: 'move' },
        { x: 100, y: 0, type: 'line' },
      ];

      const intersections = findPathIntersections(path1, path2);
      expect(intersections).toHaveLength(1);
      expect(intersections[0].x).toBe(50);
      expect(intersections[0].y).toBe(50);
    });

    it('should handle paths with no intersections', () => {
      const path1: PathPoint[] = [
        { x: 0, y: 0, type: 'move' },
        { x: 50, y: 50, type: 'line' },
      ];
      const path2: PathPoint[] = [
        { x: 60, y: 60, type: 'move' },
        { x: 100, y: 100, type: 'line' },
      ];

      const intersections = findPathIntersections(path1, path2);
      expect(intersections).toHaveLength(0);
    });
  });

  describe('getPathWindingDirection', () => {
    it('should detect clockwise direction', () => {
      const points: PathPoint[] = [
        { x: 0, y: 0, type: 'move' },
        { x: 100, y: 0, type: 'line' },
        { x: 100, y: 100, type: 'line' },
        { x: 0, y: 100, type: 'line' },
        { x: 0, y: 0, type: 'line' },
      ];

      const direction = getPathWindingDirection(points);
      expect(direction).toBe('clockwise');
    });

    it('should detect counterclockwise direction', () => {
      const points: PathPoint[] = [
        { x: 0, y: 0, type: 'move' },
        { x: 0, y: 100, type: 'line' },
        { x: 100, y: 100, type: 'line' },
        { x: 100, y: 0, type: 'line' },
        { x: 0, y: 0, type: 'line' },
      ];

      const direction = getPathWindingDirection(points);
      expect(direction).toBe('counterclockwise');
    });
  });

  describe('isPointInPath', () => {
    it('should detect point inside path', () => {
      const path: PathPoint[] = [
        { x: 0, y: 0, type: 'move' },
        { x: 100, y: 0, type: 'line' },
        { x: 100, y: 100, type: 'line' },
        { x: 0, y: 100, type: 'line' },
        { x: 0, y: 0, type: 'line' },
      ];

      const point = Vector2D.create(50, 50);
      expect(isPointInPath(point, path)).toBe(true);
    });

    it('should detect point outside path', () => {
      const path: PathPoint[] = [
        { x: 0, y: 0, type: 'move' },
        { x: 100, y: 0, type: 'line' },
        { x: 100, y: 100, type: 'line' },
        { x: 0, y: 100, type: 'line' },
        { x: 0, y: 0, type: 'line' },
      ];

      const point = Vector2D.create(150, 150);
      expect(isPointInPath(point, path)).toBe(false);
    });
  });

  describe('performPathBooleanOperation', () => {
    const rect1: PathPoint[] = [
      { x: 0, y: 0, type: 'move' },
      { x: 100, y: 0, type: 'line' },
      { x: 100, y: 100, type: 'line' },
      { x: 0, y: 100, type: 'line' },
      { x: 0, y: 0, type: 'line' },
    ];

    const rect2: PathPoint[] = [
      { x: 50, y: 50, type: 'move' },
      { x: 150, y: 50, type: 'line' },
      { x: 150, y: 150, type: 'line' },
      { x: 50, y: 150, type: 'line' },
      { x: 50, y: 50, type: 'line' },
    ];

    it('should perform union operation', () => {
      const result = performPathBooleanOperation(rect1, rect2, 'union');
      expect(result.length).toBeGreaterThan(0);
    });

    it('should perform intersection operation', () => {
      const result = performPathBooleanOperation(rect1, rect2, 'intersect');
      expect(result.length).toBeGreaterThan(0);
    });

    it('should perform subtraction operation', () => {
      const result = performPathBooleanOperation(rect1, rect2, 'subtract');
      expect(result.length).toBeGreaterThan(0);
    });

    it('should perform xor operation', () => {
      const result = performPathBooleanOperation(rect1, rect2, 'xor');
      expect(result.length).toBeGreaterThan(0);
    });

    it('should handle non-intersecting paths', () => {
      const rect3: PathPoint[] = [
        { x: 200, y: 200, type: 'move' },
        { x: 300, y: 200, type: 'line' },
        { x: 300, y: 300, type: 'line' },
        { x: 200, y: 300, type: 'line' },
        { x: 200, y: 200, type: 'line' },
      ];

      const result = performPathBooleanOperation(rect1, rect3, 'union');
      expect(result.length).toBe(rect1.length + rect3.length);
    });
  });
});
