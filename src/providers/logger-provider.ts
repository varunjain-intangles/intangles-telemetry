import { InstrumentationConfig } from "../types/config";
import {
  LoggerProvider,
  BatchLogRecordProcessor,
  ConsoleLogRecordExporter,
  SimpleLogRecordProcessor,
} from "@opentelemetry/sdk-logs";
import { logs } from "@opentelemetry/api-logs";
import {
  defaultResource,
  resourceFromAttributes,
} from "@opentelemetry/resources";
import {
  ATTR_SERVICE_NAME,
  ATTR_SERVICE_VERSION,
} from "@opentelemetry/semantic-conventions";
import { CustomLogger } from "../core/custom-logger";
import { OTLPLogExporter } from "@opentelemetry/exporter-logs-otlp-grpc";

export class LogProvider {
  private config: InstrumentationConfig;
  private provider?: LoggerProvider;

  constructor(config: InstrumentationConfig) {
    this.config = config;
  }

  init() {
    const resource = defaultResource().merge(
      resourceFromAttributes({
        [ATTR_SERVICE_NAME]: this.config.serviceName,
        [ATTR_SERVICE_VERSION]: this.config.serviceVersion,
      }),
    );

    // Add log record processors
    const logProcessors = this.getLogRecordProcessors();
    if (logProcessors.length > 0) {
      this.provider = new LoggerProvider({
        resource,
        processors: logProcessors,
      });
    } else {
      this.provider = new LoggerProvider({
        resource,
      });
    }

    ["SIGINT", "SIGTERM"].forEach((signal) => {
      process.on(signal, () => this.provider?.shutdown().catch(console.error));
    });

    logs.setGlobalLoggerProvider(this.provider);
  }

  getLogger(name: string) {
    const otelLogger = this.provider?.getLogger(name);
    return otelLogger ? new CustomLogger(otelLogger) : undefined;
  }

  getLogRecordProcessors() {
    const exporterType = this.config.exporters?.logs;
    let exporter;

    if (exporterType === "otlp") {
      exporter = new OTLPLogExporter({
        url: this.config.endpoints?.otlp || "http://localhost:4318/v1/logs",
      });
    } else if (exporterType === "console") {
      exporter = new ConsoleLogRecordExporter();
    } else {
      console.warn(`Unsupported log exporter type: ${exporterType}`);
    }

    return exporter ? [new SimpleLogRecordProcessor(exporter)] : [];
  }

  flush(): Promise<void> {
    return this.provider?.forceFlush() || Promise.resolve();
  }

  shutdown(): Promise<void> {
    return this.provider?.shutdown() || Promise.resolve();
  }
}
