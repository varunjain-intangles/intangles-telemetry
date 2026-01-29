export interface MetricOptions {
    description?: string;
    unit?: string;
}
export interface Counter {
    add(value: number, attributes?: Record<string, string | number | boolean>): void;
}
export interface Histogram {
    record(value: number, attributes?: Record<string, string | number | boolean>): void;
}
export interface UpDownCounter {
    add(value: number, attributes?: Record<string, string | number | boolean>): void;
}
export interface Meter {
    createCounter(name: string, options?: MetricOptions): Counter;
    createHistogram(name: string, options?: MetricOptions): Histogram;
    createUpDownCounter(name: string, options?: MetricOptions): UpDownCounter;
}
//# sourceMappingURL=meter.d.ts.map