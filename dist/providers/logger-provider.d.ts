import { InstrumentationConfig } from "../types/config";
import { SimpleLogRecordProcessor } from "@opentelemetry/sdk-logs";
import { CustomLogger } from "../core/custom-logger";
export declare class LogProvider {
    private config;
    private provider?;
    constructor(config: InstrumentationConfig);
    init(): void;
    getLogger(name: string): CustomLogger | undefined;
    getLogRecordProcessors(): SimpleLogRecordProcessor[];
    flush(): Promise<void>;
    shutdown(): Promise<void>;
}
//# sourceMappingURL=logger-provider.d.ts.map