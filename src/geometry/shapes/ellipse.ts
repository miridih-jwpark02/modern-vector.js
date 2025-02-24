/**
 * 타원 도형 구현
 */
import { Vector2D } from '../../core/math/vector';
import { Path } from '../path';
import { BaseShape, Shape } from './shape';

export class Ellipse extends BaseShape {
  constructor(
    center: Vector2D,
    private _radiusX: number,
    private _radiusY: number
  ) {
    super(center);
  }

  /**
   * 타원의 X축 반지름
   */
  get radiusX(): number {
    return this._radiusX * Math.abs(this.transform.getScaleX());
  }

  set radiusX(value: number) {
    this._radiusX = value;
  }

  /**
   * 타원의 Y축 반지름
   */
  get radiusY(): number {
    return this._radiusY * Math.abs(this.transform.getScaleY());
  }

  set radiusY(value: number) {
    this._radiusY = value;
  }

  /**
   * 타원의 경계 상자
   */
  get bounds(): { x: number; y: number; width: number; height: number } {
    const transformedCenter = this.center;
    const rx = this.radiusX;
    const ry = this.radiusY;

    return {
      x: transformedCenter.x - rx,
      y: transformedCenter.y - ry,
      width: rx * 2,
      height: ry * 2
    };
  }

  /**
   * Path 객체로 변환
   */
  toPath(): Path {
    const path = new Path();
    path.setStyle(this._style);

    // 타원을 베지어 곡선으로 근사
    const kappa = 0.5522847498; // 4/3 * (sqrt(2) - 1)
    const ox = this._radiusX * kappa; // Control point offset X
    const oy = this._radiusY * kappa; // Control point offset Y
    const xe = this._center.x + this._radiusX; // x-end point
    const ye = this._center.y + this._radiusY; // y-end point
    const xm = this._center.x; // x-middle point
    const ym = this._center.y; // y-middle point

    path.moveTo(xm - this._radiusX, ym)
        .cubicCurveTo(
          xm - this._radiusX, ym - oy,
          xm - ox, ym - this._radiusY,
          xm, ym - this._radiusY
        )
        .cubicCurveTo(
          xm + ox, ym - this._radiusY,
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
          xm - this._radiusX, ym + oy,
          xm - this._radiusX, ym
        )
        .closePath();

    // 변환 적용
    path.transform(this._transform);

    return path;
  }

  /**
   * 타원 복제
   */
  clone(): Shape {
    const ellipse = new Ellipse(
      this._center.clone(),
      this._radiusX,
      this._radiusY
    );
    ellipse.style = { ...this._style };
    ellipse.transform = this._transform.clone();
    return ellipse;
  }

  /**
   * 타원 크기 설정
   */
  setRadii(radiusX: number, radiusY: number): this {
    this._radiusX = radiusX;
    this._radiusY = radiusY;
    return this;
  }

  /**
   * 직사각형 경계 상자로부터 타원 생성
   */
  static fromRect(rect: { x: number; y: number; width: number; height: number }): Ellipse {
    return new Ellipse(
      new Vector2D(rect.x + rect.width / 2, rect.y + rect.height / 2),
      rect.width / 2,
      rect.height / 2
    );
  }

  /**
   * 두 초점과 거리의 합으로 타원 생성
   */
  static fromFoci(focus1: Vector2D, focus2: Vector2D, distance: number): Ellipse {
    const center = new Vector2D(
      (focus1.x + focus2.x) / 2,
      (focus1.y + focus2.y) / 2
    );

    const focalLength = focus1.subtract(focus2).length / 2;
    if (distance <= 2 * focalLength) {
      throw new Error('거리가 두 초점 사이의 거리보다 커야 합니다.');
    }

    const a = distance / 2; // 장축
    const c = focalLength; // 초점 거리
    const b = Math.sqrt(a * a - c * c); // 단축

    // 초점을 잇는 벡터의 방향을 구해 회전 각도 계산
    const angle = Math.atan2(focus2.y - focus1.y, focus2.x - focus1.x);

    const ellipse = new Ellipse(center, a, b);
    ellipse.rotate(angle);

    return ellipse;
  }
}