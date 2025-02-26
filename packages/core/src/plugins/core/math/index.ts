import { Plugin, VectorEngine } from '../../../core/types';
import { Vector2D } from './vector';

/**
 * Math operations interface
 */
export interface VectorOperations {
  create(x?: number, y?: number): Vector2D;
}

export interface MatrixOperations {
  // Matrix operations will be implemented later
}

export interface GeometryOperations {
  // Geometry operations will be implemented later
}

/**
 * Math plugin for vector graphics operations
 */
export class MathPlugin implements Plugin {
  readonly id = 'math';
  readonly version = '1.0.0';

  private vectorOps: VectorOperations = {
    create: Vector2D.create,
  };

  private matrixOps: MatrixOperations = {
    // Matrix operations will be implemented later
  };

  private geometryOps: GeometryOperations = {
    // Geometry operations will be implemented later
  };

  install(engine: VectorEngine): void {
    // Register math operations with the engine
    // This will be used by other plugins that depend on math operations
  }

  uninstall(engine: VectorEngine): void {
    // Cleanup if necessary
  }

  /**
   * Get vector operations
   */
  get vector(): VectorOperations {
    return this.vectorOps;
  }

  /**
   * Get matrix operations
   */
  get matrix(): MatrixOperations {
    return this.matrixOps;
  }

  /**
   * Get geometry operations
   */
  get geometry(): GeometryOperations {
    return this.geometryOps;
  }
}

// Export Vector2D for direct use
export { Vector2D };
