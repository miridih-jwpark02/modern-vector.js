import { Plugin, VectorEngine, SceneNode } from '../../../core/types';
import { DefaultSceneNode } from '../../../core/services/scene-node';
import { ShapePlugin } from '../../core/shapes';
import { ShapeOptions, Shape } from '../../core/shapes/types';
import { GroupPlugin } from '../../core/group';
import {
  SVGImportOptions,
  SVGImportToolPluginInterface,
  SVGImportToolPluginExtension,
  ViewBox,
  SVGStyleAttributes,
} from './types';

/**
 * SVG Import Tool Plugin
 *
 * SVG 파일을 가져와서 벡터 그래픽 엔진에서 사용할 수 있는 형태로 변환하는 플러그인입니다.
 */
export class SVGImportToolPlugin implements Plugin, SVGImportToolPluginInterface {
  /** Unique identifier for the plugin */
  readonly id = 'svg-import-tool';

  /** Semantic version of the plugin */
  readonly version = '1.0.0';

  /** Dependencies required by this plugin */
  readonly dependencies = ['shape', 'group'];

  /** Default import options */
  private defaultOptions: SVGImportOptions = {
    preserveViewBox: true,
    flattenGroups: false,
    scale: 1,
  };

  /** Reference to the engine */
  private engine: VectorEngine | null = null;

  /**
   * Install the plugin into the engine
   *
   * 엔진에 플러그인을 설치합니다.
   *
   * @param engine - The vector engine instance
   */
  install(engine: VectorEngine): void {
    this.engine = engine;

    // Register plugin methods on the engine
    // This is a common pattern to expose plugin functionality
    const engineExtended = engine as unknown as SVGImportToolPluginExtension;
    engineExtended.svgImport = {
      importFromString: this.importFromString.bind(this),
      importFromURL: this.importFromURL.bind(this),
      importFromFile: this.importFromFile.bind(this),
    };
  }

  /**
   * Uninstall the plugin from the engine
   *
   * 엔진에서 플러그인을 제거합니다.
   *
   * @param engine - The vector engine instance
   */
  uninstall(engine: VectorEngine): void {
    // Remove plugin methods from the engine
    const engineExtended = engine as unknown as SVGImportToolPluginExtension;
    // TypeScript에서는 delete 연산자를 사용할 때 타입 안전성을 위해 any로 변환해야 함
    delete (engineExtended as any).svgImport;
    this.engine = null;
  }

  /**
   * Import SVG from a string
   *
   * 문자열에서 SVG를 가져옵니다.
   *
   * @param svgString - SVG content as string
   * @param options - Import options
   * @returns Promise resolving to the imported scene node
   */
  async importFromString(svgString: string, options?: SVGImportOptions): Promise<SceneNode> {
    const mergedOptions = { ...this.defaultOptions, ...options };

    // Parse SVG string to DOM
    const parser = new DOMParser();
    const svgDoc = parser.parseFromString(svgString, 'image/svg+xml');

    // Process SVG document
    return this.processSVGDocument(svgDoc, mergedOptions);
  }

  /**
   * Import SVG from a URL
   *
   * URL에서 SVG를 가져옵니다.
   *
   * @param url - URL to the SVG file
   * @param options - Import options
   * @returns Promise resolving to the imported scene node
   */
  async importFromURL(url: string, options?: SVGImportOptions): Promise<SceneNode> {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch SVG from URL: ${url}`);
      }

      const svgString = await response.text();
      return this.importFromString(svgString, options);
    } catch (error) {
      console.error('Error importing SVG from URL:', error);
      throw error;
    }
  }

  /**
   * Import SVG from a File object
   *
   * File 객체에서 SVG를 가져옵니다.
   *
   * @param file - File object containing SVG data
   * @param options - Import options
   * @returns Promise resolving to the imported scene node
   */
  async importFromFile(file: File, options?: SVGImportOptions): Promise<SceneNode> {
    try {
      // SVG MIME 타입 체크 - 여러 MIME 타입 지원
      const validSvgTypes = ['image/svg+xml', 'application/svg+xml', 'text/svg+xml'];
      if (!file.type || !validSvgTypes.some(type => file.type.includes(type))) {
        // 파일 확장자로 2차 확인
        const filename = file.name.toLowerCase();
        if (!filename.endsWith('.svg')) {
          throw new Error(
            'File is not an SVG. Expected MIME type to include "svg+xml" or filename to end with .svg'
          );
        }
      }

      const svgString = await file.text();
      return this.importFromString(svgString, options);
    } catch (error) {
      console.error('Error importing SVG from file:', error);
      throw error;
    }
  }

  /**
   * Process SVG document and convert to scene nodes
   *
   * SVG 문서를 처리하고 장면 노드로 변환합니다.
   *
   * @param svgDoc - SVG document
   * @param options - Import options
   * @returns Scene node representing the imported SVG
   * @private
   */
  private processSVGDocument(svgDoc: Document, options: SVGImportOptions): SceneNode {
    if (!this.engine) {
      throw new Error('Plugin not installed on an engine');
    }

    const svgElement = svgDoc.documentElement;

    // Create a root group for the imported SVG
    const scene = this.engine.scene.getActive();

    // DefaultSceneNode 클래스를 사용하여 SceneNode 생성
    const rootGroup = scene.root.addChild(new DefaultSceneNode('imported-svg', this.engine.events));

    // 데이터 객체가 확실히 초기화되었는지 확인
    if (!rootGroup.data) {
      rootGroup.data = {};
    }

    // Extract viewBox if present and if preserveViewBox is true
    if (options.preserveViewBox && svgElement.hasAttribute('viewBox')) {
      const viewBoxAttr = svgElement.getAttribute('viewBox')?.split(/\s+/).map(Number);
      if (viewBoxAttr && viewBoxAttr.length === 4) {
        const viewBox: ViewBox = {
          x: viewBoxAttr[0],
          y: viewBoxAttr[1],
          width: viewBoxAttr[2],
          height: viewBoxAttr[3],
        };

        rootGroup.data.viewBox = viewBox;
      }
    }

    // Process all child elements
    this.processChildElements(svgElement, rootGroup, options);

    return rootGroup;
  }

  /**
   * Process child elements of an SVG node
   *
   * SVG 노드의 자식 요소를 처리합니다.
   *
   * @param parentElement - Parent SVG element
   * @param parentNode - Parent scene node
   * @param options - Import options
   * @private
   */
  private processChildElements(
    parentElement: Element,
    parentNode: SceneNode,
    options: SVGImportOptions
  ): void {
    // This is a simplified implementation
    // A complete implementation would handle all SVG element types and attributes

    Array.from(parentElement.children).forEach(element => {
      switch (element.tagName.toLowerCase()) {
        case 'rect':
          this.processRectElement(element, parentNode, options);
          break;
        case 'circle':
          this.processCircleElement(element, parentNode, options);
          break;
        case 'ellipse':
          this.processEllipseElement(element, parentNode, options);
          break;
        case 'line':
          this.processLineElement(element, parentNode, options);
          break;
        case 'polyline':
          this.processPolylineElement(element, parentNode, options);
          break;
        case 'polygon':
          this.processPolygonElement(element, parentNode, options);
          break;
        case 'path':
          this.processPathElement(element, parentNode, options);
          break;
        case 'g':
          this.processGroupElement(element, parentNode, options);
          break;
        // Additional element types would be handled here
      }
    });
  }

  /**
   * Process SVG rect element
   *
   * SVG rect 요소를 처리합니다.
   *
   * @param element - SVG rect element
   * @param parentNode - Parent scene node
   * @param options - Import options
   * @private
   */
  private processRectElement(
    element: Element,
    parentNode: SceneNode,
    options: SVGImportOptions
  ): void {
    // Extract attributes with defaults
    const x = parseFloat(element.getAttribute('x') || '0') * (options.scale || 1);
    const y = parseFloat(element.getAttribute('y') || '0') * (options.scale || 1);
    const width = parseFloat(element.getAttribute('width') || '0') * (options.scale || 1);
    const height = parseFloat(element.getAttribute('height') || '0') * (options.scale || 1);

    // Extract style attributes
    const style = this.extractStyleAttributes(element);

    // Create rectangle shape
    const shapePlugin = this.engine?.getPlugin<ShapePlugin>('shape');
    if (shapePlugin) {
      const shapeOptions: ShapeOptions = {
        x,
        y,
        width,
        height,
        ...style,
      };

      const rect = shapePlugin.createShape('rectangle', shapeOptions);

      // Ensure shape has required properties
      this.ensureShapeProperties(rect, style);

      // DefaultSceneNode 클래스를 사용하여 SceneNode 생성
      const rectNode = new DefaultSceneNode(rect.id, this.engine!.events);
      rectNode.data = rect;
      parentNode.addChild(rectNode);
    }
  }

  /**
   * Process SVG circle element
   *
   * SVG circle 요소를 처리합니다.
   *
   * @param element - SVG circle element
   * @param parentNode - Parent scene node
   * @param options - Import options
   * @private
   */
  private processCircleElement(
    element: Element,
    parentNode: SceneNode,
    options: SVGImportOptions
  ): void {
    // Extract attributes with defaults
    const cx = parseFloat(element.getAttribute('cx') || '0') * (options.scale || 1);
    const cy = parseFloat(element.getAttribute('cy') || '0') * (options.scale || 1);
    const r = parseFloat(element.getAttribute('r') || '0') * (options.scale || 1);

    // Extract style attributes
    const style = this.extractStyleAttributes(element);

    // Create circle shape
    const shapePlugin = this.engine?.getPlugin<ShapePlugin>('shape');
    if (shapePlugin) {
      const shapeOptions: ShapeOptions = {
        x: cx - r, // Convert center coordinates to top-left
        y: cy - r,
        radius: r,
        ...style,
      };

      const circle = shapePlugin.createShape('circle', shapeOptions);

      // Ensure shape has required properties
      this.ensureShapeProperties(circle, style);

      // DefaultSceneNode 클래스를 사용하여 SceneNode 생성
      const circleNode = new DefaultSceneNode(circle.id, this.engine!.events);
      circleNode.data = circle;
      parentNode.addChild(circleNode);
    }
  }

  /**
   * Process SVG ellipse element
   *
   * SVG ellipse 요소를 처리합니다.
   *
   * @param element - SVG ellipse element
   * @param parentNode - Parent scene node
   * @param options - Import options
   * @private
   */
  private processEllipseElement(
    element: Element,
    parentNode: SceneNode,
    options: SVGImportOptions
  ): void {
    // Extract attributes with defaults
    const cx = parseFloat(element.getAttribute('cx') || '0') * (options.scale || 1);
    const cy = parseFloat(element.getAttribute('cy') || '0') * (options.scale || 1);
    const rx = parseFloat(element.getAttribute('rx') || '0') * (options.scale || 1);
    const ry = parseFloat(element.getAttribute('ry') || '0') * (options.scale || 1);

    // Extract style attributes
    const style = this.extractStyleAttributes(element);

    // Create ellipse shape
    const shapePlugin = this.engine?.getPlugin<ShapePlugin>('shape');
    if (shapePlugin) {
      const shapeOptions: ShapeOptions = {
        x: cx - rx, // Convert center coordinates to top-left
        y: cy - ry,
        width: rx * 2, // Convert radius to width
        height: ry * 2, // Convert radius to height
        ...style,
      };

      const ellipse = shapePlugin.createShape('ellipse', shapeOptions);

      // Ensure shape has required properties
      this.ensureShapeProperties(ellipse, style);

      // DefaultSceneNode 클래스를 사용하여 SceneNode 생성
      const ellipseNode = new DefaultSceneNode(ellipse.id, this.engine!.events);
      ellipseNode.data = ellipse;
      parentNode.addChild(ellipseNode);
    }
  }

  /**
   * Process SVG line element
   *
   * SVG line 요소를 처리합니다.
   *
   * @param element - SVG line element
   * @param parentNode - Parent scene node
   * @param options - Import options
   * @private
   */
  private processLineElement(
    element: Element,
    parentNode: SceneNode,
    options: SVGImportOptions
  ): void {
    // Extract attributes with defaults
    const x1 = parseFloat(element.getAttribute('x1') || '0') * (options.scale || 1);
    const y1 = parseFloat(element.getAttribute('y1') || '0') * (options.scale || 1);
    const x2 = parseFloat(element.getAttribute('x2') || '0') * (options.scale || 1);
    const y2 = parseFloat(element.getAttribute('y2') || '0') * (options.scale || 1);

    // Extract style attributes
    const style = this.extractStyleAttributes(element);

    // Create line shape
    const shapePlugin = this.engine?.getPlugin<ShapePlugin>('shape');
    if (shapePlugin) {
      const shapeOptions: ShapeOptions = {
        x1,
        y1,
        x2,
        y2,
        ...style,
      };

      const line = shapePlugin.createShape('line', shapeOptions);

      // Ensure shape has required properties
      this.ensureShapeProperties(line, style);

      // DefaultSceneNode 클래스를 사용하여 SceneNode 생성
      const lineNode = new DefaultSceneNode(line.id, this.engine!.events);
      lineNode.data = line;
      parentNode.addChild(lineNode);
    }
  }

  /**
   * Process SVG polyline element
   *
   * SVG polyline 요소를 처리합니다.
   *
   * @param element - SVG polyline element
   * @param parentNode - Parent scene node
   * @param options - Import options
   * @private
   */
  private processPolylineElement(
    element: Element,
    parentNode: SceneNode,
    options: SVGImportOptions
  ): void {
    // points 속성 파싱
    const pointsAttr = element.getAttribute('points');
    if (!pointsAttr) {
      console.warn('Polyline element missing points attribute');
      return;
    }

    // 점 좌표 파싱
    const points = pointsAttr.trim().split(/\s+|,/).map(Number);

    if (points.length < 4 || points.length % 2 !== 0) {
      console.warn('Invalid polyline points format');
      return;
    }

    // 좌표 쌍으로 변환
    const coordinates: { x: number; y: number }[] = [];
    for (let i = 0; i < points.length; i += 2) {
      coordinates.push({
        x: points[i] * (options.scale || 1),
        y: points[i + 1] * (options.scale || 1),
      });
    }

    // 스타일 속성 추출
    const style = this.extractStyleAttributes(element);

    // 경로 명령 생성
    const commands = coordinates.map((coord, index) => {
      return index === 0
        ? { type: 'M', x: coord.x, y: coord.y }
        : { type: 'L', x: coord.x, y: coord.y };
    });

    // 경로 생성 (polyline은 닫히지 않음)
    const shapePlugin = this.engine?.getPlugin<ShapePlugin>('shape');
    if (shapePlugin) {
      const shapeOptions: ShapeOptions = {
        commands,
        ...style,
      };

      const path = shapePlugin.createShape('path', shapeOptions);

      // Ensure shape has required properties
      this.ensureShapeProperties(path, style);

      // DefaultSceneNode 클래스를 사용하여 SceneNode 생성
      const pathNode = new DefaultSceneNode(path.id, this.engine!.events);
      pathNode.data = path;
      parentNode.addChild(pathNode);
    }
  }

  /**
   * Process SVG polygon element
   *
   * SVG polygon 요소를 처리합니다.
   *
   * @param element - SVG polygon element
   * @param parentNode - Parent scene node
   * @param options - Import options
   * @private
   */
  private processPolygonElement(
    element: Element,
    parentNode: SceneNode,
    options: SVGImportOptions
  ): void {
    // points 속성 파싱
    const pointsAttr = element.getAttribute('points');
    if (!pointsAttr) {
      console.warn('Polygon element missing points attribute');
      return;
    }

    // 점 좌표 파싱
    const points = pointsAttr.trim().split(/\s+|,/).map(Number);

    if (points.length < 4 || points.length % 2 !== 0) {
      console.warn('Invalid polygon points format');
      return;
    }

    // 좌표 쌍으로 변환
    const coordinates: { x: number; y: number }[] = [];
    for (let i = 0; i < points.length; i += 2) {
      coordinates.push({
        x: points[i] * (options.scale || 1),
        y: points[i + 1] * (options.scale || 1),
      });
    }

    // 스타일 속성 추출
    const style = this.extractStyleAttributes(element);

    // 경로 명령 생성
    const commands = coordinates.map((coord, index) => {
      return index === 0
        ? { type: 'M', x: coord.x, y: coord.y }
        : { type: 'L', x: coord.x, y: coord.y };
    });

    // 경로 닫기 - 첫번째 좌표 사용
    commands.push({ type: 'Z', x: coordinates[0].x, y: coordinates[0].y });

    // 경로 생성
    const shapePlugin = this.engine?.getPlugin<ShapePlugin>('shape');
    if (shapePlugin) {
      const shapeOptions: ShapeOptions = {
        commands,
        ...style,
      };

      const path = shapePlugin.createShape('path', shapeOptions);

      // Ensure shape has required properties
      this.ensureShapeProperties(path, style);

      // DefaultSceneNode 클래스를 사용하여 SceneNode 생성
      const pathNode = new DefaultSceneNode(path.id, this.engine!.events);
      pathNode.data = path;
      parentNode.addChild(pathNode);
    }
  }

  /**
   * Process SVG path element
   *
   * SVG path 요소를 처리합니다.
   *
   * @param element - SVG path element
   * @param parentNode - Parent scene node
   * @param options - Import options
   * @private
   */
  private processPathElement(
    element: Element,
    parentNode: SceneNode,
    options: SVGImportOptions
  ): void {
    // d 속성 파싱
    const dAttr = element.getAttribute('d');
    if (!dAttr) {
      console.warn('Path element missing d attribute');
      return;
    }

    // 스타일 속성 추출
    const style = this.extractStyleAttributes(element);

    // 경로 생성
    const shapePlugin = this.engine?.getPlugin<ShapePlugin>('shape');
    if (shapePlugin) {
      const scale = options.scale || 1;

      // 간단한 방식으로 d 속성을 commands로 변환
      // 실제 구현에서는 더 정교한 SVG Path 파서가 필요함
      const commands = this.parseSVGPath(dAttr, scale);

      const shapeOptions: ShapeOptions = {
        commands,
        ...style,
      };

      const path = shapePlugin.createShape('path', shapeOptions);

      // Ensure shape has required properties
      this.ensureShapeProperties(path, style);

      // DefaultSceneNode 클래스를 사용하여 SceneNode 생성
      const pathNode = new DefaultSceneNode(path.id, this.engine!.events);
      pathNode.data = path;
      parentNode.addChild(pathNode);
    }
  }

  /**
   * Parse SVG path d attribute
   *
   * SVG path의 d 속성을 파싱합니다.
   *
   * @param d - SVG path d attribute
   * @param scale - Scale factor
   * @returns Array of path commands
   * @private
   */
  private parseSVGPath(
    d: string,
    scale: number
  ): { type: string; x: number; y: number; [key: string]: any }[] {
    // SVG Path 명령어를 파싱하기 위한 고급 구현
    const commands: { type: string; x: number; y: number; [key: string]: any }[] = [];

    // 명령어, 숫자 및 쉼표를 토큰화
    const tokenRegex = /([a-zA-Z])|([+-]?\d*\.?\d+)|(,)/g;
    const tokens = d.match(tokenRegex) || [];

    // 숫자 토큰만 필터링하고 파싱하는 헬퍼 함수
    const getNextNumbers = (
      count: number,
      startIndex: number
    ): { values: number[]; nextIndex: number } => {
      const values: number[] = [];
      let index = startIndex;

      while (values.length < count && index < tokens.length) {
        const token = tokens[index];

        // 명령어를 만나면 중단
        if (/[a-zA-Z]/.test(token)) {
          break;
        }

        // 숫자인 경우 추가
        if (/[+-]?\d*\.?\d+/.test(token)) {
          values.push(parseFloat(token) * scale);
        }
        // 쉼표는 무시

        index++;
      }

      return { values, nextIndex: index };
    };

    let currentX = 0;
    let currentY = 0;
    // 이전 제어점 (베지어 곡선에서 사용)
    let lastControlX = 0;
    let lastControlY = 0;
    // 첫 명령어의 좌표 (경로 닫기용)
    let firstCommandX = 0;
    let firstCommandY = 0;
    let commandType = '';
    let tokenIndex = 0;

    // 첫 번째 명령어가 M이 아닌 경우 현재 위치에서부터 경로가 시작됨을 가정
    let isFirstCommand = true;

    while (tokenIndex < tokens.length) {
      const token = tokens[tokenIndex];

      // 명령어인 경우
      if (/[a-zA-Z]/.test(token)) {
        commandType = token;
        tokenIndex++;

        // 첫 명령어가 M이 아닌 경우
        if (isFirstCommand && commandType !== 'M' && commandType !== 'm') {
          console.warn(
            'SVG path does not start with M or m command. Defaulting to current position.'
          );
        }

        if (isFirstCommand) {
          isFirstCommand = false;
        }

        continue;
      }

      // 좌표 값 파싱
      switch (commandType) {
        case 'M': // 절대 이동
        case 'm': {
          // 상대 이동
          const { values, nextIndex } = getNextNumbers(2, tokenIndex);
          tokenIndex = nextIndex;

          if (values.length >= 2) {
            if (commandType === 'm') {
              // 상대 이동
              currentX += values[0];
              currentY += values[1];
            } else {
              // 절대 이동
              currentX = values[0];
              currentY = values[1];
            }

            if (commands.length === 0) {
              // 첫 명령어의 좌표 저장
              firstCommandX = currentX;
              firstCommandY = currentY;
            }

            commands.push({ type: 'M', x: currentX, y: currentY });

            // M/m 다음에 좌표쌍이 계속되면 L/l로 취급
            // 추가 좌표쌍이 있는지 확인하고 처리
            let moreCoords = true;
            while (moreCoords) {
              const { values: extraValues, nextIndex: extraIndex } = getNextNumbers(2, tokenIndex);

              if (extraValues.length >= 2) {
                if (commandType === 'm') {
                  // 상대 선
                  currentX += extraValues[0];
                  currentY += extraValues[1];
                } else {
                  // 절대 선
                  currentX = extraValues[0];
                  currentY = extraValues[1];
                }

                commands.push({ type: 'L', x: currentX, y: currentY });
                tokenIndex = extraIndex;
              } else {
                moreCoords = false;
              }
            }
          }
          break;
        }

        case 'L': // 절대 선
        case 'l': {
          // 상대 선
          const { values, nextIndex } = getNextNumbers(2, tokenIndex);
          tokenIndex = nextIndex;

          if (values.length >= 2) {
            if (commandType === 'l') {
              // 상대 선
              currentX += values[0];
              currentY += values[1];
            } else {
              // 절대 선
              currentX = values[0];
              currentY = values[1];
            }

            commands.push({ type: 'L', x: currentX, y: currentY });

            // 추가 좌표쌍 처리
            let moreCoords = true;
            while (moreCoords) {
              const { values: extraValues, nextIndex: extraIndex } = getNextNumbers(2, tokenIndex);

              if (extraValues.length >= 2) {
                if (commandType === 'l') {
                  // 상대 선
                  currentX += extraValues[0];
                  currentY += extraValues[1];
                } else {
                  // 절대 선
                  currentX = extraValues[0];
                  currentY = extraValues[1];
                }

                commands.push({ type: 'L', x: currentX, y: currentY });
                tokenIndex = extraIndex;
              } else {
                moreCoords = false;
              }
            }
          }
          break;
        }

        case 'H': // 절대 수평선
        case 'h': {
          // 상대 수평선
          const { values, nextIndex } = getNextNumbers(1, tokenIndex);
          tokenIndex = nextIndex;

          if (values.length >= 1) {
            if (commandType === 'h') {
              // 상대 수평선
              currentX += values[0];
            } else {
              // 절대 수평선
              currentX = values[0];
            }

            commands.push({ type: 'L', x: currentX, y: currentY });

            // 추가 값 처리
            let moreCoords = true;
            while (moreCoords) {
              const { values: extraValues, nextIndex: extraIndex } = getNextNumbers(1, tokenIndex);

              if (extraValues.length >= 1) {
                if (commandType === 'h') {
                  // 상대 수평선
                  currentX += extraValues[0];
                } else {
                  // 절대 수평선
                  currentX = extraValues[0];
                }

                commands.push({ type: 'L', x: currentX, y: currentY });
                tokenIndex = extraIndex;
              } else {
                moreCoords = false;
              }
            }
          }
          break;
        }

        case 'V': // 절대 수직선
        case 'v': {
          // 상대 수직선
          const { values, nextIndex } = getNextNumbers(1, tokenIndex);
          tokenIndex = nextIndex;

          if (values.length >= 1) {
            if (commandType === 'v') {
              // 상대 수직선
              currentY += values[0];
            } else {
              // 절대 수직선
              currentY = values[0];
            }

            commands.push({ type: 'L', x: currentX, y: currentY });

            // 추가 값 처리
            let moreCoords = true;
            while (moreCoords) {
              const { values: extraValues, nextIndex: extraIndex } = getNextNumbers(1, tokenIndex);

              if (extraValues.length >= 1) {
                if (commandType === 'v') {
                  // 상대 수직선
                  currentY += extraValues[0];
                } else {
                  // 절대 수직선
                  currentY = extraValues[0];
                }

                commands.push({ type: 'L', x: currentX, y: currentY });
                tokenIndex = extraIndex;
              } else {
                moreCoords = false;
              }
            }
          }
          break;
        }

        case 'C': // 절대 3차 베지어 곡선
        case 'c': {
          // 상대 3차 베지어 곡선
          const { values, nextIndex } = getNextNumbers(6, tokenIndex);
          tokenIndex = nextIndex;

          if (values.length >= 6) {
            let x1, y1, x2, y2, x, y;

            if (commandType === 'c') {
              // 상대 좌표
              x1 = currentX + values[0];
              y1 = currentY + values[1];
              x2 = currentX + values[2];
              y2 = currentY + values[3];
              x = currentX + values[4];
              y = currentY + values[5];
            } else {
              // 절대 좌표
              x1 = values[0];
              y1 = values[1];
              x2 = values[2];
              y2 = values[3];
              x = values[4];
              y = values[5];
            }

            // 마지막 제어점 저장 (S 명령어에서 사용)
            lastControlX = x2;
            lastControlY = y2;

            commands.push({
              type: 'C',
              x: x,
              y: y,
              x1: x1,
              y1: y1,
              x2: x2,
              y2: y2,
            });

            // 현재 위치 업데이트
            currentX = x;
            currentY = y;

            // 추가 좌표 세트 처리
            let moreCoords = true;
            while (moreCoords) {
              const { values: extraValues, nextIndex: extraIndex } = getNextNumbers(6, tokenIndex);

              if (extraValues.length >= 6) {
                if (commandType === 'c') {
                  // 상대 좌표
                  x1 = currentX + extraValues[0];
                  y1 = currentY + extraValues[1];
                  x2 = currentX + extraValues[2];
                  y2 = currentY + extraValues[3];
                  x = currentX + extraValues[4];
                  y = currentY + extraValues[5];
                } else {
                  // 절대 좌표
                  x1 = extraValues[0];
                  y1 = extraValues[1];
                  x2 = extraValues[2];
                  y2 = extraValues[3];
                  x = extraValues[4];
                  y = extraValues[5];
                }

                // 마지막 제어점 업데이트
                lastControlX = x2;
                lastControlY = y2;

                commands.push({
                  type: 'C',
                  x: x,
                  y: y,
                  x1: x1,
                  y1: y1,
                  x2: x2,
                  y2: y2,
                });

                // 현재 위치 업데이트
                currentX = x;
                currentY = y;

                tokenIndex = extraIndex;
              } else {
                moreCoords = false;
              }
            }
          }
          break;
        }

        case 'S': // 절대 3차 베지어 곡선 (대칭 제어점)
        case 's': {
          // 상대 3차 베지어 곡선 (대칭 제어점)
          const { values, nextIndex } = getNextNumbers(4, tokenIndex);
          tokenIndex = nextIndex;

          if (values.length >= 4) {
            // 첫 번째 제어점은 이전 제어점의 반사
            let x1, y1, x2, y2, x, y;

            // 이전 제어점 반사 계산
            x1 = 2 * currentX - lastControlX;
            y1 = 2 * currentY - lastControlY;

            if (commandType === 's') {
              // 상대 좌표
              x2 = currentX + values[0];
              y2 = currentY + values[1];
              x = currentX + values[2];
              y = currentY + values[3];
            } else {
              // 절대 좌표
              x2 = values[0];
              y2 = values[1];
              x = values[2];
              y = values[3];
            }

            // 마지막 제어점 업데이트
            lastControlX = x2;
            lastControlY = y2;

            commands.push({
              type: 'C',
              x: x,
              y: y,
              x1: x1,
              y1: y1,
              x2: x2,
              y2: y2,
            });

            // 현재 위치 업데이트
            currentX = x;
            currentY = y;

            // 추가 좌표 세트 처리
            let moreCoords = true;
            while (moreCoords) {
              const { values: extraValues, nextIndex: extraIndex } = getNextNumbers(4, tokenIndex);

              if (extraValues.length >= 4) {
                // 첫 번째 제어점은 이전 제어점의 반사
                x1 = 2 * currentX - lastControlX;
                y1 = 2 * currentY - lastControlY;

                if (commandType === 's') {
                  // 상대 좌표
                  x2 = currentX + extraValues[0];
                  y2 = currentY + extraValues[1];
                  x = currentX + extraValues[2];
                  y = currentY + extraValues[3];
                } else {
                  // 절대 좌표
                  x2 = extraValues[0];
                  y2 = extraValues[1];
                  x = extraValues[2];
                  y = extraValues[3];
                }

                // 마지막 제어점 업데이트
                lastControlX = x2;
                lastControlY = y2;

                commands.push({
                  type: 'C',
                  x: x,
                  y: y,
                  x1: x1,
                  y1: y1,
                  x2: x2,
                  y2: y2,
                });

                // 현재 위치 업데이트
                currentX = x;
                currentY = y;

                tokenIndex = extraIndex;
              } else {
                moreCoords = false;
              }
            }
          }
          break;
        }

        case 'Q': // 절대 2차 베지어 곡선
        case 'q': {
          // 상대 2차 베지어 곡선
          const { values, nextIndex } = getNextNumbers(4, tokenIndex);
          tokenIndex = nextIndex;

          if (values.length >= 4) {
            let x1, y1, x, y;

            if (commandType === 'q') {
              // 상대 좌표
              x1 = currentX + values[0];
              y1 = currentY + values[1];
              x = currentX + values[2];
              y = currentY + values[3];
            } else {
              // 절대 좌표
              x1 = values[0];
              y1 = values[1];
              x = values[2];
              y = values[3];
            }

            // 마지막 제어점 저장 (T 명령어에서 사용)
            lastControlX = x1;
            lastControlY = y1;

            commands.push({
              type: 'Q',
              x: x,
              y: y,
              x1: x1,
              y1: y1,
            });

            // 현재 위치 업데이트
            currentX = x;
            currentY = y;

            // 추가 좌표 세트 처리
            let moreCoords = true;
            while (moreCoords) {
              const { values: extraValues, nextIndex: extraIndex } = getNextNumbers(4, tokenIndex);

              if (extraValues.length >= 4) {
                if (commandType === 'q') {
                  // 상대 좌표
                  x1 = currentX + extraValues[0];
                  y1 = currentY + extraValues[1];
                  x = currentX + extraValues[2];
                  y = currentY + extraValues[3];
                } else {
                  // 절대 좌표
                  x1 = extraValues[0];
                  y1 = extraValues[1];
                  x = extraValues[2];
                  y = extraValues[3];
                }

                // 마지막 제어점 업데이트
                lastControlX = x1;
                lastControlY = y1;

                commands.push({
                  type: 'Q',
                  x: x,
                  y: y,
                  x1: x1,
                  y1: y1,
                });

                // 현재 위치 업데이트
                currentX = x;
                currentY = y;

                tokenIndex = extraIndex;
              } else {
                moreCoords = false;
              }
            }
          }
          break;
        }

        case 'T': // 절대 2차 베지어 곡선 (대칭 제어점)
        case 't': {
          // 상대 2차 베지어 곡선 (대칭 제어점)
          const { values, nextIndex } = getNextNumbers(2, tokenIndex);
          tokenIndex = nextIndex;

          if (values.length >= 2) {
            // 제어점은 이전 제어점의 반사
            let x1, y1, x, y;

            // 이전 제어점 반사 계산
            x1 = 2 * currentX - lastControlX;
            y1 = 2 * currentY - lastControlY;

            if (commandType === 't') {
              // 상대 좌표
              x = currentX + values[0];
              y = currentY + values[1];
            } else {
              // 절대 좌표
              x = values[0];
              y = values[1];
            }

            // 마지막 제어점 업데이트 (다음 T 명령에서 사용)
            lastControlX = x1;
            lastControlY = y1;

            commands.push({
              type: 'Q',
              x: x,
              y: y,
              x1: x1,
              y1: y1,
            });

            // 현재 위치 업데이트
            currentX = x;
            currentY = y;

            // 추가 좌표 세트 처리
            let moreCoords = true;
            while (moreCoords) {
              const { values: extraValues, nextIndex: extraIndex } = getNextNumbers(2, tokenIndex);

              if (extraValues.length >= 2) {
                // 제어점은 이전 제어점의 반사
                x1 = 2 * currentX - lastControlX;
                y1 = 2 * currentY - lastControlY;

                if (commandType === 't') {
                  // 상대 좌표
                  x = currentX + extraValues[0];
                  y = currentY + extraValues[1];
                } else {
                  // 절대 좌표
                  x = extraValues[0];
                  y = extraValues[1];
                }

                // 마지막 제어점 업데이트
                lastControlX = x1;
                lastControlY = y1;

                commands.push({
                  type: 'Q',
                  x: x,
                  y: y,
                  x1: x1,
                  y1: y1,
                });

                // 현재 위치 업데이트
                currentX = x;
                currentY = y;

                tokenIndex = extraIndex;
              } else {
                moreCoords = false;
              }
            }
          }
          break;
        }

        case 'Z': // 경로 닫기
        case 'z': {
          // Z 명령은 인자를 갖지 않음
          commands.push({ type: 'Z', x: firstCommandX, y: firstCommandY });
          // 현재 위치를 경로의 시작점으로 설정
          currentX = firstCommandX;
          currentY = firstCommandY;
          tokenIndex++;
          break;
        }

        // 지원하지 않는 명령어 처리 (예: A - 호 명령어)
        default: {
          console.warn(`Unsupported or invalid SVG path command: ${commandType}`);
          // 다음 명령어까지 토큰 건너뛰기
          let foundNextCommand = false;
          while (tokenIndex < tokens.length && !foundNextCommand) {
            if (/[a-zA-Z]/.test(tokens[tokenIndex])) {
              foundNextCommand = true;
            } else {
              tokenIndex++;
            }
          }
          break;
        }
      }
    }

    return commands;
  }

  /**
   * Process SVG group element
   *
   * SVG group 요소를 처리합니다.
   *
   * @param element - SVG group element
   * @param parentNode - Parent scene node
   * @param options - Import options
   * @private
   */
  private processGroupElement(
    element: Element,
    parentNode: SceneNode,
    options: SVGImportOptions
  ): void {
    // Group 생성
    const groupId =
      element.getAttribute('id') || `group-${Math.random().toString(36).substring(2, 9)}`;
    const groupPlugin = this.engine?.getPlugin<GroupPlugin>('group');

    if (groupPlugin && !options.flattenGroups) {
      // 그룹으로 처리
      const group = groupPlugin.createGroup({
        id: groupId,
      });

      // 스타일 속성 추출
      const style = this.extractStyleAttributes(element);

      // 그룹 설정 (예: 변환)
      if (style.transform) {
        (group as any).transform = style.transform;
      }

      const groupNode = new DefaultSceneNode(group.id, this.engine!.events);
      groupNode.data = group;

      // 부모 노드에 그룹 노드 추가
      const addedNode = parentNode.addChild(groupNode);

      if (!addedNode.data) {
        addedNode.data = {};
      }

      this.processChildElements(element, addedNode, options);
    } else {
      // 그룹을 평탄화하여 처리
      this.processChildElements(element, parentNode, options);
    }
  }

  /**
   * Extract style attributes from an SVG element
   *
   * SVG 요소에서 스타일 속성을 추출합니다.
   *
   * @param element - SVG element
   * @returns Object containing style properties
   * @private
   */
  private extractStyleAttributes(element: Element): SVGStyleAttributes {
    const style: SVGStyleAttributes = {};

    // Extract fill
    if (element.hasAttribute('fill')) {
      const fillValue = element.getAttribute('fill');
      if (fillValue !== null) {
        style.fill = fillValue;
      }
    }

    // Extract stroke
    if (element.hasAttribute('stroke')) {
      const strokeValue = element.getAttribute('stroke');
      if (strokeValue !== null) {
        style.stroke = strokeValue;
      }
    }

    // Extract stroke-width
    if (element.hasAttribute('stroke-width')) {
      style.strokeWidth = parseFloat(element.getAttribute('stroke-width') || '1');
    }

    // Extract opacity
    if (element.hasAttribute('opacity')) {
      style.opacity = parseFloat(element.getAttribute('opacity') || '1');
    }

    // Extract style attribute and parse CSS-like properties
    if (element.hasAttribute('style')) {
      const styleAttr = element.getAttribute('style') || '';
      const styleProps = styleAttr.split(';');

      styleProps.forEach(prop => {
        const [name, value] = prop.split(':').map(s => s.trim());
        if (name && value) {
          // Convert kebab-case to camelCase
          const camelName = name.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
          style[camelName] = value;
        }
      });
    }

    return style;
  }

  /**
   * Ensure shape has required properties
   *
   * Shape 객체에 필수 속성이 있는지 확인하고 없으면 초기화합니다.
   *
   * @param shape - Shape object to check
   * @param style - Style attributes
   * @private
   */
  private ensureShapeProperties(shape: Shape, style: SVGStyleAttributes): void {
    // transform 속성이 없는 경우 초기화
    if (!shape.transform) {
      // readonly 속성이므로 타입 단언 사용
      const mathPlugin = this.engine?.getPlugin('math');
      if (mathPlugin && typeof (mathPlugin as any).createMatrix === 'function') {
        (shape as any).transform = (mathPlugin as any).createMatrix();
      }
    }

    // style 속성이 없는 경우 초기화
    if (!shape.style) {
      (shape as any).style = {
        fillColor: style.fill || 'none',
        strokeColor: style.stroke || 'none',
        strokeWidth: style.strokeWidth || 1,
      };
    }
  }
}
