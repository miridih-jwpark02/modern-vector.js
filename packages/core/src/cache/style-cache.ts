/**
 * Style property caching system
 */
import { Cache } from './cache';

/**
 * Style property types
 */
export enum StylePropertyType {
  COLOR = 'color',
  GRADIENT = 'gradient',
  PATTERN = 'pattern',
  STROKE = 'stroke',
  SHADOW = 'shadow',
  COMPOSITE = 'composite',
  FONT = 'font'
}

/**
 * Style value types
 */
type ColorValue = {
  type: 'color';
  value: string | number[];
  alpha?: number;
};

type GradientStop = {
  offset: number;
  color: string | number[];
  alpha?: number;
};

type GradientValue = {
  type: 'gradient';
  kind: 'linear' | 'radial';
  stops: GradientStop[];
  coords: number[];
};

type PatternValue = {
  type: 'pattern';
  source: string | ImageData;
  transform?: number[];
};

type StrokeValue = {
  width: number;
  cap: 'butt' | 'round' | 'square';
  join: 'miter' | 'round' | 'bevel';
  miterLimit: number;
  dash?: number[];
  dashOffset?: number;
};

type ShadowValue = {
  color: string | number[];
  blur: number;
  offset: [number, number];
};

type CompositeValue = {
  operation: string;
  alpha: number;
};

type FontValue = {
  family: string;
  size: number;
  weight?: string | number;
  style?: string;
};

type StyleValue = 
  | ColorValue 
  | GradientValue 
  | PatternValue 
  | StrokeValue 
  | ShadowValue 
  | CompositeValue 
  | FontValue;

/**
 * Style cache entry
 */
interface StyleCacheEntry {
  computed: any;
  timestamp: number;
  dependencies?: string[];
}

/**
 * Style cache key builder
 */
class StyleCacheKeyBuilder {
  private itemId: string = '';
  private property: string = '';
  private value: string[] = [];
  private context: string[] = [];

  /**
   * Item ID 설정
   */
  setItemId(id: string): this {
    this.itemId = id;
    return this;
  }

  /**
   * Property name 설정
   */
  setProperty(name: string): this {
    this.property = name;
    return this;
  }

  /**
   * Style value 추가
   */
  addValue(value: any): this {
    this.value.push(JSON.stringify(value));
    return this;
  }

  /**
   * Context value 추가
   */
  addContext(name: string, value: any): this {
    this.context.push(`${name}:${value}`);
    return this;
  }

  /**
   * Cache key 생성
   */
  build(): string {
    return [
      this.itemId,
      this.property,
      this.value.join('|'),
      this.context.join(';')
    ].join('#');
  }
}

/**
 * Style property cache manager
 */
export class StyleCache {
  private cache: Cache<StyleCacheEntry>;
  private keyBuilder: StyleCacheKeyBuilder;
  private dependencyGraph: Map<string, Set<string>>;

  constructor() {
    // 기본 캐시 정책으로 초기화
    this.cache = new Cache<StyleCacheEntry>({
      maxSize: 10 * 1024 * 1024, // 10MB
      maxItems: 2000,
      defaultTTL: 5 * 60 * 1000 // 5분
    });
    this.keyBuilder = new StyleCacheKeyBuilder();
    this.dependencyGraph = new Map();
  }

  /**
   * Computed style value 가져오기
   */
  getComputedStyle(key: string): any {
    const entry = this.cache.get(key);
    return entry?.computed;
  }

  /**
   * Computed style value 설정
   */
  setComputedStyle(key: string, value: any, dependencies?: string[]): void {
    const entry: StyleCacheEntry = {
      computed: value,
      timestamp: Date.now(),
      dependencies
    };

    // 의존성 그래프 업데이트
    if (dependencies) {
      this.updateDependencyGraph(key, dependencies);
    }

    this.cache.set(key, entry);
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
   * Cache key builder 가져오기
   */
  getKeyBuilder(): StyleCacheKeyBuilder {
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
 * Style computation helper
 */
export class StyleComputer {
  private cache: StyleCache;

  constructor(cache: StyleCache) {
    this.cache = cache;
  }

  /**
   * Color style 계산
   */
  computeColor(item: any, value: ColorValue): string {
    const key = this.cache.getKeyBuilder()
      .setItemId(item.id)
      .setProperty('color')
      .addValue(value)
      .build();

    let result = this.cache.getComputedStyle(key);
    if (!result) {
      result = this.calculateColor(value);
      this.cache.setComputedStyle(key, result);
    }
    return result;
  }

  /**
   * Gradient style 계산
   */
  computeGradient(item: any, value: GradientValue, context: CanvasRenderingContext2D): CanvasGradient {
    const key = this.cache.getKeyBuilder()
      .setItemId(item.id)
      .setProperty('gradient')
      .addValue(value)
      .addContext('canvas', context.canvas.id)
      .build();

    let result = this.cache.getComputedStyle(key);
    if (!result) {
      result = this.calculateGradient(value, context);
      this.cache.setComputedStyle(key, result);
    }
    return result;
  }

  /**
   * Pattern style 계산
   */
  computePattern(item: any, value: PatternValue, context: CanvasRenderingContext2D): CanvasPattern | null {
    const key = this.cache.getKeyBuilder()
      .setItemId(item.id)
      .setProperty('pattern')
      .addValue(value)
      .addContext('canvas', context.canvas.id)
      .build();

    let result = this.cache.getComputedStyle(key);
    if (!result) {
      result = this.calculatePattern(value, context);
      this.cache.setComputedStyle(key, result);
    }
    return result;
  }

  /**
   * Stroke style 계산
   */
  computeStroke(item: any, value: StrokeValue): void {
    const key = this.cache.getKeyBuilder()
      .setItemId(item.id)
      .setProperty('stroke')
      .addValue(value)
      .build();

    let result = this.cache.getComputedStyle(key);
    if (!result) {
      result = this.calculateStroke(value);
      this.cache.setComputedStyle(key, result);
    }
    return result;
  }

  /**
   * Shadow style 계산
   */
  computeShadow(item: any, value: ShadowValue): void {
    const key = this.cache.getKeyBuilder()
      .setItemId(item.id)
      .setProperty('shadow')
      .addValue(value)
      .build();

    let result = this.cache.getComputedStyle(key);
    if (!result) {
      result = this.calculateShadow(value);
      this.cache.setComputedStyle(key, result);
    }
    return result;
  }

  /**
   * Font style 계산
   */
  computeFont(item: any, value: FontValue): string {
    const key = this.cache.getKeyBuilder()
      .setItemId(item.id)
      .setProperty('font')
      .addValue(value)
      .build();

    let result = this.cache.getComputedStyle(key);
    if (!result) {
      result = this.calculateFont(value);
      this.cache.setComputedStyle(key, result);
    }
    return result;
  }

  /**
   * Color 실제 계산
   */
  private calculateColor(value: ColorValue): string {
    if (typeof value.value === 'string') {
      return value.alpha !== undefined 
        ? `rgba(${value.value},${value.alpha})`
        : value.value;
    } else {
      const [r, g, b] = value.value;
      return value.alpha !== undefined
        ? `rgba(${r},${g},${b},${value.alpha})`
        : `rgb(${r},${g},${b})`;
    }
  }

  /**
   * Gradient 실제 계산
   */
  private calculateGradient(value: GradientValue, context: CanvasRenderingContext2D): CanvasGradient {
    let gradient: CanvasGradient;
    
    if (value.kind === 'linear') {
      const [x1, y1, x2, y2] = value.coords;
      gradient = context.createLinearGradient(x1, y1, x2, y2);
    } else {
      const [x1, y1, r1, x2, y2, r2] = value.coords;
      gradient = context.createRadialGradient(x1, y1, r1, x2, y2, r2);
    }

    for (const stop of value.stops) {
      gradient.addColorStop(
        stop.offset,
        this.calculateColor({
          type: 'color',
          value: stop.color,
          alpha: stop.alpha
        })
      );
    }

    return gradient;
  }

  /**
   * Pattern 실제 계산
   */
  private calculatePattern(value: PatternValue, context: CanvasRenderingContext2D): CanvasPattern | null {
    let image: CanvasImageSource;
    
    if (typeof value.source === 'string') {
      // URL로부터 이미지 로드는 비동기이므로 실제 구현에서는 
      // Promise 기반으로 처리해야 함
      const img = new Image();
      img.src = value.source;
      image = img;
    } else {
      const canvas = document.createElement('canvas');
      canvas.width = value.source.width;
      canvas.height = value.source.height;
      const ctx = canvas.getContext('2d')!;
      ctx.putImageData(value.source, 0, 0);
      image = canvas;
    }

    const pattern = context.createPattern(image, 'repeat');
    if (pattern && value.transform) {
      const matrix = new DOMMatrix(value.transform);
      pattern.setTransform(matrix);
    }
    
    return pattern;
  }

  /**
   * Stroke 실제 계산
   */
  private calculateStroke(value: StrokeValue): StrokeValue {
    return {
      width: value.width,
      cap: value.cap,
      join: value.join,
      miterLimit: value.miterLimit,
      dash: value.dash,
      dashOffset: value.dashOffset
    };
  }

  /**
   * Shadow 실제 계산
   */
  private calculateShadow(value: ShadowValue): ShadowValue {
    return {
      color: value.color,
      blur: value.blur,
      offset: value.offset
    };
  }

  /**
   * Font 실제 계산
   */
  private calculateFont(value: FontValue): string {
    const parts = [];
    
    if (value.style) {
      parts.push(value.style);
    }
    if (value.weight) {
      parts.push(value.weight);
    }
    parts.push(`${value.size}px`);
    parts.push(value.family);

    return parts.join(' ');
  }
}