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