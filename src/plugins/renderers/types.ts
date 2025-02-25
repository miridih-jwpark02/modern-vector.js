/**
 * Renderer 타입 정의
 * 
 * @packageDocumentation
 * @module Renderers
 */

import { Shape } from '../core/shapes/types';
import { Scene } from '../../core/types';

/**
 * Renderer의 기능을 정의하는 interface
 * 
 * 다양한 렌더링 백엔드(Canvas, SVG, WebGL 등)를 위한 공통 인터페이스입니다.
 */
export interface Renderer {
  /** Renderer의 고유 ID */
  readonly id: string;
  /** Renderer의 기능 */
  readonly capabilities: RendererCapabilities;
  
  /**
   * Scene 렌더링
   * 
   * 주어진 Scene을 렌더링합니다.
   * 
   * @param scene - 렌더링할 Scene
   */
  render(scene: Scene): void;
  
  /**
   * 리소스 정리
   * 
   * Renderer가 사용한 리소스를 정리합니다.
   */
  dispose(): void;
}

/**
 * Renderer의 기능을 나타내는 interface
 * 
 * 각 Renderer가 지원하는 기능을 정의합니다.
 */
export interface RendererCapabilities {
  /** 최대 텍스처 크기 */
  readonly maxTextureSize: number;
  /** SVG 지원 여부 */
  readonly supportsSVG: boolean;
  /** WebGL 지원 여부 */
  readonly supportsWebGL: boolean;
  /** 3D 지원 여부 */
  readonly supports3D: boolean;
}

/**
 * Renderer plugin interface
 * 
 * Renderer 플러그인을 위한 인터페이스입니다.
 */
export interface RendererPlugin {
  /**
   * Renderer 등록
   * 
   * 새로운 Renderer를 등록합니다.
   * 
   * @param renderer - 등록할 Renderer
   */
  register(renderer: Renderer): void;
  
  /**
   * 활성 Renderer 설정
   * 
   * 주어진 ID의 Renderer를 활성 Renderer로 설정합니다.
   * 
   * @param rendererId - 활성화할 Renderer의 ID
   */
  setActive(rendererId: string): void;
  
  /**
   * Scene 렌더링
   * 
   * 주어진 Scene을 활성 Renderer로 렌더링합니다.
   * 
   * @param scene - 렌더링할 Scene
   */
  render(scene: Scene): void;
}

/**
 * Canvas context options
 */
export interface CanvasContextOptions {
  /** Canvas element */
  canvas: HTMLCanvasElement;
  /** Context type */
  contextType?: '2d' | 'webgl' | 'webgl2';
  /** Context attributes */
  contextAttributes?: CanvasRenderingContext2DSettings | WebGLContextAttributes;
}

/**
 * Canvas renderer options
 */
export interface CanvasRendererOptions {
  /** Canvas context options */
  context?: CanvasContextOptions;
  /** 안티앨리어싱 활성화 여부 */
  antialias?: boolean;
  /** 투명도 활성화 여부 */
  alpha?: boolean;
  /** 자동 클리어 여부 */
  autoClear?: boolean;
  /** 배경색 */
  backgroundColor?: string;
  /** 해상도 배율 */
  pixelRatio?: number;
}

/**
 * SVG context options
 */
export interface SVGContextOptions {
  /** SVG element */
  svg?: SVGSVGElement;
  /** SVG namespace */
  namespace?: string;
}

/**
 * SVG renderer options
 */
export interface SVGRendererOptions {
  /** SVG context options */
  context?: SVGContextOptions;
  /** 안티앨리어싱 활성화 여부 */
  antialias?: boolean;
  /** 투명도 활성화 여부 */
  alpha?: boolean;
  /** 자동 클리어 여부 */
  autoClear?: boolean;
  /** 배경색 */
  backgroundColor?: string;
  /** 해상도 배율 */
  pixelRatio?: number;
  /** SVG 크기 */
  width?: number;
  height?: number;
  /** SVG viewBox */
  viewBox?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  /** SVG preserveAspectRatio */
  preserveAspectRatio?: string;
} 