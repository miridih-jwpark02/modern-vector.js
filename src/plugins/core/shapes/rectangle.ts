import { Vector2D } from '../math/vector';
import { Matrix3x3 } from '../math/matrix';
import { Shape, ShapeStyle, Bounds, ShapeFactory, ShapeOptions } from './types';

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
export class Rectangle implements Shape {
  readonly id: string;
  readonly type: string = 'rectangle';
  readonly transform: Matrix3x3;
  readonly style: ShapeStyle;
  
  private _x: number;
  private _y: number;
  private _width: number;
  private _height: number;

  constructor(options: RectangleOptions = {}) {
    this.id = options.id || crypto.randomUUID();
    this.transform = options.transform || Matrix3x3.create();
    this.style = options.style || {};
    
    this._x = options.x || 0;
    this._y = options.y || 0;
    this._width = options.width || 0;
    this._height = options.height || 0;
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
    return new Rectangle({
      id: this.id,
      transform: matrix.multiply(this.transform),
      style: this.style,
      x: this._x,
      y: this._y,
      width: this._width,
      height: this._height
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
}

/**
 * Rectangle factory
 */
export class RectangleFactory implements ShapeFactory<Rectangle> {
  create(options: RectangleOptions): Rectangle {
    return new Rectangle(options);
  }
} 