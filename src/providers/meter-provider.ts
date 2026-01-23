import { InstrumentationConfig } from "../types/config";
import { MeterProvider } from "@opentelemetry/sdk-metrics";
import { OTLPMetricExporter } from "@opentelemetry/exporter-metrics-otlp-grpc";
import {
  ConsoleMetricExporter,
  PeriodicExportingMetricReader,
} from "@opentelemetry/sdk-metrics";
import {
  defaultResource,
  resourceFromAttributes,
} from "@opentelemetry/resources";
import {
  ATTR_SERVICE_NAME,
  ATTR_SERVICE_VERSION,
} from "@opentelemetry/semantic-conventions";
import { CustomMeter } from "../core/custom-meter";

export class MetricProvider {
  private config: InstrumentationConfig;
  private provider?: MeterProvider;

  constructor(config: InstrumentationConfig) {
    this.config = config;
  }

  init() {
    const metricReaders = [];

    // Add exporters
    const exporterType = this.config.exporters?.metrics;
    let exporter;

    if (exporterType === "otlp") {
      exporter = new OTLPMetricExporter({
        url: this.config.endpoints?.otlp || "http://localhost:4318/v1/metrics",
      });
      metricReaders.push(
        new PeriodicExportingMetricReader({
          exporter,
          exportIntervalMillis: 10000,
        }),
      );
    } else if (exporterType === "console") {
      exporter = new ConsoleMetricExporter();
      metricReaders.push(
        new PeriodicExportingMetricReader({
          exporter,
          exportIntervalMillis: 10000,
        }),
      );
    }
    const resource = defaultResource().merge(
      resourceFromAttributes({
        [ATTR_SERVICE_NAME]: this.config.serviceName,
        [ATTR_SERVICE_VERSION]: this.config.serviceVersion,
      }),
    );

    this.provider = new MeterProvider({
      readers: metricReaders,
      resource,
    });

    // this.provider.register();
  }

  getMeter(name: string) {
    const otelMeter = this.provider?.getMeter(name);
    return otelMeter ? new CustomMeter(otelMeter) : undefined;
  }
}
