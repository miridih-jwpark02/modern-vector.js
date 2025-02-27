'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { VectorEngine } from '@/../../packages/core';
import { ShapePlugin } from '@/../../packages/core/src/plugins/core/shapes/shape-plugin';
import { CanvasRenderer } from '@/../../packages/core/src/plugins/renderers/canvas/canvas-renderer';
import { MathPlugin } from '@/../../packages/core/src/plugins/core/math';
import { SVGImportToolPlugin } from '@/../../packages/core/src/plugins/tools/svg-import/svg-import-plugin';

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
import { GroupPlugin } from '../../../../../core/src/plugins/core/group/group-plugin';

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

    // Vector Engine 생성
    const engine = new VectorEngine();

    // 플러그인 등록
    engine.use(new MathPlugin());
    engine.use(new ShapePlugin());
    engine.use(new GroupPlugin());
    engine.use(new SVGImportToolPlugin());

    // 장면 생성 및 활성화
    const scene = engine.scene.create();
    engine.scene.setActive(scene);

    // 렌더러 등록
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
    const exampleSVG = `<svg width="200" height="200" viewBox="0 0 200 200">
  <rect x="50" y="50" width="100" height="100" fill="blue" stroke="black" stroke-width="2" />
  <circle cx="100" cy="100" r="30" fill="red" />
  <g id="star">
    <polygon points="100,20 120,80 180,80 130,120 150,180 100,140 50,180 70,120 20,80 80,80" fill="gold" stroke="orange" stroke-width="2" />
  </g>
</svg>`;

    setSvgString(exampleSVG);
    setImportMethod('string');
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
