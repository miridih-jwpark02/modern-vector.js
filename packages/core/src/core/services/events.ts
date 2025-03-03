import { EventService, EventHandler, TypedEventEmitter, BaseEventData, EventMap } from '../types';

/**
 * Basic event emitter implementation
 */
class BaseEventEmitter implements TypedEventEmitter {
  private handlers: Map<string, Set<EventHandler>> = new Map();

  on<K extends keyof EventMap>(event: K, handler: EventHandler<EventMap[K]>): void {
    const eventStr = String(event);
    if (!this.handlers.has(eventStr)) {
      this.handlers.set(eventStr, new Set());
    }
    this.handlers.get(eventStr)!.add(handler as EventHandler);
  }

  off<K extends keyof EventMap>(event: K, handler: EventHandler<EventMap[K]>): void {
    const eventStr = String(event);
    const handlers = this.handlers.get(eventStr);
    if (handlers) {
      handlers.delete(handler as EventHandler);
      if (handlers.size === 0) {
        this.handlers.delete(eventStr);
      }
    }
  }

  emit<K extends keyof EventMap>(event: K, data: EventMap[K]): void {
    const eventStr = String(event);
    const handlers = this.handlers.get(eventStr);
    if (handlers) {
      handlers.forEach(handler => handler(data as BaseEventData));
    }
  }
}

/**
 * Default implementation of EventService with namespacing support
 */
export class DefaultEventService extends BaseEventEmitter implements EventService {
  private namespaces: Map<string, TypedEventEmitter> = new Map();

  /**
   * Create a new event namespace
   * @param name - Namespace name
   * @returns A new event emitter for the namespace
   */
  createNamespace(name: string): TypedEventEmitter {
    if (!this.namespaces.has(name)) {
      this.namespaces.set(name, new BaseEventEmitter());
    }
    return this.namespaces.get(name)!;
  }
}
