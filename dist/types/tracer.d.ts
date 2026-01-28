export interface SpanOptions {
    kind?: number;
    attributes?: Record<string, string | number | boolean>;
    links?: any[];
    startTime?: number;
    parent?: Span | any;
}
export interface Span {
    setAttribute(key: string, value: string | number | boolean): void;
    addEvent(name: string, attributes?: Record<string, string | number | boolean>): void;
    setStatus(status: {
        code: number;
        message?: string;
    }): void;
    end(endTime?: number): void;
    recordException(exception: Error, attributes?: Record<string, string | number | boolean>): void;
}
export interface Tracer {
    startSpan(name: string, options?: SpanOptions): Span;
    startActiveSpan<T>(name: string, fn: (span: Span) => T, options?: SpanOptions): T;
}
//# sourceMappingURL=tracer.d.ts.map