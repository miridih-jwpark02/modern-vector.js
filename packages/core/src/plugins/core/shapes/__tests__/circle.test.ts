import { describe, it, expect } from 'vitest';
import { Circle, CircleFactory } from '../circle';
import { Vector2D } from '../../math/vector';
import { Matrix3x3 } from '../../math/matrix';

describe('Circle', () => {
  describe('creation', () => {
    it('should create circle with default values', () => {
      const circle = new Circle();
      expect(circle.id).toBeDefined();
      expect(circle.type).toBe('circle');
      expect(circle.bounds).toEqual({
        x: 0,
        y: 0,
        width: 0,
        height: 0
      });
    });

    it('should create circle with specified values', () => {
      const circle = new Circle({
        centerX: 100,
        centerY: 100,
        radius: 50
      });
      expect(circle.bounds).toEqual({
        x: 50,
        y: 50,
        width: 100,
        height: 100
      });
    });
  });

  describe('transformation', () => {
    it('should apply translation', () => {
      const circle = new Circle({
        centerX: 100,
        centerY: 100,
        radius: 50
      });
      const translated = circle.applyTransform(Matrix3x3.translation(10, 20));
      expect(translated.bounds).toEqual({
        x: 60,
        y: 70,
        width: 100,
        height: 100
      });
    });

    it('should apply uniform scale', () => {
      const circle = new Circle({
        centerX: 100,
        centerY: 100,
        radius: 50
      });
      const scaled = circle.applyTransform(Matrix3x3.scale(2, 2));
      expect(scaled.bounds).toEqual({
        x: 50,   // Top-left point stays at (50,50)
        y: 50,
        width: 200,
        height: 200
      });
    });
  });

  describe('scale origin', () => {
    it('should scale from top-left by default', () => {
      const circle = new Circle({
        centerX: 100,
        centerY: 100,
        radius: 50
      });
      const scaled = circle.applyTransform(Matrix3x3.scale(2, 2));
      expect(scaled.bounds).toEqual({
        x: 50,   // Top-left point stays at (50,50)
        y: 50,
        width: 200,
        height: 200
      });
    });

    it('should scale from center when specified', () => {
      const circle = new Circle({
        centerX: 100,
        centerY: 100,
        radius: 50,
        scaleOrigin: 'center'
      });
      const scaled = circle.applyTransform(Matrix3x3.scale(2, 2));
      expect(scaled.bounds).toEqual({
        x: 0,    // Center stays at (100,100), radius doubles to 100
        y: 0,
        width: 200,
        height: 200
      });
    });

    it('should scale from custom point', () => {
      const circle = new Circle({
        centerX: 100,
        centerY: 100,
        radius: 50,
        scaleOrigin: 'custom',
        customScaleOriginPoint: { x: 100, y: 50 }  // Top center point
      });
      const scaled = circle.applyTransform(Matrix3x3.scale(2, 2));
      expect(scaled.bounds).toEqual({
        x: 0,    // x: 100 - 100 = 0
        y: 50,   // y stays at 50
        width: 200,
        height: 200
      });
    });

    it('should allow changing scale origin after creation', () => {
      const circle = new Circle({
        centerX: 100,
        centerY: 100,
        radius: 50
      });
      
      // Default is topLeft, so let's change to center
      circle.setScaleOrigin('center');
      const scaled1 = circle.applyTransform(Matrix3x3.scale(2, 2));
      expect(scaled1.bounds).toEqual({
        x: 0,
        y: 0,
        width: 200,
        height: 200
      });

      circle.setScaleOrigin('custom', { x: 100, y: 100 });  // Center point
      const scaled2 = circle.applyTransform(Matrix3x3.scale(2, 2));
      expect(scaled2.bounds).toEqual({
        x: 0,
        y: 0,
        width: 200,
        height: 200
      });
    });

    it('should preserve scale origin after transformation', () => {
      const circle = new Circle({
        centerX: 100,
        centerY: 100,
        radius: 50,
        scaleOrigin: 'center'
      });
      
      const scaled = circle.applyTransform(Matrix3x3.scale(2, 2));
      const scaledAgain = scaled.applyTransform(Matrix3x3.scale(1.5, 1.5));
      
      expect(scaledAgain.bounds).toEqual({
        x: -50,   // Center scaling continues
        y: -50,   // Center scaling continues
        width: 300,  // 100 * 2 * 1.5
        height: 300  // 100 * 2 * 1.5
      });
    });

    it('should maintain circle shape after non-uniform scale', () => {
      const circle = new Circle({
        centerX: 100,
        centerY: 100,
        radius: 50,
        scaleOrigin: 'center'
      });
      
      const scaled = circle.applyTransform(Matrix3x3.scale(2, 3));
      expect(scaled.bounds.width).toBe(scaled.bounds.height);  // Circle should stay circular
    });
  });

  describe('containsPoint', () => {
    it('should detect point inside circle', () => {
      const circle = new Circle({
        centerX: 100,
        centerY: 100,
        radius: 50
      });
      expect(circle.containsPoint(Vector2D.create(100, 100))).toBe(true); // Center
      expect(circle.containsPoint(Vector2D.create(120, 120))).toBe(true); // Inside
    });

    it('should detect point outside circle', () => {
      const circle = new Circle({
        centerX: 100,
        centerY: 100,
        radius: 50
      });
      expect(circle.containsPoint(Vector2D.create(200, 200))).toBe(false);
    });

    it('should handle transformed circle', () => {
      const circle = new Circle({
        centerX: 100,
        centerY: 100,
        radius: 50,
        transform: Matrix3x3.translation(10, 20)
      });
      expect(circle.containsPoint(Vector2D.create(110, 120))).toBe(true); // Transformed center
      expect(circle.containsPoint(Vector2D.create(170, 180))).toBe(false); // Outside transformed circle
    });
  });

  describe('intersects', () => {
    it('should detect intersection with another circle', () => {
      const circle1 = new Circle({
        centerX: 100,
        centerY: 100,
        radius: 50
      });
      const circle2 = new Circle({
        centerX: 150,
        centerY: 150,
        radius: 50
      });
      expect(circle1.intersects(circle2)).toBe(true);
    });

    it('should detect non-intersection', () => {
      const circle1 = new Circle({
        centerX: 100,
        centerY: 100,
        radius: 50
      });
      const circle2 = new Circle({
        centerX: 300,
        centerY: 300,
        radius: 50
      });
      expect(circle1.intersects(circle2)).toBe(false);
    });
  });

  describe('clone', () => {
    it('should create independent copy', () => {
      const original = new Circle({
        centerX: 100,
        centerY: 100,
        radius: 50,
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
});

describe('CircleFactory', () => {
  it('should create circle through factory', () => {
    const factory = new CircleFactory();
    const circle = factory.create({
      centerX: 100,
      centerY: 100,
      radius: 50
    });
    expect(circle).toBeInstanceOf(Circle);
    expect(circle.bounds).toEqual({
      x: 50,
      y: 50,
      width: 100,
      height: 100
    });
  });
}); 