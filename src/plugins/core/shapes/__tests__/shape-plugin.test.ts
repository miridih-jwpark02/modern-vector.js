import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ShapePlugin } from '../shape-plugin';
import { Rectangle } from '../rectangle';
import { Circle } from '../circle';
import { VectorEngine } from '../../../../core/types';
import { Shape, ShapeFactory } from '../types';
import { PathPoint } from '../path/types';

describe('ShapePlugin', () => {
  let plugin: ShapePlugin;
  let mockEngine: VectorEngine;

  beforeEach(() => {
    plugin = new ShapePlugin();
    mockEngine = {
      use: vi.fn(),
      remove: vi.fn(),
      getPlugin: vi.fn(),
      renderer: {} as any,
      events: {} as any,
      scene: {} as any
    };
  });

  describe('plugin metadata', () => {
    it('should have correct id', () => {
      expect(plugin.id).toBe('shape');
    });

    it('should have correct version', () => {
      expect(plugin.version).toBe('1.0.0');
    });

    it('should depend on math plugin', () => {
      expect(plugin.dependencies).toContain('math');
    });
  });

  describe('built-in shapes', () => {
    it('should register rectangle shape by default', () => {
      expect(plugin.hasShape('rectangle')).toBe(true);
    });

    it('should create rectangle through plugin', () => {
      const rect = plugin.createShape<Rectangle>('rectangle', {
        x: 10,
        y: 20,
        width: 100,
        height: 50
      });
      expect(rect).toBeInstanceOf(Rectangle);
      expect(rect.bounds).toEqual({
        x: 10,
        y: 20,
        width: 100,
        height: 50
      });
    });

    it('should register circle shape by default', () => {
      expect(plugin.hasShape('circle')).toBe(true);
    });

    it('should create circle through plugin', () => {
      const circle = plugin.createShape<Circle>('circle', {
        centerX: 100,
        centerY: 100,
        radius: 50
      });
      expect(circle).toBeInstanceOf(Circle);
      expect(circle.bounds).toEqual({
        x: 50,
        y: 50,
        width: 100,
        height: 100
      });
    });
  });

  describe('shape registration', () => {
    class TestShape implements Shape {
      readonly id = 'test';
      readonly type = 'test';
      readonly transform = {} as any;
      readonly bounds = { x: 0, y: 0, width: 0, height: 0 };
      readonly style = {};

      clone(): Shape {
        return this;
      }
      applyTransform(): Shape {
        return this;
      }
      containsPoint(): boolean {
        return false;
      }
      intersects(): boolean {
        return false;
      }
      setScaleOrigin(): void {
        // Do nothing
      }
      toPath(): PathPoint[] {
        return [];
      }
    }

    class TestShapeFactory implements ShapeFactory<TestShape> {
      create(): TestShape {
        return new TestShape();
      }
    }

    it('should register new shape type', () => {
      plugin.registerShape('test', new TestShapeFactory());
      expect(plugin.hasShape('test')).toBe(true);
    });

    it('should throw error when registering duplicate type', () => {
      plugin.registerShape('test', new TestShapeFactory());
      expect(() => {
        plugin.registerShape('test', new TestShapeFactory());
      }).toThrow("Shape type 'test' is already registered");
    });

    it('should throw error when creating unknown shape type', () => {
      expect(() => {
        plugin.createShape('unknown', {});
      }).toThrow('Unknown shape type: unknown');
    });
  });

  describe('plugin lifecycle', () => {
    it('should install without errors', () => {
      expect(() => plugin.install(mockEngine)).not.toThrow();
    });

    it('should uninstall and clear factories', () => {
      // Register a test shape
      class TestShape implements Shape {
        readonly id = 'test';
        readonly type = 'test';
        readonly transform = {} as any;
        readonly bounds = { x: 0, y: 0, width: 0, height: 0 };
        readonly style = {};

        clone(): Shape {
          return this;
        }
        applyTransform(): Shape {
          return this;
        }
        containsPoint(): boolean {
          return false;
        }
        intersects(): boolean {
          return false;
        }
        setScaleOrigin(): void {
          // Do nothing
        }
        toPath(): PathPoint[] {
          return [];
        }
      }

      class TestShapeFactory implements ShapeFactory<TestShape> {
        create(): TestShape {
          return new TestShape();
        }
      }

      plugin.registerShape('test', new TestShapeFactory());
      expect(plugin.hasShape('test')).toBe(true);

      // Uninstall plugin
      plugin.uninstall(mockEngine);
      expect(plugin.hasShape('test')).toBe(false);
      expect(plugin.hasShape('rectangle')).toBe(false);
      expect(plugin.hasShape('circle')).toBe(false);
    });
  });
}); 