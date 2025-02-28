import { describe, it, expect, beforeEach, vi } from 'vitest';
import { SVGRenderer } from '../svg-renderer';
import { Scene, SceneNode } from '../../../../core/types';
import { Shape } from '../../../core/shapes/types';
import { Matrix3x3 } from '../../../core/math/matrix';

/**
 * Text 도형의 속성들을 정의한 인터페이스
 */
interface TextShape extends Shape {
  text: string;
  font?: string;
  fontSize?: number;
  textAlign?: CanvasTextAlign;
  textBaseline?: CanvasTextBaseline;
}

describe('SVGRenderer', () => {
  let renderer: SVGRenderer;
  let svg: SVGSVGElement;

  beforeEach(() => {
    // SVG element 생성
    svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    renderer = new SVGRenderer({
      context: { svg },
    });
  });

  describe('initialization', () => {
    it('should create SVG if not provided', () => {
      const renderer = new SVGRenderer();
      expect(renderer.getSVG()).toBeDefined();
      expect(renderer.getSVG().tagName).toBe('svg');
    });

    it('should use provided SVG', () => {
      expect(renderer.getSVG()).toBe(svg);
    });

    it('should set default options', () => {
      const renderer = new SVGRenderer();
      const svg = renderer.getSVG();
      expect(svg.getAttribute('width')).toBe('100');
      expect(svg.getAttribute('height')).toBe('100');
      expect(svg.getAttribute('viewBox')).toBe('0 0 100 100');
      expect(svg.getAttribute('preserveAspectRatio')).toBe('xMidYMid meet');
    });
  });

  describe('size management', () => {
    it('should set SVG size', () => {
      renderer.setSize(100, 200);
      expect(svg.getAttribute('width')).toBe('100');
      expect(svg.getAttribute('height')).toBe('200');
    });

    it('should handle pixel ratio', () => {
      const renderer = new SVGRenderer({
        pixelRatio: 2,
      });
      renderer.setSize(100, 200);
      expect(renderer.getSVG().getAttribute('width')).toBe('200');
      expect(renderer.getSVG().getAttribute('height')).toBe('400');
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
        height: 100,
      },
      style: {
        fillColor: '#ff0000', // red
        strokeColor: '#000000', // black
        strokeWidth: 1,
      },
      // SceneNode 필수 속성
      parent: null,
      data: {},
      children: [],
      addChild: () => ({}) as SceneNode,
      removeChild: () => false,
      clearChildren: () => {},
      findChildById: () => null,
      on: () => {},
      off: () => {},
      emit: () => {},
      // Shape 메서드
      clone: () => createMockShape(),
      applyTransform: () => createMockShape(),
      containsPoint: () => false,
      intersects: () => false,
      setScaleOrigin: () => {},
      toPath: () => [],
      ...overrides,
    });

    const createMockScene = (shapes: Shape[]): Scene => {
      const mockRoot = {
        children: shapes.map(shape => ({
          ...shape,
          nodeType: 1, // ELEMENT_NODE
          nodeName: 'DIV',
          data: shape,
        })),
      } as unknown as SceneNode;
      return {
        root: mockRoot,
        renderer: {} as any,
        plugins: new Map(),
        on: () => {},
        off: () => {},
        emit: () => {},
      };
    };

    beforeEach(() => {
      mockScene = createMockScene([createMockShape()]);
    });

    it('should clear SVG before rendering', () => {
      const spy = vi.spyOn(renderer, 'clear');
      renderer.render(mockScene);
      expect(spy).toHaveBeenCalled();
    });

    it('should render rectangle', () => {
      renderer.render(mockScene);
      const rect = svg.querySelector('rect');
      expect(rect).toBeDefined();
      expect(rect?.getAttribute('x')).toBe('0');
      expect(rect?.getAttribute('y')).toBe('0');
      expect(rect?.getAttribute('width')).toBe('100');
      expect(rect?.getAttribute('height')).toBe('100');
      expect(rect?.getAttribute('fill')).toBe('#ff0000');
      expect(rect?.getAttribute('stroke')).toBe('#000000');
      expect(rect?.getAttribute('stroke-width')).toBe('1');
    });

    it('should render circle', () => {
      mockScene = createMockScene([createMockShape({ type: 'circle' })]);
      renderer.render(mockScene);
      const circle = svg.querySelector('circle');
      expect(circle).toBeDefined();
      expect(circle?.getAttribute('cx')).toBe('50');
      expect(circle?.getAttribute('cy')).toBe('50');
      expect(circle?.getAttribute('r')).toBe('50');
    });

    it('should render line', () => {
      mockScene = createMockScene([createMockShape({ type: 'line' })]);
      renderer.render(mockScene);
      const line = svg.querySelector('line');
      expect(line).toBeDefined();
      expect(line?.getAttribute('x1')).toBe('0');
      expect(line?.getAttribute('y1')).toBe('0');
      expect(line?.getAttribute('x2')).toBe('100');
      expect(line?.getAttribute('y2')).toBe('100');
    });

    it('should render path', () => {
      mockScene = createMockScene([
        createMockShape({
          type: 'path',
          points: [
            { x: 0, y: 0, type: 'move' },
            { x: 100, y: 100, type: 'line' },
          ],
        }),
      ]);
      renderer.render(mockScene);
      const path = svg.querySelector('path');
      expect(path).toBeDefined();
      expect(path?.getAttribute('d')).toBe('M 0 0L 100 100');
    });

    it('should render text', () => {
      // TextShape 타입으로 생성
      const textShapeProps = {
        type: 'text',
      };

      const textShape = createMockShape(textShapeProps) as unknown as TextShape;
      // 텍스트 속성 추가
      textShape.text = 'Hello';
      textShape.font = 'Arial';
      textShape.fontSize = 16;
      textShape.textAlign = 'center';
      textShape.textBaseline = 'middle';

      mockScene = createMockScene([textShape]);
      renderer.render(mockScene);
      const text = svg.querySelector('text');
      expect(text).toBeDefined();
      expect(text?.textContent).toBe('Hello');
      expect(text?.getAttribute('font-family')).toBe('Arial');
      expect(text?.getAttribute('font-size')).toBe('16');
      expect(text?.getAttribute('text-anchor')).toBe('middle');
      expect(text?.getAttribute('dominant-baseline')).toBe('central');
    });

    it('should apply transform', () => {
      const transform = Matrix3x3.translation(10, 20);
      mockScene = createMockScene([
        createMockShape({
          transform,
        }),
      ]);
      renderer.render(mockScene);
      const rect = svg.querySelector('rect');
      expect(rect?.getAttribute('transform')).toBe('matrix(1,0,0,1,10,20)');
    });
  });

  describe('cleanup', () => {
    it('should clear SVG on dispose', () => {
      const spy = vi.spyOn(renderer, 'clear');
      renderer.dispose();
      expect(spy).toHaveBeenCalled();
    });

    it('should remove SVG if created by renderer', () => {
      const renderer = new SVGRenderer();
      const svg = renderer.getSVG();
      const remove = vi.fn();
      Object.defineProperty(svg, 'remove', { value: remove });
      renderer.dispose();
      expect(remove).toHaveBeenCalled();
    });

    it('should not remove SVG if provided externally', () => {
      const remove = vi.fn();
      Object.defineProperty(svg, 'parentNode', { value: {} });
      Object.defineProperty(svg, 'remove', { value: remove });
      renderer.dispose();
      expect(remove).not.toHaveBeenCalled();
    });
  });
});
