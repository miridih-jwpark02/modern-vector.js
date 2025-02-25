import { RendererService, Renderer, Scene } from '../types';

/**
 * Default implementation of RendererService
 */
export declare class DefaultRendererService implements RendererService {
    private renderers;
    private activeRenderer;
    /**
     * Register a new renderer
     * @param renderer - The renderer to register
     */
    register(renderer: Renderer): void;
    /**
     * Set the active renderer
     * @param rendererId - ID of the renderer to set as active
     */
    setActive(rendererId: string): void;
    /**
     * Render a scene using the active renderer
     * @param scene - The scene to render
     */
    render(scene: Scene): void;
}
//# sourceMappingURL=renderer.d.ts.map