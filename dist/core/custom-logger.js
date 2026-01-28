"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomLogger = void 0;
class CustomLogger {
    constructor(otelLogger) {
        this.otelLogger = otelLogger;
    }
    emit(logRecord) {
        this.otelLogger.emit({
            severityNumber: logRecord.severityNumber,
            severityText: logRecord.severityText,
            body: logRecord.body,
            attributes: logRecord.attributes,
            timestamp: logRecord.timestamp,
        });
    }
    debug(message, attributes) {
        this.emit({
            severityNumber: 5, // DEBUG
            severityText: "DEBUG",
            body: message,
            attributes: attributes,
            timestamp: Date.now(),
        });
    }
    info(message, attributes) {
        this.emit({
            severityNumber: 9, // INFO
            severityText: "INFO",
            body: message,
            attributes: attributes,
            timestamp: Date.now(),
        });
    }
    warn(message, attributes) {
        this.emit({
            severityNumber: 13, // WARN
            severityText: "WARN",
            body: message,
            attributes: attributes,
            timestamp: Date.now(),
        });
    }
    error(message, attributes) {
        this.emit({
            severityNumber: 17, // ERROR
            severityText: "ERROR",
            body: message,
            attributes: attributes,
            timestamp: Date.now(),
        });
    }
}
exports.CustomLogger = CustomLogger;
//# sourceMappingURL=custom-logger.js.map