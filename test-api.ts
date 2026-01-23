// Test file to verify the API works
import { initInstrumentation, getTracer, getMeter, getLogger } from './src/index';

// Initialize
initInstrumentation({
  serviceName: 'test-service',
  exporters: {
    traces: 'console',
    metrics: 'console',
    logs: 'console'
  }
});

// Test tracer
const tracer = getTracer('test');
console.log('Tracer:', tracer);

// Test meter
const meter = getMeter('test');
console.log('Meter:', meter);

// Test logger
const logger = getLogger('test');
console.log('Logger:', logger);