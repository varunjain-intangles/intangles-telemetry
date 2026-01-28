"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetricProvider = void 0;
const sdk_metrics_1 = require("@opentelemetry/sdk-metrics");
const exporter_metrics_otlp_grpc_1 = require("@opentelemetry/exporter-metrics-otlp-grpc");
const sdk_metrics_2 = require("@opentelemetry/sdk-metrics");
const resources_1 = require("@opentelemetry/resources");
const semantic_conventions_1 = require("@opentelemetry/semantic-conventions");
const custom_meter_1 = require("../core/custom-meter");
const api_1 = require("@opentelemetry/api");
class MetricProvider {
    constructor(config) {
        this.config = config;
    }
    init() {
        const metricReaders = this.getMetricReaders();
        const resource = (0, resources_1.defaultResource)().merge((0, resources_1.resourceFromAttributes)({
            [semantic_conventions_1.ATTR_SERVICE_NAME]: this.config.serviceName,
            [semantic_conventions_1.ATTR_SERVICE_VERSION]: this.config.serviceVersion,
        }));
        this.provider = new sdk_metrics_1.MeterProvider({
            readers: metricReaders,
            resource,
        });
        // Set this MeterProvider to be global to the app being instrumented.
        api_1.metrics.setGlobalMeterProvider(this.provider);
        // this.provider.register();
    }
    getMeter(name) {
        const otelMeter = this.provider?.getMeter(name);
        return otelMeter ? new custom_meter_1.CustomMeter(otelMeter) : undefined;
    }
    getMetricReaders() {
        const metricReaders = [];
        // Add exporters
        const exporterType = this.config.exporters?.metrics;
        let exporter;
        if (exporterType === "otlp") {
            exporter = new exporter_metrics_otlp_grpc_1.OTLPMetricExporter({
                url: this.config.endpoints?.otlp || "http://localhost:4318/v1/metrics",
            });
            metricReaders.push(new sdk_metrics_2.PeriodicExportingMetricReader({
                exporter,
                exportIntervalMillis: 10000,
            }));
        }
        else if (exporterType === "console") {
            exporter = new sdk_metrics_2.ConsoleMetricExporter();
            metricReaders.push(new sdk_metrics_2.PeriodicExportingMetricReader({
                exporter,
                exportIntervalMillis: 10000,
            }));
        }
        else {
            // No exporter configured
            console.warn(`Unsupported metric exporter type: ${exporterType}`);
        }
        return metricReaders;
    }
    flush() {
        return this.provider?.forceFlush() || Promise.resolve();
    }
    shutdown() {
        return this.provider?.shutdown() || Promise.resolve();
    }
}
exports.MetricProvider = MetricProvider;
//# sourceMappingURL=meter-provider.js.map