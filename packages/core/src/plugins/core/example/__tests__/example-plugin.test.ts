import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { ExamplePlugin } from '../example-plugin';
import { ExampleOptions } from '../types';
import { VectorEngine } from '../../../../core/types';

/**
 * Example Plugin 테스트
 */
describe('ExamplePlugin', () => {
  let engine: VectorEngine;
  let examplePlugin: ExamplePlugin;

  beforeEach(() => {
    // Mock VectorEngine
    engine = {
      use: vi.fn(),
      remove: vi.fn(),
      getPlugin: vi.fn(),
      renderer: {
        register: vi.fn(),
        setActive: vi.fn(),
        render: vi.fn(),
      },
      events: {
        on: vi.fn(),
        off: vi.fn(),
        emit: vi.fn(),
        createNamespace: vi.fn(),
      },
      scene: {
        create: vi.fn(),
        getActive: vi.fn(),
        setActive: vi.fn(),
      },
      executeExample: vi.fn(),
    } as unknown as VectorEngine;

    // Create ExamplePlugin instance
    examplePlugin = new ExamplePlugin();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should have correct metadata', () => {
    expect(examplePlugin.id).toBe('example-plugin');
    expect(examplePlugin.version).toBe('1.0.0');
    expect(examplePlugin.description).toBe('예제 기능을 제공하는 플러그인');
    expect(examplePlugin.dependencies).toEqual([]);
  });

  it('should install correctly', () => {
    // Install plugin
    examplePlugin.install(engine);

    // Verify executeExample method is bound to the engine
    expect(Object.prototype.hasOwnProperty.call(engine, 'executeExample')).toBe(true);

    // Verify warning when installing twice
    const consoleSpy = vi.spyOn(console, 'warn');
    examplePlugin.install(engine);
    expect(consoleSpy).toHaveBeenCalledWith('ExamplePlugin is already installed');
  });

  it('should execute example function with default options', () => {
    examplePlugin.install(engine);

    // Mock Date constructor to return a fixed date
    const fixedDate = new Date('2023-01-01T00:00:00Z');
    vi.spyOn(global, 'Date').mockImplementation(() => fixedDate as any);

    // Execute example function
    const result = examplePlugin.executeExample();

    // Verify result has expected format
    expect(result).toHaveProperty('id');
    expect(result).toHaveProperty('data', 'default');
    expect(result).toHaveProperty('createdAt', fixedDate);

    // Restore Date constructor
    vi.restoreAllMocks();
  });

  it('should execute example function with custom options', () => {
    examplePlugin.install(engine);

    // Mock Date constructor to return a fixed date
    const fixedDate = new Date('2023-01-01T00:00:00Z');
    vi.spyOn(global, 'Date').mockImplementation(() => fixedDate as any);

    // Custom options
    const options: ExampleOptions = {
      value: 'custom value',
      settings: { test: true },
    };

    // Execute example function with options
    const result = examplePlugin.executeExample(options);

    // Verify result has expected format with custom data
    expect(result).toHaveProperty('id');
    expect(result).toHaveProperty('data', 'custom value');
    expect(result).toHaveProperty('createdAt', fixedDate);

    // Restore Date constructor
    vi.restoreAllMocks();
  });

  it('should throw error when executeExample is called without installation', () => {
    // Don't install plugin
    expect(() => examplePlugin.executeExample()).toThrow('ExamplePlugin is not installed');
  });

  it('should uninstall correctly', () => {
    // Install and then uninstall
    examplePlugin.install(engine);
    examplePlugin.uninstall(engine);

    // Verify executeExample method is removed from the engine
    expect(Object.prototype.hasOwnProperty.call(engine, 'executeExample')).toBe(false);

    // Verify warning when uninstalling twice
    const consoleSpy = vi.spyOn(console, 'warn');
    examplePlugin.uninstall(engine);
    expect(consoleSpy).toHaveBeenCalledWith('ExamplePlugin is not installed');
  });
});
