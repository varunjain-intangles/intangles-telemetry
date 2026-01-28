import { Tracer as OTelTracer, Span as OTelSpan } from "@opentelemetry/api";
import { Tracer, Span, SpanOptions } from "../types/tracer";
export declare class CustomSpan implements Span {
    private _otelSpan;
    constructor(otelSpan: OTelSpan);
    get otelSpan(): OTelSpan;
    setAttribute(key: string, value: string | number | boolean): void;
    addEvent(name: string, attributes?: Record<string, string | number | boolean>): void;
    setStatus(status: {
        code: number;
        message?: string;
    }): void;
    end(endTime?: number): void;
    recordException(exception: Error, attributes?: Record<string, string | number | boolean>): void;
}
export declare class CustomTracer implements Tracer {
    private otelTracer;
    private injectCodeAttributes;
    constructor(otelTracer: OTelTracer, injectCodeAttributes?: boolean);
    startSpan(name: string, options?: SpanOptions): Span;
    startActiveSpan<T>(name: string, fn: (span: Span) => T, options?: SpanOptions): T;
}
//# sourceMappingURL=custom-tracer.d.ts.map