import { Plugin, VectorEngine } from '../../../core/types';
import { Shape, ShapeFactory, ShapeOptions, ShapePlugin as IShapePlugin } from './types';
import { RectangleFactory } from './rectangle';
import { CircleFactory } from './circle';
import { LineFactory } from './line';
import { TextFactory } from './text';
import { PathFactory } from './path';

/**
 * Shape plugin implementation
 * Shape 생성과 관리를 담당하는 plugin
 */
export class ShapePlugin implements Plugin, IShapePlugin {
  readonly id = 'shape';
  readonly version = '1.0.0';
  readonly dependencies = ['math'];

  private factories: Map<string, ShapeFactory> = new Map();

  constructor() {
    // Register built-in shapes
    this.registerShape('rectangle', new RectangleFactory());
    this.registerShape('circle', new CircleFactory());
    this.registerShape('path', new PathFactory());
    this.registerShape('line', new LineFactory());
    this.registerShape('text', new TextFactory());
  }

  install(engine: VectorEngine): void {
    // Plugin initialization
  }

  uninstall(engine: VectorEngine): void {
    // Cleanup
    this.factories.clear();
  }

  /**
   * Register a new shape type
   * @param type - Shape type identifier
   * @param factory - Shape factory instance
   */
  registerShape<T extends Shape>(type: string, factory: ShapeFactory<T>): void {
    if (this.factories.has(type)) {
      throw new Error(`Shape type '${type}' is already registered`);
    }
    this.factories.set(type, factory);
  }

  /**
   * Create a new shape instance
   * @param type - Shape type identifier
   * @param options - Shape creation options
   * @returns New shape instance
   */
  createShape<T extends Shape>(type: string, options: ShapeOptions): T {
    const factory = this.factories.get(type);
    if (!factory) {
      throw new Error(`Unknown shape type: ${type}`);
    }
    return factory.create(options) as T;
  }

  /**
   * Check if a shape type is registered
   * @param type - Shape type identifier
   * @returns True if the shape type is registered
   */
  hasShape(type: string): boolean {
    return this.factories.has(type);
  }
}
