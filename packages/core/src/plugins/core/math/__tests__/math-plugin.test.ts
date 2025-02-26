import { describe, it, expect, beforeEach, vi } from 'vitest';
import { MathPlugin } from '..';
import { VectorEngine } from '../../../../core/types';
import { Vector2D } from '../vector';

describe('MathPlugin', () => {
  let plugin: MathPlugin;
  let mockEngine: VectorEngine;

  beforeEach(() => {
    plugin = new MathPlugin();
    mockEngine = {
      use: vi.fn(),
      remove: vi.fn(),
      getPlugin: vi.fn(),
      renderer: {} as any,
      events: {} as any,
      scene: {} as any,
    };
  });

  describe('plugin metadata', () => {
    it('should have correct id', () => {
      expect(plugin.id).toBe('math');
    });

    it('should have correct version', () => {
      expect(plugin.version).toBe('1.0.0');
    });
  });

  describe('vector operations', () => {
    it('should provide vector creation', () => {
      const vector = plugin.vector.create(1, 2);
      expect(vector).toBeInstanceOf(Vector2D);
      expect(vector.x).toBe(1);
      expect(vector.y).toBe(2);
    });
  });

  describe('plugin lifecycle', () => {
    it('should install without errors', () => {
      expect(() => plugin.install(mockEngine)).not.toThrow();
    });

    it('should uninstall without errors', () => {
      expect(() => plugin.uninstall(mockEngine)).not.toThrow();
    });
  });

  describe('operations access', () => {
    it('should provide access to vector operations', () => {
      expect(plugin.vector).toBeDefined();
      expect(typeof plugin.vector.create).toBe('function');
    });

    it('should provide access to matrix operations', () => {
      expect(plugin.matrix).toBeDefined();
    });

    it('should provide access to geometry operations', () => {
      expect(plugin.geometry).toBeDefined();
    });
  });
});
