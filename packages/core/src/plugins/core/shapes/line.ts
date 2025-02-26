import { Vector2D } from '../math/vector';
import { Matrix3x3 } from '../math/matrix';
import { Shape, ShapeStyle, Bounds, ShapeFactory, ShapeOptions } from './types';
import { AbstractShape } from './abstract-shape';
import { PathPoint } from './path/types';

/**
 * Line shape options
 */
export interface LineOptions extends ShapeOptions {
  /** Line의 시작점 x 좌표 */
  x1?: number;
  /** Line의 시작점 y 좌표 */
  y1?: number;
  /** Line의 끝점 x 좌표 */
  x2?: number;
  /** Line의 끝점 y 좌표 */
  y2?: number;
}

/**
 * Line shape implementation
 */
export class Line extends AbstractShape {
  private _x1: number;
  private _y1: number;
  private _x2: number;
  private _y2: number;

  constructor(options: LineOptions = {}) {
    super('line', options);

    this._x1 = options.x1 || 0;
    this._y1 = options.y1 || 0;
    this._x2 = options.x2 || 0;
    this._y2 = options.y2 || 0;
  }

  protected getLocalBounds(): Bounds {
    return {
      x: Math.min(this._x1, this._x2),
      y: Math.min(this._y1, this._y2),
      width: Math.abs(this._x2 - this._x1),
      height: Math.abs(this._y2 - this._y1),
    };
  }

  get bounds(): Bounds {
    // Transform 적용된 corner points 계산
    const p1 = this.transform.multiply(Matrix3x3.translation(this._x1, this._y1));
    const p2 = this.transform.multiply(Matrix3x3.translation(this._x2, this._y2));

    const x1 = p1.values[2];
    const y1 = p1.values[5];
    const x2 = p2.values[2];
    const y2 = p2.values[5];

    return {
      x: Math.min(x1, x2),
      y: Math.min(y1, y2),
      width: Math.abs(x2 - x1),
      height: Math.abs(y2 - y1),
    };
  }

  clone(): Shape {
    return new Line({
      id: crypto.randomUUID(),
      transform: Matrix3x3.create(this.transform.values),
      style: { ...this.style },
      x1: this._x1,
      y1: this._y1,
      x2: this._x2,
      y2: this._y2,
      scaleOrigin: this.scaleOrigin,
      customScaleOriginPoint: this.customScaleOrigin,
    });
  }

  applyTransform(matrix: Matrix3x3): Shape {
    // Scale 변환인 경우 지정된 기준점을 사용
    const scale = this.getTransformScale(matrix);
    if (scale.scaleX !== 1 || scale.scaleY !== 1) {
      let origin;
      switch (this.scaleOrigin) {
        case 'center':
          origin = {
            x: (this._x1 + this._x2) / 2,
            y: (this._y1 + this._y2) / 2,
          };
          break;
        case 'custom':
          origin = this.customScaleOrigin || {
            x: Math.min(this._x1, this._x2),
            y: Math.min(this._y1, this._y2),
          };
          break;
        default:
          origin = {
            x: Math.min(this._x1, this._x2),
            y: Math.min(this._y1, this._y2),
          };
      }
      return new Line({
        id: this.id,
        transform: this.getTransformAroundPoint(matrix, origin.x, origin.y),
        style: { ...this.style },
        x1: this._x1,
        y1: this._y1,
        x2: this._x2,
        y2: this._y2,
        scaleOrigin: this.scaleOrigin,
        customScaleOriginPoint: this.customScaleOrigin,
      });
    }

    // Scale이 아닌 변환은 기존 transform에 직접 적용
    return new Line({
      id: this.id,
      transform: matrix.multiply(this.transform),
      style: { ...this.style },
      x1: this._x1,
      y1: this._y1,
      x2: this._x2,
      y2: this._y2,
      scaleOrigin: this.scaleOrigin,
      customScaleOriginPoint: this.customScaleOrigin,
    });
  }

  containsPoint(point: Vector2D): boolean {
    // Transform points to local coordinates
    const inverse = this.transform.inverse();
    const local = inverse.multiply(Matrix3x3.translation(point.x, point.y));
    const x = local.values[2];
    const y = local.values[5];

    // Line segment의 방정식을 이용한 점과의 거리 계산
    const dx = this._x2 - this._x1;
    const dy = this._y2 - this._y1;
    const length = Math.sqrt(dx * dx + dy * dy);

    if (length === 0) {
      // Line이 점인 경우
      return x === this._x1 && y === this._y1;
    }

    // 점과 직선 사이의 거리 계산
    const t = ((x - this._x1) * dx + (y - this._y1) * dy) / (length * length);

    // Line segment 범위 밖인 경우
    if (t < 0 || t > 1) {
      return false;
    }

    // 점과 직선 사이의 거리가 1px 이하인 경우 포함으로 간주
    const distance =
      Math.abs((this._x2 - this._x1) * (this._y1 - y) - (this._x1 - x) * (this._y2 - this._y1)) /
      length;

    return distance <= 1;
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

  /**
   * Line을 Path로 변환
   * @returns Path points
   */
  toPath(): PathPoint[] {
    const bounds = this.bounds;
    return [
      { x: bounds.x, y: bounds.y, type: 'move' },
      { x: bounds.x + bounds.width, y: bounds.y + bounds.height, type: 'line' },
    ];
  }
}

/**
 * Line factory
 */
export class LineFactory implements ShapeFactory<Line> {
  create(options: LineOptions): Line {
    return new Line(options);
  }
}
