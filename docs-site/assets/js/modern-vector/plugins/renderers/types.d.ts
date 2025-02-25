import { Scene } from '../../core/types';

/**
 * Renderer의 기능을 정의하는 interface
 */
export interface Renderer {
    /** Renderer의 고유 ID */
    readonly id: string;
    /** Renderer의 기능 */
    readonly capabilities: RendererCapabilities;
    /** Scene 렌더링 */
    render(scene: Scene): void;
    /** 리소스 정리 */
    dispose(): void;
}
/**
 * Renderer의 기능을 나타내는 interface
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
 */
export interface RendererPlugin {
    /** Renderer 등록 */
    register(renderer: Renderer): void;
    /** 활성 Renderer 설정 */
    setActive(rendererId: string): void;
    /** Scene 렌더링 */
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
//# sourceMappingURL=types.d.ts.map