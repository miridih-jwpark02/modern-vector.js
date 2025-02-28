import { Plugin, VectorEngine, SceneNode } from '../../../core/types';
import { DefaultSceneNode } from '../../../core/services/scene-node';
import { ShapePlugin } from '../../core/shapes';
import { ShapeOptions } from '../../core/shapes/types';
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
    _element: Element,
    _parentNode: SceneNode,
    _options: SVGImportOptions
  ): void {
    // Implementation would parse points attribute and create polygon shape
    console.log('Processing polygon element - implementation needed');
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
    _element: Element,
    _parentNode: SceneNode,
    _options: SVGImportOptions
  ): void {
    // Implementation would parse d attribute and create path shape
    console.log('Processing path element - implementation needed');
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
}
