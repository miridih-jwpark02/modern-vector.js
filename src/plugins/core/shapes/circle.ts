import { Vector2D } from '../math/vector';
import { Matrix3x3 } from '../math/matrix';
import { Shape, ShapeStyle, Bounds, ShapeFactory, ShapeOptions } from './types';

/**
 * Circle shape options
 */
export interface CircleOptions extends ShapeOptions {
  /** Circle의 중심 x 좌표 */
  centerX?: number;
  /** Circle의 중심 y 좌표 */
  centerY?: number;
  /** Circle의 반지름 */
  radius?: number;
}

/**
 * Circle shape implementation
 */
export class Circle implements Shape {
  readonly id: string;
  readonly type: string = 'circle';
  readonly transform: Matrix3x3;
  readonly style: ShapeStyle;
  
  private _centerX: number;
  private _centerY: number;
  private _radius: number;

  constructor(options: CircleOptions = {}) {
    this.id = options.id || crypto.randomUUID();
    this.transform = options.transform || Matrix3x3.create();
    this.style = options.style || {};
    
    this._centerX = options.centerX || 0;
    this._centerY = options.centerY || 0;
    this._radius = options.radius || 0;
  }

  get bounds(): Bounds {
    // Transform 적용된 center point 계산
    const center = this.transform.multiply(Matrix3x3.translation(this._centerX, this._centerY));
    const transformedX = center.values[2];
    const transformedY = center.values[5];

    // Scale 행렬 추출하여 radius 계산
    const scaleX = Math.sqrt(
      this.transform.values[0] * this.transform.values[0] +
      this.transform.values[1] * this.transform.values[1]
    );
    const scaleY = Math.sqrt(
      this.transform.values[3] * this.transform.values[3] +
      this.transform.values[4] * this.transform.values[4]
    );
    const transformedRadius = Math.max(scaleX, scaleY) * this._radius;

    return {
      x: transformedX - transformedRadius,
      y: transformedY - transformedRadius,
      width: transformedRadius * 2,
      height: transformedRadius * 2
    };
  }

  clone(): Shape {
    return new Circle({
      id: crypto.randomUUID(),
      transform: Matrix3x3.create(this.transform.values),
      style: { ...this.style },
      centerX: this._centerX,
      centerY: this._centerY,
      radius: this._radius
    });
  }

  applyTransform(matrix: Matrix3x3): Shape {
    // 중심점을 기준으로 변환 적용
    const centerTransform = Matrix3x3.translation(this._centerX, this._centerY);
    const inverseCenterTransform = Matrix3x3.translation(-this._centerX, -this._centerY);
    
    const finalTransform = centerTransform
      .multiply(matrix)
      .multiply(inverseCenterTransform)
      .multiply(this.transform);

    return new Circle({
      id: this.id,
      transform: finalTransform,
      style: this.style,
      centerX: this._centerX,
      centerY: this._centerY,
      radius: this._radius
    });
  }

  containsPoint(point: Vector2D): boolean {
    // Transform center point to world coordinates
    const worldCenter = this.transform.multiply(Matrix3x3.translation(this._centerX, this._centerY));
    const centerX = worldCenter.values[2];
    const centerY = worldCenter.values[5];

    // Calculate distance in world coordinates
    const dx = point.x - centerX;
    const dy = point.y - centerY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Scale 행렬 추출하여 radius 계산
    const scaleX = Math.sqrt(
      this.transform.values[0] * this.transform.values[0] +
      this.transform.values[1] * this.transform.values[1]
    );
    const scaleY = Math.sqrt(
      this.transform.values[3] * this.transform.values[3] +
      this.transform.values[4] * this.transform.values[4]
    );
    const transformedRadius = Math.max(scaleX, scaleY) * this._radius;

    return distance <= transformedRadius;
  }

  intersects(other: Shape): boolean {
    // Simple bounds intersection check for now
    // 더 정확한 circle-specific 교차 검사는 나중에 구현
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
 * Circle factory
 */
export class CircleFactory implements ShapeFactory<Circle> {
  create(options: CircleOptions): Circle {
    return new Circle(options);
  }
} 