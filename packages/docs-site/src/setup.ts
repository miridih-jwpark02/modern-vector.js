/**
 * 예제 설정
 */

import { getExample } from './examples';
import { ExampleSetupFunction } from './types';
import { VectorEngine } from 'modern-vector.js';
import { CanvasRendererPlugin, SVGRendererPlugin, PathOperationsPlugin } from './plugins';

// 예제 설정 함수 맵
const setupFunctions: Record<string, ExampleSetupFunction> = {
  setupBasicShapes: (container: HTMLElement) => {
    // 기본 도형 예제 설정
    const canvas = document.createElement('canvas');
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
    container.appendChild(canvas);
    
    // Modern Vector.js 엔진 초기화
    const engine = new VectorEngine();
    engine.use(CanvasRendererPlugin);
    
    // 사각형 생성
    engine.scene.createRect({
      x: 50,
      y: 50,
      width: 100,
      height: 80,
      fill: '#3498db',
      stroke: '#2980b9',
      strokeWidth: 2
    });
    
    // 원 생성
    engine.scene.createCircle({
      x: 250,
      y: 100,
      radius: 50,
      fill: '#e74c3c',
      stroke: '#c0392b',
      strokeWidth: 2
    });
    
    // 선 생성
    engine.scene.createLine({
      x1: 50,
      y1: 200,
      x2: 350,
      y2: 200,
      stroke: '#2ecc71',
      strokeWidth: 3
    });
    
    // 렌더링
    engine.renderer.render();
  },
  
  setupTransformations: (container: HTMLElement) => {
    // 변환 예제 설정
    const canvas = document.createElement('canvas');
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
    container.appendChild(canvas);
    
    // Modern Vector.js 엔진 초기화
    const engine = new VectorEngine();
    engine.use(CanvasRendererPlugin);
    
    // 사각형 생성
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
    engine.renderer.render();
  },
  
  setupPathOperations: (container: HTMLElement) => {
    // 패스 연산 예제 설정
    const canvas = document.createElement('canvas');
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
    container.appendChild(canvas);
    
    // Modern Vector.js 엔진 초기화
    const engine = new VectorEngine();
    engine.use(CanvasRendererPlugin);
    engine.use(PathOperationsPlugin);
    
    // 첫 번째 원
    const circle1 = engine.scene.createCircle({
      x: 120,
      y: 100,
      radius: 60,
      fill: 'rgba(52, 152, 219, 0.7)'
    });
    
    // 두 번째 원
    const circle2 = engine.scene.createCircle({
      x: 180,
      y: 100,
      radius: 60,
      fill: 'rgba(231, 76, 60, 0.7)'
    });
    
    // 합집합 연산
    if (engine.scene.pathOp) {
      const union = engine.scene.pathOp.union(circle1, circle2);
      union.fill = '#2ecc71';
      union.translate(0, 150);
    }
    
    // 렌더링
    engine.renderer.render();
  },
  
  setupSVGRenderer: (container: HTMLElement) => {
    // SVG 렌더러 예제 설정
    const svgContainer = document.createElement('div');
    svgContainer.style.width = '100%';
    svgContainer.style.height = '100%';
    container.appendChild(svgContainer);
    
    // Modern Vector.js 엔진 초기화
    const engine = new VectorEngine();
    engine.use(SVGRendererPlugin);
    
    // 그라디언트 정의
    const gradientId = engine.renderer.createLinearGradient({
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
    
    // 사각형 생성
    engine.scene.createRect({
      x: 50,
      y: 50,
      width: 100,
      height: 80,
      fill: '#3498db',
      rx: 10,
      ry: 10
    });
    
    // 원 생성
    engine.scene.createCircle({
      x: 250,
      y: 100,
      radius: 50,
      fill: `url(#${gradientId})`
    });
    
    // 렌더링
    engine.renderer.render();
  }
};

/**
 * 예제 설정
 * @param id - 예제 ID
 * @param container - 컨테이너 요소
 */
export function setupExample(id: string, container: HTMLElement): void {
  const example = getExample(id);
  if (!example) return;
  
  const setupFunction = setupFunctions[example.setupFunction];
  if (setupFunction) {
    setupFunction(container);
  }
}

/**
 * 예제 미리보기 설정
 * @param id - 예제 ID
 * @param container - 컨테이너 요소
 */
export function setupPreview(id: string, container: HTMLElement): void {
  const example = getExample(id);
  if (!example) return;
  
  const setupFunction = setupFunctions[example.setupFunction];
  if (setupFunction) {
    setupFunction(container);
  }
} 