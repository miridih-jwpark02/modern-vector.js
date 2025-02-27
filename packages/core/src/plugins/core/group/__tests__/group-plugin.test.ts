import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { DefaultGroupPlugin } from '../';
import { Group, DefaultGroup } from '../';
import { VectorEngine, Plugin, SceneNode } from '../../../../core/types';

/**
 * Group Plugin 테스트
 */
describe('GroupPlugin', () => {
  let engine: VectorEngine;
  let groupPlugin: DefaultGroupPlugin;
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
    groupPlugin = new DefaultGroupPlugin();
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
    expect(groupPlugin.createGroup()).toBeInstanceOf(DefaultGroup);

    // Verify warning when installing twice
    const consoleSpy = vi.spyOn(console, 'warn');
    groupPlugin.install(engine);
    expect(consoleSpy).toHaveBeenCalledWith('GroupPlugin is already installed');
  });

  it('should create a group without children', () => {
    groupPlugin.install(engine);
    const group = groupPlugin.createGroup();

    expect(group).toBeInstanceOf(DefaultGroup);
    expect(group.children).toHaveLength(0);
  });

  it('should create a group with children', () => {
    groupPlugin.install(engine);

    // Create mock nodes
    const mockNode1 = { id: 'node1', type: 'rect' } as unknown as SceneNode;
    const mockNode2 = { id: 'node2', type: 'circle' } as unknown as SceneNode;

    const group = groupPlugin.createGroup([mockNode1, mockNode2]);

    expect(group).toBeInstanceOf(DefaultGroup);
    expect(group.children).toHaveLength(2);
    expect(group.children[0]).toBe(mockNode1);
    expect(group.children[1]).toBe(mockNode2);
  });

  it('should add and remove nodes from a group', () => {
    groupPlugin.install(engine);
    const group = groupPlugin.createGroup();

    // Create mock node
    const mockNode = { id: 'node1', type: 'rect' } as unknown as SceneNode;

    // Add node
    group.add(mockNode);
    expect(group.children).toHaveLength(1);
    expect(group.children[0]).toBe(mockNode);

    // Remove node
    const removed = group.remove(mockNode);
    expect(removed).toBe(true);
    expect(group.children).toHaveLength(0);

    // Try to remove non-existent node
    const nonExistentNode = { id: 'node2', type: 'circle' } as unknown as SceneNode;
    const removedNonExistent = group.remove(nonExistentNode);
    expect(removedNonExistent).toBe(false);
  });

  it('should find a node by id', () => {
    groupPlugin.install(engine);

    // Create mock nodes
    const mockNode1 = { id: 'node1', type: 'rect' } as unknown as SceneNode;
    const mockNode2 = { id: 'node2', type: 'circle' } as unknown as SceneNode;

    const group = groupPlugin.createGroup([mockNode1, mockNode2]);

    // Find existing node
    const found = group.findById('node2');
    expect(found).toBe(mockNode2);

    // Try to find non-existent node
    const notFound = group.findById('node3');
    expect(notFound).toBeNull();
  });

  it('should apply transformations to all nodes in the group', () => {
    groupPlugin.install(engine);

    // Create mock nodes with applyTransform method
    const mockNode1 = {
      id: 'node1',
      type: 'rect',
      applyTransform: vi.fn().mockReturnValue({ id: 'node1-transformed', type: 'rect' }),
    } as unknown as SceneNode & { applyTransform: (...args: any[]) => any };
    const mockNode2 = {
      id: 'node2',
      type: 'circle',
      applyTransform: vi.fn().mockReturnValue({ id: 'node2-transformed', type: 'circle' }),
    } as unknown as SceneNode & { applyTransform: (...args: any[]) => any };

    const group = groupPlugin.createGroup([mockNode1, mockNode2]);

    // Mock transform matrix
    const mockMatrix = { type: 'matrix', matrix: [2, 0, 0, 0, 2, 0, 0, 0, 1] };

    // Apply transform
    const transformedGroup = group.applyTransform(mockMatrix as any);

    // Verify transform was applied to all nodes
    expect(mockNode1.applyTransform).toHaveBeenCalledWith(mockMatrix);
    expect(mockNode2.applyTransform).toHaveBeenCalledWith(mockMatrix);

    // Verify transformed group has transformed nodes
    expect(transformedGroup).toBeInstanceOf(DefaultGroup);
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
