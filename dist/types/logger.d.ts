export interface LogRecord {
    severityNumber: number;
    severityText?: string;
    body: string;
    attributes?: Record<string, string | number | boolean>;
    timestamp?: number;
}
export interface Logger {
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
//# sourceMappingURL=logger.d.ts.map