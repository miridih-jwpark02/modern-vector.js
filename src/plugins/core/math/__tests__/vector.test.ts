import { describe, it, expect } from 'vitest';
import { Vector2D } from '../vector';

describe('Vector2D', () => {
  describe('create', () => {
    it('should create a vector with x and y coordinates', () => {
      const vector = Vector2D.create(1, 2);
      expect(vector.x).toBe(1);
      expect(vector.y).toBe(2);
    });

    it('should create a zero vector when no arguments are provided', () => {
      const vector = Vector2D.create();
      expect(vector.x).toBe(0);
      expect(vector.y).toBe(0);
    });
  });

  describe('add', () => {
    it('should add two vectors', () => {
      const v1 = Vector2D.create(1, 2);
      const v2 = Vector2D.create(3, 4);
      const result = v1.add(v2);
      expect(result.x).toBe(4);
      expect(result.y).toBe(6);
    });

    it('should not modify the original vectors', () => {
      const v1 = Vector2D.create(1, 2);
      const v2 = Vector2D.create(3, 4);
      v1.add(v2);
      expect(v1.x).toBe(1);
      expect(v1.y).toBe(2);
      expect(v2.x).toBe(3);
      expect(v2.y).toBe(4);
    });
  });

  describe('subtract', () => {
    it('should subtract two vectors', () => {
      const v1 = Vector2D.create(3, 4);
      const v2 = Vector2D.create(1, 2);
      const result = v1.subtract(v2);
      expect(result.x).toBe(2);
      expect(result.y).toBe(2);
    });
  });

  describe('scale', () => {
    it('should scale a vector by a scalar', () => {
      const vector = Vector2D.create(2, 3);
      const result = vector.scale(2);
      expect(result.x).toBe(4);
      expect(result.y).toBe(6);
    });
  });

  describe('dot', () => {
    it('should calculate dot product of two vectors', () => {
      const v1 = Vector2D.create(1, 2);
      const v2 = Vector2D.create(3, 4);
      const result = v1.dot(v2);
      expect(result).toBe(11); // 1*3 + 2*4
    });
  });

  describe('length', () => {
    it('should calculate the length of a vector', () => {
      const vector = Vector2D.create(3, 4);
      expect(vector.length).toBe(5);
    });
  });

  describe('normalize', () => {
    it('should normalize a vector to unit length', () => {
      const vector = Vector2D.create(3, 4);
      const result = vector.normalize();
      expect(result.length).toBeCloseTo(1);
      expect(result.x).toBeCloseTo(0.6);
      expect(result.y).toBeCloseTo(0.8);
    });

    it('should return a zero vector when normalizing a zero vector', () => {
      const vector = Vector2D.create(0, 0);
      const result = vector.normalize();
      expect(result.x).toBe(0);
      expect(result.y).toBe(0);
    });
  });

  describe('angle', () => {
    it('should calculate angle between two vectors', () => {
      const v1 = Vector2D.create(1, 0);
      const v2 = Vector2D.create(0, 1);
      expect(v1.angle(v2)).toBeCloseTo(Math.PI / 2);
    });

    it('should return 0 for parallel vectors', () => {
      const v1 = Vector2D.create(1, 0);
      const v2 = Vector2D.create(2, 0);
      expect(v1.angle(v2)).toBeCloseTo(0);
    });

    it('should return PI for opposite vectors', () => {
      const v1 = Vector2D.create(1, 0);
      const v2 = Vector2D.create(-1, 0);
      expect(v1.angle(v2)).toBeCloseTo(Math.PI);
    });
  });

  describe('rotate', () => {
    it('should rotate vector by 90 degrees', () => {
      const vector = Vector2D.create(1, 0);
      const rotated = vector.rotate(Math.PI / 2);
      expect(rotated.x).toBeCloseTo(0);
      expect(rotated.y).toBeCloseTo(1);
    });

    it('should rotate vector by 180 degrees', () => {
      const vector = Vector2D.create(1, 0);
      const rotated = vector.rotate(Math.PI);
      expect(rotated.x).toBeCloseTo(-1);
      expect(rotated.y).toBeCloseTo(0);
    });
  });

  describe('perpendicular', () => {
    it('should return perpendicular vector', () => {
      const vector = Vector2D.create(1, 0);
      const perp = vector.perpendicular();
      expect(perp.x).toBe(0);
      expect(perp.y).toBe(1);
    });

    it('should maintain perpendicularity property', () => {
      const vector = Vector2D.create(2, 3);
      const perp = vector.perpendicular();
      expect(vector.dot(perp)).toBeCloseTo(0);
    });
  });

  describe('distanceTo', () => {
    it('should calculate distance between two vectors', () => {
      const v1 = Vector2D.create(0, 0);
      const v2 = Vector2D.create(3, 4);
      expect(v1.distanceTo(v2)).toBe(5);
    });

    it('should return 0 for same vectors', () => {
      const v1 = Vector2D.create(1, 2);
      const v2 = Vector2D.create(1, 2);
      expect(v1.distanceTo(v2)).toBe(0);
    });
  });

  describe('immutability', () => {
    it('should not modify original vectors in any operation', () => {
      const v1 = Vector2D.create(1, 2);
      const v2 = Vector2D.create(3, 4);
      
      v1.add(v2);
      v1.subtract(v2);
      v1.scale(2);
      v1.normalize();
      v1.rotate(Math.PI);
      v1.perpendicular();
      
      expect(v1.x).toBe(1);
      expect(v1.y).toBe(2);
      expect(v2.x).toBe(3);
      expect(v2.y).toBe(4);
    });
  });
}); 