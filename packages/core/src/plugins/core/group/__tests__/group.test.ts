import { DefaultGroup } from '../group';
import { Matrix3x3 } from '../../math/matrix';
import { EventEmitter } from '../../../../core/types';
import { v4 as uuidv4 } from 'uuid';
import { SceneNode } from '../../../../core/types';

// Mock EventEmitter
const createMockEventEmitter = (): EventEmitter => {
  const listeners: Record<string, Array<(data: any) => void>> = {};

  return {
    on: (event: string, handler: (data: any) => void): void => {
      if (!listeners[event]) {
        listeners[event] = [];
      }
      listeners[event].push(handler);
    },
    off: (event: string, handler: (data: any) => void): void => {
      if (!listeners[event]) return;
      const index = listeners[event].indexOf(handler);
      if (index !== -1) {
        listeners[event].splice(index, 1);
      }
    },
    emit: (event: string, data: any): void => {
      if (!listeners[event]) return;
      listeners[event].forEach(handler => handler(data));
    },
  };
};

// Mock 함수 생성 헬퍼
const createMockFn = <T extends any[], R>(implementation?: (...args: T) => R) => {
  const fn = (...args: T): R => {
    fn.calls.push(args);
    return implementation ? implementation(...args) : (undefined as unknown as R);
  };
  fn.calls = [] as T[];
  fn.mockImplementation = (newImpl: (...args: T) => R) => {
    implementation = newImpl;
    return fn;
  };
  fn.mockReturnValue = (value: R) => {
    implementation = () => value;
    return fn;
  };
  return fn;
};

// Mock SceneNode
interface MockNode extends SceneNode {
  bounds: { x: number; y: number; width: number; height: number };
  transform: Matrix3x3;
  type: string;
  clone(): MockNode;
  applyTransform(matrix: Matrix3x3): MockNode;
  containsPoint(point: { x: number; y: number }): boolean;
  intersects(node: MockNode): boolean;
  setScaleOrigin(origin: { x: number; y: number }): void;
  toPath(): any[];
}

// Mock Node 생성
const createMockNode = (
  id: string,
  bounds: { x: number; y: number; width: number; height: number }
): MockNode => {
  const eventEmitter = createMockEventEmitter();

  return {
    id,
    type: 'mock-node',
    transform: Matrix3x3.create(),
    bounds,
    parent: null,
    children: [],
    data: {},

    // SceneNode 메서드
    addChild: createMockFn<[SceneNode], SceneNode>(child => child),
    removeChild: createMockFn<[SceneNode], boolean>(() => true),
    clearChildren: createMockFn<[], void>(),
    findChildById: createMockFn<[string], SceneNode | null>(() => null),
    on: eventEmitter.on,
    off: eventEmitter.off,
    emit: eventEmitter.emit,

    // 추가 메서드
    clone: createMockFn<[], MockNode>(() => createMockNode(`${id}-clone`, bounds)),
    applyTransform: createMockFn<[Matrix3x3], MockNode>(() =>
      createMockNode(`${id}-transformed`, bounds)
    ),
    containsPoint: createMockFn<[{ x: number; y: number }], boolean>(point => {
      return (
        point.x >= bounds.x &&
        point.x <= bounds.x + bounds.width &&
        point.y >= bounds.y &&
        point.y <= bounds.y + bounds.height
      );
    }),
    intersects: createMockFn<[MockNode], boolean>(() => true),
    setScaleOrigin: createMockFn<[{ x: number; y: number }], void>(),
    toPath: createMockFn<[], any[]>(() => []),
  };
};

describe('DefaultGroup', () => {
  let eventEmitter: EventEmitter;

  beforeEach(() => {
    eventEmitter = createMockEventEmitter();
  });

  test('생성자가 올바르게 동작해야 함', () => {
    const id = uuidv4();
    const group = new DefaultGroup(id, {}, eventEmitter);

    expect(group.id).toBe(id);
    expect(group.type).toBe('group');
    expect(group.children).toHaveLength(0);
    expect(group.bounds).toEqual({ x: 0, y: 0, width: 0, height: 0 });
  });

  test('자식 노드를 추가하고 제거할 수 있어야 함', () => {
    const group = new DefaultGroup(uuidv4(), {}, eventEmitter);
    const node1 = createMockNode('node1', { x: 10, y: 10, width: 100, height: 100 });
    const node2 = createMockNode('node2', { x: 50, y: 50, width: 200, height: 200 });

    // 자식 추가
    group.add(node1);
    group.add(node2);

    expect(group.children).toHaveLength(2);
    expect(group.children[0].id).toBe('node1');
    expect(group.children[1].id).toBe('node2');

    // 경계 상자 확인
    expect(group.bounds.x).toBe(10);
    expect(group.bounds.y).toBe(10);
    expect(group.bounds.width).toBe(240);
    expect(group.bounds.height).toBe(240);

    // 자식 제거
    const result = group.remove(node1);

    expect(result).toBe(true);
    expect(group.children).toHaveLength(1);
    expect(group.children[0].id).toBe('node2');

    // 경계 상자 업데이트 확인
    expect(group.bounds.x).toBe(50);
    expect(group.bounds.y).toBe(50);
    expect(group.bounds.width).toBe(200);
    expect(group.bounds.height).toBe(200);

    // 모든 자식 제거
    group.clear();

    expect(group.children).toHaveLength(0);
    expect(group.bounds).toEqual({ x: 0, y: 0, width: 0, height: 0 });
  });

  test('ID로 자식 노드를 찾을 수 있어야 함', () => {
    const group = new DefaultGroup(uuidv4(), {}, eventEmitter);
    const node1 = createMockNode('node1', { x: 10, y: 10, width: 100, height: 100 });
    const node2 = createMockNode('node2', { x: 50, y: 50, width: 200, height: 200 });

    group.add(node1);
    group.add(node2);

    const found = group.findById('node2');
    expect(found).toBeTruthy();
    expect(found?.id).toBe('node2');

    const notFound = group.findById('node3');
    expect(notFound).toBeNull();
  });

  test('Group를 복제할 수 있어야 함', () => {
    const group = new DefaultGroup(uuidv4(), {}, eventEmitter);
    const node1 = createMockNode('node1', { x: 10, y: 10, width: 100, height: 100 });
    const node2 = createMockNode('node2', { x: 50, y: 50, width: 200, height: 200 });

    group.add(node1);
    group.add(node2);

    const cloned = group.clone();

    expect(cloned.id).not.toBe(group.id);
    expect(cloned.type).toBe('group');
    expect(cloned.children).toHaveLength(2);
    expect(cloned.style).toEqual(group.style);
  });

  test('변환을 적용할 수 있어야 함', () => {
    const group = new DefaultGroup(uuidv4(), {}, eventEmitter);
    const node = createMockNode('node1', { x: 10, y: 10, width: 100, height: 100 });

    group.add(node);

    const matrix = Matrix3x3.translation(50, 50);
    const transformed = group.applyTransform(matrix);

    expect(transformed.id).not.toBe(group.id);
    expect(transformed.type).toBe('group');
    expect(transformed.children).toHaveLength(1);
  });

  test('점이 Group 내부에 있는지 확인할 수 있어야 함', () => {
    const group = new DefaultGroup(uuidv4(), {}, eventEmitter);
    const node = createMockNode('node1', { x: 10, y: 10, width: 100, height: 100 });

    group.add(node);

    // 내부 점
    expect(group.containsPoint({ x: 50, y: 50 } as any)).toBe(true);

    // 외부 점
    expect(group.containsPoint({ x: 200, y: 200 } as any)).toBe(false);
  });

  test('다른 노드와 겹치는지 확인할 수 있어야 함', () => {
    const group = new DefaultGroup(uuidv4(), {}, eventEmitter);
    const node = createMockNode('node1', { x: 10, y: 10, width: 100, height: 100 });

    group.add(node);

    const otherNode = createMockNode('node2', { x: 50, y: 50, width: 100, height: 100 });

    expect(group.intersects(otherNode)).toBe(true);
  });

  test('Path로 변환할 수 있어야 함', () => {
    const group = new DefaultGroup(uuidv4(), {}, eventEmitter);
    const node = createMockNode('node1', { x: 10, y: 10, width: 100, height: 100 });

    group.add(node);

    const path = group.toPath();
    expect(Array.isArray(path)).toBe(true);
  });
});

// 테스트 헬퍼 함수
function expect(actual: any) {
  return {
    toBe: (expected: any) => {
      if (actual !== expected) {
        throw new Error(`Expected ${actual} to be ${expected}`);
      }
    },
    toEqual: (expected: any) => {
      const actualStr = JSON.stringify(actual);
      const expectedStr = JSON.stringify(expected);
      if (actualStr !== expectedStr) {
        throw new Error(`Expected ${actualStr} to equal ${expectedStr}`);
      }
    },
    toHaveLength: (expected: number) => {
      if (!Array.isArray(actual) || actual.length !== expected) {
        throw new Error(
          `Expected array to have length ${expected}, but got ${Array.isArray(actual) ? actual.length : 'not an array'}`
        );
      }
    },
    toBeTruthy: () => {
      if (!actual) {
        throw new Error(`Expected ${actual} to be truthy`);
      }
    },
    toBeNull: () => {
      if (actual !== null) {
        throw new Error(`Expected ${actual} to be null`);
      }
    },
    not: {
      toBe: (expected: any) => {
        if (actual === expected) {
          throw new Error(`Expected ${actual} not to be ${expected}`);
        }
      },
    },
  };
}

function describe(name: string, fn: () => void): void {
  console.log(`\nTest Suite: ${name}`);
  fn();
}

function test(name: string, fn: () => void): void {
  try {
    fn();
    console.log(`  ✓ ${name}`);
  } catch (error) {
    console.error(`  ✗ ${name}`);
    console.error(`    ${(error as Error).message}`);
  }
}

function beforeEach(_fn: () => void): void {
  // 실제 구현에서는 각 테스트 전에 실행되도록 설정
  // eslint-disable-next-line @typescript-eslint/no-empty-function
}
