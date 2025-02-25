import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createCanvas } from 'canvas';
import { CanvasRenderer } from '../canvas-renderer';
import { Scene } from '../../../../core/types';
import { Shape } from '../../../core/shapes/types';
import { Matrix3x3 } from '../../../core/math/matrix';

describe('CanvasRenderer', () => {
  let renderer: CanvasRenderer;
  let canvas: HTMLCanvasElement;
  let context: CanvasRenderingContext2D;

  beforeEach(() => {
    // Create canvas using node-canvas
    canvas = createCanvas(100, 100) as unknown as HTMLCanvasElement;
    context = canvas.getContext('2d')!;

    // Mock context methods
    vi.spyOn(context, 'save');
    vi.spyOn(context, 'restore');
    vi.spyOn(context, 'scale');
    vi.spyOn(context, 'transform');
    vi.spyOn(context, 'clearRect');
    vi.spyOn(context, 'fillRect');
    vi.spyOn(context, 'strokeRect');
    vi.spyOn(context, 'beginPath');
    vi.spyOn(context, 'arc');
    vi.spyOn(context, 'moveTo');
    vi.spyOn(context, 'lineTo');
    vi.spyOn(context, 'fill');
    vi.spyOn(context, 'stroke');
    vi.spyOn(context, 'fillText');
    vi.spyOn(context, 'strokeText');

    // Mock context properties
    Object.defineProperties(context, {
      fillStyle: {
        get: vi.fn(() => '#000000'),
        set: vi.fn()
      },
      strokeStyle: {
        get: vi.fn(() => '#000000'),
        set: vi.fn()
      },
      font: {
        get: vi.fn(() => '10px sans-serif'),
        set: vi.fn()
      },
      textAlign: {
        get: vi.fn(() => 'left'),
        set: vi.fn()
      },
      textBaseline: {
        get: vi.fn(() => 'alphabetic'),
        set: vi.fn()
      }
    });

    renderer = new CanvasRenderer({
      context: { canvas }
    });
  });

  describe('initialization', () => {
    it('should create canvas if not provided', () => {
      const renderer = new CanvasRenderer();
      expect(renderer.getCanvas()).toBeDefined();
    });

    it('should use provided canvas', () => {
      expect(renderer.getCanvas()).toBe(canvas);
    });

    it('should get 2D context', () => {
      expect(renderer.getContext()).toBeDefined();
      expect(renderer.getContext()).toBe(context);
    });

    it('should set default options', () => {
      const renderer = new CanvasRenderer();
      expect(renderer.getContext().imageSmoothingEnabled).toBe(true);
      expect(renderer.getContext().imageSmoothingQuality).toBe('high');
    });
  });

  describe('size management', () => {
    it('should set canvas size', () => {
      renderer.setSize(100, 200);
      expect(canvas.width).toBe(100);
      expect(canvas.height).toBe(200);
    });

    it('should handle pixel ratio', () => {
      // Create new renderer with pixel ratio
      const canvas = createCanvas(100, 100) as unknown as HTMLCanvasElement;
      const context = canvas.getContext('2d')!;
      vi.spyOn(context, 'scale');

      const renderer = new CanvasRenderer({
        context: { canvas },
        pixelRatio: 2
      });

      renderer.setSize(100, 200);
      expect(canvas.width).toBe(200);
      expect(canvas.height).toBe(400);
      expect(context.scale).toHaveBeenCalledWith(2, 2);
    });
  });

  describe('rendering', () => {
    let mockScene: Scene;

    const createMockShape = (overrides: Partial<Shape> = {}): Shape => ({
      id: 'test',
      type: 'rectangle',
      transform: Matrix3x3.create([1, 0, 0, 0, 1, 0, 0, 0, 1]),
      bounds: {
        x: 0,
        y: 0,
        width: 100,
        height: 100
      },
      style: {
        fillColor: '#ff0000',  // red
        strokeColor: '#000000',  // black
        strokeWidth: 1
      },
      clone: () => createMockShape(),
      applyTransform: () => createMockShape(),
      containsPoint: () => false,
      intersects: () => false,
      setScaleOrigin: () => {},
      toPath: () => [],
      ...overrides
    });

    const createMockScene = (shapes: Shape[]): Scene => {
      const mockRoot = {
        childNodes: shapes.map(shape => ({
          ...shape,
          nodeType: 1,  // ELEMENT_NODE
          nodeName: 'DIV'
        }))
      } as unknown as HTMLElement;
      return {
        root: mockRoot,
        renderer: {} as any,
        plugins: new Map(),
        on: () => {},
        off: () => {},
        emit: () => {}
      };
    };

    beforeEach(() => {
      mockScene = createMockScene([createMockShape()]);
    });

    it('should clear canvas before rendering', () => {
      renderer.render(mockScene);
      expect(context.clearRect).toHaveBeenCalled();
    });

    it('should save and restore context state', () => {
      renderer.render(mockScene);
      expect(context.save).toHaveBeenCalled();
      expect(context.restore).toHaveBeenCalled();
    });

    it('should apply transform', () => {
      renderer.render(mockScene);
      expect(context.transform).toHaveBeenCalledWith(1, 0, 0, 1, 0, 0);
    });

    it('should apply style', () => {
      renderer.render(mockScene);
      expect(context.fillStyle).toBe('#000000');  // Mock value
      expect(context.strokeStyle).toBe('#000000');  // Mock value
      expect(context.lineWidth).toBe(1);
    });

    it('should render rectangle', () => {
      renderer.render(mockScene);
      expect(context.fillRect).toHaveBeenCalledWith(0, 0, 100, 100);
      expect(context.strokeRect).toHaveBeenCalledWith(0, 0, 100, 100);
    });

    it('should render circle', () => {
      mockScene = createMockScene([createMockShape({ type: 'circle' })]);
      renderer.render(mockScene);
      expect(context.beginPath).toHaveBeenCalled();
      expect(context.arc).toHaveBeenCalledWith(50, 50, 50, 0, Math.PI * 2);
      expect(context.fill).toHaveBeenCalled();
      expect(context.stroke).toHaveBeenCalled();
    });

    it('should render line', () => {
      mockScene = createMockScene([createMockShape({ type: 'line' })]);
      renderer.render(mockScene);
      expect(context.beginPath).toHaveBeenCalled();
      expect(context.moveTo).toHaveBeenCalledWith(0, 0);
      expect(context.lineTo).toHaveBeenCalledWith(100, 100);
      expect(context.stroke).toHaveBeenCalled();
    });

    it('should render path', () => {
      mockScene = createMockScene([createMockShape({
        type: 'path',
        points: [
          { x: 0, y: 0, type: 'move' },
          { x: 100, y: 100, type: 'line' }
        ]
      })]);
      renderer.render(mockScene);
      expect(context.beginPath).toHaveBeenCalled();
      expect(context.moveTo).toHaveBeenCalledWith(0, 0);
      expect(context.lineTo).toHaveBeenCalledWith(100, 100);
      expect(context.fill).toHaveBeenCalled();
      expect(context.stroke).toHaveBeenCalled();
    });

    it('should render text', () => {
      mockScene = createMockScene([createMockShape({
        type: 'text',
        text: 'Hello',
        font: 'Arial',
        fontSize: 16,
        textAlign: 'center',
        textBaseline: 'middle'
      })]);
      renderer.render(mockScene);
      expect(context.font).toBe('10px sans-serif');  // Mock value
      expect(context.textAlign).toBe('left');  // Mock value
      expect(context.textBaseline).toBe('alphabetic');  // Mock value
      expect(context.fillText).toHaveBeenCalledWith('Hello', 0, 0);
      expect(context.strokeText).toHaveBeenCalledWith('Hello', 0, 0);
    });
  });

  describe('cleanup', () => {
    it('should clear canvas on dispose', () => {
      renderer.dispose();
      expect(context.clearRect).toHaveBeenCalled();
    });

    it('should remove canvas if created by renderer', () => {
      const renderer = new CanvasRenderer();
      const canvas = renderer.getCanvas();
      const remove = vi.fn();
      Object.defineProperty(canvas, 'remove', { value: remove });
      renderer.dispose();
      expect(remove).toHaveBeenCalled();
    });

    it('should not remove canvas if provided externally', () => {
      const remove = vi.fn();
      Object.defineProperty(canvas, 'parentNode', { value: {} });
      Object.defineProperty(canvas, 'remove', { value: remove });
      renderer.dispose();
      expect(remove).not.toHaveBeenCalled();
    });
  });
}); 