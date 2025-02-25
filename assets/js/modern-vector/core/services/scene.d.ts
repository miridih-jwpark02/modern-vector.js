import { SceneService, Scene, VectorEngine } from '../types';

/**
 * Default implementation of SceneService
 */
export declare class DefaultSceneService implements SceneService {
    private engine;
    private scenes;
    private activeScene;
    constructor(engine: VectorEngine);
    /**
     * Create a new scene
     * @returns The newly created scene
     */
    create(): Scene;
    /**
     * Get the active scene
     * @returns The active scene
     */
    getActive(): Scene;
    /**
     * Set the active scene
     * @param scene - The scene to set as active
     */
    setActive(scene: Scene): void;
}
//# sourceMappingURL=scene.d.ts.map