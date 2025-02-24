import { Renderer, RendererCapabilities, SVGRendererOptions } from '../types';
import { Scene } from '../../../core/types';
import { Shape } from '../../core/shapes/types';

/**
 * SVG renderer implementation
 */
export class SVGRenderer implements Renderer {
  readonly id = 'svg';
  readonly capabilities: RendererCapabilities = {
    maxTextureSize: Infinity,
    supportsSVG: true,
    supportsWebGL: false,
    supports3D: false
  };

  private svg: SVGSVGElement;
  private options: Required<SVGRendererOptions>;
  private displaySize: { width: number; height: number } = { width: 0, height: 0 };
  private readonly svgNS: string;

  constructor(options: SVGRendererOptions = {}) {
    this.svgNS = options.context?.namespace || 'http://www.w3.org/2000/svg';
    this.options = {
      context: {
        svg: options.context?.svg || document.createElementNS(this.svgNS, 'svg') as SVGSVGElement,
        namespace: this.svgNS
      },
      antialias: options.antialias ?? true,
      alpha: options.alpha ?? true,
      autoClear: options.autoClear ?? true,
      backgroundColor: options.backgroundColor || 'transparent',
      pixelRatio: options.pixelRatio || 1,
      width: options.width || 100,
      height: options.height || 100,
      viewBox: options.viewBox || {
        x: 0,
        y: 0,
        width: options.width || 100,
        height: options.height || 100
      },
      preserveAspectRatio: options.preserveAspectRatio || 'xMidYMid meet'
    };

    this.svg = this.options.context.svg!;

    // Set initial size
    this.setSize(this.options.width, this.options.height);
  }

  /**
   * SVG element 가져오기
   */
  getSVG(): SVGSVGElement {
    return this.svg;
  }

  /**
   * SVG 크기 설정
   * @param width - SVG 너비
   * @param height - SVG 높이
   */
  setSize(width: number, height: number): void {
    const ratio = this.options.pixelRatio;

    // Set display size
    this.displaySize = {
      width,
      height
    };

    // Set actual size
    this.svg.setAttribute('width', `${width * ratio}`);
    this.svg.setAttribute('height', `${height * ratio}`);

    // Set viewBox
    const viewBox = this.options.viewBox;
    this.svg.setAttribute('viewBox', `${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}`);

    // Set preserveAspectRatio
    this.svg.setAttribute('preserveAspectRatio', this.options.preserveAspectRatio);
  }

  /**
   * Scene 렌더링
   * @param scene - 렌더링할 Scene
   */
  render(scene: Scene): void {
    // Clear SVG if needed
    if (this.options.autoClear) {
      this.clear();
    }

    // Render each shape
    scene.root.childNodes.forEach(node => {
      const shape = node as unknown as Shape;
      this.renderShape(shape);
    });
  }

  /**
   * Shape 렌더링
   * @param shape - 렌더링할 Shape
   */
  private renderShape(shape: Shape): void {
    let element: SVGElement;

    // Create shape element based on type
    switch (shape.type) {
      case 'rectangle':
        element = this.renderRectangle(shape);
        break;
      case 'circle':
        element = this.renderCircle(shape);
        break;
      case 'line':
        element = this.renderLine(shape);
        break;
      case 'path':
        element = this.renderPath(shape);
        break;
      case 'text':
        element = this.renderText(shape);
        break;
      default:
        return;
    }

    // Apply transform
    const matrix = shape.transform.values;
    element.setAttribute('transform', `matrix(${matrix[0]},${matrix[1]},${matrix[3]},${matrix[4]},${matrix[2]},${matrix[5]})`);

    // Apply style
    if (shape.style.fillColor) {
      element.setAttribute('fill', shape.style.fillColor);
    }
    if (shape.style.strokeColor) {
      element.setAttribute('stroke', shape.style.strokeColor);
    }
    if (shape.style.strokeWidth) {
      element.setAttribute('stroke-width', shape.style.strokeWidth.toString());
    }
    if (shape.style.strokeDashArray) {
      element.setAttribute('stroke-dasharray', shape.style.strokeDashArray.join(','));
    }
    if (shape.style.strokeDashOffset) {
      element.setAttribute('stroke-dashoffset', shape.style.strokeDashOffset.toString());
    }
    if (shape.style.strokeLineCap) {
      element.setAttribute('stroke-linecap', shape.style.strokeLineCap);
    }
    if (shape.style.strokeLineJoin) {
      element.setAttribute('stroke-linejoin', shape.style.strokeLineJoin);
    }
    if (shape.style.strokeMiterLimit) {
      element.setAttribute('stroke-miterlimit', shape.style.strokeMiterLimit.toString());
    }
    if (shape.style.fillOpacity !== undefined) {
      element.setAttribute('fill-opacity', shape.style.fillOpacity.toString());
    }

    // Add to SVG
    this.svg.appendChild(element);
  }

  /**
   * Rectangle 렌더링
   * @param shape - 렌더링할 Rectangle
   */
  private renderRectangle(shape: Shape): SVGRectElement {
    const rect = document.createElementNS(this.svgNS, 'rect') as SVGRectElement;
    const bounds = shape.bounds;
    rect.setAttribute('x', bounds.x.toString());
    rect.setAttribute('y', bounds.y.toString());
    rect.setAttribute('width', bounds.width.toString());
    rect.setAttribute('height', bounds.height.toString());
    return rect;
  }

  /**
   * Circle 렌더링
   * @param shape - 렌더링할 Circle
   */
  private renderCircle(shape: Shape): SVGCircleElement {
    const circle = document.createElementNS(this.svgNS, 'circle') as SVGCircleElement;
    const bounds = shape.bounds;
    const centerX = bounds.x + bounds.width / 2;
    const centerY = bounds.y + bounds.height / 2;
    const radius = bounds.width / 2;
    circle.setAttribute('cx', centerX.toString());
    circle.setAttribute('cy', centerY.toString());
    circle.setAttribute('r', radius.toString());
    return circle;
  }

  /**
   * Line 렌더링
   * @param shape - 렌더링할 Line
   */
  private renderLine(shape: Shape): SVGLineElement {
    const line = document.createElementNS(this.svgNS, 'line') as SVGLineElement;
    const bounds = shape.bounds;
    line.setAttribute('x1', bounds.x.toString());
    line.setAttribute('y1', bounds.y.toString());
    line.setAttribute('x2', (bounds.x + bounds.width).toString());
    line.setAttribute('y2', (bounds.y + bounds.height).toString());
    return line;
  }

  /**
   * Path 렌더링
   * @param shape - 렌더링할 Path
   */
  private renderPath(shape: Shape): SVGPathElement {
    const path = document.createElementNS(this.svgNS, 'path') as SVGPathElement;
    if (!shape.points) return path;

    let d = '';
    shape.points.forEach((point, index) => {
      if (point.type === 'move' || index === 0) {
        d += `M ${point.x} ${point.y}`;
      } else {
        d += `L ${point.x} ${point.y}`;
      }
    });
    path.setAttribute('d', d);
    return path;
  }

  /**
   * Text 렌더링
   * @param shape - 렌더링할 Text
   */
  private renderText(shape: Shape): SVGTextElement {
    const text = document.createElementNS(this.svgNS, 'text') as SVGTextElement;
    if (!shape.text) return text;

    const bounds = shape.bounds;
    text.setAttribute('x', bounds.x.toString());
    text.setAttribute('y', bounds.y.toString());

    if (shape.font) {
      text.setAttribute('font-family', shape.font);
    }
    if (shape.fontSize) {
      text.setAttribute('font-size', shape.fontSize.toString());
    }
    if (shape.textAlign) {
      text.setAttribute('text-anchor', this.getTextAnchor(shape.textAlign));
    }
    if (shape.textBaseline) {
      text.setAttribute('dominant-baseline', this.getDominantBaseline(shape.textBaseline));
    }

    text.textContent = shape.text;
    return text;
  }

  /**
   * SVG text-anchor 값 가져오기
   * @param textAlign - Text 정렬
   */
  private getTextAnchor(textAlign: string): string {
    switch (textAlign) {
      case 'center':
        return 'middle';
      case 'right':
        return 'end';
      default:
        return 'start';
    }
  }

  /**
   * SVG dominant-baseline 값 가져오기
   * @param textBaseline - Text 기준선
   */
  private getDominantBaseline(textBaseline: string): string {
    switch (textBaseline) {
      case 'middle':
        return 'central';
      case 'bottom':
        return 'text-after-edge';
      default:
        return 'text-before-edge';
    }
  }

  /**
   * SVG 클리어
   */
  clear(): void {
    // Remove all child nodes
    while (this.svg.firstChild) {
      this.svg.removeChild(this.svg.firstChild);
    }

    // Set background color if needed
    if (this.options.backgroundColor !== 'transparent') {
      const rect = document.createElementNS(this.svgNS, 'rect');
      rect.setAttribute('x', '0');
      rect.setAttribute('y', '0');
      rect.setAttribute('width', '100%');
      rect.setAttribute('height', '100%');
      rect.setAttribute('fill', this.options.backgroundColor);
      this.svg.appendChild(rect);
    }
  }

  /**
   * 리소스 정리
   */
  dispose(): void {
    // Clear SVG
    this.clear();

    // Remove SVG from DOM if it was created by us
    if (this.options.context.svg && !this.options.context.svg.parentNode) {
      this.svg.remove();
    }
  }
} 