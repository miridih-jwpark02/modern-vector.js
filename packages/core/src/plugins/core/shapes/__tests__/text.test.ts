import { describe, it, expect, vi } from 'vitest';
import { Text, TextFactory } from '../text';
import { Vector2D } from '../../math/vector';
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

describe('Text', () => {
  describe('creation', () => {
    it('should create text with default values', () => {
      const text = new Text();
      expect(text.id).toBeDefined();
      expect(text.type).toBe('text');
      expect(text.text).toBe('');
      expect(text.font).toBe('sans-serif');
      expect(text.fontSize).toBe(16);
      expect(text.textAlign).toBe('left');
      expect(text.textBaseline).toBe('top');
    });

    it('should create text with specified values', () => {
      const text = new Text({
        x: 10,
        y: 20,
        text: 'Hello',
        font: 'Arial',
        fontSize: 24,
        textAlign: 'center',
        textBaseline: 'middle',
      });
      expect(text.text).toBe('Hello');
      expect(text.font).toBe('Arial');
      expect(text.fontSize).toBe(24);
      expect(text.textAlign).toBe('center');
      expect(text.textBaseline).toBe('middle');
    });
  });

  describe('bounds calculation', () => {
    it('should calculate bounds for left-aligned top-baseline text', () => {
      const text = new Text({
        x: 10,
        y: 20,
        text: 'Hello',
        fontSize: 16,
      });
      expect(text.bounds).toEqual({
        x: 10,
        y: 20,
        width: 100, // From mock measureText
        height: 16, // fontSize
      });
    });

    it('should calculate bounds for center-aligned text', () => {
      const text = new Text({
        x: 100,
        y: 20,
        text: 'Hello',
        fontSize: 16,
        textAlign: 'center',
      });
      expect(text.bounds).toEqual({
        x: 50, // x - width/2
        y: 20,
        width: 100,
        height: 16,
      });
    });

    it('should calculate bounds for right-aligned text', () => {
      const text = new Text({
        x: 100,
        y: 20,
        text: 'Hello',
        fontSize: 16,
        textAlign: 'right',
      });
      expect(text.bounds).toEqual({
        x: 0, // x - width
        y: 20,
        width: 100,
        height: 16,
      });
    });

    it('should calculate bounds for middle baseline text', () => {
      const text = new Text({
        x: 10,
        y: 20,
        text: 'Hello',
        fontSize: 16,
        textBaseline: 'middle',
      });
      expect(text.bounds).toEqual({
        x: 10,
        y: 12, // y - height/2
        width: 100,
        height: 16,
      });
    });

    it('should calculate bounds for bottom baseline text', () => {
      const text = new Text({
        x: 10,
        y: 20,
        text: 'Hello',
        fontSize: 16,
        textBaseline: 'bottom',
      });
      expect(text.bounds).toEqual({
        x: 10,
        y: 4, // y - height
        width: 100,
        height: 16,
      });
    });
  });

  describe('transformation', () => {
    it('should apply translation', () => {
      const text = new Text({
        x: 0,
        y: 0,
        text: 'Hello',
        fontSize: 16,
      });
      const translated = text.applyTransform(Matrix3x3.translation(10, 20));
      expect(translated.bounds).toEqual({
        x: 10,
        y: 20,
        width: 100,
        height: 16,
      });
    });

    it('should apply rotation', () => {
      const text = new Text({
        x: 0,
        y: 0,
        text: 'Hello',
        fontSize: 16,
      });
      const rotated = text.applyTransform(Matrix3x3.rotation(Math.PI / 2));
      expect(rotated.bounds.width).toBeCloseTo(16);
      expect(rotated.bounds.height).toBeCloseTo(100);
    });

    it('should apply scale', () => {
      const text = new Text({
        x: 0,
        y: 0,
        text: 'Hello',
        fontSize: 16,
      });
      const scaled = text.applyTransform(Matrix3x3.scale(2, 2));
      expect(scaled.bounds).toEqual({
        x: 0,
        y: 0,
        width: 200,
        height: 32,
      });
    });
  });

  describe('scale origin', () => {
    it('should scale from top-left by default', () => {
      const text = new Text({
        x: 0,
        y: 0,
        text: 'Hello',
        fontSize: 16,
      });
      const scaled = text.applyTransform(Matrix3x3.scale(2, 2));
      expect(scaled.bounds).toEqual({
        x: 0, // Top-left point stays at (0,0)
        y: 0,
        width: 200,
        height: 32,
      });
    });

    it('should scale from center when specified', () => {
      const text = new Text({
        x: 0,
        y: 0,
        text: 'Hello',
        fontSize: 16,
        scaleOrigin: 'center',
      });
      const scaled = text.applyTransform(Matrix3x3.scale(2, 2));
      expect(scaled.bounds).toEqual({
        x: -50, // Center point is (50, 8), so x: 50 - (100 * 2)/2 = -50
        y: -8, // y: 8 - (16 * 2)/2 = -8
        width: 200,
        height: 32,
      });
    });

    it('should scale from custom point', () => {
      const text = new Text({
        x: 0,
        y: 0,
        text: 'Hello',
        fontSize: 16,
        scaleOrigin: 'custom',
        customScaleOriginPoint: { x: 50, y: 0 }, // Middle of top edge
      });
      const scaled = text.applyTransform(Matrix3x3.scale(2, 2));
      expect(scaled.bounds).toEqual({
        x: -50, // x: 50 - (100 * 2)/2 = -50
        y: 0, // y stays at 0
        width: 200,
        height: 32,
      });
    });

    it('should preserve scale origin after transformation', () => {
      const text = new Text({
        x: 0,
        y: 0,
        text: 'Hello',
        fontSize: 16,
        scaleOrigin: 'center',
      });

      const scaled = text.applyTransform(Matrix3x3.scale(2, 2));
      const scaledAgain = scaled.applyTransform(Matrix3x3.scale(1.5, 1.5));

      expect(scaledAgain.bounds).toEqual({
        x: -100, // Center scaling continues
        y: -16, // Center scaling continues
        width: 300, // 100 * 2 * 1.5
        height: 48, // 16 * 2 * 1.5
      });
    });
  });

  describe('containsPoint', () => {
    it('should detect point inside text bounds', () => {
      const text = new Text({
        x: 0,
        y: 0,
        text: 'Hello',
        fontSize: 16,
      });
      expect(text.containsPoint(Vector2D.create(50, 8))).toBe(true); // Center point
      expect(text.containsPoint(Vector2D.create(0, 0))).toBe(true); // Top-left point
      expect(text.containsPoint(Vector2D.create(100, 16))).toBe(true); // Bottom-right point
    });

    it('should detect point outside text bounds', () => {
      const text = new Text({
        x: 0,
        y: 0,
        text: 'Hello',
        fontSize: 16,
      });
      expect(text.containsPoint(Vector2D.create(-10, -10))).toBe(false); // Outside top-left
      expect(text.containsPoint(Vector2D.create(150, 25))).toBe(false); // Outside bottom-right
    });

    it('should handle transformed text', () => {
      const text = new Text({
        x: 0,
        y: 0,
        text: 'Hello',
        fontSize: 16,
        transform: Matrix3x3.translation(10, 20),
      });
      expect(text.containsPoint(Vector2D.create(60, 28))).toBe(true); // Center point after translation
      expect(text.containsPoint(Vector2D.create(10, 20))).toBe(true); // Top-left point after translation
      expect(text.containsPoint(Vector2D.create(0, 0))).toBe(false); // Original top-left point
    });
  });

  describe('intersects', () => {
    it('should detect intersection with another text', () => {
      const text1 = new Text({
        x: 0,
        y: 0,
        text: 'Hello',
        fontSize: 16,
      });
      const text2 = new Text({
        x: 50,
        y: 8,
        text: 'World',
        fontSize: 16,
      });
      expect(text1.intersects(text2)).toBe(true);
    });

    it('should detect non-intersection', () => {
      const text1 = new Text({
        x: 0,
        y: 0,
        text: 'Hello',
        fontSize: 16,
      });
      const text2 = new Text({
        x: 0,
        y: 50,
        text: 'World',
        fontSize: 16,
      });
      expect(text1.intersects(text2)).toBe(false);
    });
  });

  describe('clone', () => {
    it('should create independent copy', () => {
      const original = new Text({
        x: 10,
        y: 20,
        text: 'Hello',
        font: 'Arial',
        fontSize: 24,
        textAlign: 'center',
        textBaseline: 'middle',
        style: {
          fillColor: 'black',
        },
      });
      const clone = original.clone();

      expect(clone.id).not.toBe(original.id);
      expect(clone.bounds).toEqual(original.bounds);
      expect(clone.style).toEqual(original.style);
      expect(clone.transform.values).toEqual(original.transform.values);

      // Text 관련 속성은 타입 캐스팅을 사용하여 접근
      expect((clone as Text).text).toBe((original as Text).text);
      expect((clone as Text).font).toBe((original as Text).font);
      expect((clone as Text).fontSize).toBe((original as Text).fontSize);
      expect((clone as Text).textAlign).toBe((original as Text).textAlign);
      expect((clone as Text).textBaseline).toBe((original as Text).textBaseline);
    });
  });
});

describe('TextFactory', () => {
  it('should create text through factory', () => {
    const factory = new TextFactory();
    const text = factory.create({
      x: 10,
      y: 20,
      text: 'Hello',
      font: 'Arial',
      fontSize: 24,
    });
    expect(text).toBeInstanceOf(Text);
    expect(text.text).toBe('Hello');
    expect(text.font).toBe('Arial');
    expect(text.fontSize).toBe(24);
  });
});
