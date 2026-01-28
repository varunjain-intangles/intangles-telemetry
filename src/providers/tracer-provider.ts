import { InstrumentationConfig } from "../types/config";
import { NodeTracerProvider } from "@opentelemetry/sdk-trace-node";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-grpc";
import {
  ConsoleSpanExporter,
  SimpleSpanProcessor,
} from "@opentelemetry/sdk-trace-base";
import {
  defaultResource,
  resourceFromAttributes,
} from "@opentelemetry/resources";
import {
  ATTR_SERVICE_NAME,
  ATTR_SERVICE_VERSION,
} from "@opentelemetry/semantic-conventions";
import { CustomTracer } from "../core/custom-tracer";
import { getSpan } from "@opentelemetry/api/build/src/trace/context-utils";

export class TracerProvider {
  private config: InstrumentationConfig;
  private provider?: NodeTracerProvider;

  constructor(config: InstrumentationConfig) {
    this.config = config;
  }

  init() {
    const spanProcessors = this.getSpanProcessors();
    const resource = defaultResource().merge(
      resourceFromAttributes({
        [ATTR_SERVICE_NAME]: this.config.serviceName,
        [ATTR_SERVICE_VERSION]: this.config.serviceVersion,
      }),
    );
    this.provider = new NodeTracerProvider({
      spanProcessors,
      resource,
    });

    this.provider.register();
  }

  getSpanProcessors() {
    const spanProcessors = [];
    // Add exporters
    const exporterType = this.config.exporters?.traces;
    let exporter;

    if (exporterType === "otlp") {
      exporter = new OTLPTraceExporter({
        url: this.config.endpoints?.otlp || "http://localhost:4318/v1/traces",
      });
    } else if (exporterType === "console") {
      exporter = new ConsoleSpanExporter();
    }

    if (exporter) {
      const spanProcessor = new SimpleSpanProcessor(exporter);
      spanProcessors.push(spanProcessor);
    }
    return spanProcessors;
  }

  getTracer(name: string) {
    const otelTracer = this.provider?.getTracer(name);
    return otelTracer
      ? new CustomTracer(otelTracer, this.config.injectCodeAttributes)
      : undefined;
  }

  flush(): Promise<void> {
    return this.provider?.forceFlush() || Promise.resolve();
  }

  shutdown(): Promise<void> {
    return this.provider?.shutdown() || Promise.resolve();
  }
}
