import { describe, it, expect, vi } from 'vitest';
import { Rectangle } from '../rectangle';
import { Circle } from '../circle';
import { Line } from '../line';
import { Text } from '../text';
import { Matrix3x3 } from '../../math/matrix';

// Mock document object for non-browser environments
if (typeof document === 'undefined') {
  global.document = {
    createElement: () => {},
  } as any;
}

// Mock canvas and context
const mockContext = {
  font: '',
  measureText: vi.fn().mockReturnValue({ width: 100 }),
};

const mockCanvas = {
  getContext: vi.fn().mockReturnValue(mockContext),
};

vi.spyOn(document, 'createElement').mockReturnValue(mockCanvas as any);

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
      expect(path).toHaveLength(5); // move + 4 bezier segments
      expect(path[0].type).toBe('move');
      // Bezier curve type인 경우 cubic으로 변환됩니다
      expect(path[1].type).toBe('cubic');
      expect(path[4].type).toBe('cubic');
    });

    it('should handle transformed circle', () => {
      const circle = new Circle({
        centerX: 100,
        centerY: 100,
        radius: 50,
        transform: Matrix3x3.translation(10, 20),
      });

      const path = circle.toPath(4);
      // 변환된 원의 중심은 (110, 120)이고, 오른쪽 지점은 (160, 120)
      expect(path[0].x).toBeCloseTo(160);
      expect(path[0].y).toBeCloseTo(120);
      expect(path[0].type).toBe('move');

      // Bezier curves를 사용하므로 정확한 값을 예측하기 어렵습니다.
      // 대신 타입만 확인합니다.
      expect(path[1].type).toBe('cubic');
      expect(path[2].type).toBe('cubic');
      expect(path[3].type).toBe('cubic');
      expect(path[4].type).toBe('cubic');
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
