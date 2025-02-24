/**
 * 수치 계산의 정확도 향상을 위한 유틸리티
 */

/**
 * 수치 계산을 위한 상수들
 */
export const EPSILON = 1e-10;
export const EPSILON_SQUARE = EPSILON * EPSILON;
export const PI = Math.PI;
export const TWO_PI = PI * 2;
export const HALF_PI = PI / 2;

/**
 * 두 수가 거의 같은지 비교
 */
export function isAlmostEqual(a: number, b: number, epsilon: number = EPSILON): boolean {
  return Math.abs(a - b) <= epsilon;
}

/**
 * 수가 거의 0인지 확인
 */
export function isAlmostZero(x: number, epsilon: number = EPSILON): boolean {
  return Math.abs(x) <= epsilon;
}

/**
 * 각도를 0~2π 범위로 정규화
 */
export function normalizeAngle(angle: number): number {
  angle = angle % TWO_PI;
  return angle < 0 ? angle + TWO_PI : angle;
}

/**
 * 두 각도 사이의 최소 차이 계산
 */
export function angleDifference(a: number, b: number): number {
  const diff = normalizeAngle(b - a);
  return diff > PI ? TWO_PI - diff : diff;
}

/**
 * 3차 방정식의 해를 구함
 * ax³ + bx² + cx + d = 0
 */
export function solveCubic(
  a: number,
  b: number,
  c: number,
  d: number
): number[] {
  // 수치 안정성을 위해 계수들을 정규화
  const scale = Math.max(Math.abs(a), Math.abs(b), Math.abs(c), Math.abs(d));
  if (scale > 1) {
    a /= scale;
    b /= scale;
    c /= scale;
    d /= scale;
  }

  // 특수한 경우 처리
  if (isAlmostZero(a)) {
    return solveQuadratic(b, c, d);
  }

  // 일반적인 경우
  const p = (3 * a * c - b * b) / (3 * a * a);
  const q = (2 * b * b * b - 9 * a * b * c + 27 * a * a * d) / (27 * a * a * a);

  if (isAlmostZero(p)) {
    // x³ + q = 0
    const u = Math.cbrt(-q);
    return [u - b / (3 * a)];
  }

  if (isAlmostZero(q)) {
    // x³ + px = 0
    const roots = [0];
    if (p < 0) {
      const u = Math.sqrt(-p);
      roots.push(u, -u);
    }
    return roots.map(x => x - b / (3 * a));
  }

  const D = q * q / 4 + p * p * p / 27;

  if (isAlmostZero(D)) {
    // 중근이 있는 경우
    const u = Math.cbrt(-q / 2);
    return [
      2 * u - b / (3 * a),
      -u - b / (3 * a)
    ];
  }

  if (D > 0) {
    // 한 개의 실근
    const u = Math.cbrt(-q / 2 + Math.sqrt(D));
    const v = Math.cbrt(-q / 2 - Math.sqrt(D));
    return [u + v - b / (3 * a)];
  }

  // 세 개의 실근
  const phi = Math.acos(-q / (2 * Math.sqrt(-p * p * p / 27)));
  const t = 2 * Math.sqrt(-p / 3);
  return [
    t * Math.cos(phi / 3) - b / (3 * a),
    t * Math.cos((phi + TWO_PI) / 3) - b / (3 * a),
    t * Math.cos((phi + 4 * PI) / 3) - b / (3 * a)
  ];
}

/**
 * 2차 방정식의 해를 구함
 * ax² + bx + c = 0
 */
export function solveQuadratic(
  a: number,
  b: number,
  c: number
): number[] {
  if (isAlmostZero(a)) {
    if (isAlmostZero(b)) return [];
    return [-c / b];
  }

  const discriminant = b * b - 4 * a * c;
  
  if (isAlmostZero(discriminant)) {
    return [-b / (2 * a)];
  }

  if (discriminant < 0) {
    return [];
  }

  // 수치 안정성을 위해 더 정확한 공식 사용
  const q = -(b + Math.sign(b) * Math.sqrt(discriminant)) / 2;
  const roots = [q / a];
  if (!isAlmostZero(q)) {
    roots.push(c / q);
  }
  return roots;
}

/**
 * 점이 선분 위에 있는지 확인
 */
export function isPointOnLine(
  px: number,
  py: number,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  epsilon: number = EPSILON
): boolean {
  // 선분의 길이가 0인 경우
  if (isAlmostEqual(x1, x2) && isAlmostEqual(y1, y2)) {
    return isAlmostEqual(px, x1) && isAlmostEqual(py, y1);
  }

  // 점과 선분 사이의 거리 계산
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len2 = dx * dx + dy * dy;
  const t = ((px - x1) * dx + (py - y1) * dy) / len2;

  if (t < 0 || t > 1) {
    return false;
  }

  const distance2 = Math.pow(px - (x1 + t * dx), 2) + 
                   Math.pow(py - (y1 + t * dy), 2);
  return distance2 <= epsilon * epsilon;
}

/**
 * 베지어 곡선의 제어점들이 거의 일직선 상에 있는지 확인
 */
export function isBezierFlat(
  x1: number, y1: number,
  x2: number, y2: number,
  x3: number, y3: number,
  x4: number, y4: number,
  epsilon: number = EPSILON
): boolean {
  // 제어점들 사이의 거리 계산
  const ux = 3 * x2 - 2 * x1 - x4;
  const uy = 3 * y2 - 2 * y1 - y4;
  const vx = 3 * x3 - 2 * x4 - x1;
  const vy = 3 * y3 - 2 * y4 - y1;

  return Math.max(ux * ux, vx * vx) + Math.max(uy * uy, vy * vy) <= 16 * epsilon * epsilon;
}