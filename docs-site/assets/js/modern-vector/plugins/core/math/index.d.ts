import { Plugin, VectorEngine } from '../../../core/types';
import { Vector2D } from './vector';

/**
 * Math operations interface
 */
export interface VectorOperations {
    create(x?: number, y?: number): Vector2D;
}
export interface MatrixOperations {
}
export interface GeometryOperations {
}
/**
 * Math plugin for vector graphics operations
 */
export declare class MathPlugin implements Plugin {
    readonly id = "math";
    readonly version = "1.0.0";
    private vectorOps;
    private matrixOps;
    private geometryOps;
    install(engine: VectorEngine): void;
    uninstall(engine: VectorEngine): void;
    /**
     * Get vector operations
     */
    get vector(): VectorOperations;
    /**
     * Get matrix operations
     */
    get matrix(): MatrixOperations;
    /**
     * Get geometry operations
     */
    get geometry(): GeometryOperations;
}
export { Vector2D };
//# sourceMappingURL=index.d.ts.map