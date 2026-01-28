import { InstrumentationConfig } from "../types/config";
import { CustomTracer } from "./custom-tracer";
import { CustomLogger } from "./custom-logger";
import { CustomMeter } from "./custom-meter";
import { SpanOptions } from "../types/tracer";
export declare class InstrumentationManager {
    private static instance;
    private config;
    private tracerProvider?;
    private loggerProvider?;
    private metricProvider?;
    constructor(config: InstrumentationConfig);
    init(): Promise<void>;
    private initWithNodeSdk;
    private initManualProviders;
    /**
     * Dynamically loads and enables an OpenTelemetry instrumentation package.
     * @param packageName The npm package name (e.g., '@opentelemetry/instrumentation-http')
     */
    private loadInstrumentation;
    getTracer(name: string): CustomTracer | undefined;
    getLogger(name: string): CustomLogger | undefined;
    getMeter(name: string): CustomMeter | undefined;
    static getInstance(): InstrumentationManager | null;
    flush(): Promise<void>;
    shutdown(): Promise<void>;
}
/**
 * Decorator for automatically creating spans around method execution.
 * Records method execution time, arguments, and any exceptions.
 *
 * @param operationName - Name of the span (defaults to method name)
 * @param options - Additional span options (attributes, kind, etc.)
 *
 * @example
 * ```typescript
 * class MyService {
 *   @Span('user-lookup')
 *   async getUser(id: string) {
 *     // Method implementation
 *   }
 *
 *   @Span('process-order', { attributes: { 'component': 'order-service' } })
 *   async processOrder(order: Order) {
 *     // Method implementation
 *   }
 * }
 * ```
 */
export declare function Span(operationName?: string, options?: SpanOptions): (target: any, propertyKey: string, descriptor: PropertyDescriptor) => PropertyDescriptor;
//# sourceMappingURL=instrumentation-manager.d.ts.map