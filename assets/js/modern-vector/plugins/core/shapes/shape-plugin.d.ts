import { Plugin, VectorEngine } from '../../../core/types';
import { Shape, ShapeFactory, ShapeOptions, ShapePlugin as IShapePlugin } from './types';

/**
 * Shape plugin implementation
 * Shape 생성과 관리를 담당하는 plugin
 */
export declare class ShapePlugin implements Plugin, IShapePlugin {
    readonly id = "shape";
    readonly version = "1.0.0";
    readonly dependencies: string[];
    private factories;
    constructor();
    install(engine: VectorEngine): void;
    uninstall(engine: VectorEngine): void;
    /**
     * Register a new shape type
     * @param type - Shape type identifier
     * @param factory - Shape factory instance
     */
    registerShape<T extends Shape>(type: string, factory: ShapeFactory<T>): void;
    /**
     * Create a new shape instance
     * @param type - Shape type identifier
     * @param options - Shape creation options
     * @returns New shape instance
     */
    createShape<T extends Shape>(type: string, options: ShapeOptions): T;
    /**
     * Check if a shape type is registered
     * @param type - Shape type identifier
     * @returns True if the shape type is registered
     */
    hasShape(type: string): boolean;
}
//# sourceMappingURL=shape-plugin.d.ts.map