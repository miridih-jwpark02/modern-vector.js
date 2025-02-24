/**
 * 2D 벡터 연산을 위한 기본 클래스
 * gl-matrix와 통합되어 고성능 연산 지원
 */
import { vec2 } from 'gl-matrix';

export class Vector2D {
  private _vec: vec2;

  constructor(x: number = 0, y: number = 0) {
    this._vec = vec2.fromValues(x, y);
  }

  /**
   * 벡터의 x 좌표
   */
  get x(): number {
    return this._vec[0];
  }

  set x(value: number) {
    this._vec[0] = value;
  }

  /**
   * 벡터의 y 좌표
   */
  get y(): number {
    return this._vec[1];
  }

  set y(value: number) {
    this._vec[1] = value;
  }

  /**
   * 벡터의 길이
   */
  get length(): number {
    return vec2.length(this._vec);
  }

  /**
   * 벡터의 길이의 제곱
   * length 계산시 제곱근 연산을 피하기 위해 사용
   */
  get lengthSquared(): number {
    return vec2.squaredLength(this._vec);
  }

  /**
   * 벡터 더하기
   */
  add(v: Vector2D): Vector2D {
    const result = new Vector2D();
    vec2.add(result._vec, this._vec, v._vec);
    return result;
  }

  /**
   * 벡터 빼기
   */
  subtract(v: Vector2D): Vector2D {
    const result = new Vector2D();
    vec2.subtract(result._vec, this._vec, v._vec);
    return result;
  }

  /**
   * 스칼라 곱
   */
  scale(s: number): Vector2D {
    const result = new Vector2D();
    vec2.scale(result._vec, this._vec, s);
    return result;
  }

  /**
   * 내적
   */
  dot(v: Vector2D): number {
    return vec2.dot(this._vec, v._vec);
  }

  /**
   * 벡터 정규화
   */
  normalize(): Vector2D {
    const result = new Vector2D();
    vec2.normalize(result._vec, this._vec);
    return result;
  }

  /**
   * 벡터 회전
   * @param angle 회전 각도 (라디안)
   */
  rotate(angle: number): Vector2D {
    const result = new Vector2D();
    vec2.rotate(result._vec, this._vec, vec2.fromValues(0, 0), angle);
    return result;
  }

  /**
   * 벡터를 배열로 변환
   */
  toArray(): [number, number] {
    return [this.x, this.y];
  }

  /**
   * 벡터를 문자열로 변환
   */
  toString(): string {
    return `Vector2D(${this.x}, ${this.y})`;
  }

  /**
   * 벡터 복제
   */
  clone(): Vector2D {
    return new Vector2D(this.x, this.y);
  }

  /**
   * 벡터 값 설정
   */
  set(x: number, y: number): this {
    vec2.set(this._vec, x, y);
    return this;
  }

  /**
   * 다른 벡터와 같은지 비교
   */
  equals(v: Vector2D, epsilon: number = Number.EPSILON): boolean {
    return Math.abs(this.x - v.x) <= epsilon && 
           Math.abs(this.y - v.y) <= epsilon;
  }
}