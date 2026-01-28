import { Meter as OTelMeter, Counter as OTelCounter, Histogram as OTelHistogram, UpDownCounter as OTelUpDownCounter } from "@opentelemetry/api";
import { Meter, Counter, Histogram, UpDownCounter, ObservableCounter, ObservableGauge, ObservableUpDownCounter, MetricOptions } from "../types/meter";
export declare class CustomCounter implements Counter {
    private otelCounter;
    constructor(otelCounter: OTelCounter);
    add(value: number, attributes?: Record<string, string | number | boolean>): void;
}
export declare class CustomHistogram implements Histogram {
    private otelHistogram;
    constructor(otelHistogram: OTelHistogram);
    record(value: number, attributes?: Record<string, string | number | boolean>): void;
}
export declare class CustomUpDownCounter implements UpDownCounter {
    private otelUpDownCounter;
    constructor(otelUpDownCounter: OTelUpDownCounter);
    add(value: number, attributes?: Record<string, string | number | boolean>): void;
}
export declare class CustomObservableCounter implements ObservableCounter {
}
export declare class CustomObservableGauge implements ObservableGauge {
}
export declare class CustomObservableUpDownCounter implements ObservableUpDownCounter {
}
export declare class CustomMeter implements Meter {
    private otelMeter;
    constructor(otelMeter: OTelMeter);
    createCounter(name: string, options?: MetricOptions): Counter;
    createHistogram(name: string, options?: MetricOptions): Histogram;
    createUpDownCounter(name: string, options?: MetricOptions): UpDownCounter;
    createObservableCounter(name: string, options?: MetricOptions): ObservableCounter;
    createObservableGauge(name: string, options?: MetricOptions): ObservableGauge;
    createObservableUpDownCounter(name: string, options?: MetricOptions): ObservableUpDownCounter;
}
//# sourceMappingURL=custom-meter.d.ts.map