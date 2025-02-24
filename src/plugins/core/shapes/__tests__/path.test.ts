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
        height: 0
      });
      expect(path.points).toEqual([]);
    });

    it('should create path with specified points', () => {
      const path = new Path({
        points: [
          { x: 10, y: 20, type: 'move' },
          { x: 100, y: 50, type: 'line' },
          { x: 50, y: 100, type: 'line' }
        ]
      });
      expect(path.bounds).toEqual({
        x: 10,
        y: 20,
        width: 90,
        height: 80
      });
      expect(path.points).toEqual([
        { x: 10, y: 20, type: 'move' },
        { x: 100, y: 50, type: 'line' },
        { x: 50, y: 100, type: 'line' }
      ]);
    });
  });

  describe('point manipulation', () => {
    it('should add points', () => {
      const path = new Path();
      path.addPoint(10, 20, 'move');
      path.addPoint(100, 50);  // Default type is 'line'
      path.addPoint(50, 100, 'line');

      expect(path.points).toEqual([
        { x: 10, y: 20, type: 'move' },
        { x: 100, y: 50, type: 'line' },
        { x: 50, y: 100, type: 'line' }
      ]);
    });

    it('should not modify original points array', () => {
      const path = new Path({
        points: [
          { x: 10, y: 20, type: 'move' },
          { x: 100, y: 50, type: 'line' }
        ]
      });
      const points = path.points;
      points.push({ x: 50, y: 100, type: 'line' });

      expect(path.points).toEqual([
        { x: 10, y: 20, type: 'move' },
        { x: 100, y: 50, type: 'line' }
      ]);
    });
  });

  describe('transformation', () => {
    it('should apply translation', () => {
      const path = new Path({
        points: [
          { x: 0, y: 0, type: 'move' },
          { x: 100, y: 50, type: 'line' }
        ]
      });
      const translated = path.applyTransform(Matrix3x3.translation(10, 20));
      expect(translated.bounds).toEqual({
        x: 10,
        y: 20,
        width: 100,
        height: 50
      });
    });

    it('should apply rotation', () => {
      const path = new Path({
        points: [
          { x: 0, y: 0, type: 'move' },
          { x: 100, y: 0, type: 'line' }
        ]
      });
      const rotated = path.applyTransform(Matrix3x3.rotation(Math.PI / 2));
      expect(rotated.bounds.width).toBeCloseTo(0);
      expect(rotated.bounds.height).toBeCloseTo(100);
    });

    it('should apply scale', () => {
      const path = new Path({
        points: [
          { x: 0, y: 0, type: 'move' },
          { x: 100, y: 50, type: 'line' }
        ]
      });
      const scaled = path.applyTransform(Matrix3x3.scale(2, 2));
      expect(scaled.bounds).toEqual({
        x: 0,
        y: 0,
        width: 200,
        height: 100
      });
    });
  });

  describe('scale origin', () => {
    it('should scale from top-left by default', () => {
      const path = new Path({
        points: [
          { x: 0, y: 0, type: 'move' },
          { x: 100, y: 50, type: 'line' }
        ]
      });
      const scaled = path.applyTransform(Matrix3x3.scale(2, 2));
      expect(scaled.bounds).toEqual({
        x: 0,  // Top-left point stays at (0,0)
        y: 0,
        width: 200,
        height: 100
      });
    });

    it('should scale from center when specified', () => {
      const path = new Path({
        points: [
          { x: 0, y: 0, type: 'move' },
          { x: 100, y: 50, type: 'line' }
        ],
        scaleOrigin: 'center'
      });
      const scaled = path.applyTransform(Matrix3x3.scale(2, 2));
      expect(scaled.bounds).toEqual({
        x: -50,  // Center point is (50, 25), so x: 50 - (100 * 2)/2 = -50
        y: -25,  // y: 25 - (50 * 2)/2 = -25
        width: 200,
        height: 100
      });
    });

    it('should scale from custom point', () => {
      const path = new Path({
        points: [
          { x: 0, y: 0, type: 'move' },
          { x: 100, y: 50, type: 'line' }
        ],
        scaleOrigin: 'custom',
        customScaleOriginPoint: { x: 50, y: 0 }  // Middle of top edge
      });
      const scaled = path.applyTransform(Matrix3x3.scale(2, 2));
      expect(scaled.bounds).toEqual({
        x: -50,  // x: 50 - (100 * 2)/2 = -50
        y: 0,    // y stays at 0
        width: 200,
        height: 100
      });
    });

    it('should preserve scale origin after transformation', () => {
      const path = new Path({
        points: [
          { x: 0, y: 0, type: 'move' },
          { x: 100, y: 50, type: 'line' }
        ],
        scaleOrigin: 'center'
      });
      
      const scaled = path.applyTransform(Matrix3x3.scale(2, 2));
      const scaledAgain = scaled.applyTransform(Matrix3x3.scale(1.5, 1.5));
      
      expect(scaledAgain.bounds).toEqual({
        x: -100,  // Center scaling continues
        y: -50,   // Center scaling continues
        width: 300,  // 100 * 2 * 1.5
        height: 150  // 50 * 2 * 1.5
      });
    });
  });

  describe('containsPoint', () => {
    it('should detect point on path', () => {
      const path = new Path({
        points: [
          { x: 0, y: 0, type: 'move' },
          { x: 100, y: 50, type: 'line' },
          { x: 50, y: 100, type: 'line' }
        ]
      });
      expect(path.containsPoint(Vector2D.create(50, 25))).toBe(true);   // On first line
      expect(path.containsPoint(Vector2D.create(75, 75))).toBe(true);   // On second line
      expect(path.containsPoint(Vector2D.create(0, 0))).toBe(true);     // Start point
      expect(path.containsPoint(Vector2D.create(50, 100))).toBe(true);  // End point
    });

    it('should handle move points correctly', () => {
      const path = new Path({
        points: [
          { x: 0, y: 0, type: 'move' },
          { x: 100, y: 50, type: 'line' },
          { x: 50, y: 100, type: 'move' },  // Start new subpath
          { x: 150, y: 150, type: 'line' }
        ]
      });
      expect(path.containsPoint(Vector2D.create(50, 25))).toBe(true);    // On first line
      expect(path.containsPoint(Vector2D.create(100, 125))).toBe(true);  // On second line
      expect(path.containsPoint(Vector2D.create(75, 75))).toBe(false);   // Between subpaths
    });

    it('should detect point away from path', () => {
      const path = new Path({
        points: [
          { x: 0, y: 0, type: 'move' },
          { x: 100, y: 50, type: 'line' }
        ]
      });
      expect(path.containsPoint(Vector2D.create(50, 50))).toBe(false);  // Point above line
      expect(path.containsPoint(Vector2D.create(-10, -5))).toBe(false); // Point before line
      expect(path.containsPoint(Vector2D.create(110, 55))).toBe(false); // Point after line
    });

    it('should handle transformed path', () => {
      const path = new Path({
        points: [
          { x: 0, y: 0, type: 'move' },
          { x: 100, y: 0, type: 'line' }
        ],
        transform: Matrix3x3.translation(10, 20)
      });
      expect(path.containsPoint(Vector2D.create(60, 20))).toBe(true);  // Middle point after translation
      expect(path.containsPoint(Vector2D.create(10, 20))).toBe(true);  // Start point after translation
      expect(path.containsPoint(Vector2D.create(0, 0))).toBe(false);   // Original start point
    });
  });

  describe('intersects', () => {
    it('should detect intersection with another path', () => {
      const path1 = new Path({
        points: [
          { x: 0, y: 0, type: 'move' },
          { x: 100, y: 50, type: 'line' }
        ]
      });
      const path2 = new Path({
        points: [
          { x: 50, y: 25, type: 'move' },
          { x: 150, y: 75, type: 'line' }
        ]
      });
      expect(path1.intersects(path2)).toBe(true);
    });

    it('should detect non-intersection', () => {
      const path1 = new Path({
        points: [
          { x: 0, y: 0, type: 'move' },
          { x: 100, y: 50, type: 'line' }
        ]
      });
      const path2 = new Path({
        points: [
          { x: 0, y: 100, type: 'move' },
          { x: 100, y: 150, type: 'line' }
        ]
      });
      expect(path1.intersects(path2)).toBe(false);
    });
  });

  describe('clone', () => {
    it('should create independent copy', () => {
      const original = new Path({
        points: [
          { x: 10, y: 20, type: 'move' },
          { x: 100, y: 50, type: 'line' }
        ],
        style: {
          strokeColor: 'black',
          strokeWidth: 2
        }
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
        { x: 100, y: 50, type: 'line' }
      ]
    });
    expect(path).toBeInstanceOf(Path);
    expect(path.bounds).toEqual({
      x: 10,
      y: 20,
      width: 90,
      height: 30
    });
  });
}); 