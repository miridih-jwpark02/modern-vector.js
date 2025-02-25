import { Vector2D } from '../math/vector';
import { Matrix3x3 } from '../math/matrix';
import { Shape, ShapeStyle, Bounds, ShapeFactory, ShapeOptions } from './types';
import { AbstractShape } from './abstract-shape';
import { PathPoint } from './path/types';

/**
 * Text shape options
 */
export interface TextOptions extends ShapeOptions {
  /** Text의 x 좌표 */
  x?: number;
  /** Text의 y 좌표 */
  y?: number;
  /** Text의 내용 */
  text?: string;
  /** Text의 폰트 */
  font?: string;
  /** Text의 크기 */
  fontSize?: number;
  /** Text의 정렬 */
  textAlign?: 'left' | 'center' | 'right';
  /** Text의 기준선 */
  textBaseline?: 'top' | 'middle' | 'bottom';
}

/**
 * Text shape implementation
 */
export class Text extends AbstractShape {
  private _x: number;
  private _y: number;
  private _text: string;
  private _font: string;
  private _fontSize: number;
  private _textAlign: 'left' | 'center' | 'right';
  private _textBaseline: 'top' | 'middle' | 'bottom';

  constructor(options: TextOptions = {}) {
    super('text', options);
    
    this._x = options.x || 0;
    this._y = options.y || 0;
    this._text = options.text || '';
    this._font = options.font || 'sans-serif';
    this._fontSize = options.fontSize || 16;
    this._textAlign = options.textAlign || 'left';
    this._textBaseline = options.textBaseline || 'top';
  }

  /**
   * Text의 내용 가져오기
   */
  get text(): string {
    return this._text;
  }

  /**
   * Text의 폰트 가져오기
   */
  get font(): string {
    return this._font;
  }

  /**
   * Text의 크기 가져오기
   */
  get fontSize(): number {
    return this._fontSize;
  }

  /**
   * Text의 정렬 가져오기
   */
  get textAlign(): 'left' | 'center' | 'right' {
    return this._textAlign;
  }

  /**
   * Text의 기준선 가져오기
   */
  get textBaseline(): 'top' | 'middle' | 'bottom' {
    return this._textBaseline;
  }

  protected getLocalBounds(): Bounds {
    // Text의 크기를 측정하기 위해 canvas 사용
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    ctx.font = `${this._fontSize}px ${this._font}`;
    const metrics = ctx.measureText(this._text);

    // Text의 높이는 fontSize로 근사
    const width = metrics.width;
    const height = this._fontSize;

    // Text align에 따른 x 좌표 조정
    let x = this._x;
    switch (this._textAlign) {
      case 'center':
        x -= width / 2;
        break;
      case 'right':
        x -= width;
        break;
    }

    // Text baseline에 따른 y 좌표 조정
    let y = this._y;
    switch (this._textBaseline) {
      case 'middle':
        y -= height / 2;
        break;
      case 'bottom':
        y -= height;
        break;
    }

    return {
      x,
      y,
      width,
      height
    };
  }

  get bounds(): Bounds {
    const localBounds = this.getLocalBounds();

    // Transform 적용된 corner points 계산
    const corners = [
      Vector2D.create(localBounds.x, localBounds.y),
      Vector2D.create(localBounds.x + localBounds.width, localBounds.y),
      Vector2D.create(localBounds.x + localBounds.width, localBounds.y + localBounds.height),
      Vector2D.create(localBounds.x, localBounds.y + localBounds.height)
    ].map(p => {
      const transformed = this.transform.multiply(Matrix3x3.translation(p.x, p.y));
      return Vector2D.create(transformed.values[2], transformed.values[5]);
    });

    // Find min/max points
    const xs = corners.map(p => p.x);
    const ys = corners.map(p => p.y);
    const minX = Math.min(...xs);
    const minY = Math.min(...ys);
    const maxX = Math.max(...xs);
    const maxY = Math.max(...ys);

    return {
      x: minX,
      y: minY,
      width: maxX - minX,
      height: maxY - minY
    };
  }

  clone(): Shape {
    return new Text({
      id: crypto.randomUUID(),
      transform: Matrix3x3.create(this.transform.values),
      style: { ...this.style },
      x: this._x,
      y: this._y,
      text: this._text,
      font: this._font,
      fontSize: this._fontSize,
      textAlign: this._textAlign,
      textBaseline: this._textBaseline,
      scaleOrigin: this.scaleOrigin,
      customScaleOriginPoint: this.customScaleOrigin
    });
  }

  applyTransform(matrix: Matrix3x3): Shape {
    // Scale 변환인 경우 지정된 기준점을 사용
    const scale = this.getTransformScale(matrix);
    if (scale.scaleX !== 1 || scale.scaleY !== 1) {
      let origin;
      const bounds = this.getLocalBounds();
      switch (this.scaleOrigin) {
        case 'center':
          origin = {
            x: bounds.x + bounds.width / 2,
            y: bounds.y + bounds.height / 2
          };
          break;
        case 'custom':
          origin = this.customScaleOrigin || {
            x: bounds.x,
            y: bounds.y
          };
          break;
        default:
          origin = {
            x: bounds.x,
            y: bounds.y
          };
      }
      return new Text({
        id: this.id,
        transform: this.getTransformAroundPoint(matrix, origin.x, origin.y),
        style: { ...this.style },
        x: this._x,
        y: this._y,
        text: this._text,
        font: this._font,
        fontSize: this._fontSize,
        textAlign: this._textAlign,
        textBaseline: this._textBaseline,
        scaleOrigin: this.scaleOrigin,
        customScaleOriginPoint: this.customScaleOrigin
      });
    }

    // Scale이 아닌 변환은 기존 transform에 직접 적용
    return new Text({
      id: this.id,
      transform: matrix.multiply(this.transform),
      style: { ...this.style },
      x: this._x,
      y: this._y,
      text: this._text,
      font: this._font,
      fontSize: this._fontSize,
      textAlign: this._textAlign,
      textBaseline: this._textBaseline,
      scaleOrigin: this.scaleOrigin,
      customScaleOriginPoint: this.customScaleOrigin
    });
  }

  containsPoint(point: Vector2D): boolean {
    // Transform point to local coordinates
    const inverse = this.transform.inverse();
    const local = inverse.multiply(Matrix3x3.translation(point.x, point.y));
    const x = local.values[2];
    const y = local.values[5];

    // Get local bounds
    const bounds = this.getLocalBounds();

    // Simple bounds check
    return (
      x >= bounds.x &&
      x <= bounds.x + bounds.width &&
      y >= bounds.y &&
      y <= bounds.y + bounds.height
    );
  }

  intersects(other: Shape): boolean {
    // Simple bounds intersection check
    const b1 = this.bounds;
    const b2 = other.bounds;

    return !(
      b2.x > b1.x + b1.width ||
      b2.x + b2.width < b1.x ||
      b2.y > b1.y + b1.height ||
      b2.y + b2.height < b1.y
    );
  }

  /**
   * Text를 Path로 변환
   * @returns Path points
   */
  toPath(): PathPoint[] {
    // Text를 Path로 변환하는 것은 복잡한 작업이므로,
    // 현재는 Text의 경계 상자를 Path로 반환
    const bounds = this.bounds;
    return [
      { x: bounds.x, y: bounds.y, type: 'move' },
      { x: bounds.x + bounds.width, y: bounds.y, type: 'line' },
      { x: bounds.x + bounds.width, y: bounds.y + bounds.height, type: 'line' },
      { x: bounds.x, y: bounds.y + bounds.height, type: 'line' },
      { x: bounds.x, y: bounds.y, type: 'line' }
    ];
  }
}

/**
 * Text factory
 */
export class TextFactory implements ShapeFactory<Text> {
  create(options: TextOptions): Text {
    return new Text(options);
  }
} 