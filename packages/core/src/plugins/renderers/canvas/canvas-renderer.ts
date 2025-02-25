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
    supports3D: false
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
        contextAttributes: options.context?.contextAttributes || {}
      },
      antialias: options.antialias ?? true,
      alpha: options.alpha ?? true,
      autoClear: options.autoClear ?? true,
      backgroundColor: options.backgroundColor || 'transparent',
      pixelRatio: options.pixelRatio || 1
    };

    this.canvas = this.options.context.canvas;
    const context = this.canvas.getContext('2d', {
      alpha: this.options.alpha,
      ...this.options.context.contextAttributes
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
      height
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
    // Save context state
    this.context.save();

    // Apply transform
    const matrix = shape.transform.values;
    this.context.transform(
      matrix[0], matrix[3], // a, b
      matrix[1], matrix[4], // c, d
      matrix[2], matrix[5]  // e, f
    );

    // Apply style
    if (shape.style.fillColor) {
      this.context.fillStyle = shape.style.fillColor;
    }
    if (shape.style.strokeColor) {
      this.context.strokeStyle = shape.style.strokeColor;
    }
    if (shape.style.strokeWidth) {
      this.context.lineWidth = shape.style.strokeWidth;
    }
    if (shape.style.strokeDashArray) {
      this.context.setLineDash(shape.style.strokeDashArray);
    }
    if (shape.style.strokeDashOffset) {
      this.context.lineDashOffset = shape.style.strokeDashOffset;
    }
    if (shape.style.strokeLineCap) {
      this.context.lineCap = shape.style.strokeLineCap;
    }
    if (shape.style.strokeLineJoin) {
      this.context.lineJoin = shape.style.strokeLineJoin;
    }
    if (shape.style.strokeMiterLimit) {
      this.context.miterLimit = shape.style.strokeMiterLimit;
    }
    if (shape.style.fillOpacity !== undefined) {
      this.context.globalAlpha = shape.style.fillOpacity;
    }

    // Draw shape based on type
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
    const bounds = shape.bounds;
    if (shape.style.fillColor) {
      this.context.fillRect(bounds.x, bounds.y, bounds.width, bounds.height);
    }
    if (shape.style.strokeColor) {
      this.context.strokeRect(bounds.x, bounds.y, bounds.width, bounds.height);
    }
  }

  /**
   * Circle 렌더링
   * 
   * @param shape - 렌더링할 Circle
   */
  private renderCircle(shape: Shape): void {
    const bounds = shape.bounds;
    const centerX = bounds.x + bounds.width / 2;
    const centerY = bounds.y + bounds.height / 2;
    const radius = bounds.width / 2;

    this.context.beginPath();
    this.context.arc(centerX, centerY, radius, 0, Math.PI * 2);
    
    if (shape.style.fillColor) {
      this.context.fill();
    }
    if (shape.style.strokeColor) {
      this.context.stroke();
    }
  }

  /**
   * Line 렌더링
   * 
   * @param shape - 렌더링할 Line
   */
  private renderLine(shape: Shape): void {
    const bounds = shape.bounds;
    this.context.beginPath();
    this.context.moveTo(bounds.x, bounds.y);
    this.context.lineTo(bounds.x + bounds.width, bounds.y + bounds.height);
    
    if (shape.style.strokeColor) {
      this.context.stroke();
    }
  }

  /**
   * Path 렌더링
   * 
   * @param shape - 렌더링할 Path
   */
  private renderPath(shape: Shape): void {
    if (!shape.points) return;

    this.context.beginPath();
    shape.points.forEach((point, index) => {
      if (point.type === 'move' || index === 0) {
        this.context.moveTo(point.x, point.y);
      } else {
        this.context.lineTo(point.x, point.y);
      }
    });

    // 닫힌 경로인 경우 closePath 호출
    if (shape.isClosed) {
      this.context.closePath();
    }

    if (shape.style.fillColor) {
      this.context.fill();
    }
    if (shape.style.strokeColor) {
      this.context.stroke();
    }
  }

  /**
   * Text 렌더링
   * 
   * @param shape - 렌더링할 Text
   */
  private renderText(shape: Shape): void {
    if (!shape.text) return;

    if (shape.font && shape.fontSize) {
      this.context.font = `${shape.fontSize}px ${shape.font}`;
    }
    if (shape.textAlign) {
      this.context.textAlign = shape.textAlign;
    }
    if (shape.textBaseline) {
      this.context.textBaseline = shape.textBaseline;
    }

    const bounds = shape.bounds;
    if (shape.style.fillColor) {
      this.context.fillText(shape.text, bounds.x, bounds.y);
    }
    if (shape.style.strokeColor) {
      this.context.strokeText(shape.text, bounds.x, bounds.y);
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