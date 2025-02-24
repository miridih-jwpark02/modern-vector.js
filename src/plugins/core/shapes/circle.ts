import { Vector2D } from '../math/vector';
import { Matrix3x3 } from '../math/matrix';
import { Shape, ShapeStyle, Bounds, ShapeFactory, ShapeOptions } from './types';
import { AbstractShape } from './abstract-shape';
import { PathPoint } from './path/types';

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
export class Circle extends AbstractShape {
  private _centerX: number;
  private _centerY: number;
  private _radius: number;

  constructor(options: CircleOptions = {}) {
    super('circle', options);
    
    this._centerX = options.centerX || 0;
    this._centerY = options.centerY || 0;
    this._radius = options.radius || 0;
  }

  protected getLocalBounds(): Bounds {
    return {
      x: this._centerX - this._radius,
      y: this._centerY - this._radius,
      width: this._radius * 2,
      height: this._radius * 2
    };
  }

  get bounds(): Bounds {
    // Transform 적용된 center point 계산
    const center = this.transform.multiply(Matrix3x3.translation(this._centerX, this._centerY));
    const transformedX = center.values[2];
    const transformedY = center.values[5];

    // Scale 행렬 추출하여 radius 계산
    const { scaleX, scaleY } = this.getTransformScale();
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
    // Scale 변환인 경우 지정된 기준점을 사용
    const scale = this.getTransformScale(matrix);
    if (scale.scaleX !== 1 || scale.scaleY !== 1) {
      let origin;
      switch (this.scaleOrigin) {
        case 'center':
          origin = {
            x: this._centerX,
            y: this._centerY
          };
          break;
        case 'custom':
          origin = this.customScaleOrigin || {
            x: this._centerX - this._radius,
            y: this._centerY - this._radius
          };
          break;
        default:
          origin = {
            x: this._centerX - this._radius,
            y: this._centerY - this._radius
          };
      }
      return new Circle({
        id: this.id,
        transform: this.getTransformAroundPoint(matrix, origin.x, origin.y),
        style: { ...this.style },
        centerX: this._centerX,
        centerY: this._centerY,
        radius: this._radius,
        scaleOrigin: this.scaleOrigin,
        customScaleOriginPoint: this.customScaleOrigin
      });
    }

    // Scale이 아닌 변환은 기존 transform에 직접 적용
    return new Circle({
      id: this.id,
      transform: matrix.multiply(this.transform),
      style: { ...this.style },
      centerX: this._centerX,
      centerY: this._centerY,
      radius: this._radius,
      scaleOrigin: this.scaleOrigin,
      customScaleOriginPoint: this.customScaleOrigin
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
    const { scaleX, scaleY } = this.getTransformScale();
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

  /**
   * Circle을 Path로 변환
   * @param segments - 원을 근사할 선분의 수 (기본값: 32)
   * @returns Path points
   */
  toPath(segments: number = 32): PathPoint[] {
    const bounds = this.bounds;
    const centerX = bounds.x + bounds.width / 2;
    const centerY = bounds.y + bounds.height / 2;
    const radius = bounds.width / 2;
    const points: PathPoint[] = [];

    // 첫 점은 move
    points.push({
      x: centerX + radius,
      y: centerY,
      type: 'move'
    });

    // 나머지 점들은 line
    for (let i = 1; i <= segments; i++) {
      const angle = (i * 2 * Math.PI) / segments;
      points.push({
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle),
        type: 'line'
      });
    }

    // 마지막 점은 시작점과 같게
    points.push({
      x: centerX + radius,
      y: centerY,
      type: 'line'
    });

    return points;
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