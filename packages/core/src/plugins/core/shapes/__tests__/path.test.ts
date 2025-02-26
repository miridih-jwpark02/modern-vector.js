import { describe, it, expect } from 'vitest';
import { Path, PathFactory } from '../path';
import { Vector2D } from '../../math/vector';
import { Matrix3x3 } from '../../math/matrix';

describe('Path', () => {
  describe('creation', () => {
    it('should create path with default values', () => {
      const path = new Path();
      expect(path.id).toBeDefined();
      expect(path.type).toBe('path');
      expect(path.bounds).toEqual({
        x: 0,
        y: 0,
        width: 0,
        height: 0,
      });
      expect(path.points).toEqual([]);
    });

    it('should create path with specified points', () => {
      const path = new Path({
        points: [
          { x: 10, y: 20, type: 'move' },
          { x: 100, y: 50, type: 'line' },
          { x: 50, y: 100, type: 'line' },
        ],
      });
      expect(path.bounds).toEqual({
        x: 10,
        y: 20,
        width: 90,
        height: 80,
      });
      expect(path.points).toEqual([
        { x: 10, y: 20, type: 'move' },
        { x: 100, y: 50, type: 'line' },
        { x: 50, y: 100, type: 'line' },
      ]);
    });
  });

  describe('point manipulation', () => {
    it('should add points', () => {
      const path = new Path();
      path.addPoint(10, 20, 'move');
      path.addPoint(100, 50); // Default type is 'line'
      path.addPoint(50, 100, 'line');

      expect(path.points).toEqual([
        { x: 10, y: 20, type: 'move' },
        { x: 100, y: 50, type: 'line' },
        { x: 50, y: 100, type: 'line' },
      ]);
    });

    it('should not modify original points array', () => {
      const path = new Path({
        points: [
          { x: 10, y: 20, type: 'move' },
          { x: 100, y: 50, type: 'line' },
        ],
      });
      const points = path.points;
      points.push({ x: 50, y: 100, type: 'line' });

      expect(path.points).toEqual([
        { x: 10, y: 20, type: 'move' },
        { x: 100, y: 50, type: 'line' },
      ]);
    });
  });

  describe('transformation', () => {
    it('should apply translation', () => {
      const path = new Path({
        points: [
          { x: 0, y: 0, type: 'move' },
          { x: 100, y: 50, type: 'line' },
        ],
      });
      const translated = path.applyTransform(Matrix3x3.translation(10, 20));
      expect(translated.bounds).toEqual({
        x: 10,
        y: 20,
        width: 100,
        height: 50,
      });
    });

    it('should apply rotation', () => {
      const path = new Path({
        points: [
          { x: 0, y: 0, type: 'move' },
          { x: 100, y: 0, type: 'line' },
        ],
      });
      const rotated = path.applyTransform(Matrix3x3.rotation(Math.PI / 2));
      expect(rotated.bounds.width).toBeCloseTo(0);
      expect(rotated.bounds.height).toBeCloseTo(100);
    });

    it('should apply scale', () => {
      const path = new Path({
        points: [
          { x: 0, y: 0, type: 'move' },
          { x: 100, y: 50, type: 'line' },
        ],
      });
      const scaled = path.applyTransform(Matrix3x3.scale(2, 2));
      expect(scaled.bounds).toEqual({
        x: 0,
        y: 0,
        width: 200,
        height: 100,
      });
    });
  });

  describe('scale origin', () => {
    it('should scale from top-left by default', () => {
      const path = new Path({
        points: [
          { x: 0, y: 0, type: 'move' },
          { x: 100, y: 50, type: 'line' },
        ],
      });
      const scaled = path.applyTransform(Matrix3x3.scale(2, 2));
      expect(scaled.bounds).toEqual({
        x: 0, // Top-left point stays at (0,0)
        y: 0,
        width: 200,
        height: 100,
      });
    });

    it('should scale from center when specified', () => {
      const path = new Path({
        points: [
          { x: 0, y: 0, type: 'move' },
          { x: 100, y: 50, type: 'line' },
        ],
        scaleOrigin: 'center',
      });
      const scaled = path.applyTransform(Matrix3x3.scale(2, 2));
      expect(scaled.bounds).toEqual({
        x: -50, // Center point is (50, 25), so x: 50 - (100 * 2)/2 = -50
        y: -25, // y: 25 - (50 * 2)/2 = -25
        width: 200,
        height: 100,
      });
    });

    it('should scale from custom point', () => {
      const path = new Path({
        points: [
          { x: 0, y: 0, type: 'move' },
          { x: 100, y: 50, type: 'line' },
        ],
        scaleOrigin: 'custom',
        customScaleOriginPoint: { x: 50, y: 0 }, // Middle of top edge
      });
      const scaled = path.applyTransform(Matrix3x3.scale(2, 2));
      expect(scaled.bounds).toEqual({
        x: -50, // x: 50 - (100 * 2)/2 = -50
        y: 0, // y stays at 0
        width: 200,
        height: 100,
      });
    });

    it('should preserve scale origin after transformation', () => {
      const path = new Path({
        points: [
          { x: 0, y: 0, type: 'move' },
          { x: 100, y: 50, type: 'line' },
        ],
        scaleOrigin: 'center',
      });

      const scaled = path.applyTransform(Matrix3x3.scale(2, 2));
      const scaledAgain = scaled.applyTransform(Matrix3x3.scale(1.5, 1.5));

      expect(scaledAgain.bounds).toEqual({
        x: -100, // Center scaling continues
        y: -50, // Center scaling continues
        width: 300, // 100 * 2 * 1.5
        height: 150, // 50 * 2 * 1.5
      });
    });
  });

  describe('containsPoint', () => {
    it('should detect point on path', () => {
      const path = new Path({
        points: [
          { x: 0, y: 0, type: 'move' },
          { x: 100, y: 50, type: 'line' },
          { x: 50, y: 100, type: 'line' },
        ],
      });
      expect(path.containsPoint(Vector2D.create(50, 25))).toBe(true); // On first line
      expect(path.containsPoint(Vector2D.create(75, 75))).toBe(true); // On second line
      expect(path.containsPoint(Vector2D.create(0, 0))).toBe(true); // Start point
      expect(path.containsPoint(Vector2D.create(50, 100))).toBe(true); // End point
    });

    it('should handle move points correctly', () => {
      const path = new Path({
        points: [
          { x: 0, y: 0, type: 'move' },
          { x: 100, y: 50, type: 'line' },
          { x: 50, y: 100, type: 'move' }, // Start new subpath
          { x: 150, y: 150, type: 'line' },
        ],
      });
      expect(path.containsPoint(Vector2D.create(50, 25))).toBe(true); // On first line
      expect(path.containsPoint(Vector2D.create(100, 125))).toBe(true); // On second line
      expect(path.containsPoint(Vector2D.create(75, 75))).toBe(false); // Between subpaths
    });

    it('should detect point away from path', () => {
      const path = new Path({
        points: [
          { x: 0, y: 0, type: 'move' },
          { x: 100, y: 50, type: 'line' },
        ],
      });
      expect(path.containsPoint(Vector2D.create(50, 50))).toBe(false); // Point above line
      expect(path.containsPoint(Vector2D.create(-10, -5))).toBe(false); // Point before line
      expect(path.containsPoint(Vector2D.create(110, 55))).toBe(false); // Point after line
    });

    it('should handle transformed path', () => {
      const path = new Path({
        points: [
          { x: 0, y: 0, type: 'move' },
          { x: 100, y: 0, type: 'line' },
        ],
        transform: Matrix3x3.translation(10, 20),
      });
      expect(path.containsPoint(Vector2D.create(60, 20))).toBe(true); // Middle point after translation
      expect(path.containsPoint(Vector2D.create(10, 20))).toBe(true); // Start point after translation
      expect(path.containsPoint(Vector2D.create(0, 0))).toBe(false); // Original start point
    });
  });

  describe('intersects', () => {
    it('should detect intersection with another path', () => {
      const path1 = new Path({
        points: [
          { x: 0, y: 0, type: 'move' },
          { x: 100, y: 100, type: 'line' },
        ],
      });
      const path2 = new Path({
        points: [
          { x: 0, y: 100, type: 'move' },
          { x: 100, y: 0, type: 'line' },
        ],
      });
      expect(path1.intersects(path2)).toBe(true);
    });

    it('should detect non-intersection with another path', () => {
      const path1 = new Path({
        points: [
          { x: 0, y: 0, type: 'move' },
          { x: 50, y: 50, type: 'line' },
        ],
      });
      const path2 = new Path({
        points: [
          { x: 100, y: 100, type: 'move' },
          { x: 150, y: 150, type: 'line' },
        ],
      });
      expect(path1.intersects(path2)).toBe(false);
    });
  });

  describe('closed path', () => {
    it('should close path with closePath method', () => {
      const path = new Path({
        points: [
          { x: 0, y: 0, type: 'move' },
          { x: 100, y: 0, type: 'line' },
          { x: 100, y: 100, type: 'line' },
        ],
      });

      // 초기에는 닫힌 경로가 아님
      expect(path.isClosed).toBe(false);

      // closePath 호출 후 닫힌 경로가 됨
      const closedPath = path.closePath();
      expect(closedPath.isClosed).toBe(true);

      // 마지막 점이 첫 번째 점과 같은 좌표인지 확인
      const points = closedPath.points;
      expect(points[points.length - 1].x).toBe(points[0].x);
      expect(points[points.length - 1].y).toBe(points[0].y);
      expect(points[points.length - 1].type).toBe('line');
    });

    it('should not add duplicate point when path is already closed', () => {
      const path = new Path({
        points: [
          { x: 0, y: 0, type: 'move' },
          { x: 100, y: 0, type: 'line' },
          { x: 100, y: 100, type: 'line' },
          { x: 0, y: 0, type: 'line' }, // 이미 닫힌 경로
        ],
      });

      // 이미 닫힌 경로임
      expect(path.isClosed).toBe(true);

      // 점의 개수 저장
      const initialPointCount = path.points.length;

      // closePath 호출해도 점이 추가되지 않음
      const closedPath = path.closePath();
      expect(closedPath.points.length).toBe(initialPointCount);
    });

    it('should create closed path with closed option', () => {
      const path = new Path({
        points: [
          { x: 0, y: 0, type: 'move' },
          { x: 100, y: 0, type: 'line' },
          { x: 100, y: 100, type: 'line' },
        ],
        closed: true, // 생성 시 닫힌 경로 옵션 사용
      });

      // 닫힌 경로로 생성됨
      expect(path.isClosed).toBe(true);

      // 마지막 점이 첫 번째 점과 같은 좌표인지 확인
      const points = path.points;
      expect(points[points.length - 1].x).toBe(points[0].x);
      expect(points[points.length - 1].y).toBe(points[0].y);
    });

    it('should not close path with less than 2 points', () => {
      // 점이 1개인 경로
      const path1 = new Path({
        points: [{ x: 0, y: 0, type: 'move' }],
      });

      const closedPath1 = path1.closePath();
      expect(closedPath1.isClosed).toBe(false);
      expect(closedPath1.points.length).toBe(1);

      // 점이 없는 경로
      const path2 = new Path();

      const closedPath2 = path2.closePath();
      expect(closedPath2.isClosed).toBe(false);
      expect(closedPath2.points.length).toBe(0);
    });

    it('should preserve closed property when cloning', () => {
      const path = new Path({
        points: [
          { x: 0, y: 0, type: 'move' },
          { x: 100, y: 0, type: 'line' },
          { x: 100, y: 100, type: 'line' },
        ],
        closed: true,
      });

      const clonedPath = path.clone() as Path;
      expect(clonedPath.isClosed).toBe(true);
    });

    it('should preserve closed property when applying transform', () => {
      const path = new Path({
        points: [
          { x: 0, y: 0, type: 'move' },
          { x: 100, y: 0, type: 'line' },
          { x: 100, y: 100, type: 'line' },
        ],
        closed: true,
      });

      const transformedPath = path.applyTransform(Matrix3x3.translation(10, 20)) as Path;
      expect(transformedPath.isClosed).toBe(true);
    });
  });

  describe('clone', () => {
    it('should create independent copy', () => {
      const original = new Path({
        points: [
          { x: 10, y: 20, type: 'move' },
          { x: 100, y: 50, type: 'line' },
        ],
        style: {
          strokeColor: 'black',
          strokeWidth: 2,
        },
      });
      const clone = original.clone();

      expect(clone.id).not.toBe(original.id);
      expect(clone.bounds).toEqual(original.bounds);
      expect(clone.style).toEqual(original.style);
      expect(clone.transform.values).toEqual(original.transform.values);
      expect(clone.points).toEqual(original.points);
    });
  });
});

describe('PathFactory', () => {
  it('should create path through factory', () => {
    const factory = new PathFactory();
    const path = factory.create({
      points: [
        { x: 10, y: 20, type: 'move' },
        { x: 100, y: 50, type: 'line' },
      ],
    });
    expect(path).toBeInstanceOf(Path);
    expect(path.bounds).toEqual({
      x: 10,
      y: 20,
      width: 90,
      height: 30,
    });
  });
});

describe('Bezier Curves and SVG Path Commands', () => {
  describe('quadratic bezier curves', () => {
    it('should add quadratic bezier curve point', () => {
      const path = new Path();
      path.addPoint(10, 10, 'move');
      path.addQuadraticCurve(20, 20, 30, 10);

      expect(path.points).toEqual([
        { x: 10, y: 10, type: 'move' },
        { x: 30, y: 10, type: 'quadratic', controlPoint: { x: 20, y: 20 } },
      ]);
    });

    it('should calculate bounds correctly with quadratic curves', () => {
      const path = new Path({
        points: [
          { x: 0, y: 0, type: 'move' },
          { x: 100, y: 0, type: 'quadratic', controlPoint: { x: 50, y: -50 } },
        ],
      });

      // 2차 베지어 곡선에서는 실제 곡선의 극점을 기준으로 경계 상자 계산
      const bounds = path.bounds;
      expect(bounds.x).toBeCloseTo(0);
      expect(bounds.y).toBeCloseTo(-25, 0); // 실제 계산된 극점의 y값
      expect(bounds.width).toBeCloseTo(100);
      expect(bounds.height).toBeCloseTo(25, 0);
    });
  });

  describe('cubic bezier curves', () => {
    it('should add cubic bezier curve point', () => {
      const path = new Path();
      path.addPoint(10, 10, 'move');
      path.addCubicCurve(20, 20, 40, 20, 50, 10);

      expect(path.points).toEqual([
        { x: 10, y: 10, type: 'move' },
        {
          x: 50,
          y: 10,
          type: 'cubic',
          controlPoint1: { x: 20, y: 20 },
          controlPoint2: { x: 40, y: 20 },
        },
      ]);
    });

    it('should calculate bounds correctly with cubic curves', () => {
      const path = new Path({
        points: [
          { x: 0, y: 0, type: 'move' },
          {
            x: 100,
            y: 0,
            type: 'cubic',
            controlPoint1: { x: 30, y: -30 },
            controlPoint2: { x: 70, y: 30 },
          },
        ],
      });

      // 3차 베지어 곡선에서는 실제 곡선의 극점을 기준으로 경계 상자 계산
      const bounds = path.bounds;
      expect(bounds.x).toBeCloseTo(0);
      expect(bounds.y).toBeCloseTo(-8.7, 0); // 실제 계산된 극점의 y값
      expect(bounds.width).toBeCloseTo(100);
      expect(bounds.height).toBeCloseTo(17.4, 0); // 실제 계산된 높이
    });
  });

  describe('SVG path commands', () => {
    it('should convert path to SVG path commands', () => {
      const path = new Path();
      path.addPoint(10, 10, 'move');
      path.addPoint(50, 10, 'line');
      path.addQuadraticCurve(70, 30, 90, 10);
      path.addCubicCurve(110, -10, 130, 30, 150, 10);

      const svgPath = path.toSVGPath();
      expect(svgPath).toBe('M10,10 L50,10 Q70,30 90,10 C110,-10 130,30 150,10');
    });

    it('should create path from SVG path commands', () => {
      const svgPath = 'M10,10 L50,10 Q70,30 90,10 C110,-10 130,30 150,10 Z';
      const path = Path.fromSVGPath(svgPath);

      expect(path.points).toEqual([
        { x: 10, y: 10, type: 'move' },
        { x: 50, y: 10, type: 'line' },
        { x: 90, y: 10, type: 'quadratic', controlPoint: { x: 70, y: 30 } },
        {
          x: 150,
          y: 10,
          type: 'cubic',
          controlPoint1: { x: 110, y: -10 },
          controlPoint2: { x: 130, y: 30 },
        },
        { x: 10, y: 10, type: 'line' }, // Z 명령어로 인해 첫 점으로 돌아감
      ]);

      expect(path.isClosed).toBe(true);
    });

    it('should handle relative commands in SVG path', () => {
      const svgPath = 'm10,10 l40,0 q20,20 40,0 c20,-20 40,20 60,0 z';
      const path = Path.fromSVGPath(svgPath);

      expect(path.points).toEqual([
        { x: 10, y: 10, type: 'move' },
        { x: 50, y: 10, type: 'line' },
        { x: 90, y: 10, type: 'quadratic', controlPoint: { x: 70, y: 30 } },
        {
          x: 150,
          y: 10,
          type: 'cubic',
          controlPoint1: { x: 110, y: -10 },
          controlPoint2: { x: 130, y: 30 },
        },
        { x: 10, y: 10, type: 'line' },
      ]);
    });

    it('should handle arc commands in SVG path', () => {
      const svgPath = 'M10,10 A50,25 0 0,1 150,10';
      const path = Path.fromSVGPath(svgPath);

      // Arc 명령어는 여러 개의 베지어 곡선으로 근사화됨
      expect(path.points.length).toBeGreaterThan(2);
      expect(path.points[0]).toEqual({ x: 10, y: 10, type: 'move' });

      // 마지막 점은 호의 끝점 (부동 소수점 오차 허용)
      const lastPoint = path.points[path.points.length - 1];
      expect(lastPoint.x).toBeCloseTo(150, 5);
      expect(lastPoint.y).toBeCloseTo(10, 5);
    });
  });

  describe('containsPoint with bezier curves', () => {
    it('should detect point on quadratic bezier curve', () => {
      const path = new Path({
        points: [
          { x: 0, y: 0, type: 'move' },
          { x: 100, y: 0, type: 'quadratic', controlPoint: { x: 50, y: -50 } },
        ],
      });

      // 곡선 위의 점 (t=0.5일 때의 점)
      expect(path.containsPoint(Vector2D.create(50, -25))).toBe(true);

      // 곡선에서 멀리 떨어진 점
      expect(path.containsPoint(Vector2D.create(50, 25))).toBe(false);
    });

    it('should detect point on cubic bezier curve', () => {
      const path = new Path({
        points: [
          { x: 0, y: 0, type: 'move' },
          {
            x: 100,
            y: 0,
            type: 'cubic',
            controlPoint1: { x: 30, y: -30 },
            controlPoint2: { x: 70, y: 30 },
          },
        ],
      });

      // 곡선 위의 점 (t=0.5일 때의 점)
      expect(path.containsPoint(Vector2D.create(50, 0))).toBe(true);

      // 곡선에서 멀리 떨어진 점
      expect(path.containsPoint(Vector2D.create(50, 50))).toBe(false);
    });
  });
});
