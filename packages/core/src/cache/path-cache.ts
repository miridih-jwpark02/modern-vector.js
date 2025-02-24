/**
 * Path data caching system
 */
import { Cache } from './cache';
import { Point } from '../geometry/point';
import { Bounds } from '../geometry/bounds';

/**
 * Path data를 위한 cache key 생성기
 */
class PathCacheKeyBuilder {
  private segments: string[] = [];
  private style: string[] = [];
  private transform: string[] = [];

  /**
   * Segment data 추가
   */
  addSegment(point: Point, handleIn?: Point, handleOut?: Point): this {
    this.segments.push(`${point.x},${point.y}`);
    if (handleIn) this.segments.push(`${handleIn.x},${handleIn.y}`);
    if (handleOut) this.segments.push(`${handleOut.x},${handleOut.y}`);
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
   * Transform matrix 추가
   */
  addTransform(matrix: number[]): this {
    this.transform.push(matrix.join(','));
    return this;
  }

  /**
   * Cache key 생성
   */
  build(): string {
    return [
      this.segments.join('|'),
      this.style.join(';'),
      this.transform.join(';')
    ].join('#');
  }
}

/**
 * Path data cache entry
 */
interface PathCacheEntry {
  bounds?: Bounds;
  length?: number;
  area?: number;
  winding?: number;
  simplified?: Point[];
  flattened?: Point[];
  intersections?: Point[];
  outline?: Point[];
}

/**
 * Path data cache manager
 */
export class PathCache {
  private cache: Cache<PathCacheEntry>;
  private keyBuilder: PathCacheKeyBuilder;

  constructor() {
    // 기본 캐시 정책으로 초기화
    this.cache = new Cache<PathCacheEntry>({
      maxSize: 10 * 1024 * 1024, // 10MB
      maxItems: 1000,
      defaultTTL: 5 * 60 * 1000 // 5분
    });
    this.keyBuilder = new PathCacheKeyBuilder();
  }

  /**
   * Path bounds 캐싱
   */
  getBounds(key: string): Bounds | undefined {
    const entry = this.cache.get(key);
    return entry?.bounds;
  }

  setBounds(key: string, bounds: Bounds): void {
    const entry = this.cache.get(key) || {};
    entry.bounds = bounds;
    this.cache.set(key, entry);
  }

  /**
   * Path length 캐싱
   */
  getLength(key: string): number | undefined {
    const entry = this.cache.get(key);
    return entry?.length;
  }

  setLength(key: string, length: number): void {
    const entry = this.cache.get(key) || {};
    entry.length = length;
    this.cache.set(key, entry);
  }

  /**
   * Path area 캐싱
   */
  getArea(key: string): number | undefined {
    const entry = this.cache.get(key);
    return entry?.area;
  }

  setArea(key: string, area: number): void {
    const entry = this.cache.get(key) || {};
    entry.area = area;
    this.cache.set(key, entry);
  }

  /**
   * Path winding 캐싱
   */
  getWinding(key: string): number | undefined {
    const entry = this.cache.get(key);
    return entry?.winding;
  }

  setWinding(key: string, winding: number): void {
    const entry = this.cache.get(key) || {};
    entry.winding = winding;
    this.cache.set(key, entry);
  }

  /**
   * Simplified path points 캐싱
   */
  getSimplified(key: string): Point[] | undefined {
    const entry = this.cache.get(key);
    return entry?.simplified;
  }

  setSimplified(key: string, points: Point[]): void {
    const entry = this.cache.get(key) || {};
    entry.simplified = points;
    this.cache.set(key, entry);
  }

  /**
   * Flattened path points 캐싱
   */
  getFlattened(key: string): Point[] | undefined {
    const entry = this.cache.get(key);
    return entry?.flattened;
  }

  setFlattened(key: string, points: Point[]): void {
    const entry = this.cache.get(key) || {};
    entry.flattened = points;
    this.cache.set(key, entry);
  }

  /**
   * Path intersection points 캐싱
   */
  getIntersections(key: string): Point[] | undefined {
    const entry = this.cache.get(key);
    return entry?.intersections;
  }

  setIntersections(key: string, points: Point[]): void {
    const entry = this.cache.get(key) || {};
    entry.intersections = points;
    this.cache.set(key, entry);
  }

  /**
   * Path outline points 캐싱
   */
  getOutline(key: string): Point[] | undefined {
    const entry = this.cache.get(key);
    return entry?.outline;
  }

  setOutline(key: string, points: Point[]): void {
    const entry = this.cache.get(key) || {};
    entry.outline = points;
    this.cache.set(key, entry);
  }

  /**
   * Cache key builder 가져오기
   */
  getKeyBuilder(): PathCacheKeyBuilder {
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