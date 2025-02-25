import { Vector2D } from '../math/vector';
import { Matrix3x3 } from '../math/matrix';
import { Shape, ShapeStyle, Bounds, ShapeFactory, ShapeOptions } from './types';
import { AbstractShape } from './abstract-shape';
import { PathPoint, Point2D } from './path/types';

/**
 * Path shape options
 */
export interface PathOptions extends ShapeOptions {
  /** Path를 구성하는 점들의 배열 */
  points?: PathPoint[];
  /** Path를 닫힌 경로로 생성할지 여부 */
  closed?: boolean;
}

/**
 * Path shape implementation
 */
export class Path extends AbstractShape {
  private _points: PathPoint[];

  constructor(options: PathOptions = {}) {
    super('path', options);
    
    this._points = options.points || [];
    
    // closed 옵션이 true인 경우 경로 닫기
    if (options.closed) {
      this.closePath();
    }
  }

  /**
   * Path 닫기
   * 첫 번째 점과 마지막 점을 연결하여 닫힌 경로를 만듭니다.
   * @returns 현재 Path 인스턴스
   */
  closePath(): Path {
    if (this._points.length < 2) {
      return this; // 점이 2개 미만이면 닫을 수 없음
    }

    const firstPoint = this._points[0];
    const lastPoint = this._points[this._points.length - 1];

    // 이미 닫혀있는지 확인 (마지막 점이 첫 번째 점과 같은 위치인지)
    if (lastPoint.x === firstPoint.x && lastPoint.y === firstPoint.y) {
      return this; // 이미 닫혀있음
    }

    // 첫 번째 점과 같은 위치에 line 타입의 점 추가
    this._points.push({
      x: firstPoint.x,
      y: firstPoint.y,
      type: 'line'
    });

    return this;
  }

  /**
   * Path에 점 추가
   * @param x - 점의 x 좌표
   * @param y - 점의 y 좌표
   * @param type - 점의 타입 (이동 또는 선)
   */
  addPoint(x: number, y: number, type: 'move' | 'line' = 'line'): void {
    this._points.push({ x, y, type });
  }

  /**
   * 2차 베지어 곡선 점 추가
   * @param cpx - 제어점의 x 좌표
   * @param cpy - 제어점의 y 좌표
   * @param x - 끝점의 x 좌표
   * @param y - 끝점의 y 좌표
   */
  addQuadraticCurve(cpx: number, cpy: number, x: number, y: number): void {
    this._points.push({
      x,
      y,
      type: 'quadratic',
      controlPoint: { x: cpx, y: cpy }
    });
  }

  /**
   * 3차 베지어 곡선 점 추가
   * @param cp1x - 첫 번째 제어점의 x 좌표
   * @param cp1y - 첫 번째 제어점의 y 좌표
   * @param cp2x - 두 번째 제어점의 x 좌표
   * @param cp2y - 두 번째 제어점의 y 좌표
   * @param x - 끝점의 x 좌표
   * @param y - 끝점의 y 좌표
   */
  addCubicCurve(cp1x: number, cp1y: number, cp2x: number, cp2y: number, x: number, y: number): void {
    this._points.push({
      x,
      y,
      type: 'cubic',
      controlPoint1: { x: cp1x, y: cp1y },
      controlPoint2: { x: cp2x, y: cp2y }
    });
  }

  /**
   * Path의 모든 점 가져오기
   */
  get points(): PathPoint[] {
    return [...this._points];
  }

  /**
   * Path가 닫혀있는지 확인
   * 첫 번째 점과 마지막 점이 같은 위치에 있으면 닫힌 경로로 간주합니다.
   */
  get isClosed(): boolean {
    if (this._points.length < 3) {
      return false; // 점이 3개 미만이면 닫힌 경로가 될 수 없음
    }

    const firstPoint = this._points[0];
    const lastPoint = this._points[this._points.length - 1];

    return lastPoint.x === firstPoint.x && lastPoint.y === firstPoint.y;
  }

  /**
   * Path를 SVG path 문자열로 변환
   * @returns SVG path 문자열 (d 속성 값)
   */
  toSVGPath(): string {
    if (this._points.length === 0) {
      return '';
    }

    let svgPath = '';
    
    for (let i = 0; i < this._points.length; i++) {
      const point = this._points[i];
      
      switch (point.type) {
        case 'move':
          svgPath += `M${point.x},${point.y} `;
          break;
        case 'line':
          svgPath += `L${point.x},${point.y} `;
          break;
        case 'quadratic':
          if (point.controlPoint) {
            svgPath += `Q${point.controlPoint.x},${point.controlPoint.y} ${point.x},${point.y} `;
          }
          break;
        case 'cubic':
          if (point.controlPoint1 && point.controlPoint2) {
            svgPath += `C${point.controlPoint1.x},${point.controlPoint1.y} ${point.controlPoint2.x},${point.controlPoint2.y} ${point.x},${point.y} `;
          }
          break;
      }
    }
    
    return svgPath.trim();
  }

  /**
   * SVG path 문자열에서 Path 객체 생성
   * @param svgPath - SVG path 문자열 (d 속성 값)
   * @returns 생성된 Path 객체
   */
  static fromSVGPath(svgPath: string): Path {
    const path = new Path();
    
    // SVG path 명령어 정규식
    const commandRegex = /([MLHVCSQTAZmlhvcsqtaz])([^MLHVCSQTAZmlhvcsqtaz]*)/g;
    let match;
    
    // 현재 위치 (상대 좌표 명령어를 위해)
    let currentX = 0;
    let currentY = 0;
    
    // 첫 번째 점의 위치 (Z 명령어를 위해)
    let firstX = 0;
    let firstY = 0;
    let firstPointSet = false;
    
    while ((match = commandRegex.exec(svgPath)) !== null) {
      const command = match[1];
      const params = match[2].trim().split(/[\s,]+/).map(parseFloat);
      
      switch (command) {
        case 'M': // 절대 이동
          if (params.length >= 2) {
            currentX = params[0];
            currentY = params[1];
            path.addPoint(currentX, currentY, 'move');
            
            if (!firstPointSet) {
              firstX = currentX;
              firstY = currentY;
              firstPointSet = true;
            }
            
            // 추가 점들은 L 명령어로 처리
            for (let i = 2; i < params.length; i += 2) {
              if (i + 1 < params.length) {
                currentX = params[i];
                currentY = params[i + 1];
                path.addPoint(currentX, currentY, 'line');
              }
            }
          }
          break;
          
        case 'm': // 상대 이동
          if (params.length >= 2) {
            currentX += params[0];
            currentY += params[1];
            path.addPoint(currentX, currentY, 'move');
            
            if (!firstPointSet) {
              firstX = currentX;
              firstY = currentY;
              firstPointSet = true;
            }
            
            // 추가 점들은 l 명령어로 처리
            for (let i = 2; i < params.length; i += 2) {
              if (i + 1 < params.length) {
                currentX += params[i];
                currentY += params[i + 1];
                path.addPoint(currentX, currentY, 'line');
              }
            }
          }
          break;
          
        case 'L': // 절대 선
          for (let i = 0; i < params.length; i += 2) {
            if (i + 1 < params.length) {
              currentX = params[i];
              currentY = params[i + 1];
              path.addPoint(currentX, currentY, 'line');
            }
          }
          break;
          
        case 'l': // 상대 선
          for (let i = 0; i < params.length; i += 2) {
            if (i + 1 < params.length) {
              currentX += params[i];
              currentY += params[i + 1];
              path.addPoint(currentX, currentY, 'line');
            }
          }
          break;
          
        case 'H': // 절대 수평선
          for (let i = 0; i < params.length; i++) {
            currentX = params[i];
            path.addPoint(currentX, currentY, 'line');
          }
          break;
          
        case 'h': // 상대 수평선
          for (let i = 0; i < params.length; i++) {
            currentX += params[i];
            path.addPoint(currentX, currentY, 'line');
          }
          break;
          
        case 'V': // 절대 수직선
          for (let i = 0; i < params.length; i++) {
            currentY = params[i];
            path.addPoint(currentX, currentY, 'line');
          }
          break;
          
        case 'v': // 상대 수직선
          for (let i = 0; i < params.length; i++) {
            currentY += params[i];
            path.addPoint(currentX, currentY, 'line');
          }
          break;
          
        case 'Q': // 절대 2차 베지어
          for (let i = 0; i < params.length; i += 4) {
            if (i + 3 < params.length) {
              const cpx = params[i];
              const cpy = params[i + 1];
              currentX = params[i + 2];
              currentY = params[i + 3];
              path.addQuadraticCurve(cpx, cpy, currentX, currentY);
            }
          }
          break;
          
        case 'q': // 상대 2차 베지어
          for (let i = 0; i < params.length; i += 4) {
            if (i + 3 < params.length) {
              const cpx = currentX + params[i];
              const cpy = currentY + params[i + 1];
              currentX += params[i + 2];
              currentY += params[i + 3];
              path.addQuadraticCurve(cpx, cpy, currentX, currentY);
            }
          }
          break;
          
        case 'C': // 절대 3차 베지어
          for (let i = 0; i < params.length; i += 6) {
            if (i + 5 < params.length) {
              const cp1x = params[i];
              const cp1y = params[i + 1];
              const cp2x = params[i + 2];
              const cp2y = params[i + 3];
              currentX = params[i + 4];
              currentY = params[i + 5];
              path.addCubicCurve(cp1x, cp1y, cp2x, cp2y, currentX, currentY);
            }
          }
          break;
          
        case 'c': // 상대 3차 베지어
          for (let i = 0; i < params.length; i += 6) {
            if (i + 5 < params.length) {
              const cp1x = currentX + params[i];
              const cp1y = currentY + params[i + 1];
              const cp2x = currentX + params[i + 2];
              const cp2y = currentY + params[i + 3];
              currentX += params[i + 4];
              currentY += params[i + 5];
              path.addCubicCurve(cp1x, cp1y, cp2x, cp2y, currentX, currentY);
            }
          }
          break;
          
        case 'Z':
        case 'z':
          // 경로 닫기 - 첫 번째 점으로 돌아감
          if (firstPointSet) {
            path.addPoint(firstX, firstY, 'line');
          }
          break;
          
        // 다른 명령어들 (S, T, A 등)은 필요에 따라 구현
        case 'A':
        case 'a':
          // Arc 명령어는 복잡하므로 간단한 구현으로 대체
          // 실제로는 여러 개의 베지어 곡선으로 근사화해야 함
          if (params.length >= 7) {
            const rx = Math.abs(params[0]);
            const ry = Math.abs(params[1]);
            const xAxisRotation = params[2];
            const largeArcFlag = params[3];
            const sweepFlag = params[4];
            const x = command === 'A' ? params[5] : currentX + params[5];
            const y = command === 'A' ? params[6] : currentY + params[6];
            
            // 간단한 구현: 직선으로 연결
            path.addPoint(x, y, 'line');
            currentX = x;
            currentY = y;
          }
          break;
      }
    }
    
    return path;
  }

  /**
   * Path를 Path points로 변환
   * @returns Path points
   */
  toPath(): PathPoint[] {
    return [...this._points];
  }

  protected getLocalBounds(): Bounds {
    if (this._points.length === 0) {
      return { x: 0, y: 0, width: 0, height: 0 };
    }

    let minX = this._points[0].x;
    let minY = this._points[0].y;
    let maxX = this._points[0].x;
    let maxY = this._points[0].y;

    for (let i = 0; i < this._points.length; i++) {
      const point = this._points[i];
      
      // 점 자체의 좌표 확인
      minX = Math.min(minX, point.x);
      minY = Math.min(minY, point.y);
      maxX = Math.max(maxX, point.x);
      maxY = Math.max(maxY, point.y);
      
      // 베지어 곡선의 제어점도 경계 상자에 포함
      if (point.type === 'quadratic' && point.controlPoint) {
        minX = Math.min(minX, point.controlPoint.x);
        minY = Math.min(minY, point.controlPoint.y);
        maxX = Math.max(maxX, point.controlPoint.x);
        maxY = Math.max(maxY, point.controlPoint.y);
      } else if (point.type === 'cubic' && point.controlPoint1 && point.controlPoint2) {
        minX = Math.min(minX, point.controlPoint1.x, point.controlPoint2.x);
        minY = Math.min(minY, point.controlPoint1.y, point.controlPoint2.y);
        maxX = Math.max(maxX, point.controlPoint1.x, point.controlPoint2.x);
        maxY = Math.max(maxY, point.controlPoint1.y, point.controlPoint2.y);
      }
    }

    return {
      x: minX,
      y: minY,
      width: maxX - minX,
      height: maxY - minY
    };
  }

  get bounds(): Bounds {
    if (this._points.length === 0) {
      return { x: 0, y: 0, width: 0, height: 0 };
    }

    // Transform 적용된 모든 점 계산
    const transformedPoints = this._points.map(p => {
      const transformed = this.transform.multiply(Matrix3x3.translation(p.x, p.y));
      return {
        x: transformed.values[2],
        y: transformed.values[5]
      };
    });

    let minX = transformedPoints[0].x;
    let minY = transformedPoints[0].y;
    let maxX = transformedPoints[0].x;
    let maxY = transformedPoints[0].y;

    for (let i = 1; i < transformedPoints.length; i++) {
      const point = transformedPoints[i];
      minX = Math.min(minX, point.x);
      minY = Math.min(minY, point.y);
      maxX = Math.max(maxX, point.x);
      maxY = Math.max(maxY, point.y);
    }

    return {
      x: minX,
      y: minY,
      width: maxX - minX,
      height: maxY - minY
    };
  }

  clone(): Shape {
    const clonedPath = new Path({
      id: crypto.randomUUID(),
      transform: Matrix3x3.create(this.transform.values),
      style: { ...this.style },
      points: [...this._points],
      scaleOrigin: this.scaleOrigin,
      customScaleOriginPoint: this.customScaleOrigin
    });
    
    return clonedPath;
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
      const transformedPath = new Path({
        id: this.id,
        transform: this.getTransformAroundPoint(matrix, origin.x, origin.y),
        style: { ...this.style },
        points: [...this._points],
        scaleOrigin: this.scaleOrigin,
        customScaleOriginPoint: this.customScaleOrigin
      });
      
      return transformedPath;
    }

    // Scale이 아닌 변환은 기존 transform에 직접 적용
    const transformedPath = new Path({
      id: this.id,
      transform: matrix.multiply(this.transform),
      style: { ...this.style },
      points: [...this._points],
      scaleOrigin: this.scaleOrigin,
      customScaleOriginPoint: this.customScaleOrigin
    });
    
    return transformedPath;
  }

  containsPoint(point: Vector2D): boolean {
    // Transform point to local coordinates
    const inverse = this.transform.inverse();
    const local = inverse.multiply(Matrix3x3.translation(point.x, point.y));
    const x = local.values[2];
    const y = local.values[5];

    // Path의 각 선분에 대해 점과의 거리 계산
    for (let i = 1; i < this._points.length; i++) {
      if (this._points[i].type === 'move') continue;

      const p1 = this._points[i - 1];
      const p2 = this._points[i];
      
      // 선분인 경우
      if (p2.type === 'line') {
        // 선분과 점 사이의 거리 계산
        const distance = this.distanceToLineSegment(
          p1.x, p1.y, p2.x, p2.y, x, y
        );
        
        // 거리가 충분히 작으면 점이 선분 위에 있다고 판단
        if (distance < 5) {
          return true;
        }
      } 
      // 2차 베지어 곡선인 경우
      else if (p2.type === 'quadratic' && p2.controlPoint) {
        // 2차 베지어 곡선과 점 사이의 거리 계산
        const distance = this.distanceToQuadraticCurve(
          p1.x, p1.y, 
          p2.controlPoint.x, p2.controlPoint.y, 
          p2.x, p2.y, 
          x, y
        );
        
        // 거리가 충분히 작으면 점이 곡선 위에 있다고 판단
        if (distance < 5) {
          return true;
        }
      }
      // 3차 베지어 곡선인 경우
      else if (p2.type === 'cubic' && p2.controlPoint1 && p2.controlPoint2) {
        // 3차 베지어 곡선과 점 사이의 거리 계산
        const distance = this.distanceToCubicCurve(
          p1.x, p1.y, 
          p2.controlPoint1.x, p2.controlPoint1.y, 
          p2.controlPoint2.x, p2.controlPoint2.y, 
          p2.x, p2.y, 
          x, y
        );
        
        // 거리가 충분히 작으면 점이 곡선 위에 있다고 판단
        if (distance < 5) {
          return true;
        }
      }
    }

    return false;
  }

  /**
   * 점과 선분 사이의 거리 계산
   * @param x1 - 선분의 시작점 x 좌표
   * @param y1 - 선분의 시작점 y 좌표
   * @param x2 - 선분의 끝점 x 좌표
   * @param y2 - 선분의 끝점 y 좌표
   * @param px - 점의 x 좌표
   * @param py - 점의 y 좌표
   * @returns 점과 선분 사이의 거리
   */
  private distanceToLineSegment(x1: number, y1: number, x2: number, y2: number, px: number, py: number): number {
    const A = px - x1;
    const B = py - y1;
    const C = x2 - x1;
    const D = y2 - y1;

    const dot = A * C + B * D;
    const len_sq = C * C + D * D;
    let param = -1;
    
    if (len_sq !== 0) {
      param = dot / len_sq;
    }

    let xx, yy;

    if (param < 0) {
      xx = x1;
      yy = y1;
    } else if (param > 1) {
      xx = x2;
      yy = y2;
    } else {
      xx = x1 + param * C;
      yy = y1 + param * D;
    }

    const dx = px - xx;
    const dy = py - yy;
    
    return Math.sqrt(dx * dx + dy * dy);
  }

  /**
   * 점과 2차 베지어 곡선 사이의 거리 계산 (근사치)
   * @param x1 - 시작점 x 좌표
   * @param y1 - 시작점 y 좌표
   * @param cpx - 제어점 x 좌표
   * @param cpy - 제어점 y 좌표
   * @param x2 - 끝점 x 좌표
   * @param y2 - 끝점 y 좌표
   * @param px - 점의 x 좌표
   * @param py - 점의 y 좌표
   * @returns 점과 2차 베지어 곡선 사이의 거리
   */
  private distanceToQuadraticCurve(
    x1: number, y1: number, 
    cpx: number, cpy: number, 
    x2: number, y2: number, 
    px: number, py: number
  ): number {
    // 곡선을 여러 개의 선분으로 근사화하여 거리 계산
    const segments = 10;
    let minDistance = Number.MAX_VALUE;
    
    let prevX = x1;
    let prevY = y1;
    
    for (let i = 1; i <= segments; i++) {
      const t = i / segments;
      const t1 = 1 - t;
      
      // 2차 베지어 곡선 공식: B(t) = (1-t)^2 * P0 + 2(1-t)t * P1 + t^2 * P2
      const x = t1 * t1 * x1 + 2 * t1 * t * cpx + t * t * x2;
      const y = t1 * t1 * y1 + 2 * t1 * t * cpy + t * t * y2;
      
      const distance = this.distanceToLineSegment(prevX, prevY, x, y, px, py);
      minDistance = Math.min(minDistance, distance);
      
      prevX = x;
      prevY = y;
    }
    
    return minDistance;
  }

  /**
   * 점과 3차 베지어 곡선 사이의 거리 계산 (근사치)
   * @param x1 - 시작점 x 좌표
   * @param y1 - 시작점 y 좌표
   * @param cp1x - 첫 번째 제어점 x 좌표
   * @param cp1y - 첫 번째 제어점 y 좌표
   * @param cp2x - 두 번째 제어점 x 좌표
   * @param cp2y - 두 번째 제어점 y 좌표
   * @param x2 - 끝점 x 좌표
   * @param y2 - 끝점 y 좌표
   * @param px - 점의 x 좌표
   * @param py - 점의 y 좌표
   * @returns 점과 3차 베지어 곡선 사이의 거리
   */
  private distanceToCubicCurve(
    x1: number, y1: number, 
    cp1x: number, cp1y: number, 
    cp2x: number, cp2y: number, 
    x2: number, y2: number, 
    px: number, py: number
  ): number {
    // 곡선을 여러 개의 선분으로 근사화하여 거리 계산
    const segments = 10;
    let minDistance = Number.MAX_VALUE;
    
    let prevX = x1;
    let prevY = y1;
    
    for (let i = 1; i <= segments; i++) {
      const t = i / segments;
      const t1 = 1 - t;
      
      // 3차 베지어 곡선 공식: B(t) = (1-t)^3 * P0 + 3(1-t)^2t * P1 + 3(1-t)t^2 * P2 + t^3 * P3
      const x = t1 * t1 * t1 * x1 + 3 * t1 * t1 * t * cp1x + 3 * t1 * t * t * cp2x + t * t * t * x2;
      const y = t1 * t1 * t1 * y1 + 3 * t1 * t1 * t * cp1y + 3 * t1 * t * t * cp2y + t * t * t * y2;
      
      const distance = this.distanceToLineSegment(prevX, prevY, x, y, px, py);
      minDistance = Math.min(minDistance, distance);
      
      prevX = x;
      prevY = y;
    }
    
    return minDistance;
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
}

/**
 * Path factory
 */
export class PathFactory implements ShapeFactory<Path> {
  create(options: PathOptions): Path {
    return new Path(options);
  }
} 