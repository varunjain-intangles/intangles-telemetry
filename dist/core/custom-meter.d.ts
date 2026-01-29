import { Meter as OTelMeter, Counter as OTelCounter, Histogram as OTelHistogram, UpDownCounter as OTelUpDownCounter } from "@opentelemetry/api";
import { Meter, Counter, Histogram, UpDownCounter, MetricOptions } from "../types/meter";
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
export declare class CustomMeter implements Meter {
    private otelMeter;
    constructor(otelMeter: OTelMeter);
    createCounter(name: string, options?: MetricOptions): Counter;
    createHistogram(name: string, options?: MetricOptions): Histogram;
    createUpDownCounter(name: string, options?: MetricOptions): UpDownCounter;
}
//# sourceMappingURL=custom-meter.d.ts.map