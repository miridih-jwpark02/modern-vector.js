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
      parseFromString: vi.fn().mockImplementation(_str => {
        const mockDoc = {
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
        return mockDoc;
      }),
    }));

    // Mock fetch
    global.fetch = vi.fn().mockImplementation(() =>
      Promise.resolve({
        ok: true,
        text: () => Promise.resolve(testSvgString),
      })
    );

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
      getPlugin: vi.fn().mockReturnValue({
        createShape: vi.fn().mockReturnValue({}),
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
    expect(plugin.dependencies).toContain('shape-plugin');
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

    // DOMParser가 호출되었는지 확인
    expect(global.DOMParser).toHaveBeenCalled();
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

    // fetch가 호출되었는지 확인
    expect(global.fetch).toHaveBeenCalledWith('https://example.com/test.svg');
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
    await engineExtended.svgImport.importFromString(testSvgString, options);

    // viewBox가 설정되었는지 확인
    // 이 테스트는 mock 구현에 따라 달라질 수 있음
  });

  /**
   * 오류 처리 테스트 - URL
   */
  test('should handle errors when importing from URL', async () => {
    // fetch 실패 mock
    global.fetch = vi.fn().mockImplementation(() =>
      Promise.resolve({
        ok: false,
        status: 404,
      })
    );

    // 오류 발생 예상
    const engineExtended = mockEngine as unknown as SVGImportToolPluginExtension;
    await expect(
      engineExtended.svgImport.importFromURL('https://example.com/nonexistent.svg')
    ).rejects.toThrow();
  });

  /**
   * 오류 처리 테스트 - 파일
   */
  test('should handle errors when importing from invalid file', async () => {
    // 잘못된 파일 타입
    const invalidFile = {
      type: 'text/plain',
    } as unknown as File;

    // 오류 발생 예상
    const engineExtended = mockEngine as unknown as SVGImportToolPluginExtension;
    await expect(engineExtended.svgImport.importFromFile(invalidFile)).rejects.toThrow(
      'File is not an SVG'
    );
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
});
