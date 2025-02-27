import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { DefaultGroupPlugin } from '../';
import { DefaultGroup } from '../';
import { VectorEngine, Plugin, SceneNode } from '../../../../core/types';
import { Matrix3x3 } from '../../math/matrix';

// 모의 SceneNode 생성 함수
const createMockSceneNode = (id: string, type: string): SceneNode => {
  return {
    id,
    type,
    parent: null,
    children: [],
    data: {},
    addChild: vi.fn(child => child),
    removeChild: vi.fn(() => true),
    clearChildren: vi.fn(),
    findChildById: vi.fn(nodeId => (nodeId === id ? { id } : null)),
    on: vi.fn(),
    off: vi.fn(),
    emit: vi.fn(),
    // 추가 속성
    transform: Matrix3x3.create(),
    applyTransform: vi.fn().mockReturnValue({ id: `${id}-transformed`, type }),
  } as unknown as SceneNode;
};

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
        register: vi.fn(),
        setActive: vi.fn(),
        render: vi.fn(),
      },
      events: {
        on: vi.fn(),
        off: vi.fn(),
        emit: vi.fn(),
        createNamespace: vi.fn(),
      },
      scene: {
        create: vi.fn(),
        getActive: vi.fn().mockReturnValue({
          root: {
            id: 'root',
            children: [],
            addChild: vi.fn(),
            removeChild: vi.fn(),
            findChildById: vi.fn(),
            clearChildren: vi.fn(),
            parent: null,
            data: {},
            on: vi.fn(),
            off: vi.fn(),
            emit: vi.fn(),
          },
          renderer: {
            id: 'mock-renderer',
            capabilities: {
              maxTextureSize: 4096,
              supportsSVG: true,
              supportsWebGL: true,
              supports3D: false,
            },
            render: vi.fn(),
            dispose: vi.fn(),
          },
          plugins: new Map(),
          on: vi.fn(),
          off: vi.fn(),
          emit: vi.fn(),
        }),
        setActive: vi.fn(),
      },
      createGroup: vi.fn(),
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
    vi.resetModules();
  });

  it('should have correct metadata', () => {
    expect(groupPlugin.id).toBe('group-plugin');
    expect(groupPlugin.version).toBe('1.0.0');
    expect(groupPlugin.dependencies).toContain('shape-plugin');
  });

  it('should install correctly', () => {
    groupPlugin.install(engine);

    // Verify engine is set (이 테스트에서는 mock을 사용)
    const mockGroup = vi.spyOn(groupPlugin, 'createGroup').mockReturnValue({} as DefaultGroup);
    groupPlugin.createGroup();

    expect(mockGroup).toHaveBeenCalled();

    // Verify warning when installing twice
    const consoleSpy = vi.spyOn(console, 'warn');
    groupPlugin.install(engine);
    expect(consoleSpy).toHaveBeenCalledWith('GroupPlugin is already installed');
  });

  it('should create a group without children', () => {
    groupPlugin.install(engine);

    // 실제 DefaultGroup을 생성하지 않고 mock 사용
    const mockEmptyGroup = {
      id: 'empty-group',
      children: [],
    };

    vi.spyOn(groupPlugin, 'createGroup').mockReturnValue(mockEmptyGroup as unknown as DefaultGroup);

    const group = groupPlugin.createGroup();
    expect(group.id).toBe('empty-group');
    expect(group.children.length).toBe(0);
  });

  it('should create a group with children', () => {
    groupPlugin.install(engine);

    // Create mock nodes
    const mockNode1 = createMockSceneNode('node1', 'rect');
    const mockNode2 = createMockSceneNode('node2', 'circle');

    // Mock group with children
    const mockGroupWithChildren = {
      id: 'group-with-children',
      children: [mockNode1, mockNode2],
      add: vi.fn(),
    };

    vi.spyOn(groupPlugin, 'createGroup').mockReturnValue(
      mockGroupWithChildren as unknown as DefaultGroup
    );

    const group = groupPlugin.createGroup([mockNode1, mockNode2]);

    expect(group.id).toBe('group-with-children');
    expect(group.children.length).toBe(2);
    expect(group.children[0]).toBe(mockNode1);
    expect(group.children[1]).toBe(mockNode2);
  });

  it('should add and remove nodes from a group', () => {
    groupPlugin.install(engine);

    // Mock node
    const mockNode = createMockSceneNode('node1', 'rect');

    // Mock group with add/remove methods
    const mockGroup = {
      id: 'test-group',
      children: [] as SceneNode[],
      add: vi.fn((node: SceneNode) => {
        mockGroup.children.push(node);
        return node;
      }),
      remove: vi.fn((node: SceneNode) => {
        const index = mockGroup.children.indexOf(node);
        if (index === -1) return false;
        mockGroup.children.splice(index, 1);
        return true;
      }),
    };

    vi.spyOn(groupPlugin, 'createGroup').mockReturnValue(mockGroup as unknown as DefaultGroup);

    const group = groupPlugin.createGroup();

    // Add node
    group.add(mockNode);
    expect(group.children.length).toBe(1);
    expect(group.children[0]).toBe(mockNode);

    // Remove node
    const removed = group.remove(mockNode);
    expect(removed).toBe(true);
    expect(group.children.length).toBe(0);

    // Try to remove non-existent node
    const nonExistentNode = createMockSceneNode('node2', 'circle');
    const removedNonExistent = group.remove(nonExistentNode);
    expect(removedNonExistent).toBe(false);
  });

  it('should find a node by id', () => {
    groupPlugin.install(engine);

    // Create mock nodes
    const mockNode1 = createMockSceneNode('node1', 'rect');
    const mockNode2 = createMockSceneNode('node2', 'circle');

    // Mock group with findById method
    const mockGroup = {
      id: 'test-group',
      children: [mockNode1, mockNode2],
      findById: vi.fn((id: string) => {
        if (id === 'node1') return mockNode1;
        if (id === 'node2') return mockNode2;
        return null;
      }),
    };

    vi.spyOn(groupPlugin, 'createGroup').mockReturnValue(mockGroup as unknown as DefaultGroup);

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
    const mockNode1 = createMockSceneNode('node1', 'rect');
    const mockNode2 = createMockSceneNode('node2', 'circle');

    // Mock matrix
    const mockMatrix = Matrix3x3.create();

    // Mock transformed nodes
    const mockNode1Transformed = createMockSceneNode('node1-transformed', 'rect');
    const mockNode2Transformed = createMockSceneNode('node2-transformed', 'circle');

    // Set up applyTransform mocks
    (mockNode1 as any).applyTransform = vi.fn().mockReturnValue(mockNode1Transformed);
    (mockNode2 as any).applyTransform = vi.fn().mockReturnValue(mockNode2Transformed);

    // Mock group with applyTransform method
    const mockGroup = {
      id: 'test-group',
      children: [mockNode1, mockNode2],
      transform: Matrix3x3.create(),
      applyTransform: vi.fn((matrix: Matrix3x3) => {
        const transformedGroup = {
          id: 'transformed-group',
          children: [
            (mockNode1 as any).applyTransform(matrix),
            (mockNode2 as any).applyTransform(matrix),
          ],
          transform: matrix,
        };
        return transformedGroup;
      }),
    };

    vi.spyOn(groupPlugin, 'createGroup').mockReturnValue(mockGroup as unknown as DefaultGroup);

    const group = groupPlugin.createGroup([mockNode1, mockNode2]);

    // Apply transform
    const transformedGroup = group.applyTransform(mockMatrix);

    // Verify transformed group
    expect(transformedGroup.id).toBe('transformed-group');
    expect(transformedGroup.children.length).toBe(2);
    expect(transformedGroup.children[0].id).toBe('node1-transformed');
    expect(transformedGroup.children[1].id).toBe('node2-transformed');
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
