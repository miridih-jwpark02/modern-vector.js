/**
 * 캐시 시스템 구현
 */
import {
  CachePolicy,
  CacheEntry,
  CacheStats,
  CacheEventType,
  CacheEventListener,
  SizeCalculator,
  CacheSerializer
} from './types';

/**
 * 기본 캐시 정책
 */
const DEFAULT_POLICY: CachePolicy = {
  maxSize: 50 * 1024 * 1024, // 50MB
  defaultTTL: 5 * 60 * 1000, // 5분
  maxItems: 1000,
  cleanupThreshold: 0.75
};

/**
 * 기본 크기 계산기
 */
function defaultSizeCalculator<T>(data: T): number {
  if (typeof data === 'string') {
    return data.length * 2; // UTF-16
  }
  if (data instanceof ArrayBuffer) {
    return data.byteLength;
  }
  if (ArrayBuffer.isView(data)) {
    return data.byteLength;
  }
  return JSON.stringify(data).length * 2;
}

/**
 * 기본 직렬화기
 */
const defaultSerializer: CacheSerializer<any> = {
  serialize: (data: any) => JSON.stringify(data),
  deserialize: (data: string) => JSON.parse(data)
};

/**
 * 캐시 구현
 */
export class Cache<T> {
  private cache: Map<string, CacheEntry<T>>;
  private policy: CachePolicy;
  private stats: CacheStats;
  private listeners: Set<CacheEventListener<T>>;
  private sizeCalculator: SizeCalculator<T>;
  private serializer: CacheSerializer<T>;
  private cleanupTimer?: number;

  constructor(
    policy: Partial<CachePolicy> = {},
    sizeCalculator?: SizeCalculator<T>,
    serializer?: CacheSerializer<T>
  ) {
    this.cache = new Map();
    this.policy = { ...DEFAULT_POLICY, ...policy };
    this.stats = {
      totalItems: 0,
      totalSize: 0,
      hits: 0,
      misses: 0,
      evictions: 0
    };
    this.listeners = new Set();
    this.sizeCalculator = sizeCalculator || defaultSizeCalculator;
    this.serializer = serializer || defaultSerializer;

    // 주기적 정리 시작
    this.startCleanup();
  }

  /**
   * 캐시에 항목 추가
   */
  set(key: string, data: T, ttl?: number): void {
    const size = this.sizeCalculator(data);
    const now = Date.now();

    // 공간 확보가 필요한 경우
    if (this.stats.totalSize + size > this.policy.maxSize ||
        this.stats.totalItems + 1 > this.policy.maxItems) {
      this.cleanup();
    }

    // 여전히 공간이 부족한 경우 가장 오래된 항목 제거
    if (this.stats.totalSize + size > this.policy.maxSize ||
        this.stats.totalItems + 1 > this.policy.maxItems) {
      this.evictOldest();
    }

    const entry: CacheEntry<T> = {
      data,
      metadata: {
        timestamp: now,
        ttl: ttl || this.policy.defaultTTL,
        size,
        hits: 0
      }
    };

    this.cache.set(key, entry);
    this.stats.totalItems++;
    this.stats.totalSize += size;

    this.emit({
      type: CacheEventType.ADDED,
      key,
      data,
      metadata: entry.metadata
    });
  }

  /**
   * 캐시에서 항목 조회
   */
  get(key: string): T | undefined {
    const entry = this.cache.get(key);
    if (!entry) {
      this.stats.misses++;
      return undefined;
    }

    // 만료 확인
    if (this.isExpired(entry)) {
      this.delete(key);
      this.stats.misses++;
      return undefined;
    }

    entry.metadata.hits++;
    this.stats.hits++;
    return entry.data;
  }

  /**
   * 캐시에서 항목 삭제
   */
  delete(key: string): boolean {
    const entry = this.cache.get(key);
    if (!entry) return false;

    this.cache.delete(key);
    this.stats.totalItems--;
    this.stats.totalSize -= entry.metadata.size;

    this.emit({
      type: CacheEventType.REMOVED,
      key,
      data: entry.data,
      metadata: entry.metadata
    });

    return true;
  }

  /**
   * 캐시 전체 삭제
   */
  clear(): void {
    this.cache.clear();
    this.stats.totalItems = 0;
    this.stats.totalSize = 0;
    this.emit({ type: CacheEventType.CLEANUP, key: '*' });
  }

  /**
   * 캐시 통계 조회
   */
  getStats(): CacheStats {
    return { ...this.stats };
  }

  /**
   * 이벤트 리스너 등록
   */
  addEventListener(listener: CacheEventListener<T>): void {
    this.listeners.add(listener);
  }

  /**
   * 이벤트 리스너 제거
   */
  removeEventListener(listener: CacheEventListener<T>): void {
    this.listeners.delete(listener);
  }

  /**
   * 캐시 정리
   */
  private cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (this.isExpired(entry)) {
        this.delete(key);
      }
    }
  }

  /**
   * 가장 오래된 항목 제거
   */
  private evictOldest(): void {
    let oldestKey: string | undefined;
    let oldestTime = Infinity;

    for (const [key, entry] of this.cache.entries()) {
      if (entry.metadata.timestamp < oldestTime) {
        oldestTime = entry.metadata.timestamp;
        oldestKey = key;
      }
    }

    if (oldestKey) {
      this.delete(oldestKey);
      this.stats.evictions++;
    }
  }

  /**
   * 항목 만료 여부 확인
   */
  private isExpired(entry: CacheEntry<T>): boolean {
    return Date.now() >= entry.metadata.timestamp + entry.metadata.ttl;
  }

  /**
   * 이벤트 발생
   */
  private emit(event: any): void {
    for (const listener of this.listeners) {
      try {
        listener(event);
      } catch (error) {
        console.error('Error in cache event listener:', error);
      }
    }
  }

  /**
   * 주기적 정리 시작
   */
  private startCleanup(): void {
    this.cleanupTimer = setInterval(() => {
      if (this.stats.totalSize > this.policy.maxSize * this.policy.cleanupThreshold ||
          this.stats.totalItems > this.policy.maxItems * this.policy.cleanupThreshold) {
        this.cleanup();
      }
    }, 60000) as unknown as number; // 1분마다 체크
  }

  /**
   * 캐시 정리 및 리소스 해제
   */
  dispose(): void {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
    }
    this.clear();
    this.listeners.clear();
  }
}