import { describe, it, expect } from 'vitest';
import { Rectangle, RectangleFactory } from '../rectangle';
import { Vector2D } from '../../math/vector';
import { Matrix3x3 } from '../../math/matrix';

describe('Rectangle', () => {
  describe('creation', () => {
    it('should create rectangle with default values', () => {
      const rect = new Rectangle();
      expect(rect.id).toBeDefined();
      expect(rect.type).toBe('rectangle');
      expect(rect.bounds).toEqual({
        x: 0,
        y: 0,
        width: 0,
        height: 0
      });
    });

    it('should create rectangle with specified values', () => {
      const rect = new Rectangle({
        x: 10,
        y: 20,
        width: 100,
        height: 50
      });
      expect(rect.bounds).toEqual({
        x: 10,
        y: 20,
        width: 100,
        height: 50
      });
    });
  });

  describe('transformation', () => {
    it('should apply translation', () => {
      const rect = new Rectangle({
        x: 0,
        y: 0,
        width: 100,
        height: 50
      });
      const translated = rect.applyTransform(Matrix3x3.translation(10, 20));
      expect(translated.bounds).toEqual({
        x: 10,
        y: 20,
        width: 100,
        height: 50
      });
    });

    it('should apply rotation', () => {
      const rect = new Rectangle({
        x: 0,
        y: 0,
        width: 100,
        height: 50
      });
      const rotated = rect.applyTransform(Matrix3x3.rotation(Math.PI / 2));
      expect(rotated.bounds.width).toBeCloseTo(50);
      expect(rotated.bounds.height).toBeCloseTo(100);
    });

    it('should apply scale', () => {
      const rect = new Rectangle({
        x: 0,
        y: 0,
        width: 100,
        height: 50
      });
      const scaled = rect.applyTransform(Matrix3x3.scale(2, 3));
      expect(scaled.bounds).toEqual({
        x: 0,
        y: 0,
        width: 200,
        height: 150
      });
    });
  });

  describe('containsPoint', () => {
    it('should detect point inside rectangle', () => {
      const rect = new Rectangle({
        x: 0,
        y: 0,
        width: 100,
        height: 50
      });
      expect(rect.containsPoint(Vector2D.create(50, 25))).toBe(true);
    });

    it('should detect point outside rectangle', () => {
      const rect = new Rectangle({
        x: 0,
        y: 0,
        width: 100,
        height: 50
      });
      expect(rect.containsPoint(Vector2D.create(150, 75))).toBe(false);
    });

    it('should handle transformed rectangle', () => {
      const rect = new Rectangle({
        x: 0,
        y: 0,
        width: 100,
        height: 50,
        transform: Matrix3x3.translation(10, 20)
      });
      expect(rect.containsPoint(Vector2D.create(60, 45))).toBe(true);
      expect(rect.containsPoint(Vector2D.create(0, 0))).toBe(false);
    });
  });

  describe('intersects', () => {
    it('should detect intersection with another rectangle', () => {
      const rect1 = new Rectangle({
        x: 0,
        y: 0,
        width: 100,
        height: 50
      });
      const rect2 = new Rectangle({
        x: 50,
        y: 25,
        width: 100,
        height: 50
      });
      expect(rect1.intersects(rect2)).toBe(true);
    });

    it('should detect non-intersection', () => {
      const rect1 = new Rectangle({
        x: 0,
        y: 0,
        width: 100,
        height: 50
      });
      const rect2 = new Rectangle({
        x: 150,
        y: 75,
        width: 100,
        height: 50
      });
      expect(rect1.intersects(rect2)).toBe(false);
    });
  });

  describe('clone', () => {
    it('should create independent copy', () => {
      const original = new Rectangle({
        x: 10,
        y: 20,
        width: 100,
        height: 50,
        style: {
          fillColor: 'red',
          strokeColor: 'black'
        }
      });
      const clone = original.clone();

      expect(clone.id).not.toBe(original.id);
      expect(clone.bounds).toEqual(original.bounds);
      expect(clone.style).toEqual(original.style);
      expect(clone.transform.values).toEqual(original.transform.values);
    });
  });

  describe('scale origin', () => {
    it('should scale from top-left by default', () => {
      const rect = new Rectangle({
        x: 0,
        y: 0,
        width: 100,
        height: 50
      });
      const scaled = rect.applyTransform(Matrix3x3.scale(2, 2));
      expect(scaled.bounds).toEqual({
        x: 0,  // Top-left point stays at (0,0)
        y: 0,
        width: 200,
        height: 100
      });
    });

    it('should scale from center when specified', () => {
      const rect = new Rectangle({
        x: 0,
        y: 0,
        width: 100,
        height: 50,
        scaleOrigin: 'center'
      });
      const scaled = rect.applyTransform(Matrix3x3.scale(2, 2));
      expect(scaled.bounds).toEqual({
        x: -50,  // Center point is (50, 25), so x: 50 - (100 * 2)/2 = -50
        y: -25,  // y: 25 - (50 * 2)/2 = -25
        width: 200,
        height: 100
      });
    });

    it('should scale from custom point', () => {
      const rect = new Rectangle({
        x: 0,
        y: 0,
        width: 100,
        height: 50,
        scaleOrigin: 'custom',
        customScaleOriginPoint: { x: 50, y: 0 }  // Middle of top edge
      });
      const scaled = rect.applyTransform(Matrix3x3.scale(2, 2));
      expect(scaled.bounds).toEqual({
        x: -50,  // x: 50 - (100 * 2)/2 = -50
        y: 0,    // y stays at 0
        width: 200,
        height: 100
      });
    });

    it('should allow changing scale origin after creation', () => {
      const rect = new Rectangle({
        x: 0,
        y: 0,
        width: 100,
        height: 50
      });
      
      // Default is topLeft, so let's change to center
      rect.setScaleOrigin('center');
      const scaled1 = rect.applyTransform(Matrix3x3.scale(2, 2));
      expect(scaled1.bounds).toEqual({
        x: -50,
        y: -25,
        width: 200,
        height: 100
      });

      rect.setScaleOrigin('custom', { x: 50, y: 25 });  // Center point
      const scaled2 = rect.applyTransform(Matrix3x3.scale(2, 2));
      expect(scaled2.bounds).toEqual({
        x: -50,
        y: -25,
        width: 200,
        height: 100
      });
    });

    it('should preserve scale origin after transformation', () => {
      const rect = new Rectangle({
        x: 0,
        y: 0,
        width: 100,
        height: 50,
        scaleOrigin: 'center'
      });
      
      const scaled = rect.applyTransform(Matrix3x3.scale(2, 2));
      const scaledAgain = scaled.applyTransform(Matrix3x3.scale(1.5, 1.5));
      
      expect(scaledAgain.bounds).toEqual({
        x: -100,  // Center scaling continues
        y: -50,   // Center scaling continues
        width: 300,  // 100 * 2 * 1.5
        height: 150  // 50 * 2 * 1.5
      });
    });
  });
});

describe('RectangleFactory', () => {
  it('should create rectangle through factory', () => {
    const factory = new RectangleFactory();
    const rect = factory.create({
      x: 10,
      y: 20,
      width: 100,
      height: 50
    });
    expect(rect).toBeInstanceOf(Rectangle);
    expect(rect.bounds).toEqual({
      x: 10,
      y: 20,
      width: 100,
      height: 50
    });
  });
}); 