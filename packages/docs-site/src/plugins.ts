/**
 * 플러그인 모듈
 */

import { VectorEngine } from 'modern-vector.js';

/**
 * Plugin 인터페이스
 */
interface Plugin {
  id: string;
  dependencies: string[];
  install(engine: VectorEngine): void;
  uninstall(engine: VectorEngine): void;
}

/**
 * Canvas 렌더러 플러그인
 */
export const CanvasRendererPlugin: Plugin = {
  id: 'canvas-renderer',
  dependencies: [],
  
  install(engine: VectorEngine): void {
    console.log('Canvas 렌더러 플러그인 설치됨');
    
    // 도형 생성 메서드 추가
    (engine.scene as any).createRect = (options: any) => {
      console.log('사각형 생성:', options);
      return {
        translate: (x: number, y: number) => {
          console.log('사각형 이동:', x, y);
        },
        rotate: (angle: number) => {
          console.log('사각형 회전:', angle);
        },
        scale: (sx: number, sy: number) => {
          console.log('사각형 크기 조절:', sx, sy);
        }
      };
    };
    
    (engine.scene as any).createCircle = (options: any) => {
      console.log('원 생성:', options);
      return {
        translate: (x: number, y: number) => {
          console.log('원 이동:', x, y);
        },
        rotate: (angle: number) => {
          console.log('원 회전:', angle);
        },
        scale: (sx: number, sy: number) => {
          console.log('원 크기 조절:', sx, sy);
        }
      };
    };
    
    (engine.scene as any).createLine = (options: any) => {
      console.log('선 생성:', options);
      return {
        translate: (x: number, y: number) => {
          console.log('선 이동:', x, y);
        },
        rotate: (angle: number) => {
          console.log('선 회전:', angle);
        },
        scale: (sx: number, sy: number) => {
          console.log('선 크기 조절:', sx, sy);
        }
      };
    };
  },
  
  uninstall(engine: VectorEngine): void {
    console.log('Canvas 렌더러 플러그인 제거됨');
    
    // 도형 생성 메서드 제거
    delete (engine.scene as any).createRect;
    delete (engine.scene as any).createCircle;
    delete (engine.scene as any).createLine;
  }
};

/**
 * SVG 렌더러 플러그인
 */
export const SVGRendererPlugin: Plugin = {
  id: 'svg-renderer',
  dependencies: [],
  
  install(engine: VectorEngine): void {
    console.log('SVG 렌더러 플러그인 설치됨');
    
    // 도형 생성 메서드 추가
    (engine.scene as any).createRect = (options: any) => {
      console.log('SVG 사각형 생성:', options);
      return {
        translate: (x: number, y: number) => {
          console.log('SVG 사각형 이동:', x, y);
        },
        rotate: (angle: number) => {
          console.log('SVG 사각형 회전:', angle);
        },
        scale: (sx: number, sy: number) => {
          console.log('SVG 사각형 크기 조절:', sx, sy);
        }
      };
    };
    
    (engine.scene as any).createCircle = (options: any) => {
      console.log('SVG 원 생성:', options);
      return {
        translate: (x: number, y: number) => {
          console.log('SVG 원 이동:', x, y);
        },
        rotate: (angle: number) => {
          console.log('SVG 원 회전:', angle);
        },
        scale: (sx: number, sy: number) => {
          console.log('SVG 원 크기 조절:', sx, sy);
        }
      };
    };
    
    // 그라디언트 생성 메서드 추가
    (engine.renderer as any).createLinearGradient = (options: any) => {
      console.log('SVG 선형 그라디언트 생성:', options);
      return options.id;
    };
  },
  
  uninstall(engine: VectorEngine): void {
    console.log('SVG 렌더러 플러그인 제거됨');
    
    // 도형 생성 메서드 제거
    delete (engine.scene as any).createRect;
    delete (engine.scene as any).createCircle;
    delete (engine.renderer as any).createLinearGradient;
  }
};

/**
 * 패스 연산 플러그인
 */
export const PathOperationsPlugin: Plugin = {
  id: 'path-operations',
  dependencies: [],
  
  install(engine: VectorEngine): void {
    console.log('패스 연산 플러그인 설치됨');
    
    // 패스 연산 객체 추가
    (engine.scene as any).pathOp = {
      union: (shape1: any, shape2: any) => {
        console.log('합집합 연산 수행');
        return {
          fill: '#2ecc71',
          translate: (x: number, y: number) => {
            console.log('합집합 결과 이동:', x, y);
          },
          rotate: (angle: number) => {
            console.log('합집합 결과 회전:', angle);
          },
          scale: (sx: number, sy: number) => {
            console.log('합집합 결과 크기 조절:', sx, sy);
          }
        };
      },
      
      intersect: (shape1: any, shape2: any) => {
        console.log('교집합 연산 수행');
        return {
          fill: '#2ecc71',
          translate: (x: number, y: number) => {
            console.log('교집합 결과 이동:', x, y);
          },
          rotate: (angle: number) => {
            console.log('교집합 결과 회전:', angle);
          },
          scale: (sx: number, sy: number) => {
            console.log('교집합 결과 크기 조절:', sx, sy);
          }
        };
      },
      
      subtract: (shape1: any, shape2: any) => {
        console.log('차집합 연산 수행');
        return {
          fill: '#2ecc71',
          translate: (x: number, y: number) => {
            console.log('차집합 결과 이동:', x, y);
          },
          rotate: (angle: number) => {
            console.log('차집합 결과 회전:', angle);
          },
          scale: (sx: number, sy: number) => {
            console.log('차집합 결과 크기 조절:', sx, sy);
          }
        };
      }
    };
  },
  
  uninstall(engine: VectorEngine): void {
    console.log('패스 연산 플러그인 제거됨');
    
    // 패스 연산 객체 제거
    delete (engine.scene as any).pathOp;
  }
}; 