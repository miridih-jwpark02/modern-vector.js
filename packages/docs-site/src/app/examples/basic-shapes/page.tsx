"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { VectorEngine } from "@/../../packages/core";
import { ShapePlugin } from "@/../../packages/core/src/plugins/core/shapes/shape-plugin";
import { CanvasRenderer } from "@/../../packages/core/src/plugins/renderers/canvas/canvas-renderer";
import { MathPlugin } from "@/../../packages/core/src/plugins/core/math";
import { DefaultSceneNode } from "@/../../packages/core/src/core/services/scene-node";

// shadcn UI 컴포넌트 import
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";

/**
 * Shape 타입 정의
 * 도형의 종류를 정의합니다.
 */
type ShapeType = "circle" | "rectangle" | "triangle" | "line" | "star";

/**
 * Shape 인터페이스
 * 도형의 속성을 정의합니다.
 */
interface Shape {
  id: string;
  type: ShapeType;
  x: number;
  y: number;
  width: number;
  height: number;
  fill: string;
  stroke: string;
  strokeWidth: number;
  rotation: number;
}

/**
 * 기본 도형 예제 페이지 컴포넌트
 */
export default function BasicShapesExample() {
  // 캔버스 참조
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // 컨테이너 참조
  const containerRef = useRef<HTMLDivElement>(null);
  // Vector Engine 참조
  const engineRef = useRef<VectorEngine | null>(null);
  
  // 상태 관리
  const [currentType, setCurrentType] = useState<ShapeType>("circle");
  const [currentFill, setCurrentFill] = useState<string>("#3b82f6");
  const [currentStroke, setCurrentStroke] = useState<string>("#1d4ed8");
  const [currentStrokeWidth, setCurrentStrokeWidth] = useState<number>(2);
  const [currentSize, setCurrentSize] = useState<number>(100);
  const [currentRotation, setCurrentRotation] = useState<number>(0);
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 500 });
  
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
      // 정리 작업
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
  
  // 도형 그리기
  useEffect(() => {
    if (!canvasRef.current || !engineRef.current) return;
    
    const engine = engineRef.current;
    
    // 장면 생성
    const scene = engine.scene.create();
    
    // 도형 플러그인 가져오기
    const shapePlugin = engine.getPlugin<ShapePlugin>('shape');
    if (!shapePlugin) return;
    
    // 이미 추가된 도형이 있으면 제거
    while (scene.root.children.length > 0) {
      scene.root.removeChild(scene.root.children[0]);
    }
    
    // 현재 선택된 도형 타입에 따라 도형 생성
    let vectorShape;
    
    switch (currentType) {
      case "circle":
        vectorShape = shapePlugin.createShape('circle', {
          centerX: canvasSize.width / 2,
          centerY: canvasSize.height / 2,
          radius: currentSize / 2,
          style: {
            fillColor: currentFill,
            strokeColor: currentStroke,
            strokeWidth: currentStrokeWidth
          }
        });
        break;
        
      case "rectangle":
        vectorShape = shapePlugin.createShape('rectangle', {
          x: canvasSize.width / 2 - currentSize / 2,
          y: canvasSize.height / 2 - currentSize / 2,
          width: currentSize,
          height: currentSize,
          style: {
            fillColor: currentFill,
            strokeColor: currentStroke,
            strokeWidth: currentStrokeWidth
          }
        });
        break;
        
      case "triangle":
        // 삼각형은 path로 구현
        const halfSize = currentSize / 2;
        vectorShape = shapePlugin.createShape('path', {
          points: [
            { x: canvasSize.width / 2, y: canvasSize.height / 2 - halfSize, type: 'move' },
            { x: canvasSize.width / 2 + halfSize, y: canvasSize.height / 2 + halfSize, type: 'line' },
            { x: canvasSize.width / 2 - halfSize, y: canvasSize.height / 2 + halfSize, type: 'line' },
            { x: canvasSize.width / 2, y: canvasSize.height / 2 - halfSize, type: 'line' }
          ],
          style: {
            fillColor: currentFill,
            strokeColor: currentStroke,
            strokeWidth: currentStrokeWidth
          }
        });
        break;
        
      case "line":
        vectorShape = shapePlugin.createShape('line', {
          x1: canvasSize.width / 2 - currentSize / 2,
          y1: canvasSize.height / 2,
          x2: canvasSize.width / 2 + currentSize / 2,
          y2: canvasSize.height / 2,
          style: {
            strokeColor: currentStroke,
            strokeWidth: currentStrokeWidth
          }
        });
        break;
        
      case "star":
        // 별 모양 계산
        const points = [];
        const spikes = 5;
        const outerRadius = currentSize / 2;
        const innerRadius = currentSize / 4;
        
        for (let i = 0; i < spikes * 2; i++) {
          const radius = i % 2 === 0 ? outerRadius : innerRadius;
          const angle = (Math.PI / spikes) * i;
          const x = canvasSize.width / 2 + Math.cos(angle) * radius;
          const y = canvasSize.height / 2 + Math.sin(angle) * radius;
          
          points.push({
            x, y, 
            type: i === 0 ? 'move' : 'line'
          });
        }
        
        // 닫힌 경로를 위해 첫 점 추가
        points.push({
          x: points[0].x,
          y: points[0].y,
          type: 'line'
        });
        
        vectorShape = shapePlugin.createShape('path', {
          points,
          style: {
            fillColor: currentFill,
            strokeColor: currentStroke,
            strokeWidth: currentStrokeWidth
          }
        });
        break;
    }
    
    // 도형이 생성되었으면 장면에 추가
    if (vectorShape) {
      // 도형을 SceneNode로 변환하여 추가
      const nodeId = `shape-${currentType}`;
      const sceneNode = new DefaultSceneNode(nodeId, engine.events.createNamespace(nodeId));
      sceneNode.data = vectorShape;
      
      // 회전 적용
      // 참고: 현재 버전에서는 회전이 직접 지원되지 않아 비활성화
      // 향후 라이브러리에서 transform API가 완성되면 활성화
      
      scene.root.addChild(sceneNode);
    }
    
    // 장면 렌더링
    engine.renderer.render(scene);
  }, [currentType, currentFill, currentStroke, currentStrokeWidth, currentSize, currentRotation, canvasSize]);
  
  // 도형 타입에 따른 설명 텍스트
  const getShapeDescription = () => {
    switch (currentType) {
      case "circle":
        return "원은 중심점과 반지름으로 정의됩니다. 중심점은 (x, y) 좌표로, 반지름은 픽셀 단위로 지정합니다.";
      case "rectangle":
        return "사각형은 좌상단 좌표 (x, y)와 너비, 높이로 정의됩니다. 모든 값은 픽셀 단위입니다.";
      case "triangle":
        return "삼각형은 세 꼭지점의 좌표로 정의됩니다. 각 꼭지점은 (x, y) 좌표로 지정합니다.";
      case "line":
        return "선은 시작점 (x1, y1)과 끝점 (x2, y2)으로 정의됩니다. 선에는 채우기 색상이 적용되지 않습니다.";
      case "star":
        return "별은 중심점, 외부 반지름, 내부 반지름, 꼭지점 수로 정의됩니다. 이 예제에서는 5개의 꼭지점을 가진 별을 생성합니다.";
      default:
        return "";
    }
  };
  
  // 코드 예제 텍스트
  const getCodeExample = () => {
    switch (currentType) {
      case "circle":
        return `// 원 생성 예제
const shapePlugin = engine.getPlugin('shape');
const circle = shapePlugin.createShape('circle', {
  centerX: canvas.width / 2,
  centerY: canvas.height / 2,
  radius: ${currentSize / 2},
  style: {
    fillColor: '${currentFill}',
    strokeColor: '${currentStroke}',
    strokeWidth: ${currentStrokeWidth}
  }
});

// 장면에 도형 추가
scene.root.addChild(circle);`;
      case "rectangle":
        return `// 사각형 생성 예제
const shapePlugin = engine.getPlugin('shape');
const rectangle = shapePlugin.createShape('rectangle', {
  x: canvas.width / 2 - ${currentSize / 2},
  y: canvas.height / 2 - ${currentSize / 2},
  width: ${currentSize},
  height: ${currentSize},
  style: {
    fillColor: '${currentFill}',
    strokeColor: '${currentStroke}',
    strokeWidth: ${currentStrokeWidth}
  }
});

// 장면에 도형 추가
scene.root.addChild(rectangle);`;
      case "triangle":
        return `// 삼각형 생성 예제
const shapePlugin = engine.getPlugin('shape');
const triangle = shapePlugin.createShape('path', {
  points: [
    { x: canvas.width / 2, y: canvas.height / 2 - ${currentSize / 2}, type: 'move' },
    { x: canvas.width / 2 + ${currentSize / 2}, y: canvas.height / 2 + ${currentSize / 2}, type: 'line' },
    { x: canvas.width / 2 - ${currentSize / 2}, y: canvas.height / 2 + ${currentSize / 2}, type: 'line' },
    { x: canvas.width / 2, y: canvas.height / 2 - ${currentSize / 2}, type: 'line' }
  ],
  style: {
    fillColor: '${currentFill}',
    strokeColor: '${currentStroke}',
    strokeWidth: ${currentStrokeWidth}
  }
});

// 장면에 도형 추가
scene.root.addChild(triangle);`;
      case "line":
        return `// 선 생성 예제
const shapePlugin = engine.getPlugin('shape');
const line = shapePlugin.createShape('line', {
  x1: canvas.width / 2 - ${currentSize / 2},
  y1: canvas.height / 2,
  x2: canvas.width / 2 + ${currentSize / 2},
  y2: canvas.height / 2,
  style: {
    strokeColor: '${currentStroke}',
    strokeWidth: ${currentStrokeWidth}
  }
});

// 장면에 도형 추가
scene.root.addChild(line);`;
      case "star":
        return `// 별 생성 예제
const shapePlugin = engine.getPlugin('shape');
const star = shapePlugin.createShape('path', {
  points: calculateStarPoints(canvas.width / 2, canvas.height / 2, 5, ${currentSize / 2}, ${currentSize / 4}),
  style: {
    fillColor: '${currentFill}',
    strokeColor: '${currentStroke}',
    strokeWidth: ${currentStrokeWidth}
  }
});

// 별 꼭지점 계산 함수
function calculateStarPoints(centerX, centerY, spikes, outerRadius, innerRadius) {
  const points = [];
  const angleStep = Math.PI / spikes;
  
  for (let i = 0; i < spikes * 2; i++) {
    const radius = i % 2 === 0 ? outerRadius : innerRadius;
    const angle = i * angleStep;
    const x = centerX + Math.cos(angle) * radius;
    const y = centerY + Math.sin(angle) * radius;
    
    points.push({
      x, y, 
      type: i === 0 ? 'move' : 'line'
    });
  }
  
  // 닫힌 경로를 위해 첫 점 추가
  points.push({
    x: points[0].x,
    y: points[0].y,
    type: 'line'
  });
  
  return points;
}`;
      default:
        return "";
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
            <h1 className="text-3xl font-bold tracking-tight">기본 도형 예제</h1>
            <p className="text-muted-foreground mt-2">
              Modern Vector.js를 사용하여 기본 도형을 생성하고 조작하는 방법을 보여주는 인터랙티브 예제입니다.
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
                />
              </CardContent>
            </Card>
            
            {/* 컨트롤 패널 */}
            <div className="space-y-6">
              {/* 도형 선택 탭 */}
              <Card>
                <CardHeader>
                  <CardTitle>도형 선택</CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue={currentType} onValueChange={(value) => setCurrentType(value as ShapeType)}>
                    <TabsList className="w-full grid grid-cols-5">
                      <TabsTrigger value="circle">원</TabsTrigger>
                      <TabsTrigger value="rectangle">사각형</TabsTrigger>
                      <TabsTrigger value="triangle">삼각형</TabsTrigger>
                      <TabsTrigger value="line">선</TabsTrigger>
                      <TabsTrigger value="star">별</TabsTrigger>
                    </TabsList>
                    
                    <div className="mt-4">
                      <p className="text-sm text-muted-foreground">
                        {getShapeDescription()}
                      </p>
                    </div>
                  </Tabs>
                </CardContent>
              </Card>
              
              {/* 도형 속성 컨트롤 */}
              <Card>
                <CardHeader>
                  <CardTitle>도형 속성</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* 크기 컨트롤 */}
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <label className="text-sm font-medium">크기</label>
                      <span className="text-sm text-muted-foreground">{currentSize}px</span>
                    </div>
                    <Slider
                      min={10}
                      max={200}
                      step={1}
                      value={[currentSize]}
                      onValueChange={(value) => setCurrentSize(value[0])}
                    />
                  </div>
                  
                  {/* 회전 컨트롤 */}
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <label className="text-sm font-medium">회전</label>
                      <span className="text-sm text-muted-foreground">{currentRotation}°</span>
                    </div>
                    <Slider
                      min={0}
                      max={360}
                      step={1}
                      value={[currentRotation]}
                      onValueChange={(value) => setCurrentRotation(value[0])}
                    />
                  </div>
                  
                  {/* 채우기 색상 컨트롤 - 선 타입이 아닐 때만 표시 */}
                  {currentType !== "line" && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium">채우기 색상</label>
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 rounded-md border overflow-hidden">
                          <input
                            type="color"
                            value={currentFill}
                            onChange={(e) => setCurrentFill(e.target.value)}
                            className="w-10 h-10 transform -translate-x-1 -translate-y-1 cursor-pointer"
                          />
                        </div>
                        <Input
                          value={currentFill}
                          onChange={(e) => setCurrentFill(e.target.value)}
                        />
                      </div>
                    </div>
                  )}
                  
                  {/* 선 색상 컨트롤 */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">선 색상</label>
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 rounded-md border overflow-hidden">
                        <input
                          type="color"
                          value={currentStroke}
                          onChange={(e) => setCurrentStroke(e.target.value)}
                          className="w-10 h-10 transform -translate-x-1 -translate-y-1 cursor-pointer"
                        />
                      </div>
                      <Input
                        value={currentStroke}
                        onChange={(e) => setCurrentStroke(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  {/* 선 두께 컨트롤 */}
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <label className="text-sm font-medium">선 두께</label>
                      <span className="text-sm text-muted-foreground">{currentStrokeWidth}px</span>
                    </div>
                    <Slider
                      min={1}
                      max={10}
                      step={1}
                      value={[currentStrokeWidth]}
                      onValueChange={(value) => setCurrentStrokeWidth(value[0])}
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
              <h2 className="text-2xl font-bold mb-4">Modern Vector.js로 기본 도형 그리기</h2>
              <p className="mb-4">
                이 예제는 Modern Vector.js를 사용하여 기본 도형을 생성하고 조작하는 방법을 보여줍니다.
                실제 라이브러리에서는 위 코드 예제와 같이 간단한 API를 통해 도형을 생성하고 스타일링할 수 있습니다.
              </p>
              <p className="mb-4">
                위 인터랙티브 데모에서는 다음과 같은 기능을 사용할 수 있습니다:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-1">
                <li>다양한 도형 유형 선택 (원, 사각형, 삼각형, 선, 별)</li>
                <li>도형 크기 및 회전 조정</li>
                <li>채우기 색상 및 선 색상 설정</li>
                <li>선 두께 조정</li>
              </ul>
              <p>
                Modern Vector.js는 이러한 기본 기능 외에도 그룹화, 레이어링, 애니메이션 등 다양한 고급 기능을 제공합니다.
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