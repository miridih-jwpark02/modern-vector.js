import { Renderer, RendererCapabilities, SVGRendererOptions } from '../types';
import { Scene } from '../../../core/types';

/**
 * SVG renderer implementation
 */
export declare class SVGRenderer implements Renderer {
    readonly id = "svg";
    readonly capabilities: RendererCapabilities;
    private svg;
    private options;
    private displaySize;
    private readonly svgNS;
    constructor(options?: SVGRendererOptions);
    /**
     * SVG element 가져오기
     */
    getSVG(): SVGSVGElement;
    /**
     * SVG 크기 설정
     * @param width - SVG 너비
     * @param height - SVG 높이
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
     * SVG text-anchor 값 가져오기
     * @param textAlign - Text 정렬
     */
    private getTextAnchor;
    /**
     * SVG dominant-baseline 값 가져오기
     * @param textBaseline - Text 기준선
     */
    private getDominantBaseline;
    /**
     * SVG 클리어
     */
    clear(): void;
    /**
     * 리소스 정리
     */
    dispose(): void;
}
//# sourceMappingURL=svg-renderer.d.ts.map