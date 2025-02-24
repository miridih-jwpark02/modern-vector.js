/**
 * Path segment 구현체들
 */
import { Vector2D } from '../core/math/vector';
import { 
  SegmentType, 
  PathSegment,
  MoveSegment,
  LineSegment,
  CubicSegment,
  QuadSegment,
  CloseSegment
} from './types';

/**
 * 세그먼트 기본 클래스
 */
abstract class BaseSegment implements PathSegment {
  constructor(
    public readonly type: SegmentType,
    public readonly point: Vector2D
  ) {}

  abstract clone(): PathSegment;
}

/**
 * MoveTo 세그먼트 구현
 */
export class MoveToSegment extends BaseSegment implements MoveSegment {
  constructor(point: Vector2D) {
    super(SegmentType.MOVE, point);
  }

  clone(): MoveSegment {
    return new MoveToSegment(this.point.clone());
  }
}

/**
 * LineTo 세그먼트 구현
 */
export class LineToSegment extends BaseSegment implements LineSegment {
  constructor(point: Vector2D) {
    super(SegmentType.LINE, point);
  }

  clone(): LineSegment {
    return new LineToSegment(this.point.clone());
  }
}

/**
 * CubicCurveTo 세그먼트 구현
 */
export class CubicCurveToSegment extends BaseSegment implements CubicSegment {
  constructor(
    point: Vector2D,
    public readonly control1: Vector2D,
    public readonly control2: Vector2D
  ) {
    super(SegmentType.CUBIC, point);
  }

  clone(): CubicSegment {
    return new CubicCurveToSegment(
      this.point.clone(),
      this.control1.clone(),
      this.control2.clone()
    );
  }
}

/**
 * QuadCurveTo 세그먼트 구현
 */
export class QuadCurveToSegment extends BaseSegment implements QuadSegment {
  constructor(
    point: Vector2D,
    public readonly control: Vector2D
  ) {
    super(SegmentType.QUAD, point);
  }

  clone(): QuadSegment {
    return new QuadCurveToSegment(
      this.point.clone(),
      this.control.clone()
    );
  }
}

/**
 * ClosePath 세그먼트 구현
 */
export class ClosePathSegment extends BaseSegment implements CloseSegment {
  constructor(point: Vector2D) {
    super(SegmentType.CLOSE, point);
  }

  clone(): CloseSegment {
    return new ClosePathSegment(this.point.clone());
  }
}

/**
 * 세그먼트 팩토리 함수들
 */
export const Segments = {
  moveTo: (x: number, y: number) => 
    new MoveToSegment(new Vector2D(x, y)),

  lineTo: (x: number, y: number) => 
    new LineToSegment(new Vector2D(x, y)),

  cubicCurveTo: (
    x: number, y: number,
    cx1: number, cy1: number,
    cx2: number, cy2: number
  ) => new CubicCurveToSegment(
    new Vector2D(x, y),
    new Vector2D(cx1, cy1),
    new Vector2D(cx2, cy2)
  ),

  quadCurveTo: (
    x: number, y: number,
    cx: number, cy: number
  ) => new QuadCurveToSegment(
    new Vector2D(x, y),
    new Vector2D(cx, cy)
  ),

  closePath: (x: number, y: number) => 
    new ClosePathSegment(new Vector2D(x, y))
};