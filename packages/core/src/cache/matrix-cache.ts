/**
 * Transform matrix caching system
 */
import { Cache } from './cache';

/**
 * Matrix operation types
 */
export enum MatrixOperation {
  MULTIPLY = 'multiply',
  INVERSE = 'inverse',
  DECOMPOSE = 'decompose',
  INTERPOLATE = 'interpolate'
}

/**
 * Matrix decomposition result
 */
interface DecomposedMatrix {
  translation: [number, number];
  rotation: number;
  scaling: [number, number];
  skewing: [number, number];
}

/**
 * Matrix cache entry types
 */
type MatrixCacheEntry = {
  multiply?: number[];
  inverse?: number[];
  decompose?: DecomposedMatrix;
  interpolate?: number[];
};

/**
 * Matrix cache key builder
 */
class MatrixCacheKeyBuilder {
  private elements: string[] = [];
  private operation: string = '';
  private params: string[] = [];

  /**
   * Matrix elements 추가
   */
  addMatrix(matrix: number[]): this {
    this.elements.push(matrix.join(','));
    return this;
  }

  /**
   * Operation 설정
   */
  setOperation(op: MatrixOperation): this {
    this.operation = op;
    return this;
  }

  /**
   * Operation parameter 추가
   */
  addParameter(param: any): this {
    this.params.push(String(param));
    return this;
  }

  /**
   * Cache key 생성
   */
  build(): string {
    return [
      this.elements.join('|'),
      this.operation,
      this.params.join(';')
    ].join('#');
  }
}

/**
 * Transform matrix cache manager
 */
export class MatrixCache {
  private cache: Cache<MatrixCacheEntry>;
  private keyBuilder: MatrixCacheKeyBuilder;

  constructor() {
    // 기본 캐시 정책으로 초기화
    this.cache = new Cache<MatrixCacheEntry>({
      maxSize: 5 * 1024 * 1024, // 5MB
      maxItems: 500,
      defaultTTL: 5 * 60 * 1000 // 5분
    });
    this.keyBuilder = new MatrixCacheKeyBuilder();
  }

  /**
   * Matrix multiplication 결과 캐싱
   */
  getMultiplyResult(key: string): number[] | undefined {
    const entry = this.cache.get(key);
    return entry?.multiply;
  }

  setMultiplyResult(key: string, result: number[]): void {
    const entry = this.cache.get(key) || {};
    entry.multiply = result;
    this.cache.set(key, entry);
  }

  /**
   * Matrix inverse 결과 캐싱
   */
  getInverseResult(key: string): number[] | undefined {
    const entry = this.cache.get(key);
    return entry?.inverse;
  }

  setInverseResult(key: string, result: number[]): void {
    const entry = this.cache.get(key) || {};
    entry.inverse = result;
    this.cache.set(key, entry);
  }

  /**
   * Matrix decomposition 결과 캐싱
   */
  getDecompositionResult(key: string): DecomposedMatrix | undefined {
    const entry = this.cache.get(key);
    return entry?.decompose;
  }

  setDecompositionResult(key: string, result: DecomposedMatrix): void {
    const entry = this.cache.get(key) || {};
    entry.decompose = result;
    this.cache.set(key, entry);
  }

  /**
   * Matrix interpolation 결과 캐싱
   */
  getInterpolationResult(key: string): number[] | undefined {
    const entry = this.cache.get(key);
    return entry?.interpolate;
  }

  setInterpolationResult(key: string, result: number[]): void {
    const entry = this.cache.get(key) || {};
    entry.interpolate = result;
    this.cache.set(key, entry);
  }

  /**
   * Cache key builder 가져오기
   */
  getKeyBuilder(): MatrixCacheKeyBuilder {
    return this.keyBuilder;
  }

  /**
   * Cache 정리
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Resource 해제
   */
  dispose(): void {
    this.cache.dispose();
  }
}

/**
 * Matrix operation helper functions
 */
export class MatrixOperations {
  private cache: MatrixCache;

  constructor(cache: MatrixCache) {
    this.cache = cache;
  }

  /**
   * Matrix multiplication with caching
   */
  multiply(m1: number[], m2: number[]): number[] {
    const key = this.cache.getKeyBuilder()
      .addMatrix(m1)
      .addMatrix(m2)
      .setOperation(MatrixOperation.MULTIPLY)
      .build();

    let result = this.cache.getMultiplyResult(key);
    if (!result) {
      result = this.calculateMultiply(m1, m2);
      this.cache.setMultiplyResult(key, result);
    }
    return result;
  }

  /**
   * Matrix inverse with caching
   */
  inverse(matrix: number[]): number[] | null {
    const key = this.cache.getKeyBuilder()
      .addMatrix(matrix)
      .setOperation(MatrixOperation.INVERSE)
      .build();

    let result = this.cache.getInverseResult(key);
    if (!result) {
      result = this.calculateInverse(matrix);
      if (result) {
        this.cache.setInverseResult(key, result);
      }
    }
    return result;
  }

  /**
   * Matrix decomposition with caching
   */
  decompose(matrix: number[]): DecomposedMatrix {
    const key = this.cache.getKeyBuilder()
      .addMatrix(matrix)
      .setOperation(MatrixOperation.DECOMPOSE)
      .build();

    let result = this.cache.getDecompositionResult(key);
    if (!result) {
      result = this.calculateDecomposition(matrix);
      this.cache.setDecompositionResult(key, result);
    }
    return result;
  }

  /**
   * Matrix interpolation with caching
   */
  interpolate(m1: number[], m2: number[], t: number): number[] {
    const key = this.cache.getKeyBuilder()
      .addMatrix(m1)
      .addMatrix(m2)
      .setOperation(MatrixOperation.INTERPOLATE)
      .addParameter(t)
      .build();

    let result = this.cache.getInterpolationResult(key);
    if (!result) {
      result = this.calculateInterpolation(m1, m2, t);
      this.cache.setInterpolationResult(key, result);
    }
    return result;
  }

  /**
   * Matrix multiplication 계산
   */
  private calculateMultiply(m1: number[], m2: number[]): number[] {
    return [
      m1[0] * m2[0] + m1[2] * m2[1],
      m1[1] * m2[0] + m1[3] * m2[1],
      m1[0] * m2[2] + m1[2] * m2[3],
      m1[1] * m2[2] + m1[3] * m2[3],
      m1[0] * m2[4] + m1[2] * m2[5] + m1[4],
      m1[1] * m2[4] + m1[3] * m2[5] + m1[5]
    ];
  }

  /**
   * Matrix inverse 계산
   */
  private calculateInverse(m: number[]): number[] | null {
    const det = m[0] * m[3] - m[1] * m[2];
    if (Math.abs(det) < 1e-6) {
      return null;
    }

    const invDet = 1 / det;
    return [
      m[3] * invDet,
      -m[1] * invDet,
      -m[2] * invDet,
      m[0] * invDet,
      (m[2] * m[5] - m[3] * m[4]) * invDet,
      (m[1] * m[4] - m[0] * m[5]) * invDet
    ];
  }

  /**
   * Matrix decomposition 계산
   */
  private calculateDecomposition(m: number[]): DecomposedMatrix {
    const sx = Math.sqrt(m[0] * m[0] + m[1] * m[1]);
    const sy = Math.sqrt(m[2] * m[2] + m[3] * m[3]);
    const rotation = Math.atan2(m[1], m[0]);
    const skewX = Math.atan2(m[0] * m[2] + m[1] * m[3], sx * sy);
    const skewY = Math.atan2(m[1] * m[2] - m[0] * m[3], sx * sy);

    return {
      translation: [m[4], m[5]],
      rotation: rotation,
      scaling: [sx, sy],
      skewing: [skewX, skewY]
    };
  }

  /**
   * Matrix interpolation 계산
   */
  private calculateInterpolation(m1: number[], m2: number[], t: number): number[] {
    return [
      m1[0] + (m2[0] - m1[0]) * t,
      m1[1] + (m2[1] - m1[1]) * t,
      m1[2] + (m2[2] - m1[2]) * t,
      m1[3] + (m2[3] - m1[3]) * t,
      m1[4] + (m2[4] - m1[4]) * t,
      m1[5] + (m2[5] - m1[5]) * t
    ];
  }
}