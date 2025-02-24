/**
 * 원 도형 구현
 */
import { Vector2D } from '../../core/math/vector';
import { Path } from '../path';
import { BaseShape, Shape } from './shape';

export class Circle extends BaseShape {
  constructor(
    center: Vector2D,
    private _radius: number
  ) {
    super(center);
  }

  /**
   * 원의 반지름
   */
  get radius(): number {
    // 변환 행렬의 스케일을 고려한 실제 반지름
    const scaleX = this.transform.getScaleX();
    const scaleY = this.transform.getScaleY();
    return this._radius * Math.sqrt((scaleX * scaleX + scaleY * scaleY) / 2);
  }

  set radius(value: number) {
    this._radius = value;
  }

  /**
   * 원의 지름
   */
  get diameter(): number {
    return this.radius * 2;
  }

  set diameter(value: number) {
    this.radius = value / 2;
  }

  /**
   * 원의 경계 상자
   */
  get bounds(): { x: number; y: number; width: number; height: number } {
    const transformedCenter = this.center;
    const radius = this.radius;

    return {
      x: transformedCenter.x - radius,
      y: transformedCenter.y - radius,
      width: radius * 2,
      height: radius * 2
    };
  }

  /**
   * Path 객체로 변환
   */
  toPath(): Path {
    const path = new Path();
    path.setStyle(this._style);

    // 원을 베지어 곡선으로 근사
    // 4개의 3차 베지어 곡선으로 원을 그림
    const kappa = 0.5522847498; // 4/3 * (sqrt(2) - 1)
    const ox = this._radius * kappa; // Control point offset horizontal
    const oy = this._radius * kappa; // Control point offset vertical
    const xe = this._center.x + this._radius; // x-end point
    const ye = this._center.y + this._radius; // y-end point
    const xm = this._center.x; // x-middle point
    const ym = this._center.y; // y-middle point

    path.moveTo(xm - this._radius, ym)
        .cubicCurveTo(
          xm - this._radius, ym - oy,
          xm - ox, ym - this._radius,
          xm, ym - this._radius
        )
        .cubicCurveTo(
          xm + ox, ym - this._radius,
          xe, ym - oy,
          xe, ym
        )
        .cubicCurveTo(
          xe, ym + oy,
          xm + ox, ye,
          xm, ye
        )
        .cubicCurveTo(
          xm - ox, ye,
          xm - this._radius, ym + oy,
          xm - this._radius, ym
        )
        .closePath();

    // 변환 적용
    path.transform(this._transform);

    return path;
  }

  /**
   * 원 복제
   */
  clone(): Shape {
    const circle = new Circle(this._center.clone(), this._radius);
    circle.style = { ...this._style };
    circle.transform = this._transform.clone();
    return circle;
  }

  /**
   * 지름으로 원 생성
   */
  static fromDiameter(center: Vector2D, diameter: number): Circle {
    return new Circle(center, diameter / 2);
  }

  /**
   * 두 점을 지나는 원 생성
   */
  static fromTwoPoints(p1: Vector2D, p2: Vector2D): Circle {
    const center = new Vector2D(
      (p1.x + p2.x) / 2,
      (p1.y + p2.y) / 2
    );
    const radius = p1.subtract(p2).length / 2;
    return new Circle(center, radius);
  }

  /**
   * 세 점을 지나는 원 생성
   */
  static fromThreePoints(p1: Vector2D, p2: Vector2D, p3: Vector2D): Circle {
    // 세 점이 일직선 상에 있는지 확인
    const d = (p1.x * (p2.y - p3.y) + p2.x * (p3.y - p1.y) + p3.x * (p1.y - p2.y)) / 2;
    if (Math.abs(d) < Number.EPSILON) {
      throw new Error('세 점이 일직선 상에 있어 원을 만들 수 없습니다.');
    }

    // 원의 중심 계산
    const a1 = p1.x * p1.x + p1.y * p1.y;
    const a2 = p2.x * p2.x + p2.y * p2.y;
    const a3 = p3.x * p3.x + p3.y * p3.y;

    const x = ((a1 * (p2.y - p3.y) + a2 * (p3.y - p1.y) + a3 * (p1.y - p2.y)) / (2 * d));
    const y = ((a1 * (p3.x - p2.x) + a2 * (p1.x - p3.x) + a3 * (p2.x - p1.x)) / (2 * d));

    const center = new Vector2D(x, y);
    const radius = center.subtract(p1).length;

    return new Circle(center, radius);
  }
}