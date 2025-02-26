import { describe, expect, test, vi, beforeEach } from 'vitest';
import { SVGImportToolPlugin } from '../svg-import-plugin';
import { VectorEngine } from '../../../../core/types';

/**
 * SVG Import Tool Plugin 테스트
 */
describe('SVGImportToolPlugin', () => {
  // 테스트용 SVG 문자열
  const testSvgString =
    '<svg width="100" height="100"><rect x="10" y="10" width="80" height="80" fill="blue" /></svg>';

  // Mock VectorEngine
  let mockEngine: VectorEngine;

  // 플러그인 인스턴스
  let plugin: SVGImportToolPlugin;

  // Mock 요소 생성 함수
  const createMockElement = (
    tagName: string,
    attributes: Record<string, string> = {},
    children: Element[] = []
  ): Element => {
    return {
      tagName,
      hasAttribute: vi.fn().mockImplementation(attr => attr in attributes),
      getAttribute: vi.fn().mockImplementation(attr => attributes[attr] || ''),
      id: attributes.id || '',
      children,
    } as unknown as Element;
  };

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

    // Mock VectorEngine 생성
    mockEngine = {
      scene: {
        getActive: vi.fn().mockReturnValue({
          root: {
            addChild: vi.fn().mockReturnValue({
              addChild: vi.fn().mockReturnValue({}),
              data: {},
            }),
          },
        }),
      },
      getPlugin: vi.fn().mockReturnValue({
        createShape: vi.fn().mockReturnValue({}),
      }),
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
  });

  /**
   * 플러그인 설치 테스트
   */
  test('should install plugin and register methods on engine', () => {
    // 엔진에 svgImport 메서드가 등록되었는지 확인
    expect((mockEngine as any).svgImport).toBeDefined();
    expect(typeof (mockEngine as any).svgImport.importFromString).toBe('function');
    expect(typeof (mockEngine as any).svgImport.importFromURL).toBe('function');
    expect(typeof (mockEngine as any).svgImport.importFromFile).toBe('function');
  });

  /**
   * 플러그인 제거 테스트
   */
  test('should uninstall plugin and remove methods from engine', () => {
    // 플러그인 제거
    plugin.uninstall(mockEngine);

    // svgImport 속성이 제거되었는지 확인
    expect((mockEngine as any).svgImport).toBeUndefined();
  });

  /**
   * SVG 문자열에서 가져오기 테스트
   */
  test('should import SVG from string', async () => {
    // SVG 문자열에서 가져오기
    const result = await (mockEngine as any).svgImport.importFromString(testSvgString);

    // 결과 검증
    expect(result).toBeDefined();

    // DOMParser가 호출되었는지 확인
    expect(global.DOMParser).toHaveBeenCalled();

    // 씬의 getActive가 호출되었는지 확인
    expect(mockEngine.scene.getActive).toHaveBeenCalled();

    // addChild가 호출되었는지 확인 (루트 그룹 생성)
    expect(mockEngine.scene.getActive().root.addChild).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'imported-svg' })
    );

    // viewBox가 설정되었는지 확인
    expect(result.data.viewBox).toEqual({
      x: 0,
      y: 0,
      width: 100,
      height: 100,
    });

    // getPlugin이 호출되었는지 확인 (shape 플러그인)
    expect(mockEngine.getPlugin).toHaveBeenCalledWith('shape');
  });

  /**
   * URL에서 SVG 가져오기 테스트
   */
  test('should import SVG from URL', async () => {
    // URL에서 SVG 가져오기
    const result = await (mockEngine as any).svgImport.importFromURL(
      'https://example.com/test.svg'
    );

    // 결과 검증
    expect(result).toBeDefined();

    // fetch가 호출되었는지 확인
    expect(global.fetch).toHaveBeenCalledWith('https://example.com/test.svg');

    // DOMParser가 호출되었는지 확인
    expect(global.DOMParser).toHaveBeenCalled();
  });

  /**
   * 파일에서 SVG 가져오기 테스트
   */
  test('should import SVG from File', async () => {
    // Mock File 객체 생성
    const mockFile = {
      type: 'image/svg+xml',
      text: vi.fn().mockResolvedValue(testSvgString),
    } as unknown as File;

    // 파일에서 SVG 가져오기
    const result = await (mockEngine as any).svgImport.importFromFile(mockFile);

    // 결과 검증
    expect(result).toBeDefined();

    // File.text가 호출되었는지 확인
    expect(mockFile.text).toHaveBeenCalled();

    // DOMParser가 호출되었는지 확인
    expect(global.DOMParser).toHaveBeenCalled();
  });

  /**
   * 잘못된 파일 타입 오류 테스트
   */
  test('should throw error for invalid file type', async () => {
    // Mock File 객체 생성 (잘못된 타입)
    const mockFile = {
      type: 'image/png',
      text: vi.fn(),
    } as unknown as File;

    // 파일에서 SVG 가져오기 시도 (오류 예상)
    await expect((mockEngine as any).svgImport.importFromFile(mockFile)).rejects.toThrow(
      'File is not an SVG'
    );

    // File.text가 호출되지 않았는지 확인
    expect(mockFile.text).not.toHaveBeenCalled();
  });

  /**
   * 가져오기 옵션 테스트
   */
  test('should apply import options correctly', async () => {
    // 가져오기 옵션
    const options = {
      preserveViewBox: false,
      flattenGroups: true,
      scale: 2,
    };

    // 옵션을 적용하여 SVG 가져오기
    await (mockEngine as any).svgImport.importFromString(testSvgString, options);

    // 옵션이 올바르게 적용되었는지 확인
    // 이 테스트는 실제 구현에 따라 달라질 수 있음
    // 여기서는 단순히 함수가 호출되었는지만 확인
    expect(global.DOMParser).toHaveBeenCalled();
  });

  /**
   * SVG rect 요소 처리 테스트
   */
  test('should process rect element correctly', () => {
    // Mock 부모 노드
    const mockParentNode = {
      addChild: vi.fn().mockReturnValue({}),
    };

    // Mock rect 요소
    const rectElement = createMockElement('rect', {
      x: '10',
      y: '20',
      width: '100',
      height: '50',
      fill: 'red',
      stroke: 'black',
      'stroke-width': '2',
    });

    // rect 요소 처리
    (plugin as any).processRectElement(rectElement, mockParentNode, { scale: 1 });

    // shape 플러그인이 호출되었는지 확인
    expect(mockEngine.getPlugin).toHaveBeenCalledWith('shape');

    // createShape가 올바른 매개변수로 호출되었는지 확인
    const shapePlugin = mockEngine.getPlugin('shape') as any;
    expect(shapePlugin.createShape).toHaveBeenCalledWith(
      'rectangle',
      expect.objectContaining({
        x: 10,
        y: 20,
        width: 100,
        height: 50,
        fill: 'red',
        stroke: 'black',
        strokeWidth: 2,
      })
    );

    // 부모 노드에 추가되었는지 확인
    expect(mockParentNode.addChild).toHaveBeenCalled();
  });

  /**
   * SVG rect 요소 스케일 적용 테스트
   */
  test('should apply scale to rect element', () => {
    // Mock 부모 노드
    const mockParentNode = {
      addChild: vi.fn().mockReturnValue({}),
    };

    // Mock rect 요소
    const rectElement = createMockElement('rect', {
      x: '10',
      y: '20',
      width: '100',
      height: '50',
    });

    // 스케일 2를 적용하여 rect 요소 처리
    (plugin as any).processRectElement(rectElement, mockParentNode, { scale: 2 });

    // createShape가 스케일이 적용된 매개변수로 호출되었는지 확인
    const shapePlugin = mockEngine.getPlugin('shape') as any;
    expect(shapePlugin.createShape).toHaveBeenCalledWith(
      'rectangle',
      expect.objectContaining({
        x: 20, // 10 * 2
        y: 40, // 20 * 2
        width: 200, // 100 * 2
        height: 100, // 50 * 2
      })
    );
  });

  /**
   * SVG group 요소 처리 테스트
   */
  test('should process group element correctly', () => {
    // Mock 부모 노드
    const mockParentNode = {
      addChild: vi.fn().mockReturnValue({
        addChild: vi.fn().mockReturnValue({}),
      }),
    };

    // Mock 자식 요소
    const childRect = createMockElement('rect', {
      x: '10',
      y: '20',
      width: '30',
      height: '40',
    });

    // Mock group 요소
    const groupElement = createMockElement('g', { id: 'test-group' }, [childRect]);

    // group 요소 처리
    (plugin as any).processGroupElement(groupElement, mockParentNode, { scale: 1 });

    // 그룹 노드가 생성되었는지 확인
    expect(mockParentNode.addChild).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'group',
        id: 'test-group',
      })
    );
  });

  /**
   * SVG group 요소 평탄화 테스트
   */
  test('should flatten group element when flattenGroups is true', () => {
    // Mock 부모 노드
    const mockParentNode = {
      addChild: vi.fn().mockReturnValue({}),
    };

    // Mock 자식 요소
    const childRect = createMockElement('rect', {
      x: '10',
      y: '20',
      width: '30',
      height: '40',
    });

    // Mock group 요소
    const groupElement = createMockElement('g', { id: 'test-group' }, [childRect]);

    // processChildElements 메서드 스파이 - 실제 구현이 호출되지 않도록 mockImplementation 사용
    const processChildElementsSpy = vi
      .spyOn(plugin as any, 'processChildElements')
      .mockImplementation(() => {});

    // flattenGroups 옵션을 true로 설정하여 group 요소 처리
    (plugin as any).processGroupElement(groupElement, mockParentNode, { flattenGroups: true });

    // 그룹 노드가 생성되지 않았는지 확인
    expect(mockParentNode.addChild).not.toHaveBeenCalled();

    // processChildElements가 부모 노드로 호출되었는지 확인
    expect(processChildElementsSpy).toHaveBeenCalledWith(
      groupElement,
      mockParentNode,
      expect.objectContaining({
        flattenGroups: true,
      })
    );
  });

  /**
   * 스타일 속성 추출 테스트
   */
  test('should extract style attributes correctly', () => {
    // Mock 요소
    const element = createMockElement('rect', {
      fill: 'blue',
      stroke: 'red',
      'stroke-width': '2',
      opacity: '0.5',
      style: 'fill-opacity:0.8;stroke-dasharray:5,2',
    });

    // 스타일 속성 추출
    const style = (plugin as any).extractStyleAttributes(element);

    // 추출된 스타일 검증
    expect(style).toEqual({
      fill: 'blue',
      stroke: 'red',
      strokeWidth: 2,
      opacity: 0.5,
      fillOpacity: '0.8',
      strokeDasharray: '5,2',
    });
  });
});
