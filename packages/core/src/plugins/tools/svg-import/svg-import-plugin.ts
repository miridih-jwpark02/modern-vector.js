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
      if (!file.type.includes('svg')) {
        throw new Error('File is not an SVG');
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
    _element: Element,
    _parentNode: SceneNode,
    _options: SVGImportOptions
  ): void {
    // Implementation would be similar to processRectElement
    // Extract cx, cy, rx, ry attributes and create ellipse shape
    console.log('Processing ellipse element - implementation needed');
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
    _element: Element,
    _parentNode: SceneNode,
    _options: SVGImportOptions
  ): void {
    // Implementation would parse points attribute and create polyline shape
    console.log('Processing polyline element - implementation needed');
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
  private parseSVGPath(d: string, scale: number): { type: string; x: number; y: number }[] {
    // 매우 기본적인 SVG Path 파싱 구현
    // 전체 SVG Path 문법을 지원하지는 않음
    const commands: { type: string; x: number; y: number }[] = [];

    // 숫자와 명령어 토큰 추출
    const tokens = d.match(/([a-zA-Z])|([+-]?\d*\.?\d+)/g) || [];

    let currentX = 0;
    let currentY = 0;
    let commandType = '';
    let tokenIndex = 0;

    while (tokenIndex < tokens.length) {
      const token = tokens[tokenIndex];

      // 명령어인 경우
      if (/[a-zA-Z]/.test(token)) {
        commandType = token;
        tokenIndex++;
        continue;
      }

      // 좌표 값 파싱
      if (commandType === 'M' || commandType === 'm') {
        // 절대/상대 이동
        const x = parseFloat(tokens[tokenIndex]) * scale;
        const y = parseFloat(tokens[tokenIndex + 1]) * scale;

        if (commandType === 'm') {
          // 상대 이동
          currentX += x;
          currentY += y;
        } else {
          // 절대 이동
          currentX = x;
          currentY = y;
        }

        commands.push({ type: 'M', x: currentX, y: currentY });
        tokenIndex += 2;
      } else if (commandType === 'L' || commandType === 'l') {
        // 절대/상대 선
        const x = parseFloat(tokens[tokenIndex]) * scale;
        const y = parseFloat(tokens[tokenIndex + 1]) * scale;

        if (commandType === 'l') {
          // 상대 선
          currentX += x;
          currentY += y;
        } else {
          // 절대 선
          currentX = x;
          currentY = y;
        }

        commands.push({ type: 'L', x: currentX, y: currentY });
        tokenIndex += 2;
      } else if (commandType === 'H' || commandType === 'h') {
        // 수평선
        const x = parseFloat(tokens[tokenIndex]) * scale;

        if (commandType === 'h') {
          // 상대 수평선
          currentX += x;
        } else {
          // 절대 수평선
          currentX = x;
        }

        commands.push({ type: 'L', x: currentX, y: currentY });
        tokenIndex += 1;
      } else if (commandType === 'V' || commandType === 'v') {
        // 수직선
        const y = parseFloat(tokens[tokenIndex]) * scale;

        if (commandType === 'v') {
          // 상대 수직선
          currentY += y;
        } else {
          // 절대 수직선
          currentY = y;
        }

        commands.push({ type: 'L', x: currentX, y: currentY });
        tokenIndex += 1;
      } else if (commandType === 'Z' || commandType === 'z') {
        // 경로 닫기 - 첫 번째 명령의 좌표 사용
        const firstCommand = commands[0];
        if (firstCommand) {
          commands.push({ type: 'Z', x: firstCommand.x, y: firstCommand.y });
        }
        tokenIndex += 1;
      } else {
        // 지원하지 않는 명령은 건너뜀
        tokenIndex += 1;
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
    if (options.flattenGroups) {
      // 그룹 평탄화 시 자식 요소를 직접 부모에 추가
      this.processChildElements(element, parentNode, options);
    } else {
      // GroupPlugin 활용
      const groupPlugin = this.engine?.getPlugin<Plugin>('group') as GroupPlugin | null;
      if (groupPlugin) {
        const group = groupPlugin.createGroup();

        // DefaultSceneNode 클래스를 사용하여 SceneNode 생성
        const groupNode = new DefaultSceneNode(group.id, this.engine!.events);
        groupNode.data = group;
        const addedNode = parentNode.addChild(groupNode);

        // 자식 요소 처리
        this.processChildElements(element, addedNode, options);
      } else {
        // 기존 방식으로 폴백
        // DefaultSceneNode 클래스를 사용하여 SceneNode 생성
        const groupId = element.id || 'group';
        const groupNode = new DefaultSceneNode(groupId, this.engine!.events);
        groupNode.data = {};
        const addedNode = parentNode.addChild(groupNode);

        // 데이터 객체가 확실히 초기화되었는지 확인
        if (!addedNode.data) {
          addedNode.data = {};
        }

        this.processChildElements(element, addedNode, options);
      }
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
