import { EventService, EventHandler, EventEmitter } from '../types';

/**
 * Basic event emitter implementation
 */
declare class BaseEventEmitter implements EventEmitter {
    private handlers;
    on(event: string, handler: EventHandler): void;
    off(event: string, handler: EventHandler): void;
    emit(event: string, data: any): void;
}
/**
 * Default implementation of EventService with namespacing support
 */
export declare class DefaultEventService extends BaseEventEmitter implements EventService {
    private namespaces;
    /**
     * Create a new event namespace
     * @param name - Namespace name
     * @returns A new event emitter for the namespace
     */
    createNamespace(name: string): EventEmitter;
}
export {};
//# sourceMappingURL=events.d.ts.map