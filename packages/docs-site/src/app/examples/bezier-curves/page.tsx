"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { VectorEngine } from "@/../../packages/core";
import { ShapePlugin } from "@/../../packages/core/src/plugins/core/shapes/shape-plugin";
import { CanvasRenderer } from "@/../../packages/core/src/plugins/renderers/canvas/canvas-renderer";
import { MathPlugin } from "@/../../packages/core/src/plugins/core/math";
import { DefaultSceneNode } from "@/../../packages/core/src/core/services/scene-node";
import { Path } from "@/../../packages/core/src/plugins/core/shapes/path";

// shadcn UI 컴포넌트 import
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";

/**
 * 제어점 타입 정의
 */
interface ControlPoint {
  x: number;
  y: number;
  isDragging: boolean;
}

/**
 * 베지어 곡선 예제 페이지 컴포넌트
 */
export default function BezierCurvesExample() {
  // 캔버스 참조
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // 컨테이너 참조
  const containerRef = useRef<HTMLDivElement>(null);
  // Vector Engine 참조
  const engineRef = useRef<VectorEngine | null>(null);
  
  // 상태 관리
  const [curveType, setCurveType] = useState<'quadratic' | 'cubic'>('quadratic');
  const [strokeColor, setStrokeColor] = useState<string>("#1d4ed8");
  const [strokeWidth, setStrokeWidth] = useState<number>(2);
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 500 });
  
  // 2차 베지어 곡선 제어점
  const [quadraticPoints, setQuadraticPoints] = useState<{
    start: ControlPoint;
    control: ControlPoint;
    end: ControlPoint;
  }>({
    start: { x: 100, y: 250, isDragging: false },
    control: { x: 400, y: 50, isDragging: false },
    end: { x: 700, y: 250, isDragging: false }
  });
  
  // 3차 베지어 곡선 제어점
  const [cubicPoints, setCubicPoints] = useState<{
    start: ControlPoint;
    control1: ControlPoint;
    control2: ControlPoint;
    end: ControlPoint;
  }>({
    start: { x: 100, y: 250, isDragging: false },
    control1: { x: 250, y: 50, isDragging: false },
    control2: { x: 550, y: 450, isDragging: false },
    end: { x: 700, y: 250, isDragging: false }
  });
  
  // Vector Engine 초기화
  useEffect(() => {
    if (!canvasRef.current) return;
    
    // Vector Engine 생성
    const engine = new VectorEngine();
    
    // 플러그인 등록
    engine.use(new MathPlugin());
    engine.use(new ShapePlugin());
    
    // 렌더러 등록
    const renderer = new CanvasRenderer({
      context: {
        canvas: canvasRef.current,
        contextType: '2d'
      },
      antialias: true,
      autoClear: true
    });
    engine.renderer.register(renderer);
    engine.renderer.setActive('canvas');
    
    // 엔진 참조 저장
    engineRef.current = engine;
    
    return () => {
      if (engineRef.current) {
        // 필요한 정리 작업 수행
      }
    };
  }, []);
  
  // 캔버스 크기 조정
  useEffect(() => {
    const updateCanvasSize = () => {
      if (containerRef.current) {
        const width = containerRef.current.clientWidth;
        const height = Math.min(500, window.innerHeight - 200);
        setCanvasSize({ width, height });
      }
    };
    
    updateCanvasSize();
    window.addEventListener("resize", updateCanvasSize);
    
    return () => {
      window.removeEventListener("resize", updateCanvasSize);
    };
  }, []);
  
  // 베지어 곡선 그리기
  useEffect(() => {
    if (!engineRef.current) return;
    
    const engine = engineRef.current;
    const scene = engine.scene.create();
    const shapePlugin = engine.getPlugin<ShapePlugin>('shape');
    if (!shapePlugin) return;
    
    // 이미 추가된 도형이 있으면 제거
    while (scene.root.children.length > 0) {
      scene.root.removeChild(scene.root.children[0]);
    }
    
    // 현재 선택된 곡선 타입에 따라 베지어 곡선 생성
    const path = shapePlugin.createShape('path', {
      points: [],
      style: {
        strokeColor,
        strokeWidth
      }
    }) as Path;
    
    // 시작점 추가
    if (curveType === 'quadratic') {
      path.addPoint(quadraticPoints.start.x, quadraticPoints.start.y, 'move');
      path.addQuadraticCurve(
        quadraticPoints.control.x,
        quadraticPoints.control.y,
        quadraticPoints.end.x,
        quadraticPoints.end.y
      );
      
      // 제어선 그리기
      const controlLines = shapePlugin.createShape('path', {
        points: [
          { x: quadraticPoints.start.x, y: quadraticPoints.start.y, type: 'move' },
          { x: quadraticPoints.control.x, y: quadraticPoints.control.y, type: 'line' },
          { x: quadraticPoints.end.x, y: quadraticPoints.end.y, type: 'line' }
        ],
        style: {
          strokeColor: '#94a3b8',
          strokeWidth: 1,
          strokeDashArray: [5, 5]
        }
      });
      
      // 제어점 그리기
      const controlPoints = [
        { x: quadraticPoints.start.x, y: quadraticPoints.start.y },
        { x: quadraticPoints.control.x, y: quadraticPoints.control.y },
        { x: quadraticPoints.end.x, y: quadraticPoints.end.y }
      ].map((point, index) => {
        return shapePlugin.createShape('circle', {
          centerX: point.x,
          centerY: point.y,
          radius: 6,
          style: {
            fillColor: index === 1 ? '#3b82f6' : '#ef4444',
            strokeColor: '#ffffff',
            strokeWidth: 2
          }
        });
      });
      
      // 장면에 추가
      const controlLinesNode = new DefaultSceneNode('control-lines', engine.events.createNamespace('control-lines'));
      controlLinesNode.data = controlLines;
      scene.root.addChild(controlLinesNode);
      
      controlPoints.forEach((point, index) => {
        const pointNode = new DefaultSceneNode(`control-point-${index}`, engine.events.createNamespace(`control-point-${index}`));
        pointNode.data = point;
        scene.root.addChild(pointNode);
      });
    } else {
      path.addPoint(cubicPoints.start.x, cubicPoints.start.y, 'move');
      path.addCubicCurve(
        cubicPoints.control1.x,
        cubicPoints.control1.y,
        cubicPoints.control2.x,
        cubicPoints.control2.y,
        cubicPoints.end.x,
        cubicPoints.end.y
      );
      
      // 제어선 그리기
      const controlLines = shapePlugin.createShape('path', {
        points: [
          { x: cubicPoints.start.x, y: cubicPoints.start.y, type: 'move' },
          { x: cubicPoints.control1.x, y: cubicPoints.control1.y, type: 'line' },
          { x: cubicPoints.control2.x, y: cubicPoints.control2.y, type: 'line' },
          { x: cubicPoints.end.x, y: cubicPoints.end.y, type: 'line' }
        ],
        style: {
          strokeColor: '#94a3b8',
          strokeWidth: 1,
          strokeDashArray: [5, 5]
        }
      });
      
      // 제어점 그리기
      const controlPoints = [
        { x: cubicPoints.start.x, y: cubicPoints.start.y },
        { x: cubicPoints.control1.x, y: cubicPoints.control1.y },
        { x: cubicPoints.control2.x, y: cubicPoints.control2.y },
        { x: cubicPoints.end.x, y: cubicPoints.end.y }
      ].map((point, index) => {
        return shapePlugin.createShape('circle', {
          centerX: point.x,
          centerY: point.y,
          radius: 6,
          style: {
            fillColor: index === 1 || index === 2 ? '#3b82f6' : '#ef4444',
            strokeColor: '#ffffff',
            strokeWidth: 2
          }
        });
      });
      
      // 장면에 추가
      const controlLinesNode = new DefaultSceneNode('control-lines', engine.events.createNamespace('control-lines'));
      controlLinesNode.data = controlLines;
      scene.root.addChild(controlLinesNode);
      
      controlPoints.forEach((point, index) => {
        const pointNode = new DefaultSceneNode(`control-point-${index}`, engine.events.createNamespace(`control-point-${index}`));
        pointNode.data = point;
        scene.root.addChild(pointNode);
      });
    }
    
    // 베지어 곡선을 장면에 추가
    const pathNode = new DefaultSceneNode('bezier-curve', engine.events.createNamespace('bezier-curve'));
    pathNode.data = path;
    scene.root.addChild(pathNode);

    // Bounds 시각화
    const bounds = path.bounds;
    const boundsRect = shapePlugin.createShape('rectangle', {
      x: bounds.x,
      y: bounds.y,
      width: bounds.width,
      height: bounds.height,
      style: {
        strokeColor: '#94a3b8',
        strokeWidth: 1,
        strokeDashArray: [4, 4],
        fillColor: 'transparent'
      }
    });
    const boundsNode = new DefaultSceneNode('bounds', engine.events.createNamespace('bounds'));
    boundsNode.data = boundsRect;
    scene.root.addChild(boundsNode);
    
    // 장면 렌더링
    engine.renderer.render(scene);
  }, [curveType, strokeColor, strokeWidth, quadraticPoints, cubicPoints]);
  
  // 마우스 이벤트 핸들러
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // 제어점과의 거리 확인
    const checkPoint = (point: ControlPoint) => {
      const dx = point.x - x;
      const dy = point.y - y;
      return Math.sqrt(dx * dx + dy * dy) < 10;
    };
    
    if (curveType === 'quadratic') {
      if (checkPoint(quadraticPoints.start)) {
        setQuadraticPoints(prev => ({
          ...prev,
          start: { ...prev.start, isDragging: true }
        }));
      } else if (checkPoint(quadraticPoints.control)) {
        setQuadraticPoints(prev => ({
          ...prev,
          control: { ...prev.control, isDragging: true }
        }));
      } else if (checkPoint(quadraticPoints.end)) {
        setQuadraticPoints(prev => ({
          ...prev,
          end: { ...prev.end, isDragging: true }
        }));
      }
    } else {
      if (checkPoint(cubicPoints.start)) {
        setCubicPoints(prev => ({
          ...prev,
          start: { ...prev.start, isDragging: true }
        }));
      } else if (checkPoint(cubicPoints.control1)) {
        setCubicPoints(prev => ({
          ...prev,
          control1: { ...prev.control1, isDragging: true }
        }));
      } else if (checkPoint(cubicPoints.control2)) {
        setCubicPoints(prev => ({
          ...prev,
          control2: { ...prev.control2, isDragging: true }
        }));
      } else if (checkPoint(cubicPoints.end)) {
        setCubicPoints(prev => ({
          ...prev,
          end: { ...prev.end, isDragging: true }
        }));
      }
    }
  };
  
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    if (curveType === 'quadratic') {
      if (quadraticPoints.start.isDragging) {
        setQuadraticPoints(prev => ({
          ...prev,
          start: { ...prev.start, x, y }
        }));
      } else if (quadraticPoints.control.isDragging) {
        setQuadraticPoints(prev => ({
          ...prev,
          control: { ...prev.control, x, y }
        }));
      } else if (quadraticPoints.end.isDragging) {
        setQuadraticPoints(prev => ({
          ...prev,
          end: { ...prev.end, x, y }
        }));
      }
    } else {
      if (cubicPoints.start.isDragging) {
        setCubicPoints(prev => ({
          ...prev,
          start: { ...prev.start, x, y }
        }));
      } else if (cubicPoints.control1.isDragging) {
        setCubicPoints(prev => ({
          ...prev,
          control1: { ...prev.control1, x, y }
        }));
      } else if (cubicPoints.control2.isDragging) {
        setCubicPoints(prev => ({
          ...prev,
          control2: { ...prev.control2, x, y }
        }));
      } else if (cubicPoints.end.isDragging) {
        setCubicPoints(prev => ({
          ...prev,
          end: { ...prev.end, x, y }
        }));
      }
    }
  };
  
  const handleMouseUp = () => {
    if (curveType === 'quadratic') {
      setQuadraticPoints(prev => ({
        ...prev,
        start: { ...prev.start, isDragging: false },
        control: { ...prev.control, isDragging: false },
        end: { ...prev.end, isDragging: false }
      }));
    } else {
      setCubicPoints(prev => ({
        ...prev,
        start: { ...prev.start, isDragging: false },
        control1: { ...prev.control1, isDragging: false },
        control2: { ...prev.control2, isDragging: false },
        end: { ...prev.end, isDragging: false }
      }));
    }
  };
  
  // 코드 예제 텍스트
  const getCodeExample = () => {
    if (curveType === 'quadratic') {
      return `// 2차 베지어 곡선 생성 예제
const shapePlugin = engine.getPlugin('shape');
const path = shapePlugin.createShape('path', {
  points: [],
  style: {
    strokeColor: '${strokeColor}',
    strokeWidth: ${strokeWidth}
  }
});

// 시작점 추가
path.addPoint(${Math.round(quadraticPoints.start.x)}, ${Math.round(quadraticPoints.start.y)}, 'move');

// 2차 베지어 곡선 추가
path.addQuadraticCurve(
  ${Math.round(quadraticPoints.control.x)}, ${Math.round(quadraticPoints.control.y)},
  ${Math.round(quadraticPoints.end.x)}, ${Math.round(quadraticPoints.end.y)}
);

// SVG path 문자열로 변환
const svgPath = path.toSVGPath();
// 결과: "M${Math.round(quadraticPoints.start.x)},${Math.round(quadraticPoints.start.y)} Q${Math.round(quadraticPoints.control.x)},${Math.round(quadraticPoints.control.y)} ${Math.round(quadraticPoints.end.x)},${Math.round(quadraticPoints.end.y)}"`;
    } else {
      return `// 3차 베지어 곡선 생성 예제
const shapePlugin = engine.getPlugin('shape');
const path = shapePlugin.createShape('path', {
  points: [],
  style: {
    strokeColor: '${strokeColor}',
    strokeWidth: ${strokeWidth}
  }
});

// 시작점 추가
path.addPoint(${Math.round(cubicPoints.start.x)}, ${Math.round(cubicPoints.start.y)}, 'move');

// 3차 베지어 곡선 추가
path.addCubicCurve(
  ${Math.round(cubicPoints.control1.x)}, ${Math.round(cubicPoints.control1.y)},
  ${Math.round(cubicPoints.control2.x)}, ${Math.round(cubicPoints.control2.y)},
  ${Math.round(cubicPoints.end.x)}, ${Math.round(cubicPoints.end.y)}
);

// SVG path 문자열로 변환
const svgPath = path.toSVGPath();
// 결과: "M${Math.round(cubicPoints.start.x)},${Math.round(cubicPoints.start.y)} C${Math.round(cubicPoints.control1.x)},${Math.round(cubicPoints.control1.y)} ${Math.round(cubicPoints.control2.x)},${Math.round(cubicPoints.control2.y)} ${Math.round(cubicPoints.end.x)},${Math.round(cubicPoints.end.y)}"`;
    }
  };
  
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 w-full border-b bg-background">
        <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
          <div className="flex gap-6 md:gap-10">
            <Link href="/" className="flex items-center space-x-2">
              <span className="inline-block font-bold">Modern Vector.js</span>
            </Link>
            <nav className="flex gap-6">
              <Link
                href="/docs"
                className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                Documentation
              </Link>
              <Link
                href="/api-docs"
                className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                API Reference
              </Link>
              <Link
                href="/examples"
                className="flex items-center text-sm font-medium text-foreground transition-colors hover:text-foreground"
              >
                Examples
              </Link>
            </nav>
          </div>
        </div>
      </header>
      
      <main className="flex-1 container py-6">
        <div className="flex flex-col space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">베지어 곡선 예제</h1>
            <p className="text-muted-foreground mt-2">
              Modern Vector.js를 사용하여 2차와 3차 베지어 곡선을 생성하고 조작하는 방법을 보여주는 인터랙티브 예제입니다.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* 캔버스 영역 */}
            <Card className="lg:col-span-3">
              <CardContent className="p-4" ref={containerRef}>
                <canvas
                  ref={canvasRef}
                  width={canvasSize.width}
                  height={canvasSize.height}
                  className="border rounded bg-white dark:bg-gray-800 w-full h-auto cursor-pointer"
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                />
              </CardContent>
            </Card>
            
            {/* 컨트롤 패널 */}
            <div className="space-y-6">
              {/* 곡선 타입 선택 */}
              <Card>
                <CardHeader>
                  <CardTitle>곡선 타입</CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs value={curveType} onValueChange={(value) => setCurveType(value as 'quadratic' | 'cubic')}>
                    <TabsList className="w-full grid grid-cols-2">
                      <TabsTrigger value="quadratic">2차 베지어</TabsTrigger>
                      <TabsTrigger value="cubic">3차 베지어</TabsTrigger>
                    </TabsList>
                    
                    <div className="mt-4">
                      <p className="text-sm text-muted-foreground">
                        {curveType === 'quadratic' ? 
                          '2차 베지어 곡선은 하나의 제어점을 사용하여 부드러운 곡선을 생성합니다.' :
                          '3차 베지어 곡선은 두 개의 제어점을 사용하여 더 복잡하고 유연한 곡선을 생성합니다.'
                        }
                      </p>
                    </div>
                  </Tabs>
                </CardContent>
              </Card>
              
              {/* 곡선 속성 */}
              <Card>
                <CardHeader>
                  <CardTitle>곡선 속성</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* 선 색상 */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">선 색상</label>
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 rounded-md border overflow-hidden">
                        <input
                          type="color"
                          value={strokeColor}
                          onChange={(e) => setStrokeColor(e.target.value)}
                          className="w-10 h-10 transform -translate-x-1 -translate-y-1 cursor-pointer"
                        />
                      </div>
                      <Input
                        value={strokeColor}
                        onChange={(e) => setStrokeColor(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  {/* 선 두께 */}
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <label className="text-sm font-medium">선 두께</label>
                      <span className="text-sm text-muted-foreground">{strokeWidth}px</span>
                    </div>
                    <Slider
                      min={1}
                      max={10}
                      step={1}
                      value={[strokeWidth]}
                      onValueChange={(value) => setStrokeWidth(value[0])}
                    />
                  </div>
                </CardContent>
              </Card>
              
              {/* 코드 예제 */}
              <Card>
                <CardHeader>
                  <CardTitle>코드 예제</CardTitle>
                </CardHeader>
                <CardContent>
                  <pre className="bg-muted p-3 rounded-md font-mono text-xs overflow-auto max-h-60">
                    <code>{getCodeExample()}</code>
                  </pre>
                </CardContent>
              </Card>
            </div>
          </div>
          
          <Card className="mt-4">
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold mb-4">베지어 곡선 사용하기</h2>
              <p className="mb-4">
                베지어 곡선은 부드러운 곡선을 생성하는 데 사용되는 매개변수 곡선입니다.
                Modern Vector.js는 2차와 3차 베지어 곡선을 지원하며, 이를 통해 복잡한 형태의 경로를 만들 수 있습니다.
              </p>
              <p className="mb-4">
                위 인터랙티브 데모에서는 다음과 같은 기능을 사용할 수 있습니다:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-1">
                <li>2차 또는 3차 베지어 곡선 선택</li>
                <li>제어점을 드래그하여 곡선 모양 조정</li>
                <li>선 색상 및 두께 설정</li>
                <li>실시간으로 생성되는 코드 예제 확인</li>
              </ul>
              <p>
                베지어 곡선은 SVG path 문자열로도 표현할 수 있으며, Modern Vector.js는 SVG path 문자열과의 상호 변환을 지원합니다.
                자세한 내용은 <Link href="/docs" className="text-blue-600 dark:text-blue-400 hover:underline">문서</Link>를 참조하세요.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            Built with Next.js, Tailwind CSS, and shadcn/ui.
          </p>
        </div>
      </footer>
    </div>
  );
} 