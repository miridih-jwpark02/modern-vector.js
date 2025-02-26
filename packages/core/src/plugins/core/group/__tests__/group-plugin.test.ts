import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { GroupPlugin } from '../';
import { Group } from '../';
import { VectorEngine, Plugin } from '../../../../core/types';

/**
 * Group Plugin 테스트
 */
describe('GroupPlugin', () => {
  let engine: VectorEngine;
  let groupPlugin: GroupPlugin;
  let mockShapePlugin: Plugin;

  beforeEach(() => {
    // Mock VectorEngine
    engine = {
      use: vi.fn(),
      remove: vi.fn(),
      getPlugin: vi.fn(),
      renderer: {
        registerRenderer: vi.fn(),
        unregisterRenderer: vi.fn(),
      },
      events: {
        on: vi.fn(),
        off: vi.fn(),
        emit: vi.fn(),
      },
      scene: {
        activeScene: {
          addNode: vi.fn(),
          removeNode: vi.fn(),
          findNodeById: vi.fn(),
          getAllNodes: vi.fn(),
          clear: vi.fn(),
        },
      },
    } as unknown as VectorEngine;

    // Mock ShapePlugin
    mockShapePlugin = {
      id: 'shape-plugin',
      version: '1.0.0',
      install: vi.fn(),
      uninstall: vi.fn(),
    };

    // Setup engine.getPlugin to return mockShapePlugin
    (engine.getPlugin as any).mockImplementation((id: string) => {
      if (id === 'shape-plugin') return mockShapePlugin;
      return null;
    });

    // Create GroupPlugin instance
    groupPlugin = new GroupPlugin();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should have correct metadata', () => {
    expect(groupPlugin.id).toBe('group-plugin');
    expect(groupPlugin.version).toBe('1.0.0');
    expect(groupPlugin.dependencies).toContain('shape-plugin');
  });

  it('should install correctly', () => {
    groupPlugin.install(engine);

    // Verify engine is set
    expect(groupPlugin.createGroup()).toBeInstanceOf(Group);

    // Verify warning when installing twice
    const consoleSpy = vi.spyOn(console, 'warn');
    groupPlugin.install(engine);
    expect(consoleSpy).toHaveBeenCalledWith('GroupPlugin is already installed');
  });

  it('should create a group without children', () => {
    groupPlugin.install(engine);
    const group = groupPlugin.createGroup();

    expect(group).toBeInstanceOf(Group);
    expect(group.children).toHaveLength(0);
  });

  it('should create a group with children', () => {
    groupPlugin.install(engine);

    // Create mock shapes
    const mockShape1 = { id: 'shape1', type: 'rect' };
    const mockShape2 = { id: 'shape2', type: 'circle' };

    const group = groupPlugin.createGroup([mockShape1 as any, mockShape2 as any]);

    expect(group).toBeInstanceOf(Group);
    expect(group.children).toHaveLength(2);
    expect(group.children[0]).toBe(mockShape1);
    expect(group.children[1]).toBe(mockShape2);
  });

  it('should add and remove shapes from a group', () => {
    groupPlugin.install(engine);
    const group = groupPlugin.createGroup();

    // Create mock shapes
    const mockShape = { id: 'shape1', type: 'rect' };

    // Add shape
    group.add(mockShape as any);
    expect(group.children).toHaveLength(1);
    expect(group.children[0]).toBe(mockShape);

    // Remove shape
    const removed = group.remove(mockShape as any);
    expect(removed).toBe(true);
    expect(group.children).toHaveLength(0);

    // Try to remove non-existent shape
    const nonExistentShape = { id: 'shape2', type: 'circle' };
    const removedNonExistent = group.remove(nonExistentShape as any);
    expect(removedNonExistent).toBe(false);
  });

  it('should find a shape by id', () => {
    groupPlugin.install(engine);

    // Create mock shapes
    const mockShape1 = { id: 'shape1', type: 'rect' };
    const mockShape2 = { id: 'shape2', type: 'circle' };

    const group = groupPlugin.createGroup([mockShape1 as any, mockShape2 as any]);

    // Find existing shape
    const found = group.findById('shape2');
    expect(found).toBe(mockShape2);

    // Try to find non-existent shape
    const notFound = group.findById('shape3');
    expect(notFound).toBeNull();
  });

  it('should apply transformations to all shapes in the group', () => {
    groupPlugin.install(engine);

    // Create mock shapes with applyTransform method
    const mockShape1 = {
      id: 'shape1',
      type: 'rect',
      applyTransform: vi.fn().mockReturnValue({ id: 'shape1-transformed', type: 'rect' }),
    };
    const mockShape2 = {
      id: 'shape2',
      type: 'circle',
      applyTransform: vi.fn().mockReturnValue({ id: 'shape2-transformed', type: 'circle' }),
    };

    const group = groupPlugin.createGroup([mockShape1 as any, mockShape2 as any]);

    // Mock transform matrix
    const mockMatrix = { type: 'matrix', matrix: [2, 0, 0, 0, 2, 0, 0, 0, 1] };

    // Apply transform
    const transformedGroup = group.applyTransform(mockMatrix as any);

    // Verify transform was applied to all shapes
    expect(mockShape1.applyTransform).toHaveBeenCalledWith(mockMatrix);
    expect(mockShape2.applyTransform).toHaveBeenCalledWith(mockMatrix);

    // Verify transformed group has transformed shapes
    expect(transformedGroup).toBeInstanceOf(Group);
    expect((transformedGroup as Group).children).toHaveLength(2);
  });

  it('should uninstall correctly', () => {
    groupPlugin.install(engine);
    groupPlugin.uninstall(engine);

    // Verify error when trying to create a group after uninstall
    expect(() => groupPlugin.createGroup()).toThrow('GroupPlugin is not installed');

    // Verify warning when uninstalling twice
    const consoleSpy = vi.spyOn(console, 'warn');
    groupPlugin.uninstall(engine);
    expect(consoleSpy).toHaveBeenCalledWith('GroupPlugin is not installed');
  });
});
