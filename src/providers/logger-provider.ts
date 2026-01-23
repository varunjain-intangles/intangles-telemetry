import { InstrumentationConfig } from "../types/config";
import {
  LoggerProvider,
  BatchLogRecordProcessor,
} from "@opentelemetry/sdk-logs";
import { OTLPLogExporter } from "@opentelemetry/exporter-logs-otlp-grpc";
import {
  ConsoleLogRecordExporter,
  SimpleLogRecordProcessor,
} from "@opentelemetry/sdk-logs";
import {
  defaultResource,
  resourceFromAttributes,
} from "@opentelemetry/resources";
import {
  ATTR_SERVICE_NAME,
  ATTR_SERVICE_VERSION,
} from "@opentelemetry/semantic-conventions";

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

    if (exporter) {
      const logProcessor = new SimpleLogRecordProcessor(exporter);

      this.provider = new LoggerProvider({
        resource,
        processors: [logProcessor],
      });
    }

    ["SIGINT", "SIGTERM"].forEach((signal) => {
      process.on(signal, () => this.provider?.shutdown().catch(console.error));
    });
    // this.provider.register();
  }

  getLogger(name: string) {
    return this.provider?.getLogger(name);
  }
}
