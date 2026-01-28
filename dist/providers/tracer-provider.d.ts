import { InstrumentationConfig } from "../types/config";
import { SimpleSpanProcessor } from "@opentelemetry/sdk-trace-base";
import { CustomTracer } from "../core/custom-tracer";
export declare class TracerProvider {
    private config;
    private provider?;
    constructor(config: InstrumentationConfig);
    init(): void;
    getSpanProcessors(): SimpleSpanProcessor[];
    getTracer(name: string): CustomTracer | undefined;
    flush(): Promise<void>;
    shutdown(): Promise<void>;
}
//# sourceMappingURL=tracer-provider.d.ts.map