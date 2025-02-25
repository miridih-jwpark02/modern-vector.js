import { Renderer, RendererCapabilities, CanvasRendererOptions } from '../types';
import { Scene } from '../../../core/types';

/**
 * Canvas renderer implementation
 */
export declare class CanvasRenderer implements Renderer {
    readonly id = "canvas";
    readonly capabilities: RendererCapabilities;
    private canvas;
    private context;
    private options;
    private displaySize;
    constructor(options?: CanvasRendererOptions);
    /**
     * Canvas element 가져오기
     */
    getCanvas(): HTMLCanvasElement;
    /**
     * Canvas context 가져오기
     */
    getContext(): CanvasRenderingContext2D;
    /**
     * Canvas 크기 설정
     * @param width - Canvas 너비
     * @param height - Canvas 높이
     */
    setSize(width: number, height: number): void;
    /**
     * Scene 렌더링
     * @param scene - 렌더링할 Scene
     */
    render(scene: Scene): void;
    /**
     * Shape 렌더링
     * @param shape - 렌더링할 Shape
     */
    private renderShape;
    /**
     * Rectangle 렌더링
     * @param shape - 렌더링할 Rectangle
     */
    private renderRectangle;
    /**
     * Circle 렌더링
     * @param shape - 렌더링할 Circle
     */
    private renderCircle;
    /**
     * Line 렌더링
     * @param shape - 렌더링할 Line
     */
    private renderLine;
    /**
     * Path 렌더링
     * @param shape - 렌더링할 Path
     */
    private renderPath;
    /**
     * Text 렌더링
     * @param shape - 렌더링할 Text
     */
    private renderText;
    /**
     * Canvas 클리어
     */
    clear(): void;
    /**
     * 리소스 정리
     */
    dispose(): void;
}
//# sourceMappingURL=canvas-renderer.d.ts.map