/**
 * 캐시 시스템 타입 정의
 */

/**
 * 캐시 항목의 메타데이터
 */
export interface CacheMetadata {
  /** 캐시 생성 시간 */
  timestamp: number;
  /** 캐시 만료 시간 (밀리초) */
  ttl: number;
  /** 캐시 크기 (바이트) */
  size: number;
  /** 캐시 접근 횟수 */
  hits: number;
}

/**
 * 캐시 정책 설정
 */
export interface CachePolicy {
  /** 최대 캐시 크기 (바이트) */
  maxSize: number;
  /** 기본 TTL (밀리초) */
  defaultTTL: number;
  /** 최대 항목 수 */
  maxItems: number;
  /** 자동 정리 임계값 (0-1) */
  cleanupThreshold: number;
}

/**
 * 캐시 항목
 */
export interface CacheEntry<T> {
  /** 캐시된 데이터 */
  data: T;
  /** 메타데이터 */
  metadata: CacheMetadata;
}

/**
 * 캐시 통계
 */
export interface CacheStats {
  /** 총 항목 수 */
  totalItems: number;
  /** 총 크기 (바이트) */
  totalSize: number;
  /** 캐시 히트 수 */
  hits: number;
  /** 캐시 미스 수 */
  misses: number;
  /** 제거된 항목 수 */
  evictions: number;
}

/**
 * 캐시 이벤트 타입
 */
export enum CacheEventType {
  /** 항목 추가 */
  ADDED = 'added',
  /** 항목 제거 */
  REMOVED = 'removed',
  /** 항목 만료 */
  EXPIRED = 'expired',
  /** 캐시 정리 */
  CLEANUP = 'cleanup'
}

/**
 * 캐시 이벤트
 */
export interface CacheEvent<T> {
  /** 이벤트 타입 */
  type: CacheEventType;
  /** 관련 키 */
  key: string;
  /** 관련 데이터 */
  data?: T;
  /** 메타데이터 */
  metadata?: CacheMetadata;
}

/**
 * 캐시 이벤트 리스너
 */
export type CacheEventListener<T> = (event: CacheEvent<T>) => void;

/**
 * 캐시 크기 계산기
 */
export type SizeCalculator<T> = (data: T) => number;

/**
 * 캐시 직렬화기
 */
export interface CacheSerializer<T> {
  /** 직렬화 */
  serialize: (data: T) => string;
  /** 역직렬화 */
  deserialize: (data: string) => T;
}