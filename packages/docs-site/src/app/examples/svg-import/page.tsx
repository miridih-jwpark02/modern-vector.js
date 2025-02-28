'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { VectorEngine, Plugin } from '@/../../packages/core';
import { ShapePlugin } from '@/../../packages/core/src/plugins/core/shapes/shape-plugin';
import { CanvasRenderer } from '@/../../packages/core/src/plugins/renderers/canvas/canvas-renderer';
import { MathPlugin } from '@/../../packages/core/src/plugins/core/math';
import { SVGImportToolPlugin } from '@/../../packages/core/src/plugins/tools/svg-import/svg-import-plugin';
import { DefaultGroupPlugin } from '@/../../packages/core/src/plugins/core/group/group-plugin';

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
    let createMatrixFn;
    if (mathPlugin && (mathPlugin as any).Matrix3x3 && (mathPlugin as any).Matrix3x3.create) {
      createMatrixFn = (mathPlugin as any).Matrix3x3.create;
      console.log('Found Matrix3x3.create method from MathPlugin');
    } else {
      console.log('Matrix3x3.create not found, using simple matrix initialization');
      createMatrixFn = () => [1, 0, 0, 0, 1, 0, 0, 0, 1]; // 항등 행렬
    }

    // 재귀적으로 노드 속성을 확인하고 필요한 속성을 설정하는 함수
    function ensureNodeProperties(node: any) {
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
    }

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
  // 캔버스 참조
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // 컨테이너 참조
  const containerRef = useRef<HTMLDivElement>(null);
  // Vector Engine 참조
  const engineRef = useRef<VectorEngine | null>(null);
  // 파일 입력 참조
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 상태 관리
  const [svgString, setSvgString] = useState<string>(
    '<svg width="200" height="200" viewBox="0 0 200 200"><rect x="50" y="50" width="100" height="100" fill="blue" stroke="black" stroke-width="2" /></svg>'
  );
  const [svgUrl, setSvgUrl] = useState<string>('');
  const [importOptions, setImportOptions] = useState<SVGImportOptions>({
    preserveViewBox: false,
    flattenGroups: false,
    scale: 1,
  });
  const [importMethod, setImportMethod] = useState<'string' | 'url' | 'file'>('string');
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 500 });
  const [importStatus, setImportStatus] = useState<'idle' | 'loading' | 'success' | 'error'>(
    'idle'
  );
  const [errorMessage, setErrorMessage] = useState<string>('');

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

      // 장면 생성 및 활성화
      console.log('Scene 생성 시작');
      const scene = engine.scene.create();
      engine.scene.setActive(scene);
      console.log('Scene 생성 및 활성화 완료');

      // 렌더러 등록
      console.log('CanvasRenderer 등록 시작');
      const renderer = new CanvasRenderer({
        context: {
          canvas: canvasRef.current,
          contextType: '2d',
        },
        antialias: true,
        autoClear: true,
      });

      engine.renderer.register(renderer);
      engine.renderer.setActive('canvas');
      console.log('CanvasRenderer 등록 및 활성화 완료');

      // 엔진 참조 저장
      engineRef.current = engine;
      console.log('engineRef에 엔진 참조 저장 완료');

      console.log('Vector Engine 초기화 완료');

      // 등록된 플러그인 확인
      const registeredMathPlugin = engine.getPlugin('math');
      const registeredShapePlugin = engine.getPlugin('shape');
      const registeredGroupPlugin = engine.getPlugin('group');
      const registeredSvgImportPlugin = engine.getPlugin('svg-import-tool');

      console.log('등록된 플러그인 확인:');
      console.log('- Math Plugin:', !!registeredMathPlugin);
      console.log('- Shape Plugin:', !!registeredShapePlugin);
      console.log('- Group Plugin:', !!registeredGroupPlugin);
      console.log('- SVG Import Plugin:', !!registeredSvgImportPlugin);

      // 엔진 확장 메서드 확인
      console.log('Engine SVG Import 확장 확인:', !!(engine as any).svgImport);
      if ((engine as any).svgImport) {
        console.log(
          '사용 가능한 SVG Import 메서드:',
          Object.keys((engine as any).svgImport).join(', ')
        );
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
    if (!engineRef.current) return;

    const engine = engineRef.current;
    setImportStatus('loading');
    setErrorMessage('');

    try {
      // 현재 장면 초기화
      const scene = engine.scene.getActive();
      while (scene.root.children.length > 0) {
        scene.root.removeChild(scene.root.children[0]);
      }

      // 가져오기 방법에 따라 SVG 가져오기
      let result;

      switch (importMethod) {
        case 'string':
          result = await (engine as any).svgImport.importFromString(svgString, importOptions);
          break;
        case 'url':
          if (!svgUrl) {
            throw new Error('URL이 입력되지 않았습니다.');
          }
          result = await (engine as any).svgImport.importFromURL(svgUrl, importOptions);
          break;
        case 'file':
          if (!fileInputRef.current?.files?.[0]) {
            throw new Error('파일이 선택되지 않았습니다.');
          }
          result = await (engine as any).svgImport.importFromFile(
            fileInputRef.current.files[0],
            importOptions
          );
          break;
      }

      // 장면 렌더링
      engine.renderer.render(scene);
      setImportStatus('success');
    } catch (error) {
      console.error('SVG 가져오기 오류:', error);
      setImportStatus('error');
      setErrorMessage(error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.');
    }
  };

  // 파일 선택 핸들러
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImportMethod('file');
    }
  };

  // 예제 SVG 로드
  const loadExampleSVG = () => {
    console.log('\n\n==== 예제 SVG 로드 버튼 클릭됨 ====');

    const exampleSVG = `<svg width="200" height="200" viewBox="0 0 200 200">
  <rect x="50" y="50" width="100" height="100" fill="blue" stroke="black" stroke-width="2" />
  <circle cx="100" cy="100" r="30" fill="red" />
  <g id="star">
    <polygon points="100,20 120,80 180,80 130,120 150,180 100,140 50,180 70,120 20,80 80,80" fill="gold" stroke="orange" stroke-width="2" />
  </g>
</svg>`;

    console.log('예제 SVG 문자열 설정:', exampleSVG.substring(0, 50) + '...');
    setSvgString(exampleSVG);
    console.log('importMethod "string"으로 설정');
    setImportMethod('string');

    // 엔진 상태 확인
    console.log('엔진 참조 확인:', !!engineRef.current);

    // 엔진이 이미 초기화되어 있으면 직접 SVG 가져오기 시도
    if (engineRef.current) {
      console.log('엔진이 초기화되어 있음, 직접 가져오기 시도');

      try {
        console.log('\n\n==== Example SVG Load Button Clicked ====');
        console.log('Engine already initialized, trying to import directly');

        // 약간의 지연 후 SVG 가져오기 실행 (상태 업데이트가 완료될 시간을 주기 위해)
        setTimeout(() => {
          console.log('타임아웃 콜백 실행');
          if (engineRef.current) {
            console.log('importSVGDirectly 함수 호출 전');
            try {
              importSVGDirectly(engineRef.current, exampleSVG);
              console.log('importSVGDirectly 함수 호출 성공');
            } catch (err) {
              console.error('importSVGDirectly 함수 호출 중 오류 발생:', err);
            }
          } else {
            console.warn('타임아웃 콜백에서 engineRef.current가 없음');
          }
        }, 100);
      } catch (err) {
        console.error('SVG 로드 처리 중 오류 발생:', err);
      }
    } else {
      console.warn('Engine not initialized yet, SVG will be loaded when engine is ready');
    }
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
            <CardFooter>
              <Button onClick={importSVG} disabled={importStatus === 'loading'}>
                {importStatus === 'loading' ? '가져오는 중...' : 'SVG 가져오기'}
              </Button>
              <Button variant="outline" className="ml-2" onClick={loadExampleSVG}>
                예제 SVG 로드
              </Button>
              <Button
                variant="secondary"
                className="ml-2"
                onClick={() => {
                  console.log('Canvas 직접 그리기 테스트 버튼 클릭');
                  if (canvasRef.current) {
                    const ctx = canvasRef.current.getContext('2d');
                    if (ctx) {
                      console.log('Canvas 컨텍스트 획득 성공');

                      // Canvas 초기화
                      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
                      console.log('Canvas 초기화 완료');

                      // 배경색 설정
                      ctx.fillStyle = '#f8f8f8';
                      ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);

                      // 빨간색 사각형 그리기
                      ctx.fillStyle = 'red';
                      ctx.fillRect(50, 50, 150, 100);

                      // 파란색 원 그리기
                      ctx.beginPath();
                      ctx.arc(250, 150, 50, 0, Math.PI * 2);
                      ctx.fillStyle = 'blue';
                      ctx.fill();

                      // 텍스트 추가
                      ctx.font = '20px Arial';
                      ctx.fillStyle = 'black';
                      ctx.fillText('Canvas 직접 그리기 테스트', 80, 220);

                      console.log('Canvas 그리기 완료');
                    } else {
                      console.error('Canvas 컨텍스트를 가져올 수 없음');
                    }
                  } else {
                    console.error('Canvas 요소를 찾을 수 없음');
                  }
                }}
              >
                Canvas 테스트
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div>
          <Card>
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

const result = await engine.svgImport.importFromFile(file);`}</code>
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
