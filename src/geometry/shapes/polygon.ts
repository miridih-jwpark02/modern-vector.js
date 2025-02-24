/**
 * 다각형 도형 구현
 */
import { Vector2D } from '../../core/math/vector';
import { Path } from '../path';
import { BaseShape, Shape } from './shape';

export class Polygon extends BaseShape {
  private _points: Vector2D[];

  constructor(center: Vector2D, points: Vector2D[]) {
    super(center);
    this._points = points;
  }

  /**
   * 다각형의 꼭지점들
   */
  get points(): Vector2D[] {
    return this._points.map(p => 
      this._transform.transformVector(
        new Vector2D(
          p.x + this._center.x,
          p.y + this._center.y
        )
      )
    );
  }

  /**
   * 다각형의 변의 개수
   */
  get sideCount(): number {
    return this._points.length;
  }

  /**
   * 다각형의 경계 상자
   */
  get bounds(): { x: number; y: number; width: number; height: number } {
    const points = this.points;
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
    if (this._points.length < 3) {
      throw new Error('다각형은 최소 3개의 점이 필요합니다.');
    }

    const path = new Path();
    path.setStyle(this._style);

    // 첫 번째 점으로 이동
    const first = this._points[0];
    path.moveTo(
      first.x + this._center.x,
      first.y + this._center.y
    );

    // 나머지 점들을 연결
    for (let i = 1; i < this._points.length; i++) {
      const point = this._points[i];
      path.lineTo(
        point.x + this._center.x,
        point.y + this._center.y
      );
    }

    // 다각형 닫기
    path.closePath();

    // 변환 적용
    path.transform(this._transform);

    return path;
  }

  /**
   * 다각형 복제
   */
  clone(): Shape {
    const polygon = new Polygon(
      this._center.clone(),
      this._points.map(p => p.clone())
    );
    polygon.style = { ...this._style };
    polygon.transform = this._transform.clone();
    return polygon;
  }

  /**
   * 점 추가
   */
  addPoint(point: Vector2D): this {
    this._points.push(point);
    return this;
  }

  /**
   * 점 제거
   */
  removePoint(index: number): this {
    if (index >= 0 && index < this._points.length) {
      this._points.splice(index, 1);
    }
    return this;
  }

  /**
   * 정다각형 생성
   */
  static regular(
    center: Vector2D,
    radius: number,
    sides: number,
    rotation: number = 0
  ): Polygon {
    if (sides < 3) {
      throw new Error('정다각형은 최소 3개의 변이 필요합니다.');
    }

    const points: Vector2D[] = [];
    const angleStep = (Math.PI * 2) / sides;

    for (let i = 0; i < sides; i++) {
      const angle = i * angleStep + rotation;
      points.push(new Vector2D(
        radius * Math.cos(angle),
        radius * Math.sin(angle)
      ));
    }

    return new Polygon(center, points);
  }

  /**
   * 별 모양 생성
   */
  static star(
    center: Vector2D,
    outerRadius: number,
    innerRadius: number,
    points: number,
    rotation: number = 0
  ): Polygon {
    if (points < 2) {
      throw new Error('별은 최소 2개의 꼭지점이 필요합니다.');
    }

    const vertices: Vector2D[] = [];
    const angleStep = Math.PI / points;

    for (let i = 0; i < points * 2; i++) {
      const angle = i * angleStep + rotation;
      const radius = i % 2 === 0 ? outerRadius : innerRadius;
      vertices.push(new Vector2D(
        radius * Math.cos(angle),
        radius * Math.sin(angle)
      ));
    }

    return new Polygon(center, vertices);
  }

  /**
   * 볼록 다각형인지 확인
   */
  isConvex(): boolean {
    const points = this._points;
    const n = points.length;
    if (n < 3) return false;

    let sign = 0;
    for (let i = 0; i < n; i++) {
      const p1 = points[i];
      const p2 = points[(i + 1) % n];
      const p3 = points[(i + 2) % n];

      const cross = (p2.x - p1.x) * (p3.y - p1.y) - 
                   (p2.y - p1.y) * (p3.x - p1.x);

      if (i === 0) {
        sign = Math.sign(cross);
      } else if (sign * cross < 0) {
        return false;
      }
    }

    return true;
  }
}