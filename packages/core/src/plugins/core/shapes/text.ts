import { Vector2D } from '../math/vector';
import { Matrix3x3 } from '../math/matrix';
import { Shape, Bounds, ShapeFactory, ShapeOptions } from './types';
import { AbstractShape } from './abstract-shape';
import { PathPoint } from './path/types';
import { EventEmitter } from '../../../core/types';

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

  // 스케일 관련 속성 추가
  protected _scaleOrigin: 'center' | 'topLeft' | 'custom' = 'topLeft';
  protected _customScaleOrigin?: { x: number; y: number };

  constructor(options: TextOptions = {}) {
    // 기본 값 설정
    const x = options.x || 0;
    const y = options.y || 0;
    const text = options.text || '';
    const font = options.font || 'sans-serif';
    const fontSize = options.fontSize || 16;
    const textAlign = options.textAlign || 'left';
    const textBaseline = options.textBaseline || 'top';

    // Text의 크기를 측정하기 위해 canvas 사용 (브라우저 환경에서만 가능)
    let width = fontSize * text.length * 0.6; // 간단한, 근사적인 계산
    const height = fontSize;

    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.font = `${fontSize}px ${font}`;
        const metrics = ctx.measureText(text);
        width = metrics.width;
        // height는 근사값 사용
      }
    } catch (e) {
      // 브라우저 환경이 아닌 경우 실패할 수 있음
      // 기본값 유지
    }

    // Text의 정렬에 따른 x 조정
    let adjustedX = x;
    if (textAlign === 'center') {
      adjustedX -= width / 2;
    } else if (textAlign === 'right') {
      adjustedX -= width;
    }

    // Text의 기준선에 따른 y 조정
    let adjustedY = y;
    if (textBaseline === 'middle') {
      adjustedY -= height / 2;
    } else if (textBaseline === 'bottom') {
      adjustedY -= height;
    }

    // 초기 bounds 계산
    const bounds: Bounds = {
      x: adjustedX,
      y: adjustedY,
      width,
      height,
    };

    // EventEmitter 모킹
    const eventEmitter: EventEmitter = {
      on: (_event: string, _handler: any) => {},
      off: (_event: string, _handler: any) => {},
      emit: (_event: string, _data: any) => {},
    };

    // AbstractShape 생성자에 인자 전달
    super(
      options.id || crypto.randomUUID(),
      'text',
      options.transform || Matrix3x3.create(),
      bounds,
      options.style || {},
      eventEmitter
    );

    this._x = x;
    this._y = y;
    this._text = text;
    this._font = font;
    this._fontSize = fontSize;
    this._textAlign = textAlign;
    this._textBaseline = textBaseline;

    // 스케일 옵션 초기화
    if (options.scaleOrigin) {
      this._scaleOrigin = options.scaleOrigin;
    }

    if (options.customScaleOriginPoint) {
      this._customScaleOrigin = options.customScaleOriginPoint;
    }
  }

  // scaleOrigin 게터 추가
  get scaleOrigin(): 'center' | 'topLeft' | 'custom' {
    return this._scaleOrigin;
  }

  // customScaleOrigin 게터 추가
  get customScaleOrigin(): { x: number; y: number } | undefined {
    return this._customScaleOrigin;
  }

  // 원래 있던 setScaleOrigin 메서드 오버라이드
  setScaleOrigin(origin: 'center' | 'topLeft' | 'custom', point?: { x: number; y: number }): void {
    this._scaleOrigin = origin;
    if (origin === 'custom' && point) {
      this._customScaleOrigin = point;
    } else {
      this._customScaleOrigin = undefined;
    }
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
      height,
    };
  }

  get bounds(): Bounds {
    const localBounds = this.getLocalBounds();

    // Transform 적용된 corner points 계산
    const corners = [
      Vector2D.create(localBounds.x, localBounds.y),
      Vector2D.create(localBounds.x + localBounds.width, localBounds.y),
      Vector2D.create(localBounds.x + localBounds.width, localBounds.y + localBounds.height),
      Vector2D.create(localBounds.x, localBounds.y + localBounds.height),
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
      height: maxY - minY,
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
      customScaleOriginPoint: this.customScaleOrigin,
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
            y: bounds.y + bounds.height / 2,
          };
          break;
        case 'custom':
          origin = this.customScaleOrigin || {
            x: bounds.x,
            y: bounds.y,
          };
          break;
        default:
          origin = {
            x: bounds.x,
            y: bounds.y,
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
        customScaleOriginPoint: this.customScaleOrigin,
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
      customScaleOriginPoint: this.customScaleOrigin,
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
      { x: bounds.x, y: bounds.y, type: 'line' },
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
