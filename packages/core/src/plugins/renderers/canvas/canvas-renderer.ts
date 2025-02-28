/**
 * Canvas Renderer 구현
 *
 * HTML Canvas를 사용하여 Shape들을 렌더링하는 Renderer 구현입니다.
 *
 * @packageDocumentation
 * @module Renderers.Canvas
 */

import { Renderer, RendererCapabilities, CanvasRendererOptions } from '../types';
import { Scene } from '../../../core/types';
import { Shape } from '../../core/shapes/types';

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

/**
 * Shape가 TextShape인지 확인하는 타입 가드 함수
 */
function isTextShape(shape: Shape): shape is TextShape {
  return shape.type === 'text' && 'text' in shape;
}

/**
 * Canvas renderer implementation
 *
 * HTML Canvas API를 사용하여 벡터 그래픽을 렌더링합니다.
 */
export class CanvasRenderer implements Renderer {
  /** Renderer의 고유 ID */
  readonly id = 'canvas';

  /** Renderer의 기능 */
  readonly capabilities: RendererCapabilities = {
    maxTextureSize: 4096,
    supportsSVG: false,
    supportsWebGL: false,
    supports3D: false,
  };

  /** Canvas element */
  private canvas: HTMLCanvasElement;

  /** Canvas 2D context */
  private context: CanvasRenderingContext2D;

  /** Renderer options */
  private options: Required<CanvasRendererOptions>;

  /** 현재 display 크기 */
  private displaySize: { width: number; height: number } = { width: 0, height: 0 };

  /**
   * Canvas Renderer 생성
   *
   * @param options - Canvas Renderer 옵션
   */
  constructor(options: CanvasRendererOptions = {}) {
    this.options = {
      context: {
        canvas: options.context?.canvas || document.createElement('canvas'),
        contextType: options.context?.contextType || '2d',
        contextAttributes: options.context?.contextAttributes || {},
      },
      antialias: options.antialias ?? true,
      alpha: options.alpha ?? true,
      autoClear: options.autoClear ?? true,
      backgroundColor: options.backgroundColor || 'transparent',
      pixelRatio: options.pixelRatio || 1,
    };

    this.canvas = this.options.context.canvas;
    const context = this.canvas.getContext('2d', {
      alpha: this.options.alpha,
      ...this.options.context.contextAttributes,
    });

    if (!context) {
      throw new Error('Failed to get 2D context');
    }

    this.context = context;

    // Enable antialiasing
    if (this.options.antialias) {
      this.context.imageSmoothingEnabled = true;
      this.context.imageSmoothingQuality = 'high';
    }

    // Set initial size
    this.setSize(this.canvas.width, this.canvas.height);
  }

  /**
   * Canvas element 가져오기
   *
   * @returns Canvas element
   */
  getCanvas(): HTMLCanvasElement {
    return this.canvas;
  }

  /**
   * Canvas context 가져오기
   *
   * @returns Canvas 2D context
   */
  getContext(): CanvasRenderingContext2D {
    return this.context;
  }

  /**
   * Canvas 크기 설정
   *
   * 디스플레이 크기와 실제 캔버스 크기를 설정합니다.
   * pixelRatio를 적용하여 고해상도 디스플레이에서도 선명하게 표시됩니다.
   *
   * @param width - Canvas 너비
   * @param height - Canvas 높이
   */
  setSize(width: number, height: number): void {
    const ratio = this.options.pixelRatio;

    // Set display size
    this.displaySize = {
      width,
      height,
    };

    // Set actual size in memory
    this.canvas.width = width * ratio;
    this.canvas.height = height * ratio;

    // Reset context state
    this.context.setTransform(1, 0, 0, 1, 0, 0);

    // Scale context to match pixel ratio
    this.context.scale(ratio, ratio);

    // Reset context state
    this.context.imageSmoothingEnabled = this.options.antialias;
    this.context.imageSmoothingQuality = 'high';
  }

  /**
   * Scene 렌더링
   *
   * Scene의 모든 Shape을 Canvas에 렌더링합니다.
   *
   * @param scene - 렌더링할 Scene
   */
  render(scene: Scene): void {
    // Clear canvas if needed
    if (this.options.autoClear) {
      this.clear();
    }

    // Save context state
    this.context.save();

    // Render each shape
    scene.root.children.forEach(node => {
      const shape = node.data as Shape;
      this.renderShape(shape);
    });

    // Restore context state
    this.context.restore();
  }

  /**
   * Shape 렌더링
   *
   * 개별 Shape을 Canvas에 렌더링합니다.
   *
   * @param shape - 렌더링할 Shape
   */
  private renderShape(shape: Shape): void {
    // 기본 검증
    if (!shape) {
      console.warn('Cannot render undefined or null shape');
      return;
    }

    // Save context state
    this.context.save();

    try {
      // Transform 객체 안전 검증
      if (!shape.transform) {
        console.warn(
          `Shape ${shape.id || 'unknown'} has no transform property - rendering with identity transform`
        );
        // 기본 변환 없이 계속 진행
      } else {
        try {
          // transform이 있지만 values가 없거나 유효하지 않은 경우를 try-catch로 처리
          const matrix = shape.transform.values;
          if (!matrix || matrix.length < 6) {
            console.warn(
              `Shape ${shape.id || 'unknown'} has invalid transform matrix - using identity transform`
            );
          } else {
            // 유효한 matrix가 있는 경우에만 transform 적용
            this.context.transform(
              matrix[0],
              matrix[3], // a, b
              matrix[1],
              matrix[4], // c, d
              matrix[2],
              matrix[5] // e, f
            );
          }
        } catch (error) {
          console.error(`Failed to apply transform for shape ${shape.id || 'unknown'}:`, error);
          // 오류 발생 시 변환없이 계속 진행
        }
      }

      // Style 객체 안전 검증
      const style = shape.style || {};

      // Apply safe style properties
      if (style.fillColor) {
        this.context.fillStyle = style.fillColor;
      } else {
        // 기본 채우기 색상 설정
        this.context.fillStyle = 'rgba(0, 0, 0, 0)'; // 투명
      }

      if (style.strokeColor) {
        this.context.strokeStyle = style.strokeColor;
      } else {
        // 기본 테두리 색상 설정
        this.context.strokeStyle = '#000000';
      }

      if (style.strokeWidth !== undefined && style.strokeWidth !== null) {
        this.context.lineWidth = style.strokeWidth;
      } else {
        // 기본 테두리 두께 설정
        this.context.lineWidth = 1;
      }

      if (style.strokeDashArray) {
        this.context.setLineDash(style.strokeDashArray);
      }

      if (style.strokeDashOffset) {
        this.context.lineDashOffset = style.strokeDashOffset;
      }

      if (style.strokeLineCap) {
        this.context.lineCap = style.strokeLineCap;
      }

      if (style.strokeLineJoin) {
        this.context.lineJoin = style.strokeLineJoin;
      }

      if (style.strokeMiterLimit) {
        this.context.miterLimit = style.strokeMiterLimit;
      }

      if (style.fillOpacity !== undefined) {
        this.context.globalAlpha = style.fillOpacity;
      }

      // Check for required shape properties
      if (!shape.type) {
        console.warn('Shape has no type - cannot render');
        this.context.restore();
        return;
      }

      if (!shape.bounds) {
        console.warn(`Shape ${shape.id || 'unknown'} has no bounds - using default bounds`);
        shape = { ...shape, bounds: { x: 0, y: 0, width: 100, height: 100 } };
      }

      // Draw shape based on type with additional safety checks
      try {
        switch (shape.type) {
          case 'rectangle':
            this.renderRectangle(shape);
            break;
          case 'circle':
            this.renderCircle(shape);
            break;
          case 'line':
            this.renderLine(shape);
            break;
          case 'path':
            this.renderPath(shape);
            break;
          case 'text':
            this.renderText(shape);
            break;
          default:
            console.warn(`Unknown shape type: ${shape.type}`);
        }
      } catch (error) {
        console.error(`Error rendering shape type ${shape.type}:`, error);
      }
    } catch (error) {
      console.error('Unexpected error in renderShape:', error);
    }

    // Restore context state
    this.context.restore();
  }

  /**
   * Rectangle 렌더링
   *
   * @param shape - 렌더링할 Rectangle
   */
  private renderRectangle(shape: Shape): void {
    const bounds = shape.bounds || { x: 0, y: 0, width: 0, height: 0 };
    const style = shape.style || {};

    if (style.fillColor) {
      this.context.fillRect(bounds.x, bounds.y, bounds.width, bounds.height);
    }
    if (style.strokeColor) {
      this.context.strokeRect(bounds.x, bounds.y, bounds.width, bounds.height);
    }
  }

  /**
   * Circle 렌더링
   *
   * @param shape - 렌더링할 Circle
   */
  private renderCircle(shape: Shape): void {
    const bounds = shape.bounds || { x: 0, y: 0, width: 0, height: 0 };
    const style = shape.style || {};

    const centerX = bounds.x + bounds.width / 2;
    const centerY = bounds.y + bounds.height / 2;
    const radius = bounds.width / 2;

    if (radius <= 0) {
      console.warn(`Circle ${shape.id || 'unknown'} has invalid radius - not rendering`);
      return;
    }

    this.context.beginPath();
    this.context.arc(centerX, centerY, radius, 0, Math.PI * 2);

    if (style.fillColor) {
      this.context.fill();
    }
    if (style.strokeColor) {
      this.context.stroke();
    }
  }

  /**
   * Line 렌더링
   *
   * @param shape - 렌더링할 Line
   */
  private renderLine(shape: Shape): void {
    const bounds = shape.bounds || { x: 0, y: 0, width: 0, height: 0 };
    const style = shape.style || {};

    this.context.beginPath();
    this.context.moveTo(bounds.x, bounds.y);
    this.context.lineTo(bounds.x + bounds.width, bounds.y + bounds.height);

    if (style.strokeColor) {
      this.context.stroke();
    }
  }

  /**
   * Path 렌더링
   *
   * @param shape - 렌더링할 Path
   */
  private renderPath(shape: Shape): void {
    const style = shape.style || {};

    // Shape에 points 속성이 없으면 안전하게 처리
    const points = (shape as any).points || [];

    if (points.length === 0) {
      console.warn(`Path ${shape.id || 'unknown'} has no points - not rendering`);
      return;
    }

    this.context.beginPath();

    try {
      points.forEach((point: any, index: number) => {
        if (!point || typeof point.x !== 'number' || typeof point.y !== 'number') {
          console.warn(`Path ${shape.id || 'unknown'} has invalid point at index ${index}`);
          return;
        }

        if (point.type === 'move' || index === 0) {
          this.context.moveTo(point.x, point.y);
        } else if (point.type === 'line') {
          this.context.lineTo(point.x, point.y);
        } else if (point.type === 'quadratic' && point.controlPoint) {
          // 2차 베지어 곡선 그리기
          if (
            typeof point.controlPoint.x !== 'number' ||
            typeof point.controlPoint.y !== 'number'
          ) {
            console.warn(
              `Path ${shape.id || 'unknown'} has invalid control point at index ${index}`
            );
            return;
          }
          this.context.quadraticCurveTo(
            point.controlPoint.x,
            point.controlPoint.y,
            point.x,
            point.y
          );
        } else if (point.type === 'cubic' && point.controlPoint1 && point.controlPoint2) {
          // 3차 베지어 곡선 그리기
          if (
            typeof point.controlPoint1.x !== 'number' ||
            typeof point.controlPoint1.y !== 'number' ||
            typeof point.controlPoint2.x !== 'number' ||
            typeof point.controlPoint2.y !== 'number'
          ) {
            console.warn(
              `Path ${shape.id || 'unknown'} has invalid control points at index ${index}`
            );
            return;
          }
          this.context.bezierCurveTo(
            point.controlPoint1.x,
            point.controlPoint1.y,
            point.controlPoint2.x,
            point.controlPoint2.y,
            point.x,
            point.y
          );
        }
      });
    } catch (error) {
      console.error(`Error rendering path points for shape ${shape.id || 'unknown'}:`, error);
    }

    // 닫힌 경로인 경우 closePath 호출
    if ((shape as any).isClosed) {
      this.context.closePath();
    }

    if (style.fillColor) {
      this.context.fill();
    }
    if (style.strokeColor) {
      this.context.stroke();
    }
  }

  /**
   * Text 렌더링
   *
   * @param shape - 렌더링할 Text
   */
  private renderText(shape: Shape): void {
    // TextShape인지 확인
    if (!isTextShape(shape)) {
      console.warn(`Shape ${shape.id || 'unknown'} is not a valid TextShape - not rendering`);
      return;
    }

    const textShape = shape;
    const bounds = shape.bounds || { x: 0, y: 0, width: 0, height: 0 };
    const style = shape.style || {};

    // 필수 속성 확인
    if (!textShape.text) {
      console.warn(`TextShape ${shape.id || 'unknown'} has no text content - not rendering`);
      return;
    }

    try {
      if (textShape.font && textShape.fontSize) {
        this.context.font = `${textShape.fontSize}px ${textShape.font}`;
      }
      if (textShape.textAlign) {
        this.context.textAlign = textShape.textAlign;
      }
      if (textShape.textBaseline) {
        this.context.textBaseline = textShape.textBaseline;
      }

      if (style.fillColor) {
        this.context.fillText(textShape.text, bounds.x, bounds.y);
      }
      if (style.strokeColor) {
        this.context.strokeText(textShape.text, bounds.x, bounds.y);
      }
    } catch (error) {
      console.error(`Error rendering text for shape ${shape.id || 'unknown'}:`, error);
    }
  }

  /**
   * Canvas 클리어
   *
   * Canvas의 모든 내용을 지웁니다.
   */
  clear(): void {
    this.context.save();
    this.context.setTransform(1, 0, 0, 1, 0, 0);

    if (this.options.backgroundColor === 'transparent') {
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    } else {
      this.context.fillStyle = this.options.backgroundColor;
      this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    this.context.restore();
  }

  /**
   * 리소스 정리
   *
   * Canvas를 정리하고 필요한 경우 DOM에서 제거합니다.
   */
  dispose(): void {
    // Clear canvas
    this.clear();

    // Remove canvas from DOM if it was created by us
    if (!this.options.context.canvas.parentNode) {
      if (typeof this.canvas.remove === 'function') {
        this.canvas.remove();
      }
    }
  }
}
