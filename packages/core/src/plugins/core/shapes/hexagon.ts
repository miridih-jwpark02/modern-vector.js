import { Vector2D } from '../math/vector';
import { Matrix3x3 } from '../math/matrix';
import { Shape, ShapeStyle, Bounds, ShapeFactory, ShapeOptions } from './types';
import { AbstractShape } from './abstract-shape';
import { PathPoint } from './path/types';

/**
 * Hexagon shape options
 */
export interface HexagonOptions extends ShapeOptions {
  /** Hexagon의 중심 x 좌표 */
  centerX?: number;
  /** Hexagon의 중심 y 좌표 */
  centerY?: number;
  /** Hexagon의 반지름 */
  radius?: number;
  /** Hexagon의 회전 각도 (라디안) */
  rotation?: number;
}

/**
 * Hexagon shape implementation
 *
 * 육각형 도형 구현
 */
export class Hexagon extends AbstractShape {
  private _centerX: number;
  private _centerY: number;
  private _radius: number;
  private _rotation: number;

  /**
   * Hexagon 생성자
   *
   * @param options - Hexagon 옵션
   */
  constructor(options: HexagonOptions = {}) {
    super(
      options.id || crypto.randomUUID(),
      'hexagon',
      options.transform || Matrix3x3.create(),
      {
        x: 0,
        y: 0,
        width: 0,
        height: 0,
      },
      options.style || {},
      options.eventEmitter || {
        on: () => {},
        off: () => {},
        emit: () => {},
      }
    );

    this._centerX = options.centerX || 0;
    this._centerY = options.centerY || 0;
    this._radius = options.radius || 0;
    this._rotation = options.rotation || 0;
  }

  /**
   * 육각형의 모든 꼭지점 계산
   *
   * @returns 육각형의 꼭지점 배열
   */
  private getVertices(): Vector2D[] {
    const vertices: Vector2D[] = [];
    const sides = 6;

    // 정육각형은 반지름이 같고 60도 간격으로 꼭지점이 위치
    // 첫 번째 꼭지점은 오른쪽(0도)에서 시작
    for (let i = 0; i < sides; i++) {
      const angle = this._rotation + (Math.PI * 2 * i) / sides;
      const x = this._centerX + this._radius * Math.cos(angle);
      const y = this._centerY + this._radius * Math.sin(angle);
      vertices.push(Vector2D.create(x, y));
    }

    return vertices;
  }

  /**
   * 로컬 좌표계 기준 경계 상자 계산
   *
   * @returns 경계 상자
   */
  protected getLocalBounds(): Bounds {
    const vertices = this.getVertices();
    const xs = vertices.map(v => v.x);
    const ys = vertices.map(v => v.y);

    const minX = Math.min(...xs);
    const minY = Math.min(...ys);
    const maxX = Math.max(...xs);
    const maxY = Math.max(...ys);

    return {
      x: minX,
      y: minY,
      width: maxX - minX,
      height: maxY - minY,
    };
  }

  /**
   * 변환이 적용된 경계 상자 반환
   */
  get bounds(): Bounds {
    const vertices = this.getVertices().map(p => {
      const transformed = Vector2D.create(
        this.transform.values[0] * p.x + this.transform.values[1] * p.y + this.transform.values[2],
        this.transform.values[3] * p.x + this.transform.values[4] * p.y + this.transform.values[5]
      );
      return transformed;
    });

    const xs = vertices.map(v => v.x);
    const ys = vertices.map(v => v.y);

    const minX = Math.min(...xs);
    const minY = Math.min(...ys);
    const maxX = Math.max(...xs);
    const maxY = Math.max(...ys);

    return {
      x: minX,
      y: minY,
      width: maxX - minX,
      height: maxY - minY,
    };
  }

  /**
   * Hexagon 복제
   *
   * @returns 복제된 Hexagon
   */
  clone(): Shape {
    return new Hexagon({
      id: crypto.randomUUID(),
      transform: Matrix3x3.create(this.transform.values),
      style: { ...this.style },
      centerX: this._centerX,
      centerY: this._centerY,
      radius: this._radius,
      rotation: this._rotation,
      eventEmitter: {
        on: () => {},
        off: () => {},
        emit: () => {},
      },
    });
  }

  /**
   * Hexagon에 변환 적용
   *
   * @param matrix - 적용할 변환 행렬
   * @returns 변환이 적용된 새 Hexagon
   */
  applyTransform(matrix: Matrix3x3): Shape {
    // Scale 변환인 경우 지정된 기준점을 사용
    const scale = this.getTransformScale(matrix);
    if (scale.scaleX !== 1 || scale.scaleY !== 1) {
      const origin = { x: this._centerX, y: this._centerY };

      const transformWithOrigin = this.getTransformAroundPoint(matrix, origin.x, origin.y);

      return new Hexagon({
        id: crypto.randomUUID(),
        transform: transformWithOrigin.multiply(this.transform),
        style: { ...this.style },
        centerX: this._centerX,
        centerY: this._centerY,
        radius: this._radius,
        rotation: this._rotation,
        eventEmitter: {
          on: () => {},
          off: () => {},
          emit: () => {},
        },
      });
    }

    // 일반 변환인 경우
    return new Hexagon({
      id: crypto.randomUUID(),
      transform: matrix.multiply(this.transform),
      style: { ...this.style },
      centerX: this._centerX,
      centerY: this._centerY,
      radius: this._radius,
      rotation: this._rotation,
      eventEmitter: {
        on: () => {},
        off: () => {},
        emit: () => {},
      },
    });
  }

  /**
   * 점이 Hexagon 내부에 있는지 확인
   *
   * @param point - 확인할 점
   * @returns 점이 내부에 있으면 true, 아니면 false
   */
  containsPoint(point: Vector2D): boolean {
    // 로컬 좌표계로 변환
    const localPoint = Vector2D.create(
      this.transform.values[0] * point.x +
        this.transform.values[1] * point.y +
        this.transform.values[2],
      this.transform.values[3] * point.x +
        this.transform.values[4] * point.y +
        this.transform.values[5]
    );

    // 중심에서 점까지의 거리가 반지름보다 작으면 내부에 있음
    const distance = Vector2D.create(this._centerX, this._centerY).distanceTo(localPoint);

    return distance <= this._radius;
  }

  /**
   * Hexagon이 다른 Shape와 겹치는지 확인
   *
   * @param other - 겹치는지 확인할 Shape
   * @returns 겹치면 true, 아니면 false
   */
  intersects(other: Shape): boolean {
    // 단순히 경계 상자 교차 확인
    const b1 = this.bounds;
    const b2 = other.bounds;

    return !(
      b1.x + b1.width < b2.x ||
      b2.x + b2.width < b1.x ||
      b1.y + b1.height < b2.y ||
      b2.y + b2.height < b1.y
    );
  }

  /**
   * Hexagon을 Path로 변환
   *
   * @returns Path 점들의 배열
   */
  toPath(): PathPoint[] {
    const vertices = this.getVertices();
    const path: PathPoint[] = [];

    // 첫 번째 점 설정
    path.push({
      x: vertices[0].x,
      y: vertices[0].y,
      type: 'move',
    });

    // 나머지 점 설정
    for (let i = 1; i < vertices.length; i++) {
      path.push({
        x: vertices[i].x,
        y: vertices[i].y,
        type: 'line',
      });
    }

    // 경로 닫기 (첫번째 점으로 선)
    path.push({
      x: vertices[0].x,
      y: vertices[0].y,
      type: 'line',
    });

    return path;
  }
}

/**
 * Hexagon 팩토리 구현
 */
export class HexagonFactory implements ShapeFactory<Hexagon> {
  /**
   * Hexagon 인스턴스 생성
   *
   * @param options - Hexagon 옵션
   * @returns 새 Hexagon 인스턴스
   */
  create(options: HexagonOptions): Hexagon {
    return new Hexagon(options);
  }
}
