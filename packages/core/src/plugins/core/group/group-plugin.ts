import { Plugin, VectorEngine } from '../../../core/types';
import { Group } from './group';
import { GroupPlugin as IGroupPlugin, GroupOptions } from './types';
import { Shape } from '../shapes/types';

/**
 * GroupPlugin 클래스
 *
 * 여러 Shape를 그룹화하는 기능을 제공하는 플러그인입니다.
 */
export class GroupPlugin implements Plugin, IGroupPlugin {
  /** 플러그인 ID */
  readonly id = 'group-plugin';

  /** 플러그인 버전 */
  readonly version = '1.0.0';

  /** 의존성 플러그인 */
  readonly dependencies = ['shape-plugin'];

  /** VectorEngine 인스턴스 */
  private engine: VectorEngine | null = null;

  /**
   * 플러그인 설치
   *
   * @param engine - VectorEngine 인스턴스
   */
  install(engine: VectorEngine): void {
    if (this.engine) {
      console.warn('GroupPlugin is already installed');
      return;
    }

    this.engine = engine;

    // 엔진에 플러그인 등록은 VectorEngine.use()에서 처리됨
  }

  /**
   * 플러그인 제거
   *
   * @param _engine - VectorEngine 인스턴스
   */
  uninstall(_engine: VectorEngine): void {
    if (!this.engine) {
      console.warn('GroupPlugin is not installed');
      return;
    }

    this.engine = null;

    // 엔진에서 플러그인 제거는 VectorEngine.remove()에서 처리됨
  }

  /**
   * 그룹 생성
   *
   * @param children - 그룹에 포함할 Shape 배열 (선택 사항)
   * @param options - 그룹 생성 옵션 (선택 사항)
   * @returns 생성된 Group 인스턴스
   */
  createGroup(children?: Shape[], options?: GroupOptions): Group {
    if (!this.engine) {
      throw new Error('GroupPlugin is not installed');
    }

    // Group 인스턴스 생성
    const group = new Group({
      ...options,
      children,
    });

    return group;
  }
}
