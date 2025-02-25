/**
 * SVG Renderer 구현
 * 
 * SVG를 사용하여 Shape들을 렌더링하는 Renderer 구현입니다.
 * 
 * @packageDocumentation
 * @module Renderers.SVG
 */

import { Renderer, RendererCapabilities, SVGRendererOptions } from '../types';
import { Scene } from '../../../core/types';
import { Shape } from '../../core/shapes/types';

/**
 * SVG renderer implementation
 * 
 * SVG API를 사용하여 벡터 그래픽을 렌더링합니다.
 */
export class SVGRenderer implements Renderer {
  /** Renderer의 고유 ID */
  readonly id = 'svg';
  
  /** Renderer의 기능 */
  readonly capabilities: RendererCapabilities = {
    maxTextureSize: Infinity,
    supportsSVG: true,
    supportsWebGL: false,
    supports3D: false
  };

  /** SVG element */
  private svg: SVGSVGElement;
  
  /** Renderer options */
  private options: Required<SVGRendererOptions>;
  
  /** 현재 display 크기 */
  private displaySize: { width: number; height: number } = { width: 0, height: 0 };
  
  /** SVG namespace */
  private readonly svgNS: string;

  /**
   * SVG Renderer 생성
   * 
   * @param options - SVG Renderer 옵션
   */
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

    // SVG element은 항상 존재함을 보장
    this.svg = this.options.context.svg!;

    // Set initial size
    this.setSize(this.options.width, this.options.height);
  }

  /**
   * SVG element 가져오기
   * 
   * @returns SVG element
   */
  getSVG(): SVGSVGElement {
    return this.svg;
  }

  /**
   * SVG 크기 설정
   * 
   * 디스플레이 크기와 viewBox를 설정합니다.
   * pixelRatio를 적용하여 고해상도 디스플레이에서도 선명하게 표시됩니다.
   * 
   * @param width - SVG 너비
   * @param height - SVG 높이
   */
  setSize(width: number, height: number): void {
    const ratio = this.options.pixelRatio;

    this.displaySize = {
      width,
      height
    };

    this.svg.setAttribute('width', `${width * ratio}`);
    this.svg.setAttribute('height', `${height * ratio}`);

    const viewBox = this.options.viewBox;
    this.svg.setAttribute('viewBox', `${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}`);
    this.svg.setAttribute('preserveAspectRatio', this.options.preserveAspectRatio);
  }

  /**
   * Scene 렌더링
   * 
   * Scene의 모든 Shape을 SVG에 렌더링합니다.
   * 
   * @param scene - 렌더링할 Scene
   */
  render(scene: Scene): void {
    if (this.options.autoClear) {
      this.clear();
    }

    scene.root.childNodes.forEach(node => {
      const shape = node as unknown as Shape;
      this.renderShape(shape);
    });
  }

  /**
   * Shape 렌더링
   * 
   * 개별 Shape을 SVG에 렌더링합니다.
   * 
   * @param shape - 렌더링할 Shape
   */
  private renderShape(shape: Shape): void {
    let element: SVGElement;

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

    const matrix = shape.transform.values;
    element.setAttribute('transform', `matrix(${matrix[0]},${matrix[1]},${matrix[3]},${matrix[4]},${matrix[2]},${matrix[5]})`);

    this.applyStyle(element, shape);

    this.svg.appendChild(element);
  }

  /**
   * Style 적용
   * 
   * Shape의 style을 SVG element에 적용합니다.
   * 
   * @param element - 스타일을 적용할 SVG element
   * @param shape - 스타일 정보를 가진 Shape
   */
  private applyStyle(element: SVGElement, shape: Shape): void {
    if (shape.style.fillColor) {
      element.setAttribute('fill', shape.style.fillColor);
    }
    if (shape.style.strokeColor) {
      element.setAttribute('stroke', shape.style.strokeColor);
    }
    if (shape.style.strokeWidth) {
      element.setAttribute('stroke-width', shape.style.strokeWidth.toString());
    }
    if (shape.style.fillOpacity !== undefined) {
      element.setAttribute('fill-opacity', shape.style.fillOpacity.toString());
    }
    if (shape.style.strokeOpacity !== undefined) {
      element.setAttribute('stroke-opacity', shape.style.strokeOpacity.toString());
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
  }

  /**
   * Rectangle 렌더링
   * 
   * @param shape - 렌더링할 Rectangle
   * @returns 생성된 SVG rect element
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
   * 
   * @param shape - 렌더링할 Circle
   * @returns 생성된 SVG circle element
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
   * 
   * @param shape - 렌더링할 Line
   * @returns 생성된 SVG line element
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
   * 
   * @param shape - 렌더링할 Path
   * @returns 생성된 SVG path element
   */
  private renderPath(shape: Shape): SVGPathElement {
    const path = document.createElementNS(this.svgNS, 'path') as SVGPathElement;
    
    if (!shape.points || shape.points.length === 0) {
      return path;
    }

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
   * 
   * @param shape - 렌더링할 Text
   * @returns 생성된 SVG text element
   */
  private renderText(shape: Shape): SVGTextElement {
    const text = document.createElementNS(this.svgNS, 'text') as SVGTextElement;
    const bounds = shape.bounds;

    text.setAttribute('x', bounds.x.toString());
    text.setAttribute('y', bounds.y.toString());

    if (shape.font && shape.fontSize) {
      text.setAttribute('font-family', shape.font);
      text.setAttribute('font-size', shape.fontSize.toString());
    }
    if (shape.textAlign) {
      let textAnchor = 'start';
      if (shape.textAlign === 'center') textAnchor = 'middle';
      if (shape.textAlign === 'right') textAnchor = 'end';
      text.setAttribute('text-anchor', textAnchor);
    }
    if (shape.textBaseline) {
      let dominantBaseline = 'auto';
      if (shape.textBaseline === 'middle') dominantBaseline = 'central';
      if (shape.textBaseline === 'bottom') dominantBaseline = 'hanging';
      text.setAttribute('dominant-baseline', dominantBaseline);
    }

    if (shape.text) {
      text.textContent = shape.text;
    }

    return text;
  }

  /**
   * SVG 클리어
   * 
   * SVG의 모든 내용을 지웁니다.
   */
  clear(): void {
    // Remove all child nodes
    while (this.svg.firstChild) {
      this.svg.removeChild(this.svg.firstChild);
    }

    // Set background if needed
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
   * 
   * SVG를 정리하고 필요한 경우 DOM에서 제거합니다.
   */
  dispose(): void {
    // Clear SVG
    this.clear();

    // Remove SVG from DOM if it was created by us
    const svg = this.options.context.svg;
    if (svg && !svg.parentNode && typeof this.svg.remove === 'function') {
      this.svg.remove();
    }
  }
} 