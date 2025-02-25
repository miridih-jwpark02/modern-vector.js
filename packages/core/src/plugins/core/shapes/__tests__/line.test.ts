import { describe, it, expect } from 'vitest';
import { Line, LineFactory } from '../line';
import { Vector2D } from '../../math/vector';
import { Matrix3x3 } from '../../math/matrix';

describe('Line', () => {
  describe('creation', () => {
    it('should create line with default values', () => {
      const line = new Line();
      expect(line.id).toBeDefined();
      expect(line.type).toBe('line');
      expect(line.bounds).toEqual({
        x: 0,
        y: 0,
        width: 0,
        height: 0
      });
    });

    it('should create line with specified values', () => {
      const line = new Line({
        x1: 10,
        y1: 20,
        x2: 100,
        y2: 50
      });
      expect(line.bounds).toEqual({
        x: 10,
        y: 20,
        width: 90,
        height: 30
      });
    });
  });

  describe('transformation', () => {
    it('should apply translation', () => {
      const line = new Line({
        x1: 0,
        y1: 0,
        x2: 100,
        y2: 50
      });
      const translated = line.applyTransform(Matrix3x3.translation(10, 20));
      expect(translated.bounds).toEqual({
        x: 10,
        y: 20,
        width: 100,
        height: 50
      });
    });

    it('should apply rotation', () => {
      const line = new Line({
        x1: 0,
        y1: 0,
        x2: 100,
        y2: 0
      });
      const rotated = line.applyTransform(Matrix3x3.rotation(Math.PI / 2));
      expect(rotated.bounds.width).toBeCloseTo(0);
      expect(rotated.bounds.height).toBeCloseTo(100);
    });

    it('should apply scale', () => {
      const line = new Line({
        x1: 0,
        y1: 0,
        x2: 100,
        y2: 50
      });
      const scaled = line.applyTransform(Matrix3x3.scale(2, 2));
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
      const line = new Line({
        x1: 0,
        y1: 0,
        x2: 100,
        y2: 50
      });
      const scaled = line.applyTransform(Matrix3x3.scale(2, 2));
      expect(scaled.bounds).toEqual({
        x: 0,  // Top-left point stays at (0,0)
        y: 0,
        width: 200,
        height: 100
      });
    });

    it('should scale from center when specified', () => {
      const line = new Line({
        x1: 0,
        y1: 0,
        x2: 100,
        y2: 50,
        scaleOrigin: 'center'
      });
      const scaled = line.applyTransform(Matrix3x3.scale(2, 2));
      expect(scaled.bounds).toEqual({
        x: -50,  // Center point is (50, 25), so x: 50 - (100 * 2)/2 = -50
        y: -25,  // y: 25 - (50 * 2)/2 = -25
        width: 200,
        height: 100
      });
    });

    it('should scale from custom point', () => {
      const line = new Line({
        x1: 0,
        y1: 0,
        x2: 100,
        y2: 50,
        scaleOrigin: 'custom',
        customScaleOriginPoint: { x: 50, y: 0 }  // Middle of line
      });
      const scaled = line.applyTransform(Matrix3x3.scale(2, 2));
      expect(scaled.bounds).toEqual({
        x: -50,  // x: 50 - (100 * 2)/2 = -50
        y: 0,    // y stays at 0
        width: 200,
        height: 100
      });
    });

    it('should preserve scale origin after transformation', () => {
      const line = new Line({
        x1: 0,
        y1: 0,
        x2: 100,
        y2: 50,
        scaleOrigin: 'center'
      });
      
      const scaled = line.applyTransform(Matrix3x3.scale(2, 2));
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
    it('should detect point on line', () => {
      const line = new Line({
        x1: 0,
        y1: 0,
        x2: 100,
        y2: 50
      });
      expect(line.containsPoint(Vector2D.create(50, 25))).toBe(true);  // Middle point
      expect(line.containsPoint(Vector2D.create(0, 0))).toBe(true);    // Start point
      expect(line.containsPoint(Vector2D.create(100, 50))).toBe(true); // End point
    });

    it('should detect point near line', () => {
      const line = new Line({
        x1: 0,
        y1: 0,
        x2: 100,
        y2: 0
      });
      expect(line.containsPoint(Vector2D.create(50, 0.5))).toBe(true);  // 0.5px above line
      expect(line.containsPoint(Vector2D.create(50, -0.5))).toBe(true); // 0.5px below line
    });

    it('should detect point away from line', () => {
      const line = new Line({
        x1: 0,
        y1: 0,
        x2: 100,
        y2: 50
      });
      expect(line.containsPoint(Vector2D.create(50, 50))).toBe(false);  // Point above line
      expect(line.containsPoint(Vector2D.create(-10, -5))).toBe(false); // Point before line
      expect(line.containsPoint(Vector2D.create(110, 55))).toBe(false); // Point after line
    });

    it('should handle transformed line', () => {
      const line = new Line({
        x1: 0,
        y1: 0,
        x2: 100,
        y2: 0,
        transform: Matrix3x3.translation(10, 20)
      });
      expect(line.containsPoint(Vector2D.create(60, 20))).toBe(true);  // Middle point after translation
      expect(line.containsPoint(Vector2D.create(10, 20))).toBe(true);  // Start point after translation
      expect(line.containsPoint(Vector2D.create(0, 0))).toBe(false);   // Original start point
    });
  });

  describe('intersects', () => {
    it('should detect intersection with another line', () => {
      const line1 = new Line({
        x1: 0,
        y1: 0,
        x2: 100,
        y2: 50
      });
      const line2 = new Line({
        x1: 50,
        y1: 25,
        x2: 150,
        y2: 75
      });
      expect(line1.intersects(line2)).toBe(true);
    });

    it('should detect non-intersection', () => {
      const line1 = new Line({
        x1: 0,
        y1: 0,
        x2: 100,
        y2: 50
      });
      const line2 = new Line({
        x1: 0,
        y1: 100,
        x2: 100,
        y2: 150
      });
      expect(line1.intersects(line2)).toBe(false);
    });
  });

  describe('clone', () => {
    it('should create independent copy', () => {
      const original = new Line({
        x1: 10,
        y1: 20,
        x2: 100,
        y2: 50,
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
    });
  });
});

describe('LineFactory', () => {
  it('should create line through factory', () => {
    const factory = new LineFactory();
    const line = factory.create({
      x1: 10,
      y1: 20,
      x2: 100,
      y2: 50
    });
    expect(line).toBeInstanceOf(Line);
    expect(line.bounds).toEqual({
      x: 10,
      y: 20,
      width: 90,
      height: 30
    });
  });
}); 