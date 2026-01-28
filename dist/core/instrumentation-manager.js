"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InstrumentationManager = void 0;
exports.Span = Span;
const tracer_provider_1 = require("../providers/tracer-provider");
const logger_provider_1 = require("../providers/logger-provider");
const meter_provider_1 = require("../providers/meter-provider");
const sdk_node_1 = require("@opentelemetry/sdk-node");
const auto_instrumentations_node_1 = require("@opentelemetry/auto-instrumentations-node");
const resources_1 = require("@opentelemetry/resources");
const semantic_conventions_1 = require("@opentelemetry/semantic-conventions");
const custom_tracer_1 = require("./custom-tracer");
const custom_logger_1 = require("./custom-logger");
const custom_meter_1 = require("./custom-meter");
class InstrumentationManager {
    constructor(config) {
        this.config = config;
        InstrumentationManager.instance = this;
    }
    init() {
        if (this.config.autoInstrument) {
            // Use NodeSDK for auto-instrumentation
            this.initWithNodeSdk();
        }
        else {
            // Manual provider initialization
            this.initManualProviders();
        }
    }
    initWithNodeSdk() {
        const sdkOptions = {
            autodetectResources: true,
            serviceName: this.config.serviceName,
            resource: (0, resources_1.resourceFromAttributes)({
                [semantic_conventions_1.ATTR_SERVICE_NAME]: this.config.serviceName,
                [semantic_conventions_1.ATTR_SERVICE_VERSION]: this.config.serviceVersion,
            }),
            instrumentations: [
                (0, auto_instrumentations_node_1.getNodeAutoInstrumentations)({
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
        const sdk = new sdk_node_1.NodeSDK(sdkOptions);
        sdk.start();
    }
    initManualProviders() {
        // Initialize providers manually
        if (this.config.exporters?.traces) {
            this.tracerProvider = new tracer_provider_1.TracerProvider(this.config);
            this.tracerProvider.init();
        }
        if (this.config.exporters?.logs) {
            this.loggerProvider = new logger_provider_1.LogProvider(this.config);
            this.loggerProvider.init();
        }
        if (this.config.exporters?.metrics) {
            this.metricProvider = new meter_provider_1.MetricProvider(this.config);
            this.metricProvider.init();
        }
        // Initialize instrumentations
        const instrumentations = [];
        this.config.instrumentations?.forEach(async (packageName) => {
            try {
                const instrumentation = this.loadInstrumentation(packageName);
                instrumentations.push(instrumentation);
            }
            catch (error) {
                // Error already logged in loadInstrumentation
            }
        });
        const sdkOptions = {
            autodetectResources: true,
            serviceName: this.config.serviceName,
            resource: (0, resources_1.resourceFromAttributes)({
                [semantic_conventions_1.ATTR_SERVICE_NAME]: this.config.serviceName,
                [semantic_conventions_1.ATTR_SERVICE_VERSION]: this.config.serviceVersion,
            }),
            instrumentations: instrumentations,
        };
        const sdk = new sdk_node_1.NodeSDK(sdkOptions);
        sdk.start();
        console.log("Manual instrumentation initialized with selected instrumentations.");
    }
    /**
     * Dynamically loads and enables an OpenTelemetry instrumentation package.
     * @param packageName The npm package name (e.g., '@opentelemetry/instrumentation-http')
     */
    loadInstrumentation(packageName) {
        try {
            // 1. Dynamic import
            const module = require(packageName);
            // 2. Find the class that looks like an Instrumentation (ends with 'Instrumentation')
            const InstrumentationClass = Object.values(module).find((exported) => typeof exported === "function" &&
                exported.prototype instanceof Object &&
                exported.name.endsWith("Instrumentation"));
            if (!InstrumentationClass) {
                throw new Error(`No valid instrumentation class found in ${packageName}`);
            }
            // 3. Instantiate and register
            // We cast to 'any' for the constructor, but the result is a standard Instrumentation
            const instance = new InstrumentationClass();
            return instance;
        }
        catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            console.error(`Failed to dynamically load ${packageName}: ${message}`);
            throw error;
        }
    }
    getTracer(name) {
        if (this.config.autoInstrument) {
            // When using NodeSdk, get tracer from global API
            const { trace } = require("@opentelemetry/api");
            const otelTracer = trace.getTracer(name);
            return new custom_tracer_1.CustomTracer(otelTracer, this.config.injectCodeAttributes);
        }
        return this.tracerProvider?.getTracer(name);
    }
    getLogger(name) {
        if (this.config.autoInstrument) {
            // When using NodeSdk, get logger from global API
            const { logs } = require("@opentelemetry/api-logs");
            const otelLogger = logs.getLogger(name);
            return new custom_logger_1.CustomLogger(otelLogger);
        }
        return this.loggerProvider?.getLogger(name);
    }
    getMeter(name) {
        if (this.config.autoInstrument) {
            // When using NodeSdk, get meter from global API
            const { metrics } = require("@opentelemetry/api");
            const otelMeter = metrics.getMeter(name);
            return new custom_meter_1.CustomMeter(otelMeter);
        }
        return this.metricProvider?.getMeter(name);
    }
    static getInstance() {
        return this.instance;
    }
    async flush() {
        const flushPromises = [];
        if (this.tracerProvider) {
            flushPromises.push(this.tracerProvider.flush());
        }
        else if (this.config.autoInstrument &&
            process.env.OTEL_TRACES_EXPORTER !== "none") {
            const { trace } = require("@opentelemetry/api");
            const tracer = trace.getTracerProvider("default");
            flushPromises.push(tracer.getDelegate().forceFlush());
        }
        if (this.loggerProvider) {
            flushPromises.push(this.loggerProvider.flush());
        }
        else if (this.config.autoInstrument &&
            process.env.OTEL_LOGS_EXPORTER !== "none") {
            const { logs } = require("@opentelemetry/api-logs");
            const logger = logs.getLoggerProvider();
            flushPromises.push(logger.forceFlush());
        }
        if (this.metricProvider) {
            flushPromises.push(this.metricProvider.flush());
        }
        else if (this.config.autoInstrument &&
            process.env.OTEL_METRICS_EXPORTER !== "none") {
            const { metrics } = require("@opentelemetry/api");
            const meter = metrics.getMeterProvider();
            flushPromises.push(meter.forceFlush());
        }
        await Promise.all(flushPromises).then(() => { });
    }
    async shutdown() {
        const shutdownPromises = [];
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
exports.InstrumentationManager = InstrumentationManager;
InstrumentationManager.instance = null;
/**
 * Decorator for automatically creating spans around method execution.
 * Records method execution time, arguments, and any exceptions.
 *
 * @param operationName - Name of the span (defaults to method name)
 * @param options - Additional span options (attributes, kind, etc.)
 *
 * @example
 * ```typescript
 * class MyService {
 *   @Span('user-lookup')
 *   async getUser(id: string) {
 *     // Method implementation
 *   }
 *
 *   @Span('process-order', { attributes: { 'component': 'order-service' } })
 *   async processOrder(order: Order) {
 *     // Method implementation
 *   }
 * }
 * ```
 */
function Span(operationName, options) {
    return function (target, propertyKey, descriptor) {
        const originalMethod = descriptor.value;
        const spanName = operationName || propertyKey;
        descriptor.value = function (...args) {
            const manager = InstrumentationManager.getInstance();
            if (!manager) {
                // If InstrumentationManager is not initialized, just call the original method
                return originalMethod.apply(this, args);
            }
            const tracer = manager.getTracer(target.constructor.name);
            if (!tracer) {
                return originalMethod.apply(this, args);
            }
            const startTime = Date.now();
            const span = tracer.startActiveSpan(spanName, (span) => {
                try {
                    // Set custom attributes
                    if (options?.attributes) {
                        Object.entries(options.attributes).forEach(([key, value]) => {
                            span.setAttribute(key, value);
                        });
                    }
                    // Add method arguments as attributes
                    args.forEach((arg, index) => {
                        if (typeof arg === "string" ||
                            typeof arg === "number" ||
                            typeof arg === "boolean") {
                            span.setAttribute(`arg${index}`, arg);
                        }
                        else if (arg && typeof arg === "object") {
                            try {
                                span.setAttribute(`arg${index}`, JSON.stringify(arg));
                            }
                            catch {
                                // Skip if can't serialize
                            }
                        }
                    });
                    const result = originalMethod.apply(this, args);
                    // Handle both promise and non-promise returns
                    if (result instanceof Promise) {
                        return result
                            .then((value) => {
                            const duration = Date.now() - startTime;
                            span.setAttribute("duration_ms", duration);
                            span.setAttribute("status", "success");
                            span.end();
                            return value;
                        })
                            .catch((error) => {
                            const duration = Date.now() - startTime;
                            span.setAttribute("duration_ms", duration);
                            span.setAttribute("status", "error");
                            span.recordException(error);
                            span.end();
                            throw error;
                        });
                    }
                    else {
                        const duration = Date.now() - startTime;
                        span.setAttribute("duration_ms", duration);
                        span.setAttribute("status", "success");
                        span.end();
                        return result;
                    }
                }
                catch (error) {
                    span.setAttribute("status", "error");
                    if (error instanceof Error) {
                        span.recordException(error);
                    }
                    span.end();
                    throw error;
                }
            });
        };
        return descriptor;
    };
}
//# sourceMappingURL=instrumentation-manager.js.map