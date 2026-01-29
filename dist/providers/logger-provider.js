"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogProvider = void 0;
const sdk_logs_1 = require("@opentelemetry/sdk-logs");
const api_logs_1 = require("@opentelemetry/api-logs");
const resources_1 = require("@opentelemetry/resources");
const semantic_conventions_1 = require("@opentelemetry/semantic-conventions");
const custom_logger_1 = require("../core/custom-logger");
const exporter_logs_otlp_grpc_1 = require("@opentelemetry/exporter-logs-otlp-grpc");
class LogProvider {
    constructor(config) {
        this.config = config;
    }
    init() {
        const resource = (0, resources_1.defaultResource)().merge((0, resources_1.resourceFromAttributes)({
            [semantic_conventions_1.ATTR_SERVICE_NAME]: this.config.serviceName,
            [semantic_conventions_1.ATTR_SERVICE_VERSION]: this.config.serviceVersion,
        }));
        // Add log record processors
        const logProcessors = this.getLogRecordProcessors();
        if (logProcessors.length > 0) {
            this.provider = new sdk_logs_1.LoggerProvider({
                resource,
                processors: logProcessors,
            });
        }
        else {
            this.provider = new sdk_logs_1.LoggerProvider({
                resource,
            });
        }
        // ["SIGINT", "SIGTERM"].forEach((signal) => {
        //   process.on(signal, () => this.provider?.shutdown().catch(console.error));
        // });
        api_logs_1.logs.setGlobalLoggerProvider(this.provider);
    }
    getLogger(name) {
        const otelLogger = this.provider?.getLogger(name);
        return otelLogger
            ? new custom_logger_1.CustomLogger(otelLogger, this.config.injectCodeAttributes)
            : undefined;
    }
    getLogRecordProcessors() {
        const exporterType = this.config.exporters?.logs;
        let exporter;
        if (exporterType === "otlp") {
            exporter = new exporter_logs_otlp_grpc_1.OTLPLogExporter({
                url: this.config.endpoints?.otlp || "http://localhost:4318/v1/logs",
            });
        }
        else if (exporterType === "console") {
            exporter = new sdk_logs_1.ConsoleLogRecordExporter();
        }
        // else {
        //   console.warn(`Unsupported log exporter type: ${exporterType}`);
        // }
        return exporter ? [new sdk_logs_1.SimpleLogRecordProcessor(exporter)] : [];
    }
    flush() {
        return this.provider?.forceFlush() || Promise.resolve();
    }
    shutdown() {
        return this.provider?.shutdown() || Promise.resolve();
    }
}
exports.LogProvider = LogProvider;
//# sourceMappingURL=logger-provider.js.map