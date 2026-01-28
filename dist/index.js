"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpanDecorator = exports.INSTRUMENTATION_WINSTON = exports.INSTRUMENTATION_UNDICI = exports.INSTRUMENTATION_SOCKET_IO = exports.INSTRUMENTATION_RUNTIME_NODE = exports.INSTRUMENTATION_RESTIFY = exports.INSTRUMENTATION_REDIS = exports.INSTRUMENTATION_PINO = exports.INSTRUMENTATION_PG = exports.INSTRUMENTATION_ORACLEDB = exports.INSTRUMENTATION_OPENAI = exports.INSTRUMENTATION_NET = exports.INSTRUMENTATION_NESTJS_CORE = exports.INSTRUMENTATION_MYSQL2 = exports.INSTRUMENTATION_MYSQL = exports.INSTRUMENTATION_MONGOOSE = exports.INSTRUMENTATION_MONGODB = exports.INSTRUMENTATION_MEMCACHED = exports.INSTRUMENTATION_LRU_MEMOIZER = exports.INSTRUMENTATION_KOA = exports.INSTRUMENTATION_KNEX = exports.INSTRUMENTATION_KAFKAJS = exports.INSTRUMENTATION_IOREDIS = exports.INSTRUMENTATION_HTTP = exports.INSTRUMENTATION_HAPI = exports.INSTRUMENTATION_GRPC = exports.INSTRUMENTATION_GRAPHQL = exports.INSTRUMENTATION_GENERIC_POOL = exports.INSTRUMENTATION_FS = exports.INSTRUMENTATION_EXPRESS = exports.INSTRUMENTATION_DNS = exports.INSTRUMENTATION_DATALOADER = exports.INSTRUMENTATION_CUCUMBER = exports.INSTRUMENTATION_CONNECT = exports.INSTRUMENTATION_CASSANDRA_DRIVER = exports.INSTRUMENTATION_BUNYAN = exports.INSTRUMENTATION_AWS_SDK = exports.INSTRUMENTATION_AWS_LAMBDA = exports.INSTRUMENTATION_AMQPLIB = void 0;
exports.initInstrumentation = initInstrumentation;
exports.getTracer = getTracer;
exports.getLogger = getLogger;
exports.getMeter = getMeter;
exports.flush = flush;
exports.shutdown = shutdown;
const instrumentation_manager_1 = require("./core/instrumentation-manager");
var config_1 = require("./types/config");
Object.defineProperty(exports, "INSTRUMENTATION_AMQPLIB", { enumerable: true, get: function () { return config_1.INSTRUMENTATION_AMQPLIB; } });
Object.defineProperty(exports, "INSTRUMENTATION_AWS_LAMBDA", { enumerable: true, get: function () { return config_1.INSTRUMENTATION_AWS_LAMBDA; } });
Object.defineProperty(exports, "INSTRUMENTATION_AWS_SDK", { enumerable: true, get: function () { return config_1.INSTRUMENTATION_AWS_SDK; } });
Object.defineProperty(exports, "INSTRUMENTATION_BUNYAN", { enumerable: true, get: function () { return config_1.INSTRUMENTATION_BUNYAN; } });
Object.defineProperty(exports, "INSTRUMENTATION_CASSANDRA_DRIVER", { enumerable: true, get: function () { return config_1.INSTRUMENTATION_CASSANDRA_DRIVER; } });
Object.defineProperty(exports, "INSTRUMENTATION_CONNECT", { enumerable: true, get: function () { return config_1.INSTRUMENTATION_CONNECT; } });
Object.defineProperty(exports, "INSTRUMENTATION_CUCUMBER", { enumerable: true, get: function () { return config_1.INSTRUMENTATION_CUCUMBER; } });
Object.defineProperty(exports, "INSTRUMENTATION_DATALOADER", { enumerable: true, get: function () { return config_1.INSTRUMENTATION_DATALOADER; } });
Object.defineProperty(exports, "INSTRUMENTATION_DNS", { enumerable: true, get: function () { return config_1.INSTRUMENTATION_DNS; } });
Object.defineProperty(exports, "INSTRUMENTATION_EXPRESS", { enumerable: true, get: function () { return config_1.INSTRUMENTATION_EXPRESS; } });
Object.defineProperty(exports, "INSTRUMENTATION_FS", { enumerable: true, get: function () { return config_1.INSTRUMENTATION_FS; } });
Object.defineProperty(exports, "INSTRUMENTATION_GENERIC_POOL", { enumerable: true, get: function () { return config_1.INSTRUMENTATION_GENERIC_POOL; } });
Object.defineProperty(exports, "INSTRUMENTATION_GRAPHQL", { enumerable: true, get: function () { return config_1.INSTRUMENTATION_GRAPHQL; } });
Object.defineProperty(exports, "INSTRUMENTATION_GRPC", { enumerable: true, get: function () { return config_1.INSTRUMENTATION_GRPC; } });
Object.defineProperty(exports, "INSTRUMENTATION_HAPI", { enumerable: true, get: function () { return config_1.INSTRUMENTATION_HAPI; } });
Object.defineProperty(exports, "INSTRUMENTATION_HTTP", { enumerable: true, get: function () { return config_1.INSTRUMENTATION_HTTP; } });
Object.defineProperty(exports, "INSTRUMENTATION_IOREDIS", { enumerable: true, get: function () { return config_1.INSTRUMENTATION_IOREDIS; } });
Object.defineProperty(exports, "INSTRUMENTATION_KAFKAJS", { enumerable: true, get: function () { return config_1.INSTRUMENTATION_KAFKAJS; } });
Object.defineProperty(exports, "INSTRUMENTATION_KNEX", { enumerable: true, get: function () { return config_1.INSTRUMENTATION_KNEX; } });
Object.defineProperty(exports, "INSTRUMENTATION_KOA", { enumerable: true, get: function () { return config_1.INSTRUMENTATION_KOA; } });
Object.defineProperty(exports, "INSTRUMENTATION_LRU_MEMOIZER", { enumerable: true, get: function () { return config_1.INSTRUMENTATION_LRU_MEMOIZER; } });
Object.defineProperty(exports, "INSTRUMENTATION_MEMCACHED", { enumerable: true, get: function () { return config_1.INSTRUMENTATION_MEMCACHED; } });
Object.defineProperty(exports, "INSTRUMENTATION_MONGODB", { enumerable: true, get: function () { return config_1.INSTRUMENTATION_MONGODB; } });
Object.defineProperty(exports, "INSTRUMENTATION_MONGOOSE", { enumerable: true, get: function () { return config_1.INSTRUMENTATION_MONGOOSE; } });
Object.defineProperty(exports, "INSTRUMENTATION_MYSQL", { enumerable: true, get: function () { return config_1.INSTRUMENTATION_MYSQL; } });
Object.defineProperty(exports, "INSTRUMENTATION_MYSQL2", { enumerable: true, get: function () { return config_1.INSTRUMENTATION_MYSQL2; } });
Object.defineProperty(exports, "INSTRUMENTATION_NESTJS_CORE", { enumerable: true, get: function () { return config_1.INSTRUMENTATION_NESTJS_CORE; } });
Object.defineProperty(exports, "INSTRUMENTATION_NET", { enumerable: true, get: function () { return config_1.INSTRUMENTATION_NET; } });
Object.defineProperty(exports, "INSTRUMENTATION_OPENAI", { enumerable: true, get: function () { return config_1.INSTRUMENTATION_OPENAI; } });
Object.defineProperty(exports, "INSTRUMENTATION_ORACLEDB", { enumerable: true, get: function () { return config_1.INSTRUMENTATION_ORACLEDB; } });
Object.defineProperty(exports, "INSTRUMENTATION_PG", { enumerable: true, get: function () { return config_1.INSTRUMENTATION_PG; } });
Object.defineProperty(exports, "INSTRUMENTATION_PINO", { enumerable: true, get: function () { return config_1.INSTRUMENTATION_PINO; } });
Object.defineProperty(exports, "INSTRUMENTATION_REDIS", { enumerable: true, get: function () { return config_1.INSTRUMENTATION_REDIS; } });
Object.defineProperty(exports, "INSTRUMENTATION_RESTIFY", { enumerable: true, get: function () { return config_1.INSTRUMENTATION_RESTIFY; } });
Object.defineProperty(exports, "INSTRUMENTATION_RUNTIME_NODE", { enumerable: true, get: function () { return config_1.INSTRUMENTATION_RUNTIME_NODE; } });
Object.defineProperty(exports, "INSTRUMENTATION_SOCKET_IO", { enumerable: true, get: function () { return config_1.INSTRUMENTATION_SOCKET_IO; } });
Object.defineProperty(exports, "INSTRUMENTATION_UNDICI", { enumerable: true, get: function () { return config_1.INSTRUMENTATION_UNDICI; } });
Object.defineProperty(exports, "INSTRUMENTATION_WINSTON", { enumerable: true, get: function () { return config_1.INSTRUMENTATION_WINSTON; } });
var instrumentation_manager_2 = require("./core/instrumentation-manager");
Object.defineProperty(exports, "SpanDecorator", { enumerable: true, get: function () { return instrumentation_manager_2.Span; } });
function initInstrumentation(config) {
    const manager = new instrumentation_manager_1.InstrumentationManager(config);
    manager.init().then(() => {
        ;
        return manager;
    });
}
function getTracer(name) {
    return instrumentation_manager_1.InstrumentationManager.getInstance()?.getTracer(name);
}
function getLogger(name) {
    return instrumentation_manager_1.InstrumentationManager.getInstance()?.getLogger(name);
}
function getMeter(name) {
    return instrumentation_manager_1.InstrumentationManager.getInstance()?.getMeter(name);
}
async function flush() {
    return instrumentation_manager_1.InstrumentationManager.getInstance()?.flush();
}
async function shutdown() {
    return instrumentation_manager_1.InstrumentationManager.getInstance()?.shutdown();
}
//# sourceMappingURL=index.js.map