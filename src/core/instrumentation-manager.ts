import { InstrumentationConfig } from "../types/config";
import { TracerProvider } from "../providers/tracer-provider";
import { LogProvider } from "../providers/logger-provider";
import { MetricProvider } from "../providers/meter-provider";
import { NodeSDK } from "@opentelemetry/sdk-node";
import { getNodeAutoInstrumentations } from "@opentelemetry/auto-instrumentations-node";
import { resourceFromAttributes } from "@opentelemetry/resources";
import {
  ATTR_SERVICE_NAME,
  ATTR_SERVICE_VERSION,
} from "@opentelemetry/semantic-conventions";
import { CustomTracer } from "./custom-tracer";
import { CustomLogger } from "./custom-logger";
import { CustomMeter } from "./custom-meter";

export class InstrumentationManager {
  private static instance: InstrumentationManager | null = null;
  private config: InstrumentationConfig;
  private tracerProvider?: TracerProvider;
  private loggerProvider?: LogProvider;
  private metricProvider?: MetricProvider;

  constructor(config: InstrumentationConfig) {
    this.config = config;
    InstrumentationManager.instance = this;
  }

  init() {
    if (this.config.autoInstrument) {
      // Use NodeSDK for auto-instrumentation
      this.initWithNodeSdk();
    } else {
      // Manual provider initialization
      this.initManualProviders();
    }
  }

  private initWithNodeSdk() {
    this.tracerProvider = new TracerProvider(this.config);

    const sdk = new NodeSDK({
      serviceName: this.config.serviceName,
      resource: resourceFromAttributes({
        [ATTR_SERVICE_NAME]: this.config.serviceName,
        [ATTR_SERVICE_VERSION]: this.config.serviceVersion,
      }),
      instrumentations: [
        getNodeAutoInstrumentations({
          // Configure auto-instrumentations as needed
          "@opentelemetry/instrumentation-http": {
            enabled: true,
          },
          "@opentelemetry/instrumentation-express": {
            enabled: true,
          },
          "@opentelemetry/instrumentation-fs": {
            enabled: false, // Disable file system instrumentation by default
          },
        }),
      ],
      spanProcessors: this.tracerProvider.getSpanProcessors(),
    });

    sdk.start();
  }

  private initManualProviders() {
    // Initialize providers manually
    if (this.config.exporters?.traces) {
      this.tracerProvider = new TracerProvider(this.config);
      this.tracerProvider.init();
    }
    if (this.config.exporters?.logs) {
      this.loggerProvider = new LogProvider(this.config);
      this.loggerProvider.init();
    }
    if (this.config.exporters?.metrics) {
      this.metricProvider = new MetricProvider(this.config);
      this.metricProvider.init();
    }
  }

  getTracer(name: string) {
    if (this.config.autoInstrument) {
      // When using NodeSdk, get tracer from global API
      const { trace } = require("@opentelemetry/api");
      const otelTracer = trace.getTracer(name);
      return new CustomTracer(otelTracer);
    }
    return this.tracerProvider?.getTracer(name);
  }

  getLogger(name: string) {
    if (this.config.autoInstrument) {
      // When using NodeSdk, get logger from global API
      const { logs } = require("@opentelemetry/api-logs");
      const otelLogger = logs.getLogger(name);
      return new CustomLogger(otelLogger);
    }
    return this.loggerProvider?.getLogger(name);
  }

  getMeter(name: string) {
    if (this.config.autoInstrument) {
      // When using NodeSdk, get meter from global API
      const { metrics } = require("@opentelemetry/api");
      const otelMeter = metrics.getMeter(name);
      return new CustomMeter(otelMeter);
    }
    return this.metricProvider?.getMeter(name);
  }

  static getInstance(): InstrumentationManager | null {
    return this.instance;
  }
}
