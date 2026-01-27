import { InstrumentationManager } from './core/instrumentation-manager';
import { InstrumentationConfig } from './types/config';

export { InstrumentationConfig } from './types/config';
export { Tracer, Span, SpanOptions } from './types/tracer';
export { Logger, LogRecord } from './types/logger';
export { Meter, Counter, Histogram, UpDownCounter, MetricOptions } from './types/meter';

export function initInstrumentation(config: InstrumentationConfig) {
  const manager = new InstrumentationManager(config);
  manager.init();
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