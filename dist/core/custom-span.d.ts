import { Tracer as OTelTracer, Span as OTelSpan } from "@opentelemetry/api";
import { Tracer, Span, SpanOptions } from "../types/tracer";
export declare class CustomSpan implements Span {
    private otelSpan;
    constructor(otelSpan: OTelSpan);
    setAttribute(key: string, value: string | number | boolean): void;
    addEvent(name: string, attributes?: Record<string, string | number | boolean>): void;
    setStatus(status: {
        code: number;
        message?: string;
    }): void;
    end(endTime?: number): void;
    recordException(exception: Error): void;
}
export declare class CustomTracer implements Tracer {
    private otelTracer;
    constructor(otelTracer: OTelTracer);
    startSpan(name: string, options?: SpanOptions): Span;
    startActiveSpan<T>(name: string, fn: (span: Span) => T, options?: SpanOptions): T;
}
//# sourceMappingURL=custom-span.d.ts.map