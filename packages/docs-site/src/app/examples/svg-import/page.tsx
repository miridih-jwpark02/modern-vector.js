'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { VectorEngine, Plugin, SceneNode } from '@/../../packages/core';
import { ShapePlugin } from '@/../../packages/core/src/plugins/core/shapes/shape-plugin';
import { CanvasRenderer } from '@/../../packages/core/src/plugins/renderers/canvas/canvas-renderer';
import { MathPlugin } from '@/../../packages/core/src/plugins/core/math';
import { SVGImportToolPlugin } from '@/../../packages/core/src/plugins/tools/svg-import/svg-import-plugin';
import { DefaultGroupPlugin } from '@/../../packages/core/src/plugins/core/group/group-plugin';
import { DefaultSceneNode } from '@/../../packages/core/src/core/services/scene-node';

// UI 컴포넌트 import - 경로 수정
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card/index';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs/index';
import { Button } from '@/components/ui/button';

// crypto.randomUUID Polyfill
// 브라우저 환경에서 crypto.randomUUID가 지원되지 않는 경우를 대비한 polyfill
import { v4 as uuidv4 } from 'uuid';

if (typeof window !== 'undefined' && typeof crypto !== 'undefined' && !crypto.randomUUID) {
  // @ts-ignore - 전역 crypto 객체에 randomUUID 함수 추가
  crypto.randomUUID = () => uuidv4();
}

// 간단한 대체 컴포넌트들
const Checkbox = ({
  id,
  checked,
  onCheckedChange,
}: {
  id: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}) => (
  <input
    type="checkbox"
    id={id}
    checked={checked}
    onChange={e => onCheckedChange(e.target.checked)}
    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
  />
);

const Label = ({ htmlFor, children }: { htmlFor: string; children: React.ReactNode }) => (
  <label htmlFor={htmlFor} className="text-sm font-medium text-gray-700">
    {children}
  </label>
);

const Slider = ({
  id,
  min,
  max,
  step,
  value,
  onValueChange,
}: {
  id: string;
  min: number;
  max: number;
  step: number;
  value: number[];
  onValueChange: (value: number[]) => void;
}) => (
  <input
    type="range"
    id={id}
    min={min}
    max={max}
    step={step}
    value={value[0]}
    onChange={e => onValueChange([parseFloat(e.target.value)])}
    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
  />
);

const Textarea = ({
  id,
  value,
  onChange,
  rows,
  className,
}: {
  id: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  rows: number;
  className?: string;
}) => (
  <textarea
    id={id}
    value={value}
    onChange={onChange}
    rows={rows}
    className={`w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none ${className || ''}`}
  />
);

const Input = ({
  id,
  type,
  placeholder,
  value,
  onChange,
  accept,
}: {
  id: string;
  type: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  accept?: string;
}) => (
  <input
    id={id}
    type={type}
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    accept={accept}
    className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none"
  />
);

/**
 * SVG Import 옵션 인터페이스
 * SVG 가져오기 옵션을 정의합니다.
 */
interface SVGImportOptions {
  preserveViewBox: boolean;
  flattenGroups: boolean;
  scale: number;
}

/**
 * 플러그인 타입 호환성 검증 함수
 *
 * @param plugin - 검증할 플러그인 객체
 * @returns 검증된 플러그인 객체
 */
function ensurePluginCompatibility<T extends { id: string; version: string }>(plugin: T): Plugin {
  // 기본적인 Plugin 인터페이스 요구사항 확인
  if (
    typeof plugin.id !== 'string' ||
    typeof plugin.version !== 'string' ||
    typeof (plugin as any).install !== 'function' ||
    typeof (plugin as any).uninstall !== 'function'
  ) {
    throw new Error(`유효하지 않은 플러그인: ${plugin.id || '알 수 없음'}`);
  }

  // Plugin 인터페이스 요구사항을 충족하므로 호환 가능
  return plugin as unknown as Plugin;
}

/**
 * SVG 직접 가져오기 함수
 */
function importSVGDirectly(engine: VectorEngine, svgStr: string) {
  try {
    console.log('\n\n==== Starting direct SVG import ====');
    console.log('SVG string to import:', svgStr);

    // 플러그인 확인 - 직접 플러그인과 엔진 확장 둘 다 확인
    console.log('Checking for SVG import methods...');
    const svgImportPlugin = engine.getPlugin('svg-import-tool');
    console.log('Direct SVG import plugin found:', !!svgImportPlugin);

    const engineExtended = engine as any;
    console.log('Engine extension svgImport found:', !!engineExtended.svgImport);

    // 플러그인 메서드 체크
    if (svgImportPlugin) {
      console.log('SVG import plugin methods:');
      const methods = Object.getOwnPropertyNames(Object.getPrototypeOf(svgImportPlugin)).filter(
        name => typeof (svgImportPlugin as any)[name] === 'function'
      );
      console.log(methods.join(', '));
    }

    // 엔진 확장 메서드 체크
    if (engineExtended.svgImport) {
      console.log('Engine extension svgImport methods:');
      console.log(Object.keys(engineExtended.svgImport).join(', '));
    }

    // 가져오기 방법 결정
    let importMethod;

    if (svgImportPlugin && typeof (svgImportPlugin as any).importFromString === 'function') {
      console.log('Using plugin.importFromString method');
      importMethod = (svgImportPlugin as any).importFromString.bind(svgImportPlugin);
    } else if (
      engineExtended.svgImport &&
      typeof engineExtended.svgImport.importFromString === 'function'
    ) {
      console.log('Using engine.svgImport.importFromString method');
      importMethod = engineExtended.svgImport.importFromString;
    } else {
      console.error('No importFromString method found');
      return;
    }

    // 현재 장면 비우기
    const activeScene = engine.scene.getActive();
    console.log('Clearing current scene');

    if (activeScene.root && activeScene.root.children) {
      console.log('Current scene has', activeScene.root.children.length, 'children');
      while (activeScene.root.children.length > 0) {
        activeScene.root.removeChild(activeScene.root.children[0]);
      }
      console.log('Scene cleared, now has', activeScene.root.children.length, 'children');
    }

    // MathPlugin에서 Matrix3x3 생성 메서드 가져오기
    const mathPlugin = engine.getPlugin('math');
    let createMatrixFn: () => number[] = () => [1, 0, 0, 0, 1, 0, 0, 0, 1]; // 타입 정의 및 기본값 설정
    if (mathPlugin && (mathPlugin as any).Matrix3x3 && (mathPlugin as any).Matrix3x3.create) {
      createMatrixFn = (mathPlugin as any).Matrix3x3.create;
      console.log('Found Matrix3x3.create method from MathPlugin');
    }

    // 재귀적으로 노드 속성을 확인하고 필요한 속성을 설정하는 함수
    const ensureNodeProperties = (node: any) => {
      if (!node) return;

      // 노드 자체에 데이터가 있는 경우
      if (node.data) {
        const data = node.data;

        // type 속성 확인 및 설정
        if (!data.type) {
          console.log(`Setting default type 'shape' for node ${node.id || 'unknown'}`);
          data.type = 'shape';
        }

        // transform 속성 확인 및 설정
        if (!data.transform) {
          console.log(`Creating default transform matrix for node ${node.id || 'unknown'}`);
          data.transform = {
            values: createMatrixFn(),
          };
        }

        // bounds 속성 확인 및 설정
        if (!data.bounds) {
          console.log(`Setting default bounds for node ${node.id || 'unknown'}`);
          data.bounds = { x: 0, y: 0, width: 100, height: 100 };
        }

        // style 속성 확인 및 설정
        if (!data.style) {
          console.log(`Creating default style for node ${node.id || 'unknown'}`);
          data.style = {
            fillColor: '#cccccc',
            strokeColor: '#000000',
            strokeWidth: 1,
          };
        }
      }

      // 자식 노드가 있는 경우 재귀적으로 처리
      if (node.children && node.children.length > 0) {
        console.log(`Processing ${node.children.length} children of node ${node.id || 'unknown'}`);
        node.children.forEach((childNode: any) => {
          ensureNodeProperties(childNode);
        });
      }
    };

    // SVG 가져오기 시작
    importMethod(svgStr)
      .then((importedNode: any) => {
        console.log('SVG import successful!');
        console.log('Imported node:', importedNode);
        console.log('Adding imported node to scene');

        if (activeScene && activeScene.root) {
          // 가져온 노드의 children에 transform 및 type 속성 확인 및 설정
          if (importedNode.children && importedNode.children.length > 0) {
            console.log(`Processing ${importedNode.children.length} children nodes`);
            importedNode.children.forEach((childNode: any, index: number) => {
              if (childNode.data) {
                // Shape 데이터에 필요한 속성 설정
                const shapeData = childNode.data;

                // type 속성 확인 및 설정
                if (!shapeData.type) {
                  console.log(`Child ${index}: Setting default type 'rectangle'`);
                  shapeData.type = 'rectangle'; // 기본 타입으로 rectangle 설정
                }

                // transform 속성 확인 및 설정
                if (!shapeData.transform) {
                  console.log(`Child ${index}: Creating default transform matrix`);
                  shapeData.transform = {
                    values: createMatrixFn(),
                  };
                }

                // bounds 속성 확인 및 설정
                if (!shapeData.bounds) {
                  console.log(`Child ${index}: Setting default bounds`);
                  shapeData.bounds = { x: 0, y: 0, width: 100, height: 100 };
                }

                // style 속성 확인 및 설정
                if (!shapeData.style) {
                  console.log(`Child ${index}: Creating default style`);
                  shapeData.style = {
                    fillColor: '#cccccc',
                    strokeColor: '#000000',
                    strokeWidth: 1,
                  };
                }

                console.log(`Child ${index} processed:`, shapeData);
              } else {
                console.warn(`Child ${index} has no data property`);
              }
            });
          } else {
            console.log('Imported node has no children, checking node data');

            // importedNode 자체가 Shape인 경우 처리
            if (importedNode.data) {
              const shapeData = importedNode.data;

              if (!shapeData.type) {
                console.log(`Setting default type 'rectangle' on imported node`);
                shapeData.type = 'rectangle';
              }

              if (!shapeData.transform) {
                console.log(`Creating default transform matrix for imported node`);
                shapeData.transform = {
                  values: createMatrixFn(),
                };
              }

              if (!shapeData.bounds) {
                console.log(`Setting default bounds for imported node`);
                shapeData.bounds = { x: 0, y: 0, width: 100, height: 100 };
              }

              if (!shapeData.style) {
                console.log(`Creating default style for imported node`);
                shapeData.style = {
                  fillColor: '#cccccc',
                  strokeColor: '#000000',
                  strokeWidth: 1,
                };
              }

              console.log('Imported node data processed:', shapeData);
            } else {
              console.warn('Imported node has no data property');
            }
          }

          // 노드 자체와 모든 자식 노드를 재귀적으로 처리
          ensureNodeProperties(importedNode);

          activeScene.root.addChild(importedNode);
          console.log('Node added to scene');
          console.log('Scene root children after import:', activeScene.root.children.length);

          console.log('Rendering scene with imported SVG');
          engine.renderer.render(activeScene);
          console.log('Render completed');
        }
      })
      .catch((error: Error) => {
        console.error('Error during import:', error);
      });
  } catch (error) {
    console.error('Error in direct SVG import:', error);
  }
}

/**
 * SVG Import Tool Plugin 예제 페이지 컴포넌트
 */
export default function SVGImportExample() {
  // SVG 모듈 로딩 상태
  const [engineReady, setEngineReady] = useState(false);
  const [svgString, setSvgString] = useState('');
  const [svgUrl, setSvgUrl] = useState('');
  const [importMethod, setImportMethod] = useState<'string' | 'url' | 'file'>('string');
  const [importStatus, setImportStatus] = useState<'idle' | 'loading' | 'success' | 'error'>(
    'idle'
  );
  const [errorMessage, setErrorMessage] = useState('');

  // 엔진, 캔버스, 기타 refs
  const engineRef = useRef<VectorEngine | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const importedNodeRef = useRef<any>(null);

  // 상태 관리
  const [importOptions, setImportOptions] = useState<SVGImportOptions>({
    preserveViewBox: false,
    flattenGroups: false,
    scale: 1,
  });
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 500 });

  // Vector Engine 초기화
  useEffect(() => {
    if (!canvasRef.current) return;

    console.log('\n\n==== Vector Engine 초기화 시작 ====');
    console.log('Canvas 요소 확인:', !!canvasRef.current);

    // Vector Engine 생성
    const engine = new VectorEngine();
    console.log('Vector Engine 인스턴스 생성됨');

    // 플러그인 등록 - 의존성에 맞는 순서로 등록
    // MathPlugin은 ShapePlugin의 의존성이므로 먼저 등록
    try {
      console.log('MathPlugin 등록 시작');
      engine.use(ensurePluginCompatibility(new MathPlugin()));
      console.log('MathPlugin 등록 완료');

      // ShapePlugin 등록 (id: 'shape')
      console.log('ShapePlugin 등록 시작');
      engine.use(ensurePluginCompatibility(new ShapePlugin()));
      console.log('ShapePlugin 등록 완료');

      // GroupPlugin은 'shape-plugin'에 의존하지만 ShapePlugin의 id는 'shape'
      // GroupPlugin의 의존성이 제대로 해결되도록 수동으로 설정
      console.log('GroupPlugin 등록 시작');
      const groupPlugin = new DefaultGroupPlugin();
      // @ts-ignore - 런타임에 의존성 정보 수정
      groupPlugin.dependencies = ['shape'];
      // @ts-ignore - ID를 'group'으로 설정하여 SVGImportToolPlugin의 의존성과 일치시킴
      groupPlugin.id = 'group';
      engine.use(ensurePluginCompatibility(groupPlugin));
      console.log('GroupPlugin 등록 완료');

      // SVGImportToolPlugin은 'shape'와 'group'에 의존
      console.log('SVGImportToolPlugin 등록 시작');
      engine.use(ensurePluginCompatibility(new SVGImportToolPlugin()));
      console.log('SVGImportToolPlugin 등록 완료');

      // 플러그인 접근 방식 확인 및 확장 적용 확인
      const hasSvgImport =
        !!(engine as any).svgImport &&
        typeof (engine as any).svgImport.importFromString === 'function';
      console.log('SVG Import 플러그인 확장 확인:', {
        svgImportExtensionExists: !!(engine as any).svgImport,
        hasImportMethod: hasSvgImport,
      });

      // 장면 생성 및 활성화
      console.log('Scene 생성 시작');
      const scene = engine.scene.create();
      engine.scene.setActive(scene);
      console.log('Scene 생성 및 활성화 완료');

      // CanvasRenderer 생성 및 등록
      console.log('Canvas 설정 - 렌더러 등록 전 Canvas 상태:', {
        canvas: !!canvasRef.current,
        width: canvasRef.current?.width || 0,
        height: canvasRef.current?.height || 0,
      });

      // Canvas 크기 명시적 설정
      if (canvasRef.current) {
        canvasRef.current.width = containerRef.current?.clientWidth || 800;
        canvasRef.current.height = Math.min(500, window.innerHeight - 200);
        console.log('Canvas 크기 설정됨:', canvasRef.current.width, 'x', canvasRef.current.height);
      }

      // 렌더러 생성
      const rendererOptions = {
        context: {
          canvas: canvasRef.current as HTMLCanvasElement,
          contextType: '2d' as '2d' | 'webgl' | 'webgl2', // 타입 명시
          contextAttributes: { alpha: true },
        },
        backgroundColor: '#ffffff',
        pixelRatio: window.devicePixelRatio || 1,
        antialias: true,
        alpha: true,
        autoClear: true,
      };

      // 렌더러 객체 생성 및 등록
      console.log('CanvasRenderer 생성...');
      const renderer = new CanvasRenderer(rendererOptions);
      console.log('CanvasRenderer 생성됨:', renderer.id);

      // 엔진 참조 저장 - 먼저 참조를 저장합니다
      engineRef.current = engine;
      console.log('engineRef에 엔진 참조 저장 완료');

      // 렌더러 등록 - engineRef.current 대신 engine 변수 사용
      console.log('CanvasRenderer 등록 시작...');
      engine.renderer.register(renderer);
      console.log('CanvasRenderer 등록 완료');

      // 렌더러 확인
      try {
        console.log('\n렌더러 상태 확인:');

        // Renderer Manager 확인
        const rendererManager = engine.renderer;
        console.log('Renderer Manager 존재:', !!rendererManager);

        if (rendererManager) {
          // 등록된 렌더러 확인
          console.log('Renderer Manager 메서드:');
          if (typeof rendererManager.register === 'function')
            console.log('- register 메서드 존재함');
          // 타입 인터페이스 차이로 인한 오류 무시 (setActive 메서드는 확인함)
          if (typeof (rendererManager as any).unregister === 'function')
            console.log('- unregister 메서드 존재함');
          if (typeof (rendererManager as any).getRenderers === 'function')
            console.log('- getRenderers 메서드 존재함');
          if (typeof (rendererManager as any).getActiveRenderer === 'function')
            console.log('- getActiveRenderer 메서드 존재함');
          if (typeof (rendererManager as any).setActiveRenderer === 'function')
            console.log('- setActiveRenderer 메서드 존재함');

          // 등록된 렌더러 목록
          const renderers =
            typeof (rendererManager as any).getRenderers === 'function'
              ? (rendererManager as any).getRenderers()
              : null;

          if (renderers) {
            console.log('등록된 렌더러 수:', renderers.length);
            console.log(
              '등록된 렌더러 IDs:',
              renderers.map((r: any) => r.id || 'unknown').join(', ')
            );

            // 각 렌더러 상세 정보
            renderers.forEach((r: any, index: number) => {
              console.log(`렌더러 ${index + 1} 정보:`, r.id || 'unknown');
              console.log(`- Canvas 요소 존재:`, !!r.getCanvas?.());
              if (r.getCanvas?.()) {
                const canvas = r.getCanvas();
                console.log(`- Canvas 크기:`, canvas.width, 'x', canvas.height);
                console.log(`- Canvas ID:`, canvas.id || 'ID 없음');
              }
            });
          } else {
            console.log('등록된 렌더러 정보를 가져올 수 없음');
          }

          // 활성 렌더러 확인
          const activeRenderer =
            typeof (rendererManager as any).getActiveRenderer === 'function'
              ? (rendererManager as any).getActiveRenderer()
              : null;

          if (activeRenderer) {
            console.log('활성 렌더러 ID:', activeRenderer.id || 'unknown');
            console.log('활성 렌더러 Canvas 존재:', !!activeRenderer.getCanvas?.());

            // 렌더링 메서드 확인
            console.log('렌더링 메서드 존재:', typeof rendererManager.render === 'function');
          } else {
            console.log('활성 렌더러 ID가 설정되지 않음');

            // 활성 렌더러가 없는 경우 렌더러 등록 프로세스 다시 시도
            console.log('렌더러 등록 프로세스 다시 시도 중...');
            const canvasElement = canvasRef.current;

            if (canvasElement) {
              console.log('Canvas 요소 있음, 렌더러 활성화 시도');
              try {
                // 기존 등록된 렌더러 여부 확인 (정확한 API가 없으므로 try-catch로 처리)
                let rendererActivated = false;

                try {
                  // 이미 등록된 'canvas' ID 렌더러 활성화 시도
                  console.log('이미 등록된 canvas 렌더러 활성화 시도');
                  if (rendererManager && typeof rendererManager.setActive === 'function') {
                    rendererManager.setActive('canvas');
                    console.log('기존 canvas 렌더러 활성화 성공');
                    rendererActivated = true;
                  }
                } catch (activationError) {
                  console.warn('기존 렌더러 활성화 실패:', activationError);
                  // 실패하면 새 렌더러 생성 시도로 진행
                }

                // 위 시도가 실패한 경우에만 새 렌더러 생성 시도
                if (!rendererActivated) {
                  console.log('새 렌더러 인스턴스 생성 시도');
                  // 중복 방지를 위해 타임스탬프로 고유 ID 생성
                  const uniqueRendererId = 'canvas-renderer-' + Date.now();

                  const newRenderer = new CanvasRenderer({
                    context: {
                      canvas: canvasElement,
                      contextType: '2d' as '2d' | 'webgl' | 'webgl2',
                      contextAttributes: { alpha: true },
                    },
                    backgroundColor: '#ffffff',
                    pixelRatio: window.devicePixelRatio || 1,
                    antialias: true,
                    alpha: true,
                    autoClear: true,
                  });

                  // 렌더러 ID를 명시적으로 설정
                  (newRenderer as any).id = uniqueRendererId;

                  console.log('새 렌더러 인스턴스 생성 완료, ID:', uniqueRendererId);
                  console.log('Canvas 연결 상태:', !!newRenderer.getCanvas());

                  if (rendererManager && typeof rendererManager.register === 'function') {
                    rendererManager.register(newRenderer);
                    console.log('새 렌더러 등록 완료');

                    if (rendererManager && typeof rendererManager.setActive === 'function') {
                      rendererManager.setActive(uniqueRendererId);
                      console.log('새 렌더러 활성화 완료');
                    }
                  }
                }
              } catch (e) {
                console.error('렌더러 활성화/등록 중 오류:', e);
              }
            } else {
              console.log('Canvas 요소가 없어서 렌더러를 생성할 수 없음');
            }
          }
        } else {
          console.log('렌더러 관리자가 초기화되지 않음');
        }
      } catch (error) {
        console.error('렌더러 상태 확인 중 오류:', error);
      }
    } catch (error) {
      console.error('Vector Engine 초기화 중 오류 발생:', error);
    }

    return () => {
      // 정리 작업
      console.log('Vector Engine 정리 작업 시작');
      if (engineRef.current) {
        // 필요한 정리 작업 수행
        console.log('Vector Engine 정리 작업 완료');
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
    window.addEventListener('resize', updateCanvasSize);

    return () => {
      window.removeEventListener('resize', updateCanvasSize);
    };
  }, []);

  // SVG 가져오기 함수
  const importSVG = async () => {
    console.log('SVG 가져오기 시작...');
    try {
      if (!engineRef.current) {
        console.error('Vector Engine이 초기화되지 않았습니다');
        return;
      }

      const engine = engineRef.current;

      // SVG Import 플러그인 접근 방식 확인
      const svgImportPlugin = engine.getPlugin('svg-import-tool');
      const hasPluginImport =
        svgImportPlugin && typeof (svgImportPlugin as any).importFromString === 'function';

      // 엔진 확장으로 접근 확인
      const hasEngineExtension =
        !!(engine as any).svgImport &&
        typeof (engine as any).svgImport.importFromString === 'function';

      console.log('SVG Import 접근 방식 확인 결과:', {
        pluginFound: !!svgImportPlugin,
        hasPluginImport,
        hasEngineExtension,
      });

      if (!hasPluginImport && !hasEngineExtension) {
        console.error('SVG Import 플러그인이 준비되지 않았습니다. 플러그인 ID 및 메서드 확인 필요');
        return;
      }

      setImportStatus('loading');
      setErrorMessage('');

      // 현재 import 방법에 따라 SVG 내용 가져오기
      let svgContent = '';

      switch (importMethod) {
        case 'string':
          svgContent = svgString;
          break;
        case 'url':
          // URL 방식은 직접 importFromURL 함수를 사용하므로 여기서는 처리하지 않음
          break;
        case 'file':
          // 파일 방식은 직접 importFromFile 함수를 사용하므로 여기서는 처리하지 않음
          break;
      }

      console.log('SVG 내용 길이:', svgContent.length);
      console.log('SVG 가져오기 옵션:', importOptions);

      // 이전에 생성된 노드 제거
      try {
        if (engine.scene && importedNodeRef.current) {
          console.log('이전에 임포트된 노드 제거 시도');

          // 활성 Scene에서 모든 노드 제거
          const scene = engine.scene.getActive();
          if (scene && scene.root) {
            console.log('현재 Scene의 자식 수:', scene.root.children.length);
            scene.root.clearChildren();
            console.log('Scene 초기화 완료');
          }

          importedNodeRef.current = null;
        }
      } catch (err) {
        console.error('이전 노드 제거 중 오류:', err);
      }

      // SVG 가져오기 시작
      console.log('SVG 임포트 함수 호출 시작...');
      let result: any;

      try {
        // SVG 직접 가져오기 시도
        console.time('SVG 가져오기 시간');

        // 접근 방식에 따라 적절한 메서드 선택
        if (hasPluginImport) {
          console.log('플러그인 직접 접근 방식으로 SVG 가져오기 시도');
          const svgImportPlugin = engine.getPlugin('svg-import-tool');
          result = await (svgImportPlugin as any).importFromString(svgContent, importOptions);
        } else if (hasEngineExtension) {
          console.log('엔진 확장 방식으로 SVG 가져오기 시도');
          result = await (engine as any).svgImport.importFromString(svgContent, importOptions);
        }

        console.timeEnd('SVG 가져오기 시간');

        console.log('SVG 가져오기 결과:', {
          success: !!result,
          resultType: result ? typeof result : 'undefined',
          hasId: result ? !!result.id : false,
          id: result ? result.id : '없음',
        });

        // 가져온 노드 검증
        if (result) {
          console.log('가져온 SVG 노드 상세 정보:');
          console.log('- 노드 ID:', result.id);
          console.log('- 노드 타입:', result.nodeType || '알 수 없음');
          console.log('- 자식 노드 수:', result.children ? result.children.length : '알 수 없음');

          // 노드 속성 검증 및 보정
          const validateImportedNode = (node: any, level = 0) => {
            if (!node) return;

            // 기본 노드 속성 확인
            const prefix = '  '.repeat(level) + '- ';
            console.log(prefix + `노드: ${node.id}, 타입: ${node.type || '없음'}`);

            // transform 확인
            if (!node.transform || !node.transform.values) {
              console.warn(prefix + `노드 ${node.id}에 transform이 없거나 유효하지 않음`);
            }

            // bounds 확인
            if (!node.bounds) {
              console.warn(prefix + `노드 ${node.id}에 bounds가 없음`);
            } else {
              console.log(
                prefix +
                  `bounds: x=${node.bounds.x}, y=${node.bounds.y}, w=${node.bounds.width}, h=${node.bounds.height}`
              );
            }

            // style 확인
            if (!node.style) {
              console.warn(prefix + `노드 ${node.id}에 style이 없음`);
            }

            // 자식 노드 검증
            if (node.children && node.children.length > 0) {
              console.log(prefix + `자식 노드 ${node.children.length}개 검증 시작`);
              node.children.forEach((child: any) => validateImportedNode(child, level + 1));
            }
          };

          console.log('=== 가져온 SVG 노드 구조 검증 ===');
          validateImportedNode(result);
        }

        // 가져온 노드를 Scene에 추가
        console.log('가져온 SVG 노드를 Scene에 추가 시도');
        const scene = engine.scene.getActive();

        if (scene && scene.root && result) {
          console.log('Scene에 노드 추가 전 자식 수:', scene.root.children.length);
          scene.root.addChild(result);
          console.log('Scene에 노드 추가 후 자식 수:', scene.root.children.length);

          // 렌더링 시도
          console.log('렌더러를 통한 렌더링 시도...');
          try {
            engine.renderer.render(scene);
            console.log('렌더링 완료 (에러 없음)');
          } catch (err) {
            console.error('렌더링 중 오류:', err);
          }

          // 임포트된 노드 참조 저장
          importedNodeRef.current = result;
          console.log('SVG 가져오기 및 렌더링 완료');
        } else {
          console.error('활성 Scene을 찾을 수 없거나 가져온 노드가 없음');
        }
      } catch (err) {
        console.error('SVG 가져오기 중 오류:', err);
      }
    } catch (err) {
      console.error('SVG 가져오기 처리 중 오류:', err);
    }
  };

  // 파일 선택 핸들러
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImportMethod('file');
    }
  };

  // 예제 SVG 로드 함수
  const loadExampleSVG = () => {
    console.log('\n\n==== 예제 SVG 로드 버튼 클릭됨 ====');

    const exampleSVG = `<svg width="200" height="200" viewBox="0 0 200 200">
  <rect x="30" y="30" width="140" height="140" fill="#4285f4" stroke="#0f2e90" stroke-width="3" />
  <circle cx="100" cy="100" r="50" fill="#ea4335" stroke="#991409" stroke-width="2" />
  <polygon points="100,50 120,80 160,80 130,110 140,150 100,130 60,150 70,110 40,80 80,80" fill="#fbbc05" stroke="#e37400" stroke-width="2" />
  <text x="100" y="180" font-family="Arial" font-size="16" text-anchor="middle" fill="#34a853">Vector.js</text>
</svg>`;

    console.log('예제 SVG 문자열 설정:', exampleSVG.substring(0, 50) + '...');
    setSvgString(exampleSVG);
    setImportMethod('string');

    // 옵션 설정
    setImportOptions({
      preserveViewBox: true,
      flattenGroups: false,
      scale: 1,
    });

    console.log('예제 SVG 설정 완료, SVG 가져오기 시작');

    // 자동으로 importSVG 함수 호출
    setTimeout(() => {
      importSVG();
    }, 100);
  };

  // 코드 예제 가져오기
  const getCodeExample = () => {
    switch (importMethod) {
      case 'string':
        return `// SVG 문자열에서 가져오기
const svgString = \`<svg width="200" height="200">
  <rect x="50" y="50" width="100" height="100" fill="blue" />
</svg>\`;

// 옵션 설정
const options = {
  preserveViewBox: ${importOptions.preserveViewBox},
  flattenGroups: ${importOptions.flattenGroups},
  scale: ${importOptions.scale}
};

// SVG 가져오기
const result = await engine.svgImport.importFromString(svgString, options);`;

      case 'url':
        return `// URL에서 SVG 가져오기
const svgUrl = "${svgUrl || 'https://example.com/image.svg'}";

// 옵션 설정
const options = {
  preserveViewBox: ${importOptions.preserveViewBox},
  flattenGroups: ${importOptions.flattenGroups},
  scale: ${importOptions.scale}
};

// SVG 가져오기
const result = await engine.svgImport.importFromURL(svgUrl, options);`;

      case 'file':
        return `// 파일에서 SVG 가져오기
// HTML에서 파일 입력 요소 가져오기
const fileInput = document.getElementById('svg-file-input');
const file = fileInput.files[0];

// 옵션 설정
const options = {
  preserveViewBox: ${importOptions.preserveViewBox},
  flattenGroups: ${importOptions.flattenGroups},
  scale: ${importOptions.scale}
};

// SVG 가져오기
const result = await engine.svgImport.importFromFile(file, options);`;
      default:
        return '';
    }
  };

  // Engine Test 버튼 클릭 핸들러
  const handleEngineTest = () => {
    const engine = engineRef.current;
    console.log('엔진 테스트 시작...');

    if (engine) {
      try {
        console.log('엔진 분석:');
        console.log('- engine.ready:', (engine as any).ready);
        console.log('- engine.scene exists:', !!engine.scene);
        console.log('- engine.renderer exists:', !!engine.renderer);

        const plugins = [
          'Math Plugin 로드됨:',
          !!engine.getPlugin('math'),
          'Shape Plugin 로드됨:',
          !!engine.getPlugin('shape'),
          'Group Plugin 로드됨:',
          !!engine.getPlugin('group'),
          'SVG Import Tool 로드됨:',
          !!(
            engine.getPlugin('svg-import-tool') &&
            (engine.getPlugin('svg-import-tool') as any)?.importFromString
          ),
        ];
        console.log('플러그인 상태:', plugins);

        // 활성 렌더러 정보 확인
        try {
          // 렌더러 관리자가 있는지 확인
          const rendererManager = (engine as any).renderer;
          console.log('렌더러 객체 키:', Object.keys(rendererManager));

          // 활성 렌더러 확인 시도
          console.log('엔진의 renderer 객체 타입:', typeof rendererManager);
          console.log(
            '렌더러 객체의 메서드:',
            Object.getOwnPropertyNames(Object.getPrototypeOf(rendererManager))
          );

          if (typeof rendererManager.getActive === 'function') {
            const activeRenderer = rendererManager.getActive();
            console.log('활성 렌더러 객체:', activeRenderer);
            console.log('활성 렌더러 ID:', activeRenderer?.id);

            // 렌더러가 실제 Canvas와 연결되어 있는지 확인
            if (activeRenderer && typeof activeRenderer.getCanvas === 'function') {
              const canvas = activeRenderer.getCanvas();
              console.log('활성 렌더러의 Canvas:', !!canvas);
              if (canvas) {
                console.log('Canvas 크기:', { width: canvas.width, height: canvas.height });
                console.log('Canvas 표시 상태:', {
                  visibility: canvas.style.visibility,
                  display: canvas.style.display,
                  width: canvas.style.width,
                  height: canvas.style.height,
                });
              }
            } else {
              console.log('활성 렌더러가 getCanvas 메서드를 가지고 있지 않음');
            }
          } else {
            console.log(
              '렌더러 관리자(engine.renderer)에 getActive 메서드가 없음, 직접 렌더러 확인 시도'
            );

            // 직접 렌더러 목록 확인
            if (rendererManager.renderers) {
              console.log('등록된 렌더러 IDs:', Object.keys(rendererManager.renderers));

              // active_id로 활성 렌더러 확인
              if (rendererManager.active_id) {
                console.log('활성 렌더러 ID:', rendererManager.active_id);
                const active = rendererManager.renderers[rendererManager.active_id];
                console.log('활성 렌더러:', active);

                // 렌더러가 Canvas를 가지고 있는지 확인
                if (active && typeof active.getCanvas === 'function') {
                  const canvas = active.getCanvas();
                  console.log('활성 렌더러의 Canvas:', !!canvas);
                  if (canvas) {
                    console.log('Canvas 크기:', { width: canvas.width, height: canvas.height });
                  }
                }
              } else {
                console.log('활성 렌더러 ID가 설정되지 않음');
              }
            } else {
              console.log('등록된 렌더러 목록이 없음');
            }
          }
        } catch (error) {
          console.error('렌더러 정보 확인 중 오류:', error);
        }

        // 활성 Scene 확인
        try {
          console.log('활성 Scene 정보:');
          if (engine.scene) {
            // 활성 Scene 가져오기
            const activeScene = engine.scene.getActive();
            console.log('활성 Scene 존재:', !!activeScene);

            if (activeScene && activeScene.root) {
              console.log('Scene Root 노드 존재:', !!activeScene.root);
              console.log(
                'Scene의 자식 수:',
                activeScene.root.children ? activeScene.root.children.length : 0
              );

              // 간단한 도형 생성하여 렌더링 테스트
              try {
                console.log('테스트 Shape 생성 및 렌더링 시도...');

                // Scene 초기화 - activeScene.root 사용
                if (activeScene.root.clearChildren) {
                  activeScene.root.clearChildren();
                  console.log('Scene 초기화 완료');
                } else {
                  console.log('clearChildren 메서드 없음, 수동으로 자식 제거 시도');
                  if (activeScene.root.children && activeScene.root.children.length > 0) {
                    while (activeScene.root.children.length > 0) {
                      activeScene.root.removeChild(activeScene.root.children[0]);
                    }
                  }
                }

                // 테스트용 사각형 추가 (플러그인 직접 확인)
                const shapePlugin = engine.getPlugin('shape');
                console.log('Shape 플러그인 존재:', !!shapePlugin);

                let rect;
                if (shapePlugin && typeof (shapePlugin as any).createRect === 'function') {
                  rect = (shapePlugin as any).createRect({
                    x: 50,
                    y: 50,
                    width: 100,
                    height: 100,
                    fill: '#ff0000',
                    stroke: '#000000',
                    strokeWidth: 2,
                  });
                } else if (
                  (engine as any).shape &&
                  typeof (engine as any).shape.createRect === 'function'
                ) {
                  rect = (engine as any).shape.createRect({
                    x: 50,
                    y: 50,
                    width: 100,
                    height: 100,
                    fill: '#ff0000',
                    stroke: '#000000',
                    strokeWidth: 2,
                  });
                } else {
                  console.error('Shape 생성 메서드를 찾을 수 없음');
                }

                if (rect) {
                  console.log('테스트 Shape 생성됨:', rect.id);
                  // Scene에 노드 추가 - activeScene.root 사용
                  activeScene.root.addChild(rect);
                  console.log('Shape를 Scene에 추가함');

                  // 렌더링 시도 - activeScene 전달
                  console.log('렌더링 시도...');
                  if (typeof engine.renderer.render === 'function') {
                    engine.renderer.render(activeScene);
                    console.log('렌더링 완료 (에러 없음)');
                  } else {
                    console.error('render 메서드를 찾을 수 없음');
                  }
                } else {
                  console.error('Shape 생성 실패');
                }
              } catch (error) {
                console.error('테스트 렌더링 중 오류:', error);
              }
            } else {
              console.log('활성 Scene에 Root 노드가 없음');
            }
          } else {
            console.log('Scene 서비스가 없음');
          }
        } catch (error) {
          console.error('Scene 정보 확인 중 오류:', error);
        }
      } catch (err) {
        console.error('엔진 테스트 중 오류:', err);
      }
    } else {
      console.error('Vector Engine이 초기화되지 않음');
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <Link href="/examples" className="text-blue-500 hover:underline mb-4 inline-block">
          ← 예제 목록으로 돌아가기
        </Link>
        <h1 className="text-3xl font-bold mb-2">SVG Import Tool Plugin</h1>
        <p className="text-gray-600 mb-4">
          SVG 파일을 가져와서 Modern Vector.js 장면으로 변환하는 방법을 알아봅니다. 문자열, URL,
          파일에서 SVG를 가져올 수 있습니다.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>SVG 미리보기</CardTitle>
              <CardDescription>가져온 SVG가 캔버스에 렌더링됩니다.</CardDescription>
            </CardHeader>
            <CardContent>
              <div ref={containerRef} className="w-full border rounded-lg overflow-hidden">
                <canvas
                  ref={canvasRef}
                  width={canvasSize.width}
                  height={canvasSize.height}
                  className="w-full h-full bg-white"
                  style={{
                    border: '2px solid #333',
                    position: 'relative',
                    zIndex: 10,
                    visibility: 'visible',
                    display: 'block',
                    minHeight: '300px',
                    backgroundColor: '#f0f0f0',
                  }}
                />
              </div>

              {importStatus === 'error' && (
                <div className="mt-4 p-3 bg-red-100 text-red-800 rounded-md">
                  <p className="font-semibold">오류 발생:</p>
                  <p>{errorMessage}</p>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex flex-wrap gap-2">
              <Button onClick={importSVG} disabled={importStatus === 'loading'}>
                {importStatus === 'loading' ? '가져오는 중...' : 'SVG 가져오기'}
              </Button>
              <Button variant="outline" onClick={loadExampleSVG}>
                예제 SVG 로드
              </Button>
              <Button
                variant="outline"
                className="border-indigo-500 text-indigo-700"
                onClick={() => {
                  console.log('직접 Canvas 그리기 테스트 시작...');

                  // Canvas 요소 가져오기
                  const canvas = canvasRef.current;
                  if (!canvas) {
                    console.error('Canvas 요소를 찾을 수 없음');
                    return;
                  }

                  console.log('Canvas 요소 확인:', !!canvas);
                  console.log('Canvas 크기:', canvas.width, 'x', canvas.height);
                  console.log('Canvas ID:', canvas.id || 'ID 없음');

                  try {
                    // Canvas 2D Context 가져오기
                    const ctx = canvas.getContext('2d');
                    if (!ctx) {
                      console.error('Canvas 2D Context를 가져올 수 없음');
                      return;
                    }

                    console.log('Canvas 2D Context 확인:', !!ctx);

                    // Canvas 초기화
                    ctx.clearRect(0, 0, canvas.width, canvas.height);

                    // 배경 그리기
                    ctx.fillStyle = '#f8f8f8';
                    ctx.fillRect(0, 0, canvas.width, canvas.height);

                    // 테스트 도형 그리기
                    // 1. 사각형
                    ctx.fillStyle = '#ff0000';
                    ctx.fillRect(50, 50, 100, 100);

                    // 2. 테두리
                    ctx.strokeStyle = '#000000';
                    ctx.lineWidth = 2;
                    ctx.strokeRect(50, 50, 100, 100);

                    // 3. 텍스트
                    ctx.fillStyle = '#000000';
                    ctx.font = '16px Arial';
                    ctx.fillText('직접 그리기 테스트', 60, 90);

                    console.log('Canvas 직접 그리기 완료');

                    // 픽셀 데이터 확인 (그림이 실제로 그려졌는지 확인)
                    const pixelData = ctx.getImageData(60, 60, 1, 1).data;
                    console.log(
                      '(60,60) 픽셀 색상:',
                      `rgba(${pixelData[0]}, ${pixelData[1]}, ${pixelData[2]}, ${pixelData[3] / 255})`
                    );

                    if (pixelData[0] > 0) {
                      console.log('빨간색 픽셀 확인됨 - 그리기 성공');
                    } else {
                      console.error('예상한 픽셀 색상이 없음 - 그리기 실패');
                    }
                  } catch (error) {
                    console.error('Canvas 직접 그리기 중 오류:', error);
                  }
                }}
              >
                직접 Canvas 그리기 테스트
              </Button>
            </CardFooter>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>가져오기 옵션</CardTitle>
              <CardDescription>SVG 가져오기 방법과 옵션을 설정합니다.</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs
                defaultValue="string"
                value={importMethod}
                onValueChange={v => setImportMethod(v as any)}
              >
                <TabsList className="w-full mb-4">
                  <TabsTrigger value="string" className="flex-1">
                    문자열
                  </TabsTrigger>
                  <TabsTrigger value="url" className="flex-1">
                    URL
                  </TabsTrigger>
                  <TabsTrigger value="file" className="flex-1">
                    파일
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="string">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="svg-string">SVG 문자열</Label>
                      <Textarea
                        id="svg-string"
                        value={svgString}
                        onChange={e => setSvgString(e.target.value)}
                        rows={8}
                        className="font-mono text-sm"
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="url">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="svg-url">SVG URL</Label>
                      <Input
                        id="svg-url"
                        type="url"
                        placeholder="https://example.com/image.svg"
                        value={svgUrl}
                        onChange={e => setSvgUrl(e.target.value)}
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="file">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="svg-file">SVG 파일 선택</Label>
                      <input
                        id="svg-file"
                        ref={fileInputRef}
                        type="file"
                        accept=".svg"
                        onChange={handleFileChange}
                        className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none"
                      />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              <div className="mt-6 space-y-4">
                <h3 className="font-semibold">가져오기 옵션</h3>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="preserve-viewbox"
                    checked={importOptions.preserveViewBox}
                    onCheckedChange={checked =>
                      setImportOptions({ ...importOptions, preserveViewBox: !!checked })
                    }
                  />
                  <Label htmlFor="preserve-viewbox">viewBox 유지</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="flatten-groups"
                    checked={importOptions.flattenGroups}
                    onCheckedChange={checked =>
                      setImportOptions({ ...importOptions, flattenGroups: !!checked })
                    }
                  />
                  <Label htmlFor="flatten-groups">그룹 평탄화</Label>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="scale">스케일: {importOptions.scale.toFixed(1)}</Label>
                  </div>
                  <Slider
                    id="scale"
                    min={0.1}
                    max={3}
                    step={0.1}
                    value={[importOptions.scale]}
                    onValueChange={value => setImportOptions({ ...importOptions, scale: value[0] })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>코드 예제</CardTitle>
              <CardDescription>현재 설정으로 SVG를 가져오는 코드입니다.</CardDescription>
            </CardHeader>
            <CardContent>
              <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto text-sm">
                <code>{getCodeExample()}</code>
              </pre>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>SVG Import Tool Plugin 사용 방법</CardTitle>
              <CardDescription>
                SVG Import Tool Plugin을 사용하여 SVG 파일을 가져오는 방법을 알아봅니다.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <h3 className="text-lg font-semibold">1. 플러그인 설치</h3>
              <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto text-sm">
                <code>{`// SVG Import Tool Plugin 가져오기
import { SVGImportToolPlugin } from 'modern-vector.js/plugins/tools/svg-import';

// Vector Engine 생성
const engine = new VectorEngine();

// 플러그인 등록
engine.use(new SVGImportToolPlugin());`}</code>
              </pre>

              <h3 className="text-lg font-semibold">2. SVG 가져오기</h3>
              <p>
                SVG Import Tool Plugin은 문자열, URL, 파일에서 SVG를 가져오는 세 가지 방법을
                제공합니다. 각 방법은 비동기 함수로 구현되어 있어 Promise를 반환합니다.
              </p>

              <h4 className="font-semibold">문자열에서 가져오기</h4>
              <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto text-sm">
                <code>{`const svgString = '<svg>...</svg>';
const result = await engine.svgImport.importFromString(svgString);`}</code>
              </pre>

              <h4 className="font-semibold">URL에서 가져오기</h4>
              <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto text-sm">
                <code>{`const svgUrl = 'https://example.com/image.svg';
const result = await engine.svgImport.importFromURL(svgUrl);`}</code>
              </pre>

              <h4 className="font-semibold">파일에서 가져오기</h4>
              <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto text-sm">
                <code>{`// HTML 파일 입력에서 파일 가져오기
const fileInput = document.getElementById('file-input');
const file = fileInput.files[0];

// 옵션 설정
const options = {
  preserveViewBox: ${importOptions.preserveViewBox},
  flattenGroups: ${importOptions.flattenGroups},
  scale: ${importOptions.scale}
};

// SVG 가져오기
const result = await engine.svgImport.importFromFile(file, options);`}</code>
              </pre>

              <h3 className="text-lg font-semibold">3. 가져오기 옵션</h3>
              <p>SVG Import Tool Plugin은 다음과 같은 옵션을 제공합니다:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>preserveViewBox</strong>: SVG의 viewBox 속성을 유지할지 여부 (기본값:
                  true)
                </li>
                <li>
                  <strong>flattenGroups</strong>: SVG 그룹을 평탄화할지 여부 (기본값: false)
                </li>
                <li>
                  <strong>scale</strong>: SVG 요소에 적용할 스케일 팩터 (기본값: 1)
                </li>
              </ul>

              <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto text-sm">
                <code>{`// 가져오기 옵션 설정
const options = {
  preserveViewBox: true,
  flattenGroups: false,
  scale: 1.5
};

// 옵션을 적용하여 SVG 가져오기
const result = await engine.svgImport.importFromString(svgString, options);`}</code>
              </pre>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>SVG Import Tool Plugin 사용 방법</CardTitle>
          <CardDescription>
            SVG Import Tool Plugin을 사용하여 SVG 파일을 가져오는 방법을 알아봅니다.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <h3 className="text-lg font-semibold">1. 플러그인 설치</h3>
          <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto text-sm">
            <code>{`// SVG Import Tool Plugin 가져오기
import { SVGImportToolPlugin } from 'modern-vector.js/plugins/tools/svg-import';

// Vector Engine 생성
const engine = new VectorEngine();

// 플러그인 등록
engine.use(new SVGImportToolPlugin());`}</code>
          </pre>

          <h3 className="text-lg font-semibold">2. SVG 가져오기</h3>
          <p>
            SVG Import Tool Plugin은 문자열, URL, 파일에서 SVG를 가져오는 세 가지 방법을 제공합니다.
            각 방법은 비동기 함수로 구현되어 있어 Promise를 반환합니다.
          </p>

          <h4 className="font-semibold">문자열에서 가져오기</h4>
          <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto text-sm">
            <code>{`const svgString = '<svg>...</svg>';
const result = await engine.svgImport.importFromString(svgString);`}</code>
          </pre>

          <h4 className="font-semibold">URL에서 가져오기</h4>
          <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto text-sm">
            <code>{`const svgUrl = 'https://example.com/image.svg';
const result = await engine.svgImport.importFromURL(svgUrl);`}</code>
          </pre>

          <h4 className="font-semibold">파일에서 가져오기</h4>
          <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto text-sm">
            <code>{`// HTML 파일 입력에서 파일 가져오기
const fileInput = document.getElementById('file-input');
const file = fileInput.files[0];

// 옵션 설정
const options = {
  preserveViewBox: ${importOptions.preserveViewBox},
  flattenGroups: ${importOptions.flattenGroups},
  scale: ${importOptions.scale}
};

// SVG 가져오기
const result = await engine.svgImport.importFromFile(file, options);`}</code>
          </pre>

          <h3 className="text-lg font-semibold">3. 가져오기 옵션</h3>
          <p>SVG Import Tool Plugin은 다음과 같은 옵션을 제공합니다:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>preserveViewBox</strong>: SVG의 viewBox 속성을 유지할지 여부 (기본값: true)
            </li>
            <li>
              <strong>flattenGroups</strong>: SVG 그룹을 평탄화할지 여부 (기본값: false)
            </li>
            <li>
              <strong>scale</strong>: SVG 요소에 적용할 스케일 팩터 (기본값: 1)
            </li>
          </ul>

          <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto text-sm">
            <code>{`// 가져오기 옵션 설정
const options = {
  preserveViewBox: true,
  flattenGroups: false,
  scale: 1.5
};

// 옵션을 적용하여 SVG 가져오기
const result = await engine.svgImport.importFromString(svgString, options);`}</code>
          </pre>
        </CardContent>
      </Card>
    </div>
  );
}
