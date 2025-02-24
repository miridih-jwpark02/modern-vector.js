/**
 * 2D 변환 행렬을 위한 클래스
 * gl-matrix와 통합되어 고성능 연산 지원
 */
import { mat2d } from 'gl-matrix';
import { Vector2D } from './vector';

export class Matrix2D {
  private _mat: mat2d;

  constructor() {
    this._mat = mat2d.create();
  }

  /**
   * 단위 행렬 생성
   */
  static identity(): Matrix2D {
    return new Matrix2D();
  }

  /**
   * 이동 변환 행렬 생성
   */
  static translation(x: number, y: number): Matrix2D {
    const result = new Matrix2D();
    mat2d.fromTranslation(result._mat, [x, y]);
    return result;
  }

  /**
   * 회전 변환 행렬 생성
   * @param angle 회전 각도 (라디안)
   */
  static rotation(angle: number): Matrix2D {
    const result = new Matrix2D();
    mat2d.fromRotation(result._mat, angle);
    return result;
  }

  /**
   * 크기 변환 행렬 생성
   */
  static scaling(sx: number, sy: number): Matrix2D {
    const result = new Matrix2D();
    mat2d.fromScaling(result._mat, [sx, sy]);
    return result;
  }

  /**
   * 행렬 곱셈
   */
  multiply(m: Matrix2D): Matrix2D {
    const result = new Matrix2D();
    mat2d.multiply(result._mat, this._mat, m._mat);
    return result;
  }

  /**
   * 역행렬 계산
   */
  invert(): Matrix2D {
    const result = new Matrix2D();
    mat2d.invert(result._mat, this._mat);
    return result;
  }

  /**
   * 벡터 변환
   */
  transformVector(v: Vector2D): Vector2D {
    const result = new Vector2D();
    const vec = [v.x, v.y];
    vec2.transformMat2d(vec, vec, this._mat);
    result.set(vec[0], vec[1]);
    return result;
  }

  /**
   * 이동 변환 적용
   */
  translate(x: number, y: number): this {
    mat2d.translate(this._mat, this._mat, [x, y]);
    return this;
  }

  /**
   * 회전 변환 적용
   */
  rotate(angle: number): this {
    mat2d.rotate(this._mat, this._mat, angle);
    return this;
  }

  /**
   * 크기 변환 적용
   */
  scale(sx: number, sy: number): this {
    mat2d.scale(this._mat, this._mat, [sx, sy]);
    return this;
  }

  /**
   * 행렬을 배열로 변환
   */
  toArray(): number[] {
    return Array.from(this._mat);
  }

  /**
   * 행렬 복제
   */
  clone(): Matrix2D {
    const result = new Matrix2D();
    mat2d.copy(result._mat, this._mat);
    return result;
  }

  /**
   * 행렬 값 설정
   */
  set(values: number[]): this {
    this._mat.set(values);
    return this;
  }

  /**
   * 다른 행렬과 같은지 비교
   */
  equals(m: Matrix2D, epsilon: number = Number.EPSILON): boolean {
    return mat2d.equals(this._mat, m._mat);
  }
}