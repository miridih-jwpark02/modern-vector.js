/**
 * WebAssembly 기하 연산 모듈
 */

let wasmInstance: WebAssembly.Instance | null = null;
let wasmMemory: WebAssembly.Memory | null = null;

/**
 * WebAssembly 모듈 초기화
 */
export async function initGeometryWasm(): Promise<void> {
  if (wasmInstance) return;

  try {
    const response = await fetch('/wasm/geometry.wasm');
    const wasmBytes = await response.arrayBuffer();
    const wasmModule = await WebAssembly.compile(wasmBytes);
    const instance = await WebAssembly.instantiate(wasmModule, {});

    wasmInstance = instance;
    wasmMemory = instance.exports.memory as WebAssembly.Memory;
  } catch (error) {
    console.error('Failed to initialize WebAssembly module:', error);
    throw error;
  }
}

/**
 * 선분 교차점 계산
 */
export function lineIntersection(
  x1: number, y1: number,
  x2: number, y2: number,
  x3: number, y3: number,
  x4: number, y4: number
): { x: number; y: number; exists: boolean } {
  if (!wasmInstance) {
    throw new Error('WebAssembly module not initialized');
  }

  const { lineIntersection } = wasmInstance.exports as any;
  const [x, y, exists] = lineIntersection(
    x1, y1, x2, y2,
    x3, y3, x4, y4
  );

  return { x, y, exists: !!exists };
}

/**
 * 베지어 곡선 분할
 */
export function subdivideCubicBezier(
  t: number,
  x0: number, y0: number,
  x1: number, y1: number,
  x2: number, y2: number,
  x3: number, y3: number
): {
  left: [number, number, number, number, number, number, number, number];
  right: [number, number, number, number, number, number, number, number];
} {
  if (!wasmInstance) {
    throw new Error('WebAssembly module not initialized');
  }

  const { subdivideCubicBezier } = wasmInstance.exports as any;
  const [
    lx0, ly0, lx1, ly1, lx2, ly2, lx3, ly3
  ] = subdivideCubicBezier(
    t,
    x0, y0, x1, y1, x2, y2, x3, y3
  );

  return {
    left: [x0, y0, lx1, ly1, lx2, ly2, lx3, ly3],
    right: [lx3, ly3, x2, y2, x3, y3, x3, y3]
  };
}

/**
 * WebAssembly 메모리 해제
 */
export function disposeGeometryWasm(): void {
  wasmInstance = null;
  wasmMemory = null;
}