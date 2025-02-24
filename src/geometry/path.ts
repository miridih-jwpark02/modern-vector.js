/**
 * Path 클래스 구현
 */
import { Vector2D } from '../core/math/vector';
import { Matrix2D } from '../core/math/matrix';
import { PathSegment, PathStyle, FillRule, LineJoin, LineCap } from './types';
import { Segments } from './segments';

export class Path {
  private segments: PathSegment[] = [];
  private _style: PathStyle = {
    fillColor: '#000000',
    strokeColor: undefined,
    strokeWidth: 1,
    fillRule: FillRule.NONZERO,
    lineJoin: LineJoin.MITER,
    lineCap: LineCap.BUTT,
    miterLimit: 10
  };
  private _transform: Matrix2D = Matrix2D.identity();
  private _bounds: { x: number; y: number; width: number; height: number } | null = null;

  /**
   * 새로운 Path 인스턴스 생성
   */
  constructor() {}

  /**
   * 현재 위치를 이동
   */
  moveTo(x: number, y: number): this {
    this.segments.push(Segments.moveTo(x, y));
    this._invalidateBounds();
    return this;
  }

  /**
   * 현재 위치에서 직선 그리기
   */
  lineTo(x: number, y: number): this {
    this.segments.push(Segments.lineTo(x, y));
    this._invalidateBounds();
    return this;
  }

  /**
   * 3차 베지어 곡선 그리기
   */
  cubicCurveTo(
    x: number, y: number,
    controlX1: number, controlY1: number,
    controlX2: number, controlY2: number
  ): this {
    this.segments.push(Segments.cubicCurveTo(
      x, y, controlX1, controlY1, controlX2, controlY2
    ));
    this._invalidateBounds();
    return this;
  }

  /**
   * 2차 베지어 곡선 그리기
   */
  quadCurveTo(
    x: number, y: number,
    controlX: number, controlY: number
  ): this {
    this.segments.push(Segments.quadCurveTo(
      x, y, controlX, controlY
    ));
    this._invalidateBounds();
    return this;
  }

  /**
   * Path 닫기
   */
  closePath(): this {
    if (this.segments.length > 0) {
      const firstPoint = this.segments[0].point;
      this.segments.push(Segments.closePath(firstPoint.x, firstPoint.y));
      this._invalidateBounds();
    }
    return this;
  }

  /**
   * Path 스타일 설정
   */
  setStyle(style: Partial<PathStyle>): this {
    this._style = { ...this._style, ...style };
    return this;
  }

  /**
   * Path 변환 적용
   */
  transform(matrix: Matrix2D): this {
    this._transform = this._transform.multiply(matrix);
    this._invalidateBounds();
    return this;
  }

  /**
   * Path 이동
   */
  translate(x: number, y: number): this {
    return this.transform(Matrix2D.translation(x, y));
  }

  /**
   * Path 회전
   */
  rotate(angle: number): this {
    return this.transform(Matrix2D.rotation(angle));
  }

  /**
   * Path 크기 변경
   */
  scale(sx: number, sy: number): this {
    return this.transform(Matrix2D.scaling(sx, sy));
  }

  /**
   * Path 복제
   */
  clone(): Path {
    const path = new Path();
    path.segments = this.segments.map(segment => segment.clone());
    path._style = { ...this._style };
    path._transform = this._transform.clone();
    return path;
  }

  /**
   * Path의 경계 상자 계산
   */
  getBounds(): { x: number; y: number; width: number; height: number } {
    if (!this._bounds) {
      let minX = Infinity;
      let minY = Infinity;
      let maxX = -Infinity;
      let maxY = -Infinity;

      for (const segment of this.segments) {
        const point = this._transform.transformVector(segment.point);
        minX = Math.min(minX, point.x);
        minY = Math.min(minY, point.y);
        maxX = Math.max(maxX, point.x);
        maxY = Math.max(maxY, point.y);

        if ('control' in segment) {
          const control = this._transform.transformVector((segment as any).control);
          minX = Math.min(minX, control.x);
          minY = Math.min(minY, control.y);
          maxX = Math.max(maxX, control.x);
          maxY = Math.max(maxY, control.y);
        }

        if ('control1' in segment && 'control2' in segment) {
          const control1 = this._transform.transformVector((segment as any).control1);
          const control2 = this._transform.transformVector((segment as any).control2);
          minX = Math.min(minX, control1.x, control2.x);
          minY = Math.min(minY, control1.y, control2.y);
          maxX = Math.max(maxX, control1.x, control2.x);
          maxY = Math.max(maxY, control1.y, control2.y);
        }
      }

      this._bounds = {
        x: minX,
        y: minY,
        width: maxX - minX,
        height: maxY - minY
      };
    }

    return this._bounds;
  }

  /**
   * 경계 상자 캐시 무효화
   */
  private _invalidateBounds(): void {
    this._bounds = null;
  }

  /**
   * Path의 세그먼트 목록 반환
   */
  getSegments(): PathSegment[] {
    return this.segments;
  }

  /**
   * Path의 스타일 반환
   */
  getStyle(): PathStyle {
    return this._style;
  }

  /**
   * Path의 변환 행렬 반환
   */
  getTransform(): Matrix2D {
    return this._transform;
  }
}