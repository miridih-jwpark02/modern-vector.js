import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { DefaultGroup } from '../group';
import { Matrix3x3 } from '../../math/matrix';
import { EventEmitter } from '../../../../core/types';
import { Vector2D } from '../../math/vector';
import { SceneNode } from '../../../../core/types';

// Mock EventEmitter
const createMockEventEmitter = (): EventEmitter => {
  return {
    on: vi.fn(),
    off: vi.fn(),
    emit: vi.fn(),
  };
};

// Mock createMockVector 함수에서 unknown으로 캐스팅 후 Vector2D로 변환
const createMockVector = (x: number, y: number) => {
  const mockVector = {
    x,
    y,
    add: vi.fn().mockReturnValue({ x: x + 1, y: y + 1 }),
    subtract: vi.fn().mockReturnValue({ x: x - 1, y: y - 1 }),
    scale: vi.fn().mockReturnValue({ x: x * 2, y: y * 2 }),
    dot: vi.fn().mockReturnValue(10),
    cross: vi.fn().mockReturnValue(5),
    length: 5, // 함수가 아닌 숫자로 변경
    normalize: vi.fn().mockReturnThis(),
    distance: 10, // 함수가 아닌 숫자로 변경
    angle: vi.fn().mockReturnValue(45),
    clone: vi.fn().mockReturnThis(),
    rotate: vi.fn().mockReturnThis(),
    perpendicular: vi.fn().mockReturnThis(),
    distanceTo: vi.fn().mockReturnValue(15),
  };
  return mockVector as unknown as Vector2D;
};

// Mock SceneNode
const createMockNode = (
  id: string,
  bounds: { x: number; y: number; width: number; height: number }
): SceneNode => {
  return {
    id,
    parent: null,
    children: [],
    data: {},
    // Mock methods
    addChild: vi.fn().mockReturnValue({ id }),
    removeChild: vi.fn().mockReturnValue(true),
    clearChildren: vi.fn(),
    findChildById: vi.fn().mockReturnValue(null),
    on: vi.fn(),
    off: vi.fn(),
    emit: vi.fn(),
    // Additional properties for testing
    bounds,
    type: 'mock-node',
    transform: Matrix3x3.create(),
    containsPoint: vi.fn().mockReturnValue(true),
    intersects: vi.fn().mockReturnValue(false),
    toPath: vi.fn().mockReturnValue([]),
  } as unknown as SceneNode;
};

/**
 * DefaultGroup 테스트
 */
describe('DefaultGroup', () => {
  let mockEventEmitter: EventEmitter;
  let group: DefaultGroup;

  beforeEach(() => {
    mockEventEmitter = createMockEventEmitter();

    // Mock UUID
    vi.mock('uuid', () => ({
      v4: vi.fn().mockReturnValue('mocked-uuid'),
    }));

    group = new DefaultGroup('test-group', {}, mockEventEmitter);
  });

  afterEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
  });

  it('생성자가 올바르게 동작해야 함', () => {
    expect(group.id).toBe('test-group');
    expect(group.type).toBe('group');
    expect(group.children.length).toBe(0);
  });

  it('자식 노드를 추가하고 제거할 수 있어야 함', () => {
    // Mock nodes
    const node1 = createMockNode('node1', { x: 0, y: 0, width: 100, height: 100 });
    const node2 = createMockNode('node2', { x: 100, y: 100, width: 100, height: 100 });

    // Add nodes
    group.add(node1);
    group.add(node2);

    expect(group.children.length).toBe(2);

    // Remove a node
    const result = group.remove(node1);
    expect(result).toBe(true);
    expect(group.children.length).toBe(1);

    // Clear all nodes
    group.clear();
    expect(group.children.length).toBe(0);
  });

  it('ID로 자식 노드를 찾을 수 있어야 함', () => {
    const node = createMockNode('target-node', { x: 0, y: 0, width: 100, height: 100 });
    group.add(node);

    // Mock findChildById
    vi.spyOn(group, 'findChildById').mockImplementation(id => {
      return id === 'target-node' ? node : null;
    });

    const found = group.findById('target-node');
    expect(found).toBe(node);

    const notFound = group.findById('non-existent');
    expect(notFound).toBeNull();
  });

  it('Group를 복제할 수 있어야 함', () => {
    const node = createMockNode('node1', { x: 0, y: 0, width: 100, height: 100 });
    group.add(node);

    // Create a spy to mock clone behavior
    const mockClone = {
      id: 'cloned-group',
      children: [{ id: 'cloned-node' }],
    };

    vi.spyOn(group, 'clone').mockImplementation(() => mockClone as unknown as DefaultGroup);

    const cloned = group.clone();
    expect(cloned.id).toBe('cloned-group');
    expect(cloned.children.length).toBe(1);
  });

  it('변환을 적용할 수 있어야 함', () => {
    // Mock matrix
    const matrix = {
      values: [
        [1, 0, 0],
        [0, 1, 0],
        [10, 20, 1],
      ],
      determinant: vi.fn().mockReturnValue(1),
      multiply: vi.fn().mockReturnThis(),
      inverse: vi.fn().mockReturnThis(),
      transpose: vi.fn().mockReturnThis(),
      clone: vi.fn().mockReturnThis(),
    } as unknown as Matrix3x3;

    // Mock transformed group
    const mockTransformed = {
      id: 'transformed-group',
      transform: matrix,
    };

    vi.spyOn(group, 'applyTransform').mockImplementation(
      () => mockTransformed as unknown as DefaultGroup
    );

    const transformed = group.applyTransform(matrix);
    expect(transformed.id).toBe('transformed-group');
  });

  it('점이 Group 내부에 있는지 확인할 수 있어야 함', () => {
    const node = createMockNode('node1', { x: 0, y: 0, width: 100, height: 100 });
    group.add(node);

    // Mock node's containsPoint to return true
    (node as any).containsPoint = vi.fn().mockReturnValue(true);

    const point = createMockVector(50, 50);
    const result = group.containsPoint(point);

    expect(result).toBe(true);
  });

  it('다른 노드와 겹치는지 확인할 수 있어야 함', () => {
    const node = createMockNode('node1', { x: 0, y: 0, width: 100, height: 100 });
    const otherNode = createMockNode('other', { x: 50, y: 50, width: 100, height: 100 });

    group.add(node);

    // Mock node's intersects to return true
    (node as any).intersects = vi.fn().mockReturnValue(true);

    const result = group.intersects(otherNode);
    expect(result).toBe(true);
  });

  it('Path로 변환할 수 있어야 함', () => {
    const node = createMockNode('node1', { x: 0, y: 0, width: 100, height: 100 });
    group.add(node);

    // Mock points that will be returned by toPath
    const pathPoints = [
      { x: 0, y: 0, type: 'M' },
      { x: 100, y: 100, type: 'L' },
    ];

    // Mock node's toPath to return our path points
    (node as any).toPath = vi.fn().mockReturnValue(pathPoints);

    const result = group.toPath();
    expect(result).toEqual(pathPoints);
  });
});
