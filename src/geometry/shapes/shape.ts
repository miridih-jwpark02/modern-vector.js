/**
 * 기본 도형들의 공통 인터페이스
 */
import { Path } from '../path';
import { Vector2D } from '../../core/math/vector';
import { Matrix2D } from '../../core/math/matrix';
import { PathStyle } from '../types';

export interface Shape {
  /**
   * 도형의 중심점
   */
  readonly center: Vector2D;

  /**
   * 도형의 경계 상자
   */
  readonly bounds: {
    x: number;
    y: number;
    width: number;
    height: number;
  };

  /**
   * 도형의 스타일
   */
  style: PathStyle;

  /**
   * 도형의 변환 행렬
   */
  transform: Matrix2D;

  /**
   * Path 객체로 변환
   */
  toPath(): Path;

  /**
   * 도형 복제
   */
  clone(): Shape;

  /**
   * 도형 이동
   */
  translate(x: number, y: number): this;

  /**
   * 도형 회전
   */
  rotate(angle: number): this;

  /**
   * 도형 크기 변경
   */
  scale(sx: number, sy: number): this;
}

/**
 * 기본 도형 구현을 위한 추상 클래스
 */
export abstract class BaseShape implements Shape {
  protected _transform: Matrix2D = Matrix2D.identity();
  protected _style: PathStyle = {
    fillColor: '#000000',
    strokeColor: undefined,
    strokeWidth: 1
  };

  constructor(protected _center: Vector2D) {}

  get center(): Vector2D {
    return this._transform.transformVector(this._center);
  }

  abstract get bounds(): {
    x: number;
    y: number;
    width: number;
    height: number;
  };

  get style(): PathStyle {
    return this._style;
  }

  set style(value: PathStyle) {
    this._style = { ...this._style, ...value };
  }

  get transform(): Matrix2D {
    return this._transform;
  }

  set transform(value: Matrix2D) {
    this._transform = value;
  }

  abstract toPath(): Path;

  abstract clone(): Shape;

  translate(x: number, y: number): this {
    this._transform = this._transform.multiply(Matrix2D.translation(x, y));
    return this;
  }

  rotate(angle: number): this {
    this._transform = this._transform.multiply(Matrix2D.rotation(angle));
    return this;
  }

  scale(sx: number, sy: number): this {
    this._transform = this._transform.multiply(Matrix2D.scaling(sx, sy));
    return this;
  }
}