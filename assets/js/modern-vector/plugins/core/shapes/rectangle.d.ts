import { Vector2D } from '../math/vector';
import { Matrix3x3 } from '../math/matrix';
import { Shape, Bounds, ShapeFactory, ShapeOptions } from './types';
import { AbstractShape } from './abstract-shape';
import { PathPoint } from './path/types';

/**
 * Rectangle shape options
 */
export interface RectangleOptions extends ShapeOptions {
    /** Rectangle의 x 좌표 */
    x?: number;
    /** Rectangle의 y 좌표 */
    y?: number;
    /** Rectangle의 너비 */
    width?: number;
    /** Rectangle의 높이 */
    height?: number;
}
/**
 * Rectangle shape implementation
 */
export declare class Rectangle extends AbstractShape {
    private _x;
    private _y;
    private _width;
    private _height;
    constructor(options?: RectangleOptions);
    protected getLocalBounds(): Bounds;
    get bounds(): Bounds;
    clone(): Shape;
    applyTransform(matrix: Matrix3x3): Shape;
    containsPoint(point: Vector2D): boolean;
    intersects(other: Shape): boolean;
    /**
     * Rectangle을 Path로 변환
     * @returns Path points
     */
    toPath(): PathPoint[];
}
/**
 * Rectangle factory
 */
export declare class RectangleFactory implements ShapeFactory<Rectangle> {
    create(options: RectangleOptions): Rectangle;
}
//# sourceMappingURL=rectangle.d.ts.map