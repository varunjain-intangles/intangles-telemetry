import { Logger as OTelLogger } from "@opentelemetry/api-logs";
import { Logger, LogRecord } from "../types/logger";
import { CodeAttributes } from "./code-attributes";

export class CustomLogger implements Logger {
  private otelLogger: OTelLogger;
  private injectCodeAttributes: boolean;
  private stackTraceSkip: number = 2; // Default skip for log methods
  constructor(otelLogger: OTelLogger, injectCodeAttributes: boolean = false) {
    this.otelLogger = otelLogger;
    this.injectCodeAttributes = injectCodeAttributes;
  }

  emit(logRecord: LogRecord): void {
    const attributes = logRecord.attributes ? { ...logRecord.attributes } : {};

    // Inject code attributes if enabled
    if (this.injectCodeAttributes) {
      const codeAttrs = CodeAttributes.getCodeAttributes(this.stackTraceSkip); // Skip: emit -> caller -> actual code
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

  debug(message: string, attributes?: { [key: string]: any }): void {
    this.stackTraceSkip = 3; // Adjust skip for debug method
    this.emit({
      severityNumber: 5, // DEBUG
      severityText: "DEBUG",
      body: message,
      attributes: attributes,
      timestamp: Date.now(),
    });
  }

  info(message: string, attributes?: { [key: string]: any }): void {
    this.stackTraceSkip = 3; // Adjust skip for info method
    this.emit({
      severityNumber: 9, // INFO
      severityText: "INFO",
      body: message,
      attributes: attributes,
      timestamp: Date.now(),
    });
  }

  warn(message: string, attributes?: { [key: string]: any }): void {
    this.stackTraceSkip = 3; // Adjust skip for warn method
    this.emit({
      severityNumber: 13, // WARN
      severityText: "WARN",
      body: message,
      attributes: attributes,
      timestamp: Date.now(),
    });
  }

  error(message: string, attributes?: { [key: string]: any }): void {
    this.stackTraceSkip = 3; // Adjust skip for error method
    this.emit({
      severityNumber: 17, // ERROR
      severityText: "ERROR",
      body: message,
      attributes: attributes,
      timestamp: Date.now(),
    });
  }
}
