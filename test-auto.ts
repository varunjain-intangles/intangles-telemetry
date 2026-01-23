// Test auto-instrumentation
import { initInstrumentation } from './src/index';

// Initialize with auto-instrumentation
initInstrumentation({
  serviceName: 'test-service-auto',
  serviceVersion: '1.0.0',
  autoInstrument: true,
  exporters: {
    traces: 'console',
    metrics: 'console',
    logs: 'console'
  }
});

console.log('Auto-instrumentation initialized!');

// Simulate some HTTP requests (would be auto-instrumented)
import http from 'http';

const server = http.createServer((req, res) => {
  console.log(`Request: ${req.method} ${req.url}`);
  res.end('Hello from auto-instrumented server!');
});

server.listen(3001, () => {
  console.log('Server listening on port 3001');

  // Make a test request
  http.get('http://localhost:3001/test', (res) => {
    console.log('Test request completed');
    server.close();
  });
});