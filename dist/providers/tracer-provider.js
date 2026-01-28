"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TracerProvider = void 0;
const sdk_trace_node_1 = require("@opentelemetry/sdk-trace-node");
const exporter_trace_otlp_grpc_1 = require("@opentelemetry/exporter-trace-otlp-grpc");
const sdk_trace_base_1 = require("@opentelemetry/sdk-trace-base");
const resources_1 = require("@opentelemetry/resources");
const semantic_conventions_1 = require("@opentelemetry/semantic-conventions");
const custom_tracer_1 = require("../core/custom-tracer");
class TracerProvider {
    constructor(config) {
        this.config = config;
    }
    init() {
        const spanProcessors = this.getSpanProcessors();
        const resource = (0, resources_1.defaultResource)().merge((0, resources_1.resourceFromAttributes)({
            [semantic_conventions_1.ATTR_SERVICE_NAME]: this.config.serviceName,
            [semantic_conventions_1.ATTR_SERVICE_VERSION]: this.config.serviceVersion,
        }));
        this.provider = new sdk_trace_node_1.NodeTracerProvider({
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
            exporter = new exporter_trace_otlp_grpc_1.OTLPTraceExporter({
                url: this.config.endpoints?.otlp || "http://localhost:4318/v1/traces",
            });
        }
        else if (exporterType === "console") {
            exporter = new sdk_trace_base_1.ConsoleSpanExporter();
        }
        if (exporter) {
            const spanProcessor = new sdk_trace_base_1.SimpleSpanProcessor(exporter);
            spanProcessors.push(spanProcessor);
        }
        return spanProcessors;
    }
    getTracer(name) {
        const otelTracer = this.provider?.getTracer(name);
        return otelTracer
            ? new custom_tracer_1.CustomTracer(otelTracer, this.config.injectCodeAttributes)
            : undefined;
    }
    flush() {
        return this.provider?.forceFlush() || Promise.resolve();
    }
    shutdown() {
        return this.provider?.shutdown() || Promise.resolve();
    }
}
exports.TracerProvider = TracerProvider;
//# sourceMappingURL=tracer-provider.js.map