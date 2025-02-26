import { RendererService, Renderer, Scene } from '../types';

/**
 * Default implementation of RendererService
 */
export class DefaultRendererService implements RendererService {
  private renderers: Map<string, Renderer> = new Map();
  private activeRenderer: Renderer | null = null;

  /**
   * Register a new renderer
   * @param renderer - The renderer to register
   */
  register(renderer: Renderer): void {
    if (this.renderers.has(renderer.id)) {
      throw new Error(`Renderer with id ${renderer.id} is already registered`);
    }
    this.renderers.set(renderer.id, renderer);

    // Set as active if it's the first renderer
    if (!this.activeRenderer) {
      this.activeRenderer = renderer;
    }
  }

  /**
   * Set the active renderer
   * @param rendererId - ID of the renderer to set as active
   */
  setActive(rendererId: string): void {
    const renderer = this.renderers.get(rendererId);
    if (!renderer) {
      throw new Error(`No renderer found with id ${rendererId}`);
    }
    this.activeRenderer = renderer;
  }

  /**
   * Render a scene using the active renderer
   * @param scene - The scene to render
   */
  render(scene: Scene): void {
    if (!this.activeRenderer) {
      throw new Error('No active renderer available');
    }
    this.activeRenderer.render(scene);
  }
}
