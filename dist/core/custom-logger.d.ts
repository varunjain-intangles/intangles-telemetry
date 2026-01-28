import { Logger as OTelLogger } from "@opentelemetry/api-logs";
import { Logger, LogRecord } from "../types/logger";
export declare class CustomLogger implements Logger {
    private otelLogger;
    constructor(otelLogger: OTelLogger);
    emit(logRecord: LogRecord): void;
    debug(message: string, attributes?: {
        [key: string]: any;
    }): void;
    info(message: string, attributes?: {
        [key: string]: any;
    }): void;
    warn(message: string, attributes?: {
        [key: string]: any;
    }): void;
    error(message: string, attributes?: {
        [key: string]: any;
    }): void;
}
//# sourceMappingURL=custom-logger.d.ts.map