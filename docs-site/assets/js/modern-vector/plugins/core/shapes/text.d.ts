import { Vector2D } from '../math/vector';
import { Matrix3x3 } from '../math/matrix';
import { Shape, Bounds, ShapeFactory, ShapeOptions } from './types';
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
export declare class Text extends AbstractShape {
    private _x;
    private _y;
    private _text;
    private _font;
    private _fontSize;
    private _textAlign;
    private _textBaseline;
    constructor(options?: TextOptions);
    /**
     * Text의 내용 가져오기
     */
    get text(): string;
    /**
     * Text의 폰트 가져오기
     */
    get font(): string;
    /**
     * Text의 크기 가져오기
     */
    get fontSize(): number;
    /**
     * Text의 정렬 가져오기
     */
    get textAlign(): 'left' | 'center' | 'right';
    /**
     * Text의 기준선 가져오기
     */
    get textBaseline(): 'top' | 'middle' | 'bottom';
    protected getLocalBounds(): Bounds;
    get bounds(): Bounds;
    clone(): Shape;
    applyTransform(matrix: Matrix3x3): Shape;
    containsPoint(point: Vector2D): boolean;
    intersects(other: Shape): boolean;
    /**
     * Text를 Path로 변환
     * @returns Path points
     */
    toPath(): PathPoint[];
}
/**
 * Text factory
 */
export declare class TextFactory implements ShapeFactory<Text> {
    create(options: TextOptions): Text;
}
//# sourceMappingURL=text.d.ts.map