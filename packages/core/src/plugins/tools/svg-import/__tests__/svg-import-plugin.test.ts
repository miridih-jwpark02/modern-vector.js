import { describe, expect, test, vi, beforeEach } from 'vitest';
import { SVGImportToolPlugin } from '../svg-import-plugin';
import {
  VectorEngine,
  SceneNode,
  Renderer,
  Scene,
  RendererCapabilities,
} from '../../../../core/types';
import { SVGImportToolPluginExtension, SVGImportOptions } from '../types';

/**
 * SVG Import Tool Plugin 테스트
 */
describe('SVGImportToolPlugin', () => {
  // 테스트용 SVG 문자열
  const testSvgString =
    '<svg width="100" height="100"><rect x="10" y="10" width="80" height="80" fill="blue" /></svg>';

  // 다양한 SVG 요소를 포함한 복잡한 테스트 SVG
  const complexSvgString = `
    <svg width="200" height="200" viewBox="0 0 200 200">
      <g id="test-group">
        <rect x="10" y="10" width="80" height="80" fill="red" stroke="black" stroke-width="2" />
        <circle cx="150" cy="50" r="30" fill="blue" opacity="0.5" />
        <ellipse cx="50" cy="150" rx="40" ry="20" fill="green" />
        <line x1="100" y1="10" x2="100" y2="190" stroke="purple" stroke-width="3" />
        <polyline points="10,80 30,90 50,80 70,90" fill="none" stroke="orange" />
        <polygon points="120,120 150,150 120,180 90,150" fill="yellow" stroke="black" />
        <path d="M160,120 C180,100 180,140 160,120 Z" fill="pink" />
      </g>
    </svg>
  `;

  // 다양한 Path 명령어를 포함한 SVG
  const pathTestSvgString = `
    <svg width="200" height="200" viewBox="0 0 200 200">
      <path d="M10,10 L50,10 L50,50 L10,50 Z" fill="red" />
      <path d="M70,10 h40 v40 h-40 Z" fill="green" />
      <path d="M10,70 Q30,60 50,70 T90,70" fill="none" stroke="blue" stroke-width="2" />
      <path d="M110,70 C120,50 140,50 150,70 S180,90 190,70" fill="none" stroke="purple" stroke-width="2" />
      <path d="M10,110 A30,30 0 0,1 40,140" fill="none" stroke="orange" stroke-width="2" />
    </svg>
  `;

  // 잘못된 형식의 SVG
  const invalidSvgString = `
    <svg width="100" height="100">
      <rect x="10" y="invalid" width="80" height="malformed" fill="blue" />
      <unknown_element />
    </svg>
  `;

  // 빈 SVG
  const emptySvgString = '<svg width="100" height="100"></svg>';

  // Mock VectorEngine
  let mockEngine: VectorEngine;

  // Mock Renderer
  let mockRenderer: Renderer;

  // 플러그인 인스턴스
  let plugin: SVGImportToolPlugin;

  /**
   * 각 테스트 전에 실행되는 설정
   */
  beforeEach(() => {
    // Mock DOMParser
    global.DOMParser = vi.fn().mockImplementation(() => ({
      parseFromString: vi.fn().mockImplementation(str => {
        // 테스트 SVG에 따라 다른 mock 객체 반환
        if (str === testSvgString) {
          return {
            documentElement: {
              hasAttribute: vi.fn().mockReturnValue(true),
              getAttribute: vi.fn().mockReturnValue('0 0 100 100'),
              children: [
                {
                  tagName: 'rect',
                  hasAttribute: vi.fn().mockImplementation(attr => {
                    return ['x', 'y', 'width', 'height', 'fill'].includes(attr);
                  }),
                  getAttribute: vi.fn().mockImplementation(attr => {
                    switch (attr) {
                      case 'x':
                        return '10';
                      case 'y':
                        return '10';
                      case 'width':
                        return '80';
                      case 'height':
                        return '80';
                      case 'fill':
                        return 'blue';
                      default:
                        return '';
                    }
                  }),
                },
              ],
            },
          };
        } else if (str.includes('test-group')) {
          // 복잡한 SVG 문자열을 위한 mock
          return {
            documentElement: {
              hasAttribute: vi.fn().mockReturnValue(true),
              getAttribute: vi.fn().mockReturnValue('0 0 200 200'),
              children: [
                {
                  tagName: 'g',
                  id: 'test-group',
                  hasAttribute: vi.fn().mockReturnValue(false),
                  getAttribute: vi.fn().mockReturnValue(null),
                  children: [
                    {
                      tagName: 'rect',
                      hasAttribute: vi.fn().mockReturnValue(true),
                      getAttribute: vi.fn(),
                    },
                    {
                      tagName: 'circle',
                      hasAttribute: vi.fn().mockReturnValue(true),
                      getAttribute: vi.fn(),
                    },
                    {
                      tagName: 'ellipse',
                      hasAttribute: vi.fn().mockReturnValue(true),
                      getAttribute: vi.fn(),
                    },
                    {
                      tagName: 'line',
                      hasAttribute: vi.fn().mockReturnValue(true),
                      getAttribute: vi.fn(),
                    },
                    {
                      tagName: 'polyline',
                      hasAttribute: vi.fn().mockReturnValue(true),
                      getAttribute: vi.fn(),
                    },
                    {
                      tagName: 'polygon',
                      hasAttribute: vi.fn().mockReturnValue(true),
                      getAttribute: vi.fn(),
                    },
                    {
                      tagName: 'path',
                      hasAttribute: vi.fn().mockReturnValue(true),
                      getAttribute: vi.fn(),
                    },
                  ],
                },
              ],
            },
          };
        } else if (str.includes('path d="M10,10')) {
          // Path 테스트를 위한 mock
          return {
            documentElement: {
              hasAttribute: vi.fn().mockReturnValue(true),
              getAttribute: vi.fn().mockReturnValue('0 0 200 200'),
              children: [
                {
                  tagName: 'path',
                  hasAttribute: vi.fn().mockImplementation(attr => attr === 'd' || attr === 'fill'),
                  getAttribute: vi.fn().mockImplementation(attr => {
                    if (attr === 'd') return 'M10,10 L50,10 L50,50 L10,50 Z';
                    if (attr === 'fill') return 'red';
                    return null;
                  }),
                },
                // 더 많은 path 요소들...
              ],
            },
          };
        } else if (str === emptySvgString) {
          // 빈 SVG를 위한 mock
          return {
            documentElement: {
              hasAttribute: vi.fn().mockReturnValue(true),
              getAttribute: vi.fn().mockReturnValue('0 0 100 100'),
              children: [],
            },
          };
        } else {
          // 기본 fallback mock
          return {
            documentElement: {
              hasAttribute: vi.fn().mockReturnValue(false),
              getAttribute: vi.fn().mockReturnValue(null),
              children: [],
            },
          };
        }
      }),
    }));

    // Mock fetch
    global.fetch = vi.fn().mockImplementation(url => {
      if (url.includes('error')) {
        return Promise.resolve({
          ok: false,
          status: 404,
          statusText: 'Not Found',
        });
      }

      if (url.includes('complex')) {
        return Promise.resolve({
          ok: true,
          text: () => Promise.resolve(complexSvgString),
        });
      }

      return Promise.resolve({
        ok: true,
        text: () => Promise.resolve(testSvgString),
      });
    });

    // Mock Renderer
    mockRenderer = {
      id: 'mock-renderer',
      capabilities: {
        maxTextureSize: 4096,
        supportsSVG: true,
        supportsWebGL: true,
        supports3D: false,
      } as RendererCapabilities,
      render: vi.fn(),
      dispose: vi.fn(),
    };

    // Mock SceneNode
    const mockSceneNode: Partial<SceneNode> = {
      id: 'root-node',
      parent: null,
      children: [],
      data: {},
      addChild: vi.fn().mockImplementation(child => {
        return {
          id: child.id || 'imported-svg',
          parent: mockSceneNode,
          children: [],
          data: {},
          addChild: vi.fn().mockReturnValue({
            id: 'child-node',
            parent: { id: 'imported-svg' },
            children: [],
            data: {},
          }),
        } as unknown as SceneNode;
      }),
      removeChild: vi.fn().mockReturnValue(true),
      clearChildren: vi.fn(),
      findChildById: vi.fn().mockReturnValue(null),
      on: vi.fn(),
      off: vi.fn(),
      emit: vi.fn(),
    };

    // Mock Scene
    const mockScene: Partial<Scene> = {
      root: mockSceneNode as SceneNode,
      renderer: mockRenderer,
      plugins: new Map(),
      on: vi.fn(),
      off: vi.fn(),
      emit: vi.fn(),
    };

    // Mock Shape Plugin
    const mockShapePlugin = {
      createShape: vi.fn().mockImplementation((type, options) => {
        return {
          id: `mock-${type}-${Math.random().toString(36).substring(2, 9)}`,
          type,
          ...options,
        };
      }),
    };

    // Mock Group Plugin
    const mockGroupPlugin = {
      createGroup: vi.fn().mockReturnValue({
        id: `mock-group-${Math.random().toString(36).substring(2, 9)}`,
        type: 'group',
      }),
    };

    // Mock Math Plugin
    const mockMathPlugin = {
      createMatrix: vi.fn().mockReturnValue([1, 0, 0, 0, 1, 0, 0, 0, 1]),
    };

    // Mock VectorEngine 생성
    mockEngine = {
      scene: {
        getActive: vi.fn().mockReturnValue(mockScene),
        create: vi.fn().mockReturnValue(mockScene),
        setActive: vi.fn(),
      },
      renderer: {
        register: vi.fn(),
        setActive: vi.fn(),
        render: vi.fn(),
      },
      events: {
        on: vi.fn(),
        off: vi.fn(),
        emit: vi.fn(),
        createNamespace: vi.fn().mockReturnValue({
          on: vi.fn(),
          off: vi.fn(),
          emit: vi.fn(),
        }),
      },
      getPlugin: vi.fn().mockImplementation(id => {
        if (id === 'shape') return mockShapePlugin;
        if (id === 'group') return mockGroupPlugin;
        if (id === 'math') return mockMathPlugin;
        return null;
      }),
      use: vi.fn(),
      remove: vi.fn(),
    } as unknown as VectorEngine;

    // 플러그인 인스턴스 생성
    plugin = new SVGImportToolPlugin();

    // 플러그인 설치
    plugin.install(mockEngine);
  });

  /**
   * 플러그인 인스턴스 생성 테스트
   */
  test('should create plugin instance with correct properties', () => {
    // 기본 속성 검증
    expect(plugin.id).toBe('svg-import-tool');
    expect(plugin.version).toBe('1.0.0');
    expect(plugin.dependencies).toContain('shape');
    expect(plugin.dependencies).toContain('group');
  });

  /**
   * 플러그인 설치 테스트
   */
  test('should install plugin and register methods on engine', () => {
    // 엔진에 svgImport 메서드가 등록되었는지 확인
    const engineExtended = mockEngine as unknown as SVGImportToolPluginExtension;
    expect(engineExtended.svgImport).toBeDefined();
    expect(typeof engineExtended.svgImport.importFromString).toBe('function');
    expect(typeof engineExtended.svgImport.importFromURL).toBe('function');
    expect(typeof engineExtended.svgImport.importFromFile).toBe('function');
  });

  /**
   * 플러그인 제거 테스트
   */
  test('should uninstall plugin and remove methods from engine', () => {
    // 플러그인 제거
    plugin.uninstall(mockEngine);

    // svgImport 속성이 제거되었는지 확인
    const engineExtended = mockEngine as unknown as SVGImportToolPluginExtension;
    expect(engineExtended.svgImport).toBeUndefined();
  });

  /**
   * SVG 문자열에서 가져오기 테스트
   */
  test('should import SVG from string', async () => {
    // SVG 문자열에서 가져오기
    const engineExtended = mockEngine as unknown as SVGImportToolPluginExtension;
    const result = await engineExtended.svgImport.importFromString(testSvgString);

    // 결과 검증
    expect(result).toBeDefined();
    expect(result.id).toBe('imported-svg');

    // DOMParser가 호출되었는지 확인
    expect(global.DOMParser).toHaveBeenCalled();
  });

  /**
   * 빈 SVG 문자열 가져오기 테스트
   */
  test('should handle empty SVG properly', async () => {
    const engineExtended = mockEngine as unknown as SVGImportToolPluginExtension;
    const result = await engineExtended.svgImport.importFromString(emptySvgString);

    // 결과 검증 - 빈 SVG도 유효한 노드로 임포트되어야 함
    expect(result).toBeDefined();
    expect(result.id).toBe('imported-svg');
    expect(result.children).toBeDefined();
    expect(result.children.length).toBe(0);
  });

  /**
   * SVG URL에서 가져오기 테스트
   */
  test('should import SVG from URL', async () => {
    // SVG URL에서 가져오기
    const engineExtended = mockEngine as unknown as SVGImportToolPluginExtension;
    const result = await engineExtended.svgImport.importFromURL('https://example.com/test.svg');

    // 결과 검증
    expect(result).toBeDefined();
    expect(result.id).toBe('imported-svg');

    // fetch가 호출되었는지 확인
    expect(global.fetch).toHaveBeenCalledWith('https://example.com/test.svg');
  });

  /**
   * 복잡한 SVG URL에서 가져오기 테스트
   */
  test('should import complex SVG from URL', async () => {
    const engineExtended = mockEngine as unknown as SVGImportToolPluginExtension;
    const result = await engineExtended.svgImport.importFromURL('https://example.com/complex.svg');

    // 결과 검증
    expect(result).toBeDefined();
    expect(result.id).toBe('imported-svg');

    // fetch가 호출되었는지 확인
    expect(global.fetch).toHaveBeenCalledWith('https://example.com/complex.svg');
  });

  /**
   * SVG 파일에서 가져오기 테스트
   */
  test('should import SVG from File', async () => {
    // Mock File 객체 - text 메서드를 직접 구현
    const mockFile = {
      type: 'image/svg+xml',
      text: vi.fn().mockResolvedValue(testSvgString),
    } as unknown as File;

    // SVG 파일에서 가져오기
    const engineExtended = mockEngine as unknown as SVGImportToolPluginExtension;
    const result = await engineExtended.svgImport.importFromFile(mockFile);

    // 결과 검증
    expect(result).toBeDefined();
    expect(result.id).toBe('imported-svg');
    expect(mockFile.text).toHaveBeenCalled();
  });

  /**
   * 다른 MIME 타입의 SVG 파일 가져오기 테스트
   */
  test('should import SVG from File with different MIME type', async () => {
    // application/svg+xml MIME 타입의 파일도 지원해야 함
    const mockFile = {
      type: 'application/svg+xml',
      text: vi.fn().mockResolvedValue(testSvgString),
    } as unknown as File;

    const engineExtended = mockEngine as unknown as SVGImportToolPluginExtension;
    const result = await engineExtended.svgImport.importFromFile(mockFile);

    expect(result).toBeDefined();
    expect(mockFile.text).toHaveBeenCalled();
  });

  /**
   * 가져오기 옵션 테스트
   */
  test('should apply import options correctly', async () => {
    // 옵션 설정
    const options: SVGImportOptions = {
      preserveViewBox: true,
      flattenGroups: true,
      scale: 2,
    };

    // SVG 문자열에서 가져오기 (옵션 적용)
    const engineExtended = mockEngine as unknown as SVGImportToolPluginExtension;
    const result = await engineExtended.svgImport.importFromString(testSvgString, options);

    // 결과가 정의되었는지 확인
    expect(result).toBeDefined();

    // getPlugin 메서드가 호출되었는지 확인
    expect(mockEngine.getPlugin).toHaveBeenCalledWith('shape');

    // viewBox가 설정되었는지 확인
    expect(result.data).toBeDefined();
    expect(result.data.viewBox).toBeDefined();
  });

  /**
   * viewBox 비활성화 옵션 테스트
   */
  test('should respect preserveViewBox option when false', async () => {
    const options: SVGImportOptions = {
      preserveViewBox: false,
      flattenGroups: false,
      scale: 1,
    };

    const engineExtended = mockEngine as unknown as SVGImportToolPluginExtension;
    const result = await engineExtended.svgImport.importFromString(testSvgString, options);

    // preserveViewBox가 false일 때 viewBox가 설정되지 않아야 함
    expect(result.data.viewBox).toBeUndefined();
  });

  /**
   * 그룹 평탄화 옵션 테스트
   */
  test('should flatten groups when flattenGroups option is true', async () => {
    const options: SVGImportOptions = {
      preserveViewBox: true,
      flattenGroups: true,
      scale: 1,
    };

    // spyOn으로 processGroupElement 메서드를 모니터링
    const processGroupElementSpy = vi.spyOn(plugin as any, 'processGroupElement');

    const engineExtended = mockEngine as unknown as SVGImportToolPluginExtension;
    await engineExtended.svgImport.importFromString(complexSvgString, options);

    // 그룹 평탄화가 처리되었는지 확인
    expect(processGroupElementSpy).toHaveBeenCalledWith(
      expect.anything(),
      expect.anything(),
      expect.objectContaining({ flattenGroups: true })
    );
  });

  /**
   * 오류 처리 테스트 - URL
   */
  test('should handle errors when importing from URL', async () => {
    // fetch 실패 URL
    const errorUrl = 'https://example.com/error.svg';

    // 오류 발생 예상
    const engineExtended = mockEngine as unknown as SVGImportToolPluginExtension;
    await expect(engineExtended.svgImport.importFromURL(errorUrl)).rejects.toThrow();

    // fetch가 호출되었는지 확인
    expect(global.fetch).toHaveBeenCalledWith(errorUrl);
  });

  /**
   * 오류 처리 테스트 - 잘못된 파일 타입
   */
  test('should handle errors when importing from invalid file type', async () => {
    // 잘못된 파일 타입
    const invalidFile = {
      type: 'text/plain', // SVG가 아닌 타입
      text: vi.fn(),
    } as unknown as File;

    // 오류 발생 예상
    const engineExtended = mockEngine as unknown as SVGImportToolPluginExtension;
    await expect(engineExtended.svgImport.importFromFile(invalidFile)).rejects.toThrow(
      'File is not an SVG'
    );
  });

  /**
   * 파일 읽기 오류 처리 테스트
   */
  test('should handle errors when file reading fails', async () => {
    // 파일 읽기 실패 모의
    const errorFile = {
      type: 'image/svg+xml',
      text: vi.fn().mockRejectedValue(new Error('File read error')),
    } as unknown as File;

    // 오류 발생 예상
    const engineExtended = mockEngine as unknown as SVGImportToolPluginExtension;
    await expect(engineExtended.svgImport.importFromFile(errorFile)).rejects.toThrow();
  });

  /**
   * 플러그인 미설치 오류 테스트
   */
  test('should throw error when plugin not installed', async () => {
    // 새 플러그인 인스턴스 (설치되지 않음)
    const uninstalledPlugin = new SVGImportToolPlugin();

    // 오류 발생 예상
    await expect(uninstalledPlugin.importFromString(testSvgString)).rejects.toThrow(
      'Plugin not installed on an engine'
    );
  });

  /**
   * SVG 각 요소 타입별 처리 테스트
   */
  describe('SVG Element Processing', () => {
    /**
     * Rectangle 요소 처리 테스트
     */
    test('should process rect elements correctly', async () => {
      const rectSvg =
        '<svg width="100" height="100"><rect x="10" y="20" width="30" height="40" fill="red" /></svg>';

      // 원래의 processRectElement를 스파이로 대체
      const processRectSpy = vi.spyOn(plugin as any, 'processRectElement');

      const engineExtended = mockEngine as unknown as SVGImportToolPluginExtension;
      await engineExtended.svgImport.importFromString(rectSvg);

      // processRectElement가 호출되었는지 확인
      expect(processRectSpy).toHaveBeenCalled();
    });

    /**
     * Circle 요소 처리 테스트
     */
    test('should process circle elements correctly', async () => {
      const circleSvg =
        '<svg width="100" height="100"><circle cx="50" cy="50" r="30" fill="blue" /></svg>';

      // 원래의 processCircleElement를 스파이로 대체
      const processCircleSpy = vi.spyOn(plugin as any, 'processCircleElement');

      const engineExtended = mockEngine as unknown as SVGImportToolPluginExtension;
      await engineExtended.svgImport.importFromString(circleSvg);

      // processCircleElement가 호출되었는지 확인
      expect(processCircleSpy).toHaveBeenCalled();
    });

    /**
     * Line 요소 처리 테스트
     */
    test('should process line elements correctly', async () => {
      const lineSvg =
        '<svg width="100" height="100"><line x1="10" y1="10" x2="90" y2="90" stroke="black" /></svg>';

      // 원래의 processLineElement를 스파이로 대체
      const processLineSpy = vi.spyOn(plugin as any, 'processLineElement');

      const engineExtended = mockEngine as unknown as SVGImportToolPluginExtension;
      await engineExtended.svgImport.importFromString(lineSvg);

      // processLineElement가 호출되었는지 확인
      expect(processLineSpy).toHaveBeenCalled();
    });

    /**
     * Polygon 요소 처리 테스트
     */
    test('should process polygon elements correctly', async () => {
      const polygonSvg =
        '<svg width="100" height="100"><polygon points="10,10 90,10 50,90" fill="green" /></svg>';

      // 원래의 processPolygonElement를 스파이로 대체
      const processPolygonSpy = vi.spyOn(plugin as any, 'processPolygonElement');

      const engineExtended = mockEngine as unknown as SVGImportToolPluginExtension;
      await engineExtended.svgImport.importFromString(polygonSvg);

      // processPolygonElement가 호출되었는지 확인
      expect(processPolygonSpy).toHaveBeenCalled();
    });

    /**
     * Path 요소 처리 테스트
     */
    test('should process path elements correctly', async () => {
      const pathSvg =
        '<svg width="100" height="100"><path d="M10,10 L90,10 L50,90 Z" fill="purple" /></svg>';

      // 원래의 processPathElement를 스파이로 대체
      const processPathSpy = vi.spyOn(plugin as any, 'processPathElement');

      const engineExtended = mockEngine as unknown as SVGImportToolPluginExtension;
      await engineExtended.svgImport.importFromString(pathSvg);

      // processPathElement가 호출되었는지 확인
      expect(processPathSpy).toHaveBeenCalled();
    });
  });

  /**
   * SVG Path 파싱 테스트
   */
  describe('SVG Path Parsing', () => {
    /**
     * 기본 경로 명령어 파싱 테스트
     */
    test('should parse basic path commands correctly', () => {
      const pathD = 'M10,10 L20,20 H30 V40 Z';
      const result = (plugin as any).parseSVGPath(pathD, 1);

      expect(result).toEqual(
        expect.arrayContaining([
          { type: 'M', x: 10, y: 10 },
          { type: 'L', x: 20, y: 20 },
          { type: 'L', x: 30, y: 20 }, // H30 -> 수평선
          { type: 'L', x: 30, y: 40 }, // V40 -> 수직선
          { type: 'Z', x: 10, y: 10 }, // Z -> 경로 닫기
        ])
      );
    });

    /**
     * 복잡한 경로 명령어 파싱 테스트 - pathTestSvgString 사용
     */
    test('should parse complex path commands from pathTestSvgString', async () => {
      // pathTestSvgString에서 SVG 가져오기
      const engineExtended = mockEngine as unknown as SVGImportToolPluginExtension;
      const result = await engineExtended.svgImport.importFromString(pathTestSvgString);

      // 결과가 정의되었는지 검증
      expect(result).toBeDefined();
      expect(result.id).toBe('imported-svg');

      // path 요소가 처리되었는지 검증
      const processPathSpy = vi.spyOn(plugin as any, 'processPathElement');
      expect(processPathSpy).toHaveBeenCalled();
    });

    /**
     * 잘못된 SVG 처리 테스트 - invalidSvgString 사용
     */
    test('should handle invalid SVG gracefully', async () => {
      // invalidSvgString에서 SVG 가져오기 시도
      const engineExtended = mockEngine as unknown as SVGImportToolPluginExtension;
      const result = await engineExtended.svgImport.importFromString(invalidSvgString);

      // 결과가 정의되었는지 검증 (오류가 발생해도 기본 노드는 생성되어야 함)
      expect(result).toBeDefined();
      expect(result.id).toBe('imported-svg');
    });

    /**
     * 상대 경로 명령어 파싱 테스트
     */
    test('should parse relative path commands correctly', () => {
      const pathD = 'M10,10 l10,10 h10 v10 z';
      const result = (plugin as any).parseSVGPath(pathD, 1);

      expect(result).toEqual(
        expect.arrayContaining([
          { type: 'M', x: 10, y: 10 },
          { type: 'L', x: 20, y: 20 }, // l10,10 -> 상대 선
          { type: 'L', x: 30, y: 20 }, // h10 -> 상대 수평선
          { type: 'L', x: 30, y: 30 }, // v10 -> 상대 수직선
          { type: 'Z', x: 10, y: 10 }, // z -> 경로 닫기
        ])
      );
    });

    /**
     * 스케일된 경로 파싱 테스트
     */
    test('should scale path coordinates according to scale factor', () => {
      const pathD = 'M10,10 L20,20';
      const scale = 2;
      const result = (plugin as any).parseSVGPath(pathD, scale);

      expect(result).toEqual([
        { type: 'M', x: 20, y: 20 }, // 10*2, 10*2
        { type: 'L', x: 40, y: 40 }, // 20*2, 20*2
      ]);
    });
  });

  /**
   * 스타일 속성 추출 테스트
   */
  describe('Style Attribute Extraction', () => {
    /**
     * 기본 스타일 속성 추출 테스트
     */
    test('should extract basic style attributes', () => {
      const element = {
        hasAttribute: vi.fn().mockImplementation(attr => {
          return ['fill', 'stroke', 'stroke-width', 'opacity'].includes(attr);
        }),
        getAttribute: vi.fn().mockImplementation(attr => {
          switch (attr) {
            case 'fill':
              return 'red';
            case 'stroke':
              return 'blue';
            case 'stroke-width':
              return '2';
            case 'opacity':
              return '0.5';
            default:
              return null;
          }
        }),
      };

      const style = (plugin as any).extractStyleAttributes(element);

      expect(style).toEqual({
        fill: 'red',
        stroke: 'blue',
        strokeWidth: 2,
        opacity: 0.5,
      });
    });

    /**
     * style 속성에서 스타일 추출 테스트
     */
    test('should extract styles from the style attribute', () => {
      const element = {
        hasAttribute: vi.fn().mockImplementation(attr => {
          return attr === 'style';
        }),
        getAttribute: vi.fn().mockImplementation(attr => {
          if (attr === 'style') {
            return 'fill:green; stroke:purple; stroke-width:3';
          }
          return null;
        }),
      };

      const style = (plugin as any).extractStyleAttributes(element);

      expect(style).toEqual({
        fill: 'green',
        stroke: 'purple',
        strokeWidth: '3', // style 속성에서는 문자열로 유지
      });
    });

    /**
     * 개별 속성과 style 속성 조합 테스트
     */
    test('should combine individual attributes with style attribute', () => {
      const element = {
        hasAttribute: vi.fn().mockImplementation(attr => {
          return ['fill', 'style'].includes(attr);
        }),
        getAttribute: vi.fn().mockImplementation(attr => {
          if (attr === 'fill') return 'red';
          if (attr === 'style') return 'stroke:blue; fill-opacity:0.7';
          return null;
        }),
      };

      const style = (plugin as any).extractStyleAttributes(element);

      expect(style).toEqual({
        fill: 'red',
        stroke: 'blue',
        fillOpacity: '0.7',
      });
    });
  });

  /**
   * SVG import 후 렌더링 테스트
   */
  test('should render imported SVG correctly', async () => {
    // SVG 문자열에서 가져오기
    const engineExtended = mockEngine as unknown as SVGImportToolPluginExtension;
    const importedNode = await engineExtended.svgImport.importFromString(testSvgString);

    // 가져온 노드가 정상적으로 생성되었는지 확인
    expect(importedNode).toBeDefined();
    expect(importedNode.id).toBe('imported-svg');

    // 현재 활성화된 씬 가져오기
    const activeScene = mockEngine.scene.getActive();

    // 렌더러 호출
    activeScene.renderer.render(activeScene);

    // 렌더러의 render 메서드가 호출되었는지 확인
    expect(mockRenderer.render).toHaveBeenCalledWith(activeScene);
  });

  /**
   * 의존성 부족 시 오류 테스트
   */
  test('should throw error when dependencies are not available', async () => {
    // 플러그인 제거 후 재설치
    plugin.uninstall(mockEngine);

    // 의존성 체크를 실패하도록 getPlugin 모킹 변경
    mockEngine.getPlugin = vi.fn().mockReturnValue(null);

    // 플러그인 재설치
    plugin.install(mockEngine);

    // SVG 가져오기 시도 시 오류 발생 예상
    const engineExtended = mockEngine as unknown as SVGImportToolPluginExtension;
    await expect(engineExtended.svgImport.importFromString(testSvgString)).rejects.toThrow();
  });
});
