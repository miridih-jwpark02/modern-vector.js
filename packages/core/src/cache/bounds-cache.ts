/**
 * Computed bounds caching system
 */
import { Cache } from './cache';
import { Bounds } from '../geometry/bounds';

/**
 * Bounds type
 */
export enum BoundsType {
  GEOMETRY = 'geometry',    // 기하학적 경계
  STROKE = 'stroke',       // Stroke 포함 경계
  HANDLE = 'handle',       // Handle 포함 경계
  ROUGH = 'rough',         // 대략적인 경계
  CONTROL = 'control',     // Control point 경계
  FILL = 'fill',          // Fill 영역 경계
  CLIP = 'clip'           // Clipping 영역 경계
}

/**
 * Bounds cache entry
 */
interface BoundsCacheEntry {
  bounds: Bounds;
  timestamp: number;
  dirty: boolean;
  dependencies?: string[];  // 의존하는 다른 bounds의 key들
}

/**
 * Bounds cache key builder
 */
class BoundsCacheKeyBuilder {
  private itemId: string = '';
  private type: BoundsType = BoundsType.GEOMETRY;
  private transform: string[] = [];
  private style: string[] = [];

  /**
   * Item ID 설정
   */
  setItemId(id: string): this {
    this.itemId = id;
    return this;
  }

  /**
   * Bounds type 설정
   */
  setType(type: BoundsType): this {
    this.type = type;
    return this;
  }

  /**
   * Transform matrix 추가
   */
  addTransform(matrix: number[]): this {
    this.transform.push(matrix.join(','));
    return this;
  }

  /**
   * Style property 추가
   */
  addStyle(name: string, value: any): this {
    this.style.push(`${name}:${value}`);
    return this;
  }

  /**
   * Cache key 생성
   */
  build(): string {
    return [
      this.itemId,
      this.type,
      this.transform.join('|'),
      this.style.join(';')
    ].join('#');
  }
}

/**
 * Computed bounds cache manager
 */
export class BoundsCache {
  private cache: Cache<BoundsCacheEntry>;
  private keyBuilder: BoundsCacheKeyBuilder;
  private dependencyGraph: Map<string, Set<string>>;

  constructor() {
    // 기본 캐시 정책으로 초기화
    this.cache = new Cache<BoundsCacheEntry>({
      maxSize: 5 * 1024 * 1024, // 5MB
      maxItems: 1000,
      defaultTTL: 5 * 60 * 1000 // 5분
    });
    this.keyBuilder = new BoundsCacheKeyBuilder();
    this.dependencyGraph = new Map();
  }

  /**
   * Bounds 가져오기
   */
  getBounds(key: string): Bounds | undefined {
    const entry = this.cache.get(key);
    if (entry && !this.isDirty(entry)) {
      return entry.bounds;
    }
    return undefined;
  }

  /**
   * Bounds 설정
   */
  setBounds(key: string, bounds: Bounds, dependencies?: string[]): void {
    const entry: BoundsCacheEntry = {
      bounds,
      timestamp: Date.now(),
      dirty: false,
      dependencies
    };

    // 의존성 그래프 업데이트
    if (dependencies) {
      this.updateDependencyGraph(key, dependencies);
    }

    this.cache.set(key, entry);
  }

  /**
   * Bounds를 dirty로 표시
   */
  markDirty(key: string): void {
    const entry = this.cache.get(key);
    if (entry) {
      entry.dirty = true;
      this.cache.set(key, entry);

      // 의존하는 bounds도 dirty로 표시
      this.markDependentsDirty(key);
    }
  }

  /**
   * 의존성 그래프 업데이트
   */
  private updateDependencyGraph(key: string, dependencies: string[]): void {
    // 이전 의존성 제거
    for (const [dep, dependents] of this.dependencyGraph.entries()) {
      dependents.delete(key);
      if (dependents.size === 0) {
        this.dependencyGraph.delete(dep);
      }
    }

    // 새 의존성 추가
    for (const dep of dependencies) {
      if (!this.dependencyGraph.has(dep)) {
        this.dependencyGraph.set(dep, new Set());
      }
      this.dependencyGraph.get(dep)!.add(key);
    }
  }

  /**
   * 의존하는 bounds들을 dirty로 표시
   */
  private markDependentsDirty(key: string): void {
    const dependents = this.dependencyGraph.get(key);
    if (dependents) {
      for (const dependent of dependents) {
        this.markDirty(dependent);
      }
    }
  }

  /**
   * Bounds가 dirty 상태인지 확인
   */
  private isDirty(entry: BoundsCacheEntry): boolean {
    if (entry.dirty) {
      return true;
    }

    // 의존하는 bounds 중 하나라도 dirty면 이 bounds도 dirty
    if (entry.dependencies) {
      for (const dep of entry.dependencies) {
        const depEntry = this.cache.get(dep);
        if (!depEntry || this.isDirty(depEntry)) {
          return true;
        }
      }
    }

    return false;
  }

  /**
   * Cache key builder 가져오기
   */
  getKeyBuilder(): BoundsCacheKeyBuilder {
    return this.keyBuilder;
  }

  /**
   * Cache 정리
   */
  clear(): void {
    this.cache.clear();
    this.dependencyGraph.clear();
  }

  /**
   * Resource 해제
   */
  dispose(): void {
    this.cache.dispose();
    this.dependencyGraph.clear();
  }
}

/**
 * Bounds computation helper
 */
export class BoundsComputer {
  private cache: BoundsCache;

  constructor(cache: BoundsCache) {
    this.cache = cache;
  }

  /**
   * Geometry bounds 계산
   */
  computeGeometryBounds(item: any, transform?: number[]): Bounds {
    const key = this.cache.getKeyBuilder()
      .setItemId(item.id)
      .setType(BoundsType.GEOMETRY)
      .addTransform(transform || [1, 0, 0, 1, 0, 0])
      .build();

    let bounds = this.cache.getBounds(key);
    if (!bounds) {
      bounds = this.calculateGeometryBounds(item, transform);
      this.cache.setBounds(key, bounds);
    }
    return bounds;
  }

  /**
   * Stroke bounds 계산
   */
  computeStrokeBounds(item: any, transform?: number[]): Bounds {
    const key = this.cache.getKeyBuilder()
      .setItemId(item.id)
      .setType(BoundsType.STROKE)
      .addTransform(transform || [1, 0, 0, 1, 0, 0])
      .addStyle('strokeWidth', item.strokeWidth)
      .addStyle('strokeCap', item.strokeCap)
      .addStyle('strokeJoin', item.strokeJoin)
      .addStyle('miterLimit', item.miterLimit)
      .build();

    let bounds = this.cache.getBounds(key);
    if (!bounds) {
      // Stroke bounds는 geometry bounds에 의존
      const geomBounds = this.computeGeometryBounds(item, transform);
      bounds = this.calculateStrokeBounds(item, geomBounds);
      this.cache.setBounds(key, bounds, [
        this.cache.getKeyBuilder()
          .setItemId(item.id)
          .setType(BoundsType.GEOMETRY)
          .addTransform(transform || [1, 0, 0, 1, 0, 0])
          .build()
      ]);
    }
    return bounds;
  }

  /**
   * Handle bounds 계산
   */
  computeHandleBounds(item: any, transform?: number[]): Bounds {
    const key = this.cache.getKeyBuilder()
      .setItemId(item.id)
      .setType(BoundsType.HANDLE)
      .addTransform(transform || [1, 0, 0, 1, 0, 0])
      .build();

    let bounds = this.cache.getBounds(key);
    if (!bounds) {
      bounds = this.calculateHandleBounds(item, transform);
      this.cache.setBounds(key, bounds);
    }
    return bounds;
  }

  /**
   * Geometry bounds 실제 계산
   */
  private calculateGeometryBounds(item: any, transform?: number[]): Bounds {
    // 실제 geometry bounds 계산 로직 구현
    // 이 예제에서는 더미 값 반환
    return new Bounds(0, 0, 100, 100);
  }

  /**
   * Stroke bounds 실제 계산
   */
  private calculateStrokeBounds(item: any, geomBounds: Bounds): Bounds {
    // 실제 stroke bounds 계산 로직 구현
    // 이 예제에서는 geometry bounds에 padding 추가
    const padding = item.strokeWidth / 2;
    return new Bounds(
      geomBounds.x - padding,
      geomBounds.y - padding,
      geomBounds.width + padding * 2,
      geomBounds.height + padding * 2
    );
  }

  /**
   * Handle bounds 실제 계산
   */
  private calculateHandleBounds(item: any, transform?: number[]): Bounds {
    // 실제 handle bounds 계산 로직 구현
    // 이 예제에서는 더미 값 반환
    return new Bounds(0, 0, 120, 120);
  }
}