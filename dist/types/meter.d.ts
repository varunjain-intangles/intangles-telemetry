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
export interface ObservableCounter {
}
export interface ObservableGauge {
}
export interface ObservableUpDownCounter {
}
export interface Meter {
    createCounter(name: string, options?: MetricOptions): Counter;
    createHistogram(name: string, options?: MetricOptions): Histogram;
    createUpDownCounter(name: string, options?: MetricOptions): UpDownCounter;
    createObservableCounter(name: string, options?: MetricOptions): ObservableCounter;
    createObservableGauge(name: string, options?: MetricOptions): ObservableGauge;
    createObservableUpDownCounter(name: string, options?: MetricOptions): ObservableUpDownCounter;
}
//# sourceMappingURL=meter.d.ts.map