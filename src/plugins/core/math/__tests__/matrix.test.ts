import { describe, it, expect } from 'vitest';
import { Matrix3x3 } from '../matrix';

describe('Matrix3x3', () => {
  describe('create', () => {
    it('should create identity matrix by default', () => {
      const matrix = Matrix3x3.create();
      expect(matrix.values).toEqual([
        1, 0, 0,
        0, 1, 0,
        0, 0, 1
      ]);
    });

    it('should create matrix from values', () => {
      const values = [
        1, 2, 3,
        4, 5, 6,
        7, 8, 9
      ];
      const matrix = Matrix3x3.create(values);
      expect(matrix.values).toEqual(values);
    });

    it('should throw error for invalid values length', () => {
      expect(() => Matrix3x3.create([1, 2, 3, 4])).toThrow();
    });
  });

  describe('multiply', () => {
    it('should multiply two matrices', () => {
      const m1 = Matrix3x3.create([
        1, 2, 3,
        4, 5, 6,
        7, 8, 9
      ]);
      const m2 = Matrix3x3.create([
        9, 8, 7,
        6, 5, 4,
        3, 2, 1
      ]);
      const result = m1.multiply(m2);
      expect(result.values).toEqual([
        30, 24, 18,
        84, 69, 54,
        138, 114, 90
      ]);
    });

    it('should not modify original matrices', () => {
      const m1 = Matrix3x3.create([1, 2, 3, 4, 5, 6, 7, 8, 9]);
      const m2 = Matrix3x3.create([9, 8, 7, 6, 5, 4, 3, 2, 1]);
      const original1 = [...m1.values];
      const original2 = [...m2.values];
      m1.multiply(m2);
      expect(m1.values).toEqual(original1);
      expect(m2.values).toEqual(original2);
    });
  });

  describe('transformations', () => {
    it('should create translation matrix', () => {
      const matrix = Matrix3x3.translation(10, 20);
      expect(matrix.values).toEqual([
        1, 0, 10,
        0, 1, 20,
        0, 0, 1
      ]);
    });

    it('should create rotation matrix', () => {
      const matrix = Matrix3x3.rotation(Math.PI / 2);
      expect(matrix.values[0]).toBeCloseTo(0);
      expect(matrix.values[1]).toBeCloseTo(-1);
      expect(matrix.values[3]).toBeCloseTo(1);
      expect(matrix.values[4]).toBeCloseTo(0);
    });

    it('should create scale matrix', () => {
      const matrix = Matrix3x3.scale(2, 3);
      expect(matrix.values).toEqual([
        2, 0, 0,
        0, 3, 0,
        0, 0, 1
      ]);
    });
  });

  describe('inverse', () => {
    it('should calculate inverse matrix', () => {
      const matrix = Matrix3x3.scale(2, 2);
      const inverse = matrix.inverse();
      const result = matrix.multiply(inverse);
      // Should be close to identity matrix
      expect(result.values[0]).toBeCloseTo(1);
      expect(result.values[4]).toBeCloseTo(1);
      expect(result.values[8]).toBeCloseTo(1);
      expect(result.values[1]).toBeCloseTo(0);
      expect(result.values[2]).toBeCloseTo(0);
      expect(result.values[3]).toBeCloseTo(0);
      expect(result.values[5]).toBeCloseTo(0);
      expect(result.values[6]).toBeCloseTo(0);
      expect(result.values[7]).toBeCloseTo(0);
    });

    it('should throw error for non-invertible matrix', () => {
      const matrix = Matrix3x3.create([
        1, 1, 1,
        1, 1, 1,
        1, 1, 1
      ]);
      expect(() => matrix.inverse()).toThrow();
    });
  });

  describe('determinant', () => {
    it('should calculate determinant', () => {
      const matrix = Matrix3x3.create([
        1, 2, 3,
        4, 5, 6,
        7, 8, 9
      ]);
      expect(matrix.determinant()).toBe(0);
    });

    it('should calculate non-zero determinant', () => {
      const matrix = Matrix3x3.create([
        2, 0, 0,
        0, 2, 0,
        0, 0, 2
      ]);
      expect(matrix.determinant()).toBe(8);
    });
  });
}); 