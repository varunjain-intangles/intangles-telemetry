import { InstrumentationConfig } from "../types/config";
import { PeriodicExportingMetricReader } from "@opentelemetry/sdk-metrics";
import { CustomMeter } from "../core/custom-meter";
export declare class MetricProvider {
    private config;
    private provider?;
    constructor(config: InstrumentationConfig);
    init(): void;
    getMeter(name: string): CustomMeter | undefined;
    getMetricReaders(): PeriodicExportingMetricReader[];
    flush(): Promise<void>;
    shutdown(): Promise<void>;
}
//# sourceMappingURL=meter-provider.d.ts.map