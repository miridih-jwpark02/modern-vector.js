"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { VectorEngine } from "@/../../packages/core";
import { ShapePlugin } from "@/../../packages/core/src/plugins/core/shapes/shape-plugin";
import { CanvasRenderer } from "@/../../packages/core/src/plugins/renderers/canvas/canvas-renderer";
import { MathPlugin } from "@/../../packages/core/src/plugins/core/math";
import { Circle } from "@/../../packages/core/src/plugins/core/shapes/circle";
import { DefaultSceneNode } from "@/../../packages/core/src/core/services/scene-node";

// UI 컴포넌트 import
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";

// 필요한 타입 정의
interface PathPoint {
  x: number;
  y: number;
  type: 'move' | 'line' | 'cubic';
  controlPoint1?: { x: number; y: number };
  controlPoint2?: { x: number; y: number };
}

interface Path {
  points: PathPoint[];
  style: {
    fillColor?: string;
    strokeColor?: string;
    strokeWidth?: number;
  };
}

/**
 * Circle rendering 모드
 */
type RenderMode = "circle" | "bezier-path" | "linear-path" | "comparison";

/**
 * Circle toPath 예제 컴포넌트
 * Circle 클래스의 toPath 메서드를 활용한 원 렌더링 방식을 보여줍니다.
 */
export default function CircleToPathExample() {
  // 캔버스 참조
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // 컨테이너 참조
  const containerRef = useRef<HTMLDivElement>(null);
  // Vector Engine 참조
  const engineRef = useRef<VectorEngine | null>(null);
  
  // 상태 관리
  const [renderMode, setRenderMode] = useState<RenderMode>("comparison");
  const [segments, setSegments] = useState<number>(8);
  const [showControlPoints, setShowControlPoints] = useState<boolean>(false);
  const [showPathPoints, setShowPathPoints] = useState<boolean>(true);
  const [circleRadius, setCircleRadius] = useState<number>(100);
  
  // 화면 크기에 맞게 캔버스 크기 조정
  useEffect(() => {
    const updateCanvasSize = () => {
      if (canvasRef.current && containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        canvasRef.current.width = width;
        canvasRef.current.height = height;
        
        // Engine이 이미 존재하면 크기 업데이트
        if (engineRef.current) {
          // resize 메서드 대신 캔버스 크기 직접 설정
          const canvas = canvasRef.current;
          canvas.width = width;
          canvas.height = height;
          renderScene();
        }
      }
    };
    
    // 초기 로드 및 리사이즈 시 호출
    updateCanvasSize();
    window.addEventListener("resize", updateCanvasSize);
    
    return () => {
      window.removeEventListener("resize", updateCanvasSize);
    };
  }, []);
  
  // 초기 Vector Engine 설정
  useEffect(() => {
    if (canvasRef.current) {
      // Engine 초기화 - 인자 없이 생성
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
      
      engineRef.current = engine;
      
      // 렌더링
      renderScene();
    }
    
    return () => {
      if (engineRef.current) {
        // destroy 대신 참조 제거
        engineRef.current = null;
      }
    };
  }, []);
  
  // 상태 변경 시 다시 렌더링
  useEffect(() => {
    if (engineRef.current) {
      renderScene();
    }
  }, [renderMode, segments, showControlPoints, showPathPoints, circleRadius]);
  
  /**
   * Scene 렌더링
   * 선택된 렌더링 모드에 따라 원을 다른 방식으로 표시합니다.
   */
  const renderScene = () => {
    if (!engineRef.current) return;
    
    const engine = engineRef.current;
    const width = canvasRef.current?.width || 600;
    const height = canvasRef.current?.height || 400;
    const centerX = width / 2;
    const centerY = height / 2;
    
    // 기존 노드 클리어 - API 변경
    const scene = engine.scene.create();
    const shapePlugin = engine.getPlugin<ShapePlugin>('shape');
    if (!shapePlugin) return;
    
    // 이미 추가된 도형이 있으면 제거
    if (scene.root && scene.root.children) {
      while (scene.root.children.length > 0) {
        scene.root.removeChild(scene.root.children[0]);
      }
    }
    
    if (renderMode === "circle" || renderMode === "comparison") {
      // 일반 Circle 객체 생성
      const circle = new Circle({
        centerX: centerX - (renderMode === "comparison" ? circleRadius + 20 : 0),
        centerY: centerY,
        radius: circleRadius,
        style: {
          fillColor: renderMode === "comparison" ? "rgba(65, 105, 225, 0.2)" : "rgba(65, 105, 225, 0.6)",
          strokeColor: "royalblue",
          strokeWidth: 2
        }
      });
      
      // API 변경 - DefaultSceneNode 사용
      const circleNode = new DefaultSceneNode('circle', engine.events.createNamespace('circle'));
      circleNode.data = circle;
      scene.root.addChild(circleNode);
    }
    
    if (renderMode === "bezier-path" || renderMode === "comparison") {
      // 베지어 곡선으로 변환된 원 경로
      const circle = new Circle({
        centerX: centerX + (renderMode === "comparison" ? circleRadius + 20 : 0),
        centerY: centerY,
        radius: circleRadius
      });
      
      const pathPoints = circle.toPath(segments, true); // 베지어 곡선 사용
      
      // Path 객체 생성 - ShapePlugin 사용
      const path = shapePlugin.createShape('path', {
        points: pathPoints,
        style: {
          fillColor: "rgba(220, 20, 60, 0.2)",
          strokeColor: "crimson",
          strokeWidth: 2
        }
      });
      
      // API 변경 - DefaultSceneNode 사용
      const pathNode = new DefaultSceneNode('bezier-path', engine.events.createNamespace('bezier-path'));
      pathNode.data = path;
      scene.root.addChild(pathNode);
      
      // 제어점 표시 (옵션)
      if (showControlPoints) {
        pathPoints.forEach((point, index) => {
          if (point.type === 'cubic' && point.controlPoint1 && point.controlPoint2) {
            // 제어점 1
            const cp1 = new Circle({
              centerX: point.controlPoint1.x,
              centerY: point.controlPoint1.y,
              radius: 4,
              style: {
                fillColor: "orange",
                strokeColor: "white",
                strokeWidth: 1
              }
            });
            
            // API 변경 - DefaultSceneNode 사용
            const cp1Node = new DefaultSceneNode(`cp1-${index}`, engine.events.createNamespace(`cp1-${index}`));
            cp1Node.data = cp1;
            scene.root.addChild(cp1Node);
            
            // 제어점 2
            const cp2 = new Circle({
              centerX: point.controlPoint2.x,
              centerY: point.controlPoint2.y,
              radius: 4,
              style: {
                fillColor: "orange",
                strokeColor: "white",
                strokeWidth: 1
              }
            });
            
            // API 변경 - DefaultSceneNode 사용
            const cp2Node = new DefaultSceneNode(`cp2-${index}`, engine.events.createNamespace(`cp2-${index}`));
            cp2Node.data = cp2;
            scene.root.addChild(cp2Node);
          }
        });
      }
    }
    
    if (renderMode === "linear-path" || renderMode === "comparison") {
      // 선형 선분으로 변환된 원 경로
      const circle = new Circle({
        centerX: renderMode === "comparison" ? centerX : centerX,
        centerY: centerY,
        radius: circleRadius
      });
      
      const pathPoints = circle.toPath(segments, false); // 직선 세그먼트 사용
      
      // Path 객체 생성 - ShapePlugin 사용
      const path = shapePlugin.createShape('path', {
        points: pathPoints,
        style: {
          fillColor: "rgba(50, 205, 50, 0.2)",
          strokeColor: "limegreen",
          strokeWidth: 2
        }
      });
      
      // API 변경 - DefaultSceneNode 사용
      const pathNode = new DefaultSceneNode('linear-path', engine.events.createNamespace('linear-path'));
      pathNode.data = path;
      scene.root.addChild(pathNode);
    }
    
    // Path 포인트 표시 (옵션)
    if (showPathPoints && renderMode !== "circle") {
      const circle = new Circle({
        centerX: centerX + (renderMode === "comparison" ? circleRadius + 20 : 0),
        centerY: centerY,
        radius: circleRadius
      });
      
      // 베지어 또는 선형 패스에 따라 적절한 포인트 가져오기
      const pathPoints = circle.toPath(
        segments, 
        renderMode === "bezier-path" || (renderMode === "comparison")
      );
      
      // 모든 경로 포인트에 작은 원 표시
      pathPoints.forEach((point, index) => {
        const pointCircle = new Circle({
          centerX: point.x,
          centerY: point.y,
          radius: 3,
          style: {
            fillColor: "white",
            strokeColor: "black",
            strokeWidth: 1
          }
        });
        
        // API 변경 - DefaultSceneNode 사용
        const pointNode = new DefaultSceneNode(`path-point-${index}`, engine.events.createNamespace(`path-point-${index}`));
        pointNode.data = pointCircle;
        scene.root.addChild(pointNode);
      });
    }
    
    // 렌더링 요청 - API 변경
    engine.renderer.render(scene);
  };
  
  /**
   * 렌더링 모드에 따른 설명 텍스트 반환
   */
  const getRenderModeDescription = () => {
    switch (renderMode) {
      case "circle":
        return "일반 Circle 객체를 직접 렌더링합니다. 표준 원 렌더링 방식입니다.";
      case "bezier-path":
        return "Circle.toPath(segments, true)를 사용하여 베지어 곡선으로 원을 근사합니다. 4개의 3차 베지어 곡선을 사용하여 정확한 원을 표현합니다.";
      case "linear-path": 
        return "Circle.toPath(segments, false)를 사용하여 직선 세그먼트로 원을 근사합니다. 세그먼트 수가 많을수록 더 부드러운 원형을 얻을 수 있습니다.";
      case "comparison":
        return "세 가지 렌더링 방식을 비교합니다. 파란색: 일반 Circle, 빨간색: 베지어 곡선, 녹색: 직선 세그먼트";
      default:
        return "";
    }
  };
  
  /**
   * 코드 예제 반환
   */
  const getCodeExample = () => {
    if (renderMode === "circle") {
      return `// 일반 Circle 객체 생성
const circle = new Circle({
  centerX: 300,
  centerY: 200,
  radius: ${circleRadius},
  style: {
    fillColor: "rgba(65, 105, 225, 0.6)",
    strokeColor: "royalblue",
    strokeWidth: 2
  }
});

// Scene에 추가
engine.scene.add({
  id: "circle",
  name: "Regular Circle",
  shape: circle
});`;
    } else if (renderMode === "bezier-path") {
      return `// Circle 객체 생성
const circle = new Circle({
  centerX: 300,
  centerY: 200,
  radius: ${circleRadius}
});

// toPath 메서드로 베지어 곡선 경로 얻기
const pathPoints = circle.toPath(undefined, true);
// 첫 번째 인자는 세그먼트 수로, 베지어 곡선에서는 무시됨
// 두 번째 인자 true는 베지어 곡선을 사용하도록 지정

// Path 객체 생성 - ShapePlugin 사용
const path = shapePlugin.createShape('path', {
  points: pathPoints,
  style: {
    fillColor: "rgba(220, 20, 60, 0.2)",
    strokeColor: "crimson",
    strokeWidth: 2
  }
});

// Scene에 추가
engine.scene.add({
  id: "bezier-path",
  name: "Bezier Path Circle",
  shape: path
});`;
    } else if (renderMode === "linear-path") {
      return `// Circle 객체 생성
const circle = new Circle({
  centerX: 300,
  centerY: 200,
  radius: ${circleRadius}
});

// toPath 메서드로 선형 세그먼트 경로 얻기
const pathPoints = circle.toPath(${segments}, false);
// 첫 번째 인자 ${segments}는 선분의 수를 지정
// 두 번째 인자 false는 직선 세그먼트를 사용하도록 지정

// Path 객체 생성 - ShapePlugin 사용
const path = shapePlugin.createShape('path', {
  points: pathPoints,
  style: {
    fillColor: "rgba(50, 205, 50, 0.2)",
    strokeColor: "limegreen",
    strokeWidth: 2
  }
});

// Scene에 추가
engine.scene.add({
  id: "linear-path",
  name: "Linear Path Circle",
  shape: path
});`;
    } else {
      return `// 세 가지 방식의 원 렌더링 비교
// 1. 일반 Circle 객체
const circle = new Circle({
  centerX: 150,
  centerY: 200,
  radius: ${circleRadius},
  style: {
    fillColor: "rgba(65, 105, 225, 0.2)",
    strokeColor: "royalblue",
    strokeWidth: 2
  }
});

// 2. 베지어 곡선 경로
const bezierCircle = new Circle({
  centerX: 450,
  centerY: 200,
  radius: ${circleRadius}
});
const bezierPathPoints = bezierCircle.toPath(undefined, true);
const bezierPath = shapePlugin.createShape('path', {
  points: bezierPathPoints,
  style: {
    fillColor: "rgba(220, 20, 60, 0.2)",
    strokeColor: "crimson", 
    strokeWidth: 2
  }
});

// 3. 선형 세그먼트 경로
const linearCircle = new Circle({
  centerX: 300,
  centerY: 200,
  radius: ${circleRadius}
});
const linearPathPoints = linearCircle.toPath(${segments}, false);
const linearPath = shapePlugin.createShape('path', {
  points: linearPathPoints,
  style: {
    fillColor: "rgba(50, 205, 50, 0.2)",
    strokeColor: "limegreen",
    strokeWidth: 2
  }
});

// Scene에 모두 추가
engine.scene.add({ id: "circle", shape: circle });
engine.scene.add({ id: "bezier-path", shape: bezierPath });
engine.scene.add({ id: "linear-path", shape: linearPath });`;
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
              <Link href="/docs" className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
                Documentation
              </Link>
              <Link href="/examples" className="flex items-center text-sm font-medium text-foreground transition-colors hover:text-foreground">
                Examples
              </Link>
            </nav>
          </div>
        </div>
      </header>
      
      <main className="flex-1 container py-6">
        <div className="flex flex-col space-y-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Circle toPath Method</h1>
            <p className="text-muted-foreground mt-2">
              Circle 클래스의 toPath 메서드를 사용하여 원을 다양한 방식으로 렌더링하는 예제입니다.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>렌더링 결과</CardTitle>
                  <CardDescription>{getRenderModeDescription()}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div
                    ref={containerRef}
                    className="w-full h-[400px] border rounded-md bg-slate-50 dark:bg-slate-900 relative"
                  >
                    <canvas
                      ref={canvasRef}
                      className="w-full h-full"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>렌더링 설정</CardTitle>
                  <CardDescription>원 표시 방법을 변경해보세요</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <div>렌더링 모드</div>
                    <Tabs defaultValue={renderMode} onValueChange={(value) => setRenderMode(value as RenderMode)}>
                      <TabsList className="w-full grid grid-cols-2 h-auto">
                        <TabsTrigger value="circle">Circle</TabsTrigger>
                        <TabsTrigger value="bezier-path">Bezier</TabsTrigger>
                        <TabsTrigger value="linear-path">Linear</TabsTrigger>
                        <TabsTrigger value="comparison">비교</TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div>반지름</div>
                      <span className="text-sm text-muted-foreground">{circleRadius}px</span>
                    </div>
                    <Slider
                      min={20}
                      max={150}
                      step={1}
                      value={[circleRadius]}
                      onValueChange={(values) => setCircleRadius(values[0])}
                    />
                  </div>
                  
                  {(renderMode === "linear-path" || renderMode === "comparison") && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div>세그먼트 수</div>
                        <span className="text-sm text-muted-foreground">{segments}</span>
                      </div>
                      <Slider
                        min={3}
                        max={64}
                        step={1}
                        value={[segments]}
                        onValueChange={(values) => setSegments(values[0])}
                      />
                    </div>
                  )}
                  
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="show-path-points"
                      checked={showPathPoints}
                      onChange={(e) => setShowPathPoints(e.target.checked)}
                    />
                    <label htmlFor="show-path-points">경로 포인트 표시</label>
                  </div>
                  
                  {(renderMode === "bezier-path" || renderMode === "comparison") && (
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="show-control-points"
                        checked={showControlPoints}
                        onChange={(e) => setShowControlPoints(e.target.checked)}
                      />
                      <label htmlFor="show-control-points">베지어 제어점 표시</label>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>코드 예제</CardTitle>
                  <CardDescription>현재 설정의 코드 구현 예시</CardDescription>
                </CardHeader>
                <CardContent>
                  <pre className="bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 p-4 rounded-md text-xs overflow-auto max-h-[300px]">
                    <code>{getCodeExample()}</code>
                  </pre>
                </CardContent>
              </Card>
            </div>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Circle.toPath 메서드 설명</CardTitle>
              <CardDescription>
                원을 Path 객체로 변환하는 방법에 대한 상세 설명
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                <code>Circle.toPath()</code> 메서드는 원을 Path 객체로 변환하는 기능을 제공합니다. 
                이 메서드는 원을 두 가지 방식으로 근사할 수 있습니다:
              </p>
              
              <div className="space-y-2">
                <h3 className="font-bold">베지어 곡선 방식 (useBezier = true)</h3>
                <p>
                  4개의 3차 베지어 곡선을 사용하여 원을 정확하게 표현합니다. 이 방식은 세그먼트 수에 관계없이 항상 정확한 원을 생성합니다.
                  베지어 곡선 제어점은 수학적으로 정확한 원을 그리기 위해 특별한 계수(0.5522847498)를 사용합니다.
                </p>
                <pre className="bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 p-3 rounded-md text-xs">
                  <code>circle.toPath(undefined, true); // 세그먼트 수 인자는 무시됨</code>
                </pre>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-bold">직선 세그먼트 방식 (useBezier = false)</h3>
                <p>
                  지정된 수의 직선 세그먼트를 사용하여 원을 근사합니다. 세그먼트 수가 많을수록 더 부드러운 원이 생성되지만, 
                  계산 비용이 증가합니다. 이 방식은 성능이 중요하거나 저해상도 렌더링에 유용합니다.
                </p>
                <pre className="bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 p-3 rounded-md text-xs">
                  <code>circle.toPath(32, false); // 32개의 직선 세그먼트로 원 근사</code>
                </pre>
              </div>
              
              <div className="bg-amber-50 dark:bg-amber-950 border-l-4 border-amber-500 p-4 rounded-r-md">
                <h3 className="font-bold text-amber-800 dark:text-amber-400">유의사항</h3>
                <p className="text-amber-700 dark:text-amber-300">
                  대부분의 경우 베지어 곡선 방식(useBezier = true)이 권장됩니다. 베지어 곡선 방식은 세그먼트 수에 관계없이 항상 정확한 원을 생성하며, 
                  4개의 곡선 세그먼트만 사용하기 때문에 일반적으로 더 효율적입니다. 직선 세그먼트 방식은 세그먼트 수가 적을 경우 각진 모양이 될 수 있습니다.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            Modern Vector.js - Circle Rendering Example
          </p>
        </div>
      </footer>
    </div>
  );
} 