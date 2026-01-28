import { InstrumentationManager} from './core/instrumentation-manager';
import { InstrumentationConfig } from './types/config';

export { InstrumentationConfig, SupportedInstrumentation } from './types/config';
export {
  INSTRUMENTATION_AMQPLIB,
  INSTRUMENTATION_AWS_LAMBDA,
  INSTRUMENTATION_AWS_SDK,
  INSTRUMENTATION_BUNYAN,
  INSTRUMENTATION_CASSANDRA_DRIVER,
  INSTRUMENTATION_CONNECT,
  INSTRUMENTATION_CUCUMBER,
  INSTRUMENTATION_DATALOADER,
  INSTRUMENTATION_DNS,
  INSTRUMENTATION_EXPRESS,
  INSTRUMENTATION_FS,
  INSTRUMENTATION_GENERIC_POOL,
  INSTRUMENTATION_GRAPHQL,
  INSTRUMENTATION_GRPC,
  INSTRUMENTATION_HAPI,
  INSTRUMENTATION_HTTP,
  INSTRUMENTATION_IOREDIS,
  INSTRUMENTATION_KAFKAJS,
  INSTRUMENTATION_KNEX,
  INSTRUMENTATION_KOA,
  INSTRUMENTATION_LRU_MEMOIZER,
  INSTRUMENTATION_MEMCACHED,
  INSTRUMENTATION_MONGODB,
  INSTRUMENTATION_MONGOOSE,
  INSTRUMENTATION_MYSQL,
  INSTRUMENTATION_MYSQL2,
  INSTRUMENTATION_NESTJS_CORE,
  INSTRUMENTATION_NET,
  INSTRUMENTATION_OPENAI,
  INSTRUMENTATION_ORACLEDB,
  INSTRUMENTATION_PG,
  INSTRUMENTATION_PINO,
  INSTRUMENTATION_REDIS,
  INSTRUMENTATION_RESTIFY,
  INSTRUMENTATION_RUNTIME_NODE,
  INSTRUMENTATION_SOCKET_IO,
  INSTRUMENTATION_UNDICI,
  INSTRUMENTATION_WINSTON,
} from './types/config';
export { Tracer, Span, SpanOptions } from './types/tracer';
export { Span as SpanDecorator} from './core/instrumentation-manager';
export { Logger, LogRecord } from './types/logger';
export { Meter, Counter, Histogram, UpDownCounter, MetricOptions } from './types/meter';

export function initInstrumentation(config: InstrumentationConfig) {
  const manager = new InstrumentationManager(config);
  manager.init().then(() => {;
    return manager;
  });
  return manager;
}

export function getTracer(name: string) {
  return InstrumentationManager.getInstance()?.getTracer(name);
}

export function getLogger(name: string) {
  return InstrumentationManager.getInstance()?.getLogger(name);
}

export function getMeter(name: string) {
  return InstrumentationManager.getInstance()?.getMeter(name);
}

export async function flush(): Promise<void> {
  return InstrumentationManager.getInstance()?.flush();
}

export async function shutdown(): Promise<void> {
  return InstrumentationManager.getInstance()?.shutdown();
} 