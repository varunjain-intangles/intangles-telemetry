import { Logger as OTelLogger } from "@opentelemetry/api-logs";
import { Logger, LogRecord } from "../types/logger";

export class CustomLogger implements Logger {
  private otelLogger: OTelLogger;

  constructor(otelLogger: OTelLogger) {
    this.otelLogger = otelLogger;
  }

  emit(logRecord: LogRecord): void {
    this.otelLogger.emit({
      severityNumber: logRecord.severityNumber,
      severityText: logRecord.severityText,
      body: logRecord.body,
      attributes: logRecord.attributes,
      timestamp: logRecord.timestamp,
    });
  }

  debug(message: string, attributes?: { [key: string]: any }): void {
    this.emit({
      severityNumber: 5, // DEBUG
      severityText: "DEBUG",
      body: message,
      attributes: attributes,
      timestamp: Date.now(),
    });
  }

  info(message: string, attributes?: { [key: string]: any }): void {
    this.emit({
      severityNumber: 9, // INFO
      severityText: "INFO",
      body: message,
      attributes: attributes,
      timestamp: Date.now(),
    });
  }

  warn(message: string, attributes?: { [key: string]: any }): void {
    this.emit({
      severityNumber: 13, // WARN
      severityText: "WARN",
      body: message,
      attributes: attributes,
      timestamp: Date.now(),
    });
  }

  error(message: string, attributes?: { [key: string]: any }): void {
    this.emit({
      severityNumber: 17, // ERROR
      severityText: "ERROR",
      body: message,
      attributes: attributes,
      timestamp: Date.now(),
    });
  }
}
