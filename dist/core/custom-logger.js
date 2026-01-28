"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomLogger = void 0;
const code_attributes_1 = require("./code-attributes");
class CustomLogger {
    constructor(otelLogger, injectCodeAttributes = false) {
        this.otelLogger = otelLogger;
        this.injectCodeAttributes = injectCodeAttributes;
    }
    emit(logRecord) {
        const attributes = logRecord.attributes ? { ...logRecord.attributes } : {};
        // Inject code attributes if enabled
        if (this.injectCodeAttributes) {
            const codeAttrs = code_attributes_1.CodeAttributes.getCodeAttributes(2); // Skip: emit -> caller
            Object.assign(attributes, codeAttrs);
        }
        this.otelLogger.emit({
            severityNumber: logRecord.severityNumber,
            severityText: logRecord.severityText,
            body: logRecord.body,
            attributes,
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