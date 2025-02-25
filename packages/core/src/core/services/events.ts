import { EventService, EventHandler, EventEmitter } from '../types';

/**
 * Basic event emitter implementation
 */
class BaseEventEmitter implements EventEmitter {
  private handlers: Map<string, Set<EventHandler>> = new Map();

  on(event: string, handler: EventHandler): void {
    if (!this.handlers.has(event)) {
      this.handlers.set(event, new Set());
    }
    this.handlers.get(event)!.add(handler);
  }

  off(event: string, handler: EventHandler): void {
    const handlers = this.handlers.get(event);
    if (handlers) {
      handlers.delete(handler);
      if (handlers.size === 0) {
        this.handlers.delete(event);
      }
    }
  }

  emit(event: string, data: any): void {
    const handlers = this.handlers.get(event);
    if (handlers) {
      handlers.forEach(handler => handler(data));
    }
  }
}

/**
 * Default implementation of EventService with namespacing support
 */
export class DefaultEventService extends BaseEventEmitter implements EventService {
  private namespaces: Map<string, EventEmitter> = new Map();

  /**
   * Create a new event namespace
   * @param name - Namespace name
   * @returns A new event emitter for the namespace
   */
  createNamespace(name: string): EventEmitter {
    if (!this.namespaces.has(name)) {
      this.namespaces.set(name, new BaseEventEmitter());
    }
    return this.namespaces.get(name)!;
  }
} 