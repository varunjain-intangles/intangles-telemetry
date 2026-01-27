import { InstrumentationConfig } from "../types/config";
import { TracerProvider } from "../providers/tracer-provider";
import { LogProvider } from "../providers/logger-provider";
import { MetricProvider } from "../providers/meter-provider";
import { NodeSDK } from "@opentelemetry/sdk-node";
import { Instrumentation } from "@opentelemetry/instrumentation";
import { getNodeAutoInstrumentations } from "@opentelemetry/auto-instrumentations-node";
import { resourceFromAttributes } from "@opentelemetry/resources";
import {
  ATTR_SERVICE_NAME,
  ATTR_SERVICE_VERSION,
} from "@opentelemetry/semantic-conventions";
import { CustomTracer } from "./custom-tracer";
import { CustomLogger } from "./custom-logger";
import { CustomMeter } from "./custom-meter";

/**
 * Interface representing the expected shape of an OTel instrumentation module
 */
interface InstrumentationModule {
  [key: string]: any;
}

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
    const sdkOptions = {
      autodetectResources: true,
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
    };

    const sdk = new NodeSDK(sdkOptions);

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

    // Initialize instrumentations
    const instrumentations: Instrumentation[] = [];

    this.config.instrumentations?.forEach((element) => {
      try {
        this.loadInstrumentation(element).then((instrumentation) => {
          instrumentations.push(instrumentation);
        });
      } catch (error) {
        console.error(`Failed to load instrumentation ${element}:`, error);
      }
    });

    const sdkOptions = {
      autodetectResources: true,
      serviceName: this.config.serviceName,
      resource: resourceFromAttributes({
        [ATTR_SERVICE_NAME]: this.config.serviceName,
        [ATTR_SERVICE_VERSION]: this.config.serviceVersion,
      }),
      instrumentations: instrumentations,
    };

    const sdk = new NodeSDK(sdkOptions);

    sdk.start();

    console.log(
      "Manual instrumentation initialized with selected instrumentations.",
    );
  }

  /**
   * Dynamically loads and enables an OpenTelemetry instrumentation package.
   * @param packageName The npm package name (e.g., '@opentelemetry/instrumentation-http')
   */
  private async loadInstrumentation(
    packageName: string,
  ): Promise<Instrumentation> {
    try {
      // 1. Dynamic import
      const module: InstrumentationModule = await import(packageName);

      // 2. Find the class that looks like an Instrumentation (ends with 'Instrumentation')
      const InstrumentationClass = Object.values(module).find(
        (exported) =>
          typeof exported === "function" &&
          exported.prototype instanceof Object &&
          exported.name.endsWith("Instrumentation"),
      );

      if (!InstrumentationClass) {
        throw new Error(
          `No valid instrumentation class found in ${packageName}`,
        );
      }

      // 3. Instantiate and register
      // We cast to 'any' for the constructor, but the result is a standard Instrumentation
      const instance = new (InstrumentationClass as any)() as Instrumentation;

      return instance;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.error(`Failed to dynamically load ${packageName}: ${message}`);
      throw error;
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

  async flush(): Promise<void> {
    const flushPromises: Promise<void>[] = [];

    if (this.tracerProvider) {
      flushPromises.push(this.tracerProvider.flush());
    } else if (
      this.config.autoInstrument &&
      process.env.OTEL_TRACES_EXPORTER !== "none"
    ) {
      const { trace } = require("@opentelemetry/api");
      const tracer = trace.getTracerProvider("default");
      flushPromises.push(tracer.getDelegate().forceFlush());
    }

    if (this.loggerProvider) {
      flushPromises.push(this.loggerProvider.flush());
    } else if (
      this.config.autoInstrument &&
      process.env.OTEL_LOGS_EXPORTER !== "none"
    ) {
      const { logs } = require("@opentelemetry/api-logs");
      const logger = logs.getLoggerProvider();
      flushPromises.push(logger.forceFlush());
    }
    if (this.metricProvider) {
      flushPromises.push(this.metricProvider.flush());
    } else if (
      this.config.autoInstrument &&
      process.env.OTEL_METRICS_EXPORTER !== "none"
    ) {
      const { metrics } = require("@opentelemetry/api");
      const meter = metrics.getMeterProvider();
      flushPromises.push(meter.forceFlush());
    }

    await Promise.all(flushPromises).then(() => {});
  }

  async shutdown(): Promise<void> {
    const shutdownPromises: Promise<void>[] = [];

    if (this.tracerProvider) {
      shutdownPromises.push(this.tracerProvider.shutdown());
    }
    if (this.loggerProvider) {
      shutdownPromises.push(this.loggerProvider.shutdown());
    }
    if (this.metricProvider) {
      shutdownPromises.push(this.metricProvider.shutdown());
    }

    await Promise.all(shutdownPromises);
  }
}
