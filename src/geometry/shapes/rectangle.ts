/**
 * 사각형 도형 구현
 */
import { Vector2D } from '../../core/math/vector';
import { Path } from '../path';
import { BaseShape, Shape } from './shape';

export class Rectangle extends BaseShape {
  constructor(
    center: Vector2D,
    private _width: number,
    private _height: number
  ) {
    super(center);
  }

  /**
   * 사각형의 너비
   */
  get width(): number {
    return this._width * Math.abs(this.transform.getScaleX());
  }

  set width(value: number) {
    this._width = value;
  }

  /**
   * 사각형의 높이
   */
  get height(): number {
    return this._height * Math.abs(this.transform.getScaleY());
  }

  set height(value: number) {
    this._height = value;
  }

  /**
   * 사각형의 경계 상자
   */
  get bounds(): { x: number; y: number; width: number; height: number } {
    const halfWidth = this._width / 2;
    const halfHeight = this._height / 2;

    // 네 모서리 점들을 변환
    const points = [
      new Vector2D(this._center.x - halfWidth, this._center.y - halfHeight),
      new Vector2D(this._center.x + halfWidth, this._center.y - halfHeight),
      new Vector2D(this._center.x + halfWidth, this._center.y + halfHeight),
      new Vector2D(this._center.x - halfWidth, this._center.y + halfHeight)
    ].map(p => this._transform.transformVector(p));

    // 경계 상자 계산
    const xs = points.map(p => p.x);
    const ys = points.map(p => p.y);
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);

    return {
      x: minX,
      y: minY,
      width: maxX - minX,
      height: maxY - minY
    };
  }

  /**
   * Path 객체로 변환
   */
  toPath(): Path {
    const halfWidth = this._width / 2;
    const halfHeight = this._height / 2;

    const path = new Path();
    path.setStyle(this._style);

    // 사각형 그리기
    path.moveTo(this._center.x - halfWidth, this._center.y - halfHeight)
        .lineTo(this._center.x + halfWidth, this._center.y - halfHeight)
        .lineTo(this._center.x + halfWidth, this._center.y + halfHeight)
        .lineTo(this._center.x - halfWidth, this._center.y + halfHeight)
        .closePath();

    // 변환 적용
    path.transform(this._transform);

    return path;
  }

  /**
   * 사각형 복제
   */
  clone(): Shape {
    const rect = new Rectangle(
      this._center.clone(),
      this._width,
      this._height
    );
    rect.style = { ...this._style };
    rect.transform = this._transform.clone();
    return rect;
  }

  /**
   * 사각형 크기 설정
   */
  setSize(width: number, height: number): this {
    this._width = width;
    this._height = height;
    return this;
  }

  /**
   * 정사각형 생성
   */
  static square(center: Vector2D, size: number): Rectangle {
    return new Rectangle(center, size, size);
  }

  /**
   * 좌표로 사각형 생성
   */
  static fromCorners(x1: number, y1: number, x2: number, y2: number): Rectangle {
    const width = Math.abs(x2 - x1);
    const height = Math.abs(y2 - y1);
    const center = new Vector2D(
      (x1 + x2) / 2,
      (y1 + y2) / 2
    );
    return new Rectangle(center, width, height);
  }
}