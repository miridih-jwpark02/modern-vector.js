import { describe, it, expect } from 'vitest';
import { Rectangle } from '../rectangle';
import { Circle } from '../circle';
import { Line } from '../line';
import { Text } from '../text';
import { PathPoint } from '../path/types';
import { Matrix3x3 } from '../../math/matrix';

describe('Shape to Path Conversion', () => {
  describe('Rectangle', () => {
    it('should convert rectangle to path', () => {
      const rect = new Rectangle({
        x: 0,
        y: 0,
        width: 100,
        height: 50,
      });

      const path = rect.toPath();
      expect(path).toHaveLength(5); // 4 corners + closing point
      expect(path[0]).toEqual({ x: 0, y: 0, type: 'move' });
      expect(path[1]).toEqual({ x: 100, y: 0, type: 'line' });
      expect(path[2]).toEqual({ x: 100, y: 50, type: 'line' });
      expect(path[3]).toEqual({ x: 0, y: 50, type: 'line' });
      expect(path[4]).toEqual({ x: 0, y: 0, type: 'line' });
    });

    it('should handle transformed rectangle', () => {
      const rect = new Rectangle({
        x: 0,
        y: 0,
        width: 100,
        height: 50,
        transform: Matrix3x3.translation(10, 20),
      });

      const path = rect.toPath();
      expect(path[0]).toEqual({ x: 10, y: 20, type: 'move' });
      expect(path[1]).toEqual({ x: 110, y: 20, type: 'line' });
    });
  });

  describe('Circle', () => {
    it('should convert circle to path', () => {
      const circle = new Circle({
        centerX: 100,
        centerY: 100,
        radius: 50,
      });

      const path = circle.toPath(4); // 4 segments for easy testing
      expect(path).toHaveLength(6); // 4 points + start/end point
      expect(path[0].type).toBe('move');
      expect(path[1].type).toBe('line');
      expect(path[5].type).toBe('line');

      // Check if points form a square (4 segments)
      expect(path[0].x).toBeCloseTo(150); // Right
      expect(path[0].y).toBeCloseTo(100);
      expect(path[0].type).toBe('move');

      expect(path[1].x).toBeCloseTo(100); // Bottom
      expect(path[1].y).toBeCloseTo(150);
      expect(path[1].type).toBe('line');

      expect(path[2].x).toBeCloseTo(50); // Left
      expect(path[2].y).toBeCloseTo(100);
      expect(path[2].type).toBe('line');

      expect(path[3].x).toBeCloseTo(100); // Top
      expect(path[3].y).toBeCloseTo(50);
      expect(path[3].type).toBe('line');

      expect(path[5].x).toBeCloseTo(150); // Close
      expect(path[5].y).toBeCloseTo(100);
      expect(path[5].type).toBe('line');
    });

    it('should handle transformed circle', () => {
      const circle = new Circle({
        centerX: 100,
        centerY: 100,
        radius: 50,
        transform: Matrix3x3.translation(10, 20),
      });

      const path = circle.toPath(4);
      expect(path[0].x).toBeCloseTo(160);
      expect(path[0].y).toBeCloseTo(120);
      expect(path[0].type).toBe('move');

      expect(path[1].x).toBeCloseTo(110);
      expect(path[1].y).toBeCloseTo(170);
      expect(path[1].type).toBe('line');
    });
  });

  describe('Line', () => {
    it('should convert line to path', () => {
      const line = new Line({
        x1: 0,
        y1: 0,
        x2: 100,
        y2: 50,
      });

      const path = line.toPath();
      expect(path).toHaveLength(2);
      expect(path[0]).toEqual({ x: 0, y: 0, type: 'move' });
      expect(path[1]).toEqual({ x: 100, y: 50, type: 'line' });
    });

    it('should handle transformed line', () => {
      const line = new Line({
        x1: 0,
        y1: 0,
        x2: 100,
        y2: 50,
        transform: Matrix3x3.translation(10, 20),
      });

      const path = line.toPath();
      expect(path[0]).toEqual({ x: 10, y: 20, type: 'move' });
      expect(path[1]).toEqual({ x: 110, y: 70, type: 'line' });
    });
  });

  describe('Text', () => {
    it('should convert text to path (bounding box)', () => {
      const text = new Text({
        x: 0,
        y: 0,
        text: 'Hello',
        font: 'Arial',
        fontSize: 16,
      });

      const path = text.toPath();
      expect(path).toHaveLength(5); // 4 corners + closing point
      expect(path[0].type).toBe('move');
      expect(path[1].type).toBe('line');
      expect(path[4].type).toBe('line');
    });

    it('should handle transformed text', () => {
      const text = new Text({
        x: 0,
        y: 0,
        text: 'Hello',
        font: 'Arial',
        fontSize: 16,
        transform: Matrix3x3.translation(10, 20),
      });

      const path = text.toPath();
      expect(path[0].x).toBe(10); // Translated x
      expect(path[0].y).toBe(20); // Translated y
    });
  });
});
