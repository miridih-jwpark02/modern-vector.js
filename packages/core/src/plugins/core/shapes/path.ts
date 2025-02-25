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
   * 
   * 현재 경로에 2차 베지어 곡선 점을 추가합니다. 2차 베지어 곡선은 하나의 제어점을 사용하여
   * 부드러운 곡선을 생성합니다.
   * 
   * @param cpx - 제어점의 x 좌표
   * @param cpy - 제어점의 y 좌표
   * @param x - 끝점의 x 좌표
   * @param y - 끝점의 y 좌표
   * @returns 현재 Path 인스턴스 (메서드 체이닝 지원)
   * 
   * @example
   * ```typescript
   * const path = new Path();
   * path.addPoint(10, 10, 'move');
   * path.addQuadraticCurve(50, 0, 90, 10); // 제어점 (50, 0), 끝점 (90, 10)
   * ```
   */
  addQuadraticCurve(cpx: number, cpy: number, x: number, y: number): Path {
    this._points.push({
      x,
      y,
      type: 'quadratic',
      controlPoint: { x: cpx, y: cpy }
    });
    return this;
  }

  /**
   * 3차 베지어 곡선 점 추가
   * 
   * 현재 경로에 3차 베지어 곡선 점을 추가합니다. 3차 베지어 곡선은 두 개의 제어점을 사용하여
   * 더 복잡하고 유연한 곡선을 생성합니다.
   * 
   * @param cp1x - 첫 번째 제어점의 x 좌표
   * @param cp1y - 첫 번째 제어점의 y 좌표
   * @param cp2x - 두 번째 제어점의 x 좌표
   * @param cp2y - 두 번째 제어점의 y 좌표
   * @param x - 끝점의 x 좌표
   * @param y - 끝점의 y 좌표
   * @returns 현재 Path 인스턴스 (메서드 체이닝 지원)
   * 
   * @example
   * ```typescript
   * const path = new Path();
   * path.addPoint(10, 10, 'move');
   * path.addCubicCurve(30, 0, 60, 30, 90, 10); // 제어점1 (30, 0), 제어점2 (60, 30), 끝점 (90, 10)
   * ```
   */
  addCubicCurve(cp1x: number, cp1y: number, cp2x: number, cp2y: number, x: number, y: number): Path {
    this._points.push({
      x,
      y,
      type: 'cubic',
      controlPoint1: { x: cp1x, y: cp1y },
      controlPoint2: { x: cp2x, y: cp2y }
    });
    return this;
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
   * 
   * 현재 Path 객체를 SVG path 요소의 d 속성에 사용할 수 있는 문자열로 변환합니다.
   * 이 메서드는 모든 점 타입(이동, 선, 2차 베지어, 3차 베지어)을 지원합니다.
   * 
   * @returns SVG path 문자열
   * 
   * @example
   * ```typescript
   * const path = new Path();
   * path.addPoint(10, 10, 'move');
   * path.addPoint(50, 10, 'line');
   * path.addQuadraticCurve(70, 30, 90, 10);
   * 
   * const svgPath = path.toSVGPath();
   * // 결과: "M10,10 L50,10 Q70,30 90,10"
   * ```
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
   * 
   * SVG path 요소의 d 속성 값으로부터 Path 객체를 생성합니다.
   * 이 메서드는 다음 SVG 명령어들을 지원합니다:
   * - M/m: 이동 (절대/상대)
   * - L/l: 선 (절대/상대)
   * - H/h: 수평선 (절대/상대)
   * - V/v: 수직선 (절대/상대)
   * - Q/q: 2차 베지어 곡선 (절대/상대)
   * - C/c: 3차 베지어 곡선 (절대/상대)
   * - A/a: 호 (절대/상대) - 여러 개의 베지어 곡선으로 근사화됨
   * - Z/z: 경로 닫기
   * 
   * @param svgPath - SVG path 문자열 (d 속성 값)
   * @returns 생성된 Path 객체
   * 
   * @example
   * ```typescript
   * // SVG path 문자열에서 Path 객체 생성
   * const path = Path.fromSVGPath("M10,10 L50,10 Q70,30 90,10 C110,-10 130,30 150,10 Z");
   * ```
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
          
        // Arc 명령어 처리
        case 'A':
        case 'a':
          if (params.length >= 7) {
            const rx = Math.abs(params[0]);
            const ry = Math.abs(params[1]);
            const xAxisRotation = params[2] * Math.PI / 180; // 각도를 라디안으로 변환
            const largeArcFlag = params[3] !== 0;
            const sweepFlag = params[4] !== 0;
            const endX = command === 'A' ? params[5] : currentX + params[5];
            const endY = command === 'A' ? params[6] : currentY + params[6];
            
            // Arc를 베지어 곡선으로 근사화
            const curves = Path.approximateArc(
              currentX, currentY,
              rx, ry,
              xAxisRotation,
              largeArcFlag,
              sweepFlag,
              endX, endY
            );
            
            // 생성된 베지어 곡선들을 경로에 추가
            for (const curve of curves) {
              path.addCubicCurve(
                curve.cp1x, curve.cp1y,
                curve.cp2x, curve.cp2y,
                curve.x, curve.y
              );
            }
            
            currentX = endX;
            currentY = endY;
          }
          break;
      }
    }
    
    return path;
  }

  /**
   * SVG Arc를 여러 개의 3차 베지어 곡선으로 근사화
   * 
   * SVG path의 Arc 명령어(A/a)를 여러 개의 3차 베지어 곡선으로 변환합니다.
   * 이 메서드는 내부적으로 사용되며, Arc를 정확하게 표현하기 위해 여러 개의 
   * 베지어 곡선 세그먼트로 분할합니다.
   * 
   * @param x1 - 시작점 x 좌표
   * @param y1 - 시작점 y 좌표
   * @param rx - x 반지름
   * @param ry - y 반지름
   * @param angle - x축 회전 각도 (라디안)
   * @param largeArcFlag - 큰 호 플래그
   * @param sweepFlag - 쓸기 방향 플래그
   * @param x2 - 끝점 x 좌표
   * @param y2 - 끝점 y 좌표
   * @returns 3차 베지어 곡선 배열
   * 
   * @internal
   */
  private static approximateArc(
    x1: number, y1: number,
    rx: number, ry: number,
    angle: number,
    largeArcFlag: boolean,
    sweepFlag: boolean,
    x2: number, y2: number
  ): { cp1x: number; cp1y: number; cp2x: number; cp2y: number; x: number; y: number }[] {
    // 반지름이 0이면 직선으로 처리
    if (rx === 0 || ry === 0) {
      return [];
    }
    
    // 시작점과 끝점이 같으면 빈 배열 반환
    if (x1 === x2 && y1 === y2) {
      return [];
    }
    
    // 반지름이 음수면 절대값 사용
    rx = Math.abs(rx);
    ry = Math.abs(ry);
    
    // 1. 타원 중심 좌표계로 변환
    const cosAngle = Math.cos(angle);
    const sinAngle = Math.sin(angle);
    
    // 시작점을 타원 중심 좌표계로 변환
    const dx = (x1 - x2) / 2;
    const dy = (y1 - y2) / 2;
    const x1p = cosAngle * dx + sinAngle * dy;
    const y1p = -sinAngle * dx + cosAngle * dy;
    
    // 반지름 보정 (필요한 경우)
    let lambda = (x1p * x1p) / (rx * rx) + (y1p * y1p) / (ry * ry);
    if (lambda > 1) {
      const sqrtLambda = Math.sqrt(lambda);
      rx *= sqrtLambda;
      ry *= sqrtLambda;
    }
    
    // 2. 타원 중심 계산
    const sign = largeArcFlag === sweepFlag ? -1 : 1;
    const sq = ((rx * rx) * (ry * ry) - (rx * rx) * (y1p * y1p) - (ry * ry) * (x1p * x1p)) / 
               ((rx * rx) * (y1p * y1p) + (ry * ry) * (x1p * x1p));
    const coef = sign * Math.sqrt(Math.max(0, sq));
    const cxp = coef * ((rx * y1p) / ry);
    const cyp = coef * (-(ry * x1p) / rx);
    
    // 타원 중심을 원래 좌표계로 변환
    const cx = cosAngle * cxp - sinAngle * cyp + (x1 + x2) / 2;
    const cy = sinAngle * cxp + cosAngle * cyp + (y1 + y2) / 2;
    
    // 3. 시작각과 끝각 계산
    const startVectorX = (x1p - cxp) / rx;
    const startVectorY = (y1p - cyp) / ry;
    const startAngle = Math.atan2(startVectorY, startVectorX);
    
    const endVectorX = (-x1p - cxp) / rx;
    const endVectorY = (-y1p - cyp) / ry;
    let sweepAngle = Math.atan2(endVectorY, endVectorX) - startAngle;
    
    // 각도 조정
    if (!sweepFlag && sweepAngle > 0) {
      sweepAngle -= 2 * Math.PI;
    } else if (sweepFlag && sweepAngle < 0) {
      sweepAngle += 2 * Math.PI;
    }
    
    // 4. 호를 여러 개의 베지어 곡선으로 분할
    const segments = Math.ceil(Math.abs(sweepAngle) / (Math.PI / 2));
    const curves: { cp1x: number; cp1y: number; cp2x: number; cp2y: number; x: number; y: number }[] = [];
    
    for (let i = 0; i < segments; i++) {
      const segmentAngle = startAngle + sweepAngle * (i / segments);
      const nextSegmentAngle = startAngle + sweepAngle * ((i + 1) / segments);
      const segmentSweep = nextSegmentAngle - segmentAngle;
      
      // 베지어 곡선 제어점 계산을 위한 상수
      const alpha = Math.sin(segmentSweep) * (Math.sqrt(4 + 3 * Math.tan(segmentSweep / 2) * Math.tan(segmentSweep / 2)) - 1) / 3;
      
      // 현재 세그먼트의 시작점
      const startX = cx + rx * Math.cos(segmentAngle) * cosAngle - ry * Math.sin(segmentAngle) * sinAngle;
      const startY = cy + rx * Math.cos(segmentAngle) * sinAngle + ry * Math.sin(segmentAngle) * cosAngle;
      
      // 현재 세그먼트의 끝점
      const endX = cx + rx * Math.cos(nextSegmentAngle) * cosAngle - ry * Math.sin(nextSegmentAngle) * sinAngle;
      const endY = cy + rx * Math.cos(nextSegmentAngle) * sinAngle + ry * Math.sin(nextSegmentAngle) * cosAngle;
      
      // 제어점 계산
      const cp1x = startX + alpha * (-rx * Math.sin(segmentAngle) * cosAngle - ry * Math.cos(segmentAngle) * sinAngle);
      const cp1y = startY + alpha * (-rx * Math.sin(segmentAngle) * sinAngle + ry * Math.cos(segmentAngle) * cosAngle);
      
      const cp2x = endX - alpha * (-rx * Math.sin(nextSegmentAngle) * cosAngle - ry * Math.cos(nextSegmentAngle) * sinAngle);
      const cp2y = endY - alpha * (-rx * Math.sin(nextSegmentAngle) * sinAngle + ry * Math.cos(nextSegmentAngle) * cosAngle);
      
      // 첫 번째 세그먼트가 아니면 곡선 추가
      if (i > 0 || curves.length === 0) {
        curves.push({
          cp1x, cp1y,
          cp2x, cp2y,
          x: endX, y: endY
        });
      }
    }
    
    return curves;
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
    const transformedPoints: Point2D[] = [];
    
    // 모든 점과 제어점을 변환하여 배열에 추가
    for (const point of this._points) {
      // 점 자체 변환
      const transformed = this.transform.multiply(Matrix3x3.translation(point.x, point.y));
      transformedPoints.push({
        x: transformed.values[2],
        y: transformed.values[5]
      });
      
      // 베지어 곡선의 제어점도 변환하여 추가
      if (point.type === 'quadratic' && point.controlPoint) {
        const transformedCP = this.transform.multiply(
          Matrix3x3.translation(point.controlPoint.x, point.controlPoint.y)
        );
        transformedPoints.push({
          x: transformedCP.values[2],
          y: transformedCP.values[5]
        });
      } else if (point.type === 'cubic' && point.controlPoint1 && point.controlPoint2) {
        const transformedCP1 = this.transform.multiply(
          Matrix3x3.translation(point.controlPoint1.x, point.controlPoint1.y)
        );
        transformedPoints.push({
          x: transformedCP1.values[2],
          y: transformedCP1.values[5]
        });
        
        const transformedCP2 = this.transform.multiply(
          Matrix3x3.translation(point.controlPoint2.x, point.controlPoint2.y)
        );
        transformedPoints.push({
          x: transformedCP2.values[2],
          y: transformedCP2.values[5]
        });
      }
    }

    // 모든 변환된 점들 중 최소/최대 좌표 찾기
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