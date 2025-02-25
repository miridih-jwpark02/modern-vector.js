/**
 * 예제 데이터 관리
 */

import { Example } from './types';

// 예제 데이터
const examples: Record<string, Example> = {
  'basic-shapes': {
    title: '기본 도형',
    description: '사각형, 원, 선, 다각형 등 기본 도형 그리기',
    code: `// Canvas 요소 가져오기
const canvas = document.getElementById('canvas');
const engine = new VectorEngine();

// 렌더러 설정
engine.use(CanvasRendererPlugin);

// 도형 생성
const rect = engine.scene.createRect({
  x: 50,
  y: 50,
  width: 100,
  height: 80,
  fill: '#3498db',
  stroke: '#2980b9',
  strokeWidth: 2
});

const circle = engine.scene.createCircle({
  x: 250,
  y: 100,
  radius: 50,
  fill: '#e74c3c',
  stroke: '#c0392b',
  strokeWidth: 2
});

const line = engine.scene.createLine({
  x1: 50,
  y1: 200,
  x2: 350,
  y2: 200,
  stroke: '#2ecc71',
  strokeWidth: 3
});

// 렌더링
engine.renderer.render();`,
    setupFunction: 'setupBasicShapes'
  },
  'transformations': {
    title: '변환',
    description: '이동, 회전, 크기 조절 등 변환 적용하기',
    code: `// Canvas 요소 가져오기
const canvas = document.getElementById('canvas');
const engine = new VectorEngine();

// 렌더러 설정
engine.use(CanvasRendererPlugin);

// 도형 생성
const rect = engine.scene.createRect({
  x: 150,
  y: 100,
  width: 100,
  height: 80,
  fill: '#3498db'
});

// 변환 적용
rect.translate(50, 0);
rect.rotate(45);
rect.scale(1.5, 1);

// 렌더링
engine.renderer.render();`,
    setupFunction: 'setupTransformations'
  },
  'path-operations': {
    title: '패스 연산',
    description: '합집합, 교집합, 차집합 등 패스 연산',
    code: `// Canvas 요소 가져오기
const canvas = document.getElementById('canvas');
const engine = new VectorEngine();

// 렌더러 및 패스 연산 플러그인 설정
engine.use(CanvasRendererPlugin);
engine.use(PathOperationsPlugin);

// 도형 생성
const circle1 = engine.scene.createCircle({
  x: 120,
  y: 100,
  radius: 60,
  fill: 'rgba(52, 152, 219, 0.7)'
});

const circle2 = engine.scene.createCircle({
  x: 180,
  y: 100,
  radius: 60,
  fill: 'rgba(231, 76, 60, 0.7)'
});

// 패스 연산
const union = engine.scene.pathOp.union(circle1, circle2);
union.fill = '#2ecc71';
union.translate(0, 150);

// 렌더링
engine.renderer.render();`,
    setupFunction: 'setupPathOperations'
  },
  'svg-renderer': {
    title: 'SVG 렌더러',
    description: 'SVG 렌더링 엔진을 사용한 벡터 그래픽',
    code: `// SVG 요소 가져오기
const svgContainer = document.getElementById('svg-container');
const engine = new VectorEngine();

// SVG 렌더러 설정
engine.use(SVGRendererPlugin);

// 도형 생성
const rect = engine.scene.createRect({
  x: 50,
  y: 50,
  width: 100,
  height: 80,
  fill: '#3498db',
  rx: 10,
  ry: 10
});

const circle = engine.scene.createCircle({
  x: 250,
  y: 100,
  radius: 50,
  fill: 'url(#gradient)'
});

// 그라디언트 정의
const gradient = engine.renderer.createLinearGradient({
  id: 'gradient',
  x1: 0,
  y1: 0,
  x2: 1,
  y2: 1,
  stops: [
    { offset: 0, color: '#e74c3c' },
    { offset: 1, color: '#f39c12' }
  ]
});

// 렌더링
engine.renderer.render();`,
    setupFunction: 'setupSVGRenderer'
  }
};

/**
 * 예제 데이터 로드
 */
export function loadExamples(): void {
  console.log('예제 데이터 로드됨:', Object.keys(examples).length);
}

/**
 * 예제 데이터 가져오기
 * @param id - 예제 ID
 * @returns 예제 데이터 또는 undefined
 */
export function getExample(id: string): Example | undefined {
  return examples[id];
}

/**
 * 모든 예제 데이터 가져오기
 * @returns 모든 예제 데이터
 */
export function getAllExamples(): Record<string, Example> {
  return examples;
} 