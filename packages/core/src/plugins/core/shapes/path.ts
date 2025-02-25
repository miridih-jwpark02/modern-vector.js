import { Vector2D } from '../math/vector';
import { Matrix3x3 } from '../math/matrix';
import { Shape, ShapeStyle, Bounds, ShapeFactory, ShapeOptions } from './types';
import { AbstractShape } from './abstract-shape';

/**
 * Path의 각 점을 표현하는 인터페이스
 */
export interface PathPoint {
  /** 점의 x 좌표 */
  x: number;
  /** 점의 y 좌표 */
  y: number;
  /** 점의 타입 (이동 또는 선) */
  type: 'move' | 'line';
}

/**
 * Path shape options
 */
export interface PathOptions extends ShapeOptions {
  /** Path를 구성하는 점들의 배열 */
  points?: PathPoint[];
  /** Path를 닫힌 경로로 생성할지 여부 */
  closed?: boolean;
}

/**
 * Path shape implementation
 */
export class Path extends AbstractShape {
  private _points: PathPoint[];

  constructor(options: PathOptions = {}) {
    super('path', options);
    
    this._points = options.points || [];
    
    // closed 옵션이 true인 경우 경로 닫기
    if (options.closed) {
      this.closePath();
    }
  }

  /**
   * Path 닫기
   * 첫 번째 점과 마지막 점을 연결하여 닫힌 경로를 만듭니다.
   * @returns 현재 Path 인스턴스
   */
  closePath(): Path {
    if (this._points.length < 2) {
      return this; // 점이 2개 미만이면 닫을 수 없음
    }

    const firstPoint = this._points[0];
    const lastPoint = this._points[this._points.length - 1];

    // 이미 닫혀있는지 확인 (마지막 점이 첫 번째 점과 같은 위치인지)
    if (lastPoint.x === firstPoint.x && lastPoint.y === firstPoint.y) {
      return this; // 이미 닫혀있음
    }

    // 첫 번째 점과 같은 위치에 line 타입의 점 추가
    this._points.push({
      x: firstPoint.x,
      y: firstPoint.y,
      type: 'line'
    });

    return this;
  }

  /**
   * Path에 점 추가
   * @param x - 점의 x 좌표
   * @param y - 점의 y 좌표
   * @param type - 점의 타입 (이동 또는 선)
   */
  addPoint(x: number, y: number, type: 'move' | 'line' = 'line'): void {
    this._points.push({ x, y, type });
  }

  /**
   * Path의 모든 점 가져오기
   */
  get points(): PathPoint[] {
    return [...this._points];
  }

  /**
   * Path가 닫혀있는지 확인
   * 첫 번째 점과 마지막 점이 같은 위치에 있으면 닫힌 경로로 간주합니다.
   */
  get isClosed(): boolean {
    if (this._points.length < 3) {
      return false; // 점이 3개 미만이면 닫힌 경로가 될 수 없음
    }

    const firstPoint = this._points[0];
    const lastPoint = this._points[this._points.length - 1];

    return lastPoint.x === firstPoint.x && lastPoint.y === firstPoint.y;
  }

  /**
   * Path를 Path points로 변환
   * @returns Path points
   */
  toPath(): PathPoint[] {
    return [...this._points];
  }

  protected getLocalBounds(): Bounds {
    if (this._points.length === 0) {
      return { x: 0, y: 0, width: 0, height: 0 };
    }

    let minX = this._points[0].x;
    let minY = this._points[0].y;
    let maxX = this._points[0].x;
    let maxY = this._points[0].y;

    for (let i = 1; i < this._points.length; i++) {
      const point = this._points[i];
      minX = Math.min(minX, point.x);
      minY = Math.min(minY, point.y);
      maxX = Math.max(maxX, point.x);
      maxY = Math.max(maxY, point.y);
    }

    return {
      x: minX,
      y: minY,
      width: maxX - minX,
      height: maxY - minY
    };
  }

  get bounds(): Bounds {
    if (this._points.length === 0) {
      return { x: 0, y: 0, width: 0, height: 0 };
    }

    // Transform 적용된 모든 점 계산
    const transformedPoints = this._points.map(p => {
      const transformed = this.transform.multiply(Matrix3x3.translation(p.x, p.y));
      return {
        x: transformed.values[2],
        y: transformed.values[5]
      };
    });

    let minX = transformedPoints[0].x;
    let minY = transformedPoints[0].y;
    let maxX = transformedPoints[0].x;
    let maxY = transformedPoints[0].y;

    for (let i = 1; i < transformedPoints.length; i++) {
      const point = transformedPoints[i];
      minX = Math.min(minX, point.x);
      minY = Math.min(minY, point.y);
      maxX = Math.max(maxX, point.x);
      maxY = Math.max(maxY, point.y);
    }

    return {
      x: minX,
      y: minY,
      width: maxX - minX,
      height: maxY - minY
    };
  }

  clone(): Shape {
    const clonedPath = new Path({
      id: crypto.randomUUID(),
      transform: Matrix3x3.create(this.transform.values),
      style: { ...this.style },
      points: [...this._points],
      scaleOrigin: this.scaleOrigin,
      customScaleOriginPoint: this.customScaleOrigin
    });
    
    return clonedPath;
  }

  applyTransform(matrix: Matrix3x3): Shape {
    // Scale 변환인 경우 지정된 기준점을 사용
    const scale = this.getTransformScale(matrix);
    if (scale.scaleX !== 1 || scale.scaleY !== 1) {
      let origin;
      const bounds = this.getLocalBounds();
      switch (this.scaleOrigin) {
        case 'center':
          origin = {
            x: bounds.x + bounds.width / 2,
            y: bounds.y + bounds.height / 2
          };
          break;
        case 'custom':
          origin = this.customScaleOrigin || {
            x: bounds.x,
            y: bounds.y
          };
          break;
        default:
          origin = {
            x: bounds.x,
            y: bounds.y
          };
      }
      const transformedPath = new Path({
        id: this.id,
        transform: this.getTransformAroundPoint(matrix, origin.x, origin.y),
        style: { ...this.style },
        points: [...this._points],
        scaleOrigin: this.scaleOrigin,
        customScaleOriginPoint: this.customScaleOrigin
      });
      
      return transformedPath;
    }

    // Scale이 아닌 변환은 기존 transform에 직접 적용
    const transformedPath = new Path({
      id: this.id,
      transform: matrix.multiply(this.transform),
      style: { ...this.style },
      points: [...this._points],
      scaleOrigin: this.scaleOrigin,
      customScaleOriginPoint: this.customScaleOrigin
    });
    
    return transformedPath;
  }

  containsPoint(point: Vector2D): boolean {
    // Transform point to local coordinates
    const inverse = this.transform.inverse();
    const local = inverse.multiply(Matrix3x3.translation(point.x, point.y));
    const x = local.values[2];
    const y = local.values[5];

    // Path의 각 선분에 대해 점과의 거리 계산
    for (let i = 1; i < this._points.length; i++) {
      if (this._points[i].type === 'move') continue;

      const p1 = this._points[i - 1];
      const p2 = this._points[i];

      // Line segment의 방정식을 이용한 점과의 거리 계산
      const dx = p2.x - p1.x;
      const dy = p2.y - p1.y;
      const length = Math.sqrt(dx * dx + dy * dy);
      
      if (length === 0) continue;

      // 점과 직선 사이의 거리 계산
      const t = ((x - p1.x) * dx + (y - p1.y) * dy) / (length * length);
      
      // Line segment 범위 안에 있고, 거리가 1px 이하인 경우
      if (t >= 0 && t <= 1) {
        const distance = Math.abs(
          (p2.x - p1.x) * (p1.y - y) -
          (p1.x - x) * (p2.y - p1.y)
        ) / length;

        if (distance <= 1) {
          return true;
        }
      }
    }

    return false;
  }

  intersects(other: Shape): boolean {
    // Simple bounds intersection check
    const b1 = this.bounds;
    const b2 = other.bounds;

    return !(
      b2.x > b1.x + b1.width ||
      b2.x + b2.width < b1.x ||
      b2.y > b1.y + b1.height ||
      b2.y + b2.height < b1.y
    );
  }
}

/**
 * Path factory
 */
export class PathFactory implements ShapeFactory<Path> {
  create(options: PathOptions): Path {
    return new Path(options);
  }
} 