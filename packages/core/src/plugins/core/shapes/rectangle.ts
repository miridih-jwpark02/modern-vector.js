import { Vector2D } from '../math/vector';
import { Matrix3x3 } from '../math/matrix';
import { Shape, ShapeStyle, Bounds, ShapeFactory, ShapeOptions } from './types';
import { AbstractShape } from './abstract-shape';
import { PathPoint } from './path/types';

/**
 * Rectangle shape options
 */
export interface RectangleOptions extends ShapeOptions {
  /** Rectangle의 x 좌표 */
  x?: number;
  /** Rectangle의 y 좌표 */
  y?: number;
  /** Rectangle의 너비 */
  width?: number;
  /** Rectangle의 높이 */
  height?: number;
}

/**
 * Rectangle shape implementation
 */
export class Rectangle extends AbstractShape {
  private _x: number;
  private _y: number;
  private _width: number;
  private _height: number;

  constructor(options: RectangleOptions = {}) {
    super('rectangle', options);
    
    this._x = options.x || 0;
    this._y = options.y || 0;
    this._width = options.width || 0;
    this._height = options.height || 0;
  }

  protected getLocalBounds(): Bounds {
    return {
      x: this._x,
      y: this._y,
      width: this._width,
      height: this._height
    };
  }

  get bounds(): Bounds {
    // Transform 적용된 corner points 계산
    const corners = [
      Vector2D.create(this._x, this._y),
      Vector2D.create(this._x + this._width, this._y),
      Vector2D.create(this._x + this._width, this._y + this._height),
      Vector2D.create(this._x, this._y + this._height)
    ].map(p => {
      const transformed = this.transform.multiply(Matrix3x3.translation(p.x, p.y));
      return Vector2D.create(transformed.values[2], transformed.values[5]);
    });

    // Find min/max points
    const xs = corners.map(p => p.x);
    const ys = corners.map(p => p.y);
    const minX = Math.min(...xs);
    const minY = Math.min(...ys);
    const maxX = Math.max(...xs);
    const maxY = Math.max(...ys);

    return {
      x: minX,
      y: minY,
      width: maxX - minX,
      height: maxY - minY
    };
  }

  clone(): Shape {
    return new Rectangle({
      id: crypto.randomUUID(),
      transform: Matrix3x3.create(this.transform.values),
      style: { ...this.style },
      x: this._x,
      y: this._y,
      width: this._width,
      height: this._height
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
            x: this._x + this._width / 2,
            y: this._y + this._height / 2
          };
          break;
        case 'custom':
          origin = this.customScaleOrigin || {
            x: this._x,
            y: this._y
          };
          break;
        default:
          origin = {
            x: this._x,
            y: this._y
          };
      }
      return new Rectangle({
        id: this.id,
        transform: this.getTransformAroundPoint(matrix, origin.x, origin.y),
        style: { ...this.style },
        x: this._x,
        y: this._y,
        width: this._width,
        height: this._height,
        scaleOrigin: this.scaleOrigin,
        customScaleOriginPoint: this.customScaleOrigin
      });
    }

    // Scale이 아닌 변환은 기존 transform에 직접 적용
    return new Rectangle({
      id: this.id,
      transform: matrix.multiply(this.transform),
      style: { ...this.style },
      x: this._x,
      y: this._y,
      width: this._width,
      height: this._height,
      scaleOrigin: this.scaleOrigin,
      customScaleOriginPoint: this.customScaleOrigin
    });
  }

  containsPoint(point: Vector2D): boolean {
    // Transform point to local coordinates
    const inverse = this.transform.inverse();
    const local = inverse.multiply(Matrix3x3.translation(point.x, point.y));
    const x = local.values[2];
    const y = local.values[5];

    return (
      x >= this._x &&
      x <= this._x + this._width &&
      y >= this._y &&
      y <= this._y + this._height
    );
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
   * Rectangle을 Path로 변환
   * @returns Path points
   */
  toPath(): PathPoint[] {
    const bounds = this.bounds;
    return [
      { x: bounds.x, y: bounds.y, type: 'move' },
      { x: bounds.x + bounds.width, y: bounds.y, type: 'line' },
      { x: bounds.x + bounds.width, y: bounds.y + bounds.height, type: 'line' },
      { x: bounds.x, y: bounds.y + bounds.height, type: 'line' },
      { x: bounds.x, y: bounds.y, type: 'line' }
    ];
  }
}

/**
 * Rectangle factory
 */
export class RectangleFactory implements ShapeFactory<Rectangle> {
  create(options: RectangleOptions): Rectangle {
    return new Rectangle(options);
  }
} 