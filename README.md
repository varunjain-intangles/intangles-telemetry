# @intangles/telemetry

A portable OpenTelemetry instrumentation library for Node.js/TypeScript applications.

## Installation

```bash
npm install @intangles/telemetry
```

## Usage

### Basic Setup with Manual Instrumentation

```typescript
import { initInstrumentation } from '@intangles/telemetry';

initInstrumentation({
  serviceName: 'my-service',
  serviceVersion: '1.0.0',
  exporters: {
    traces: 'otlp',
    metrics: 'otlp',
    logs: 'otlp'
  },
  endpoints: {
    otlp: 'http://localhost:4318'
  }
});
```

### Auto-Instrumentation Setup

```typescript
import { initInstrumentation } from '@intangles/telemetry';

initInstrumentation({
  serviceName: 'my-service',
  serviceVersion: '1.0.0',
  exporters: {
    traces: 'otlp',
    metrics: 'otlp',
    logs: 'otlp'
  },
  endpoints: {
    otlp: 'http://localhost:4318'
  },
  autoInstrument: true  // Enable auto-instrumentation
});

// Your application code - HTTP requests, database calls, etc. will be automatically instrumented
import express from 'express';
const app = express();

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(3000);
```

## Instrumentation Modes

### Manual Instrumentation
When `autoInstrument` is `false` (default), you have full control over instrumentation:
- Manually create spans, metrics, and logs
- Use `getTracer()`, `getMeter()`, and `getLogger()` for custom instrumentation
- Only instruments code you explicitly instrument

### Auto-Instrumentation
When `autoInstrument` is `true`, the library automatically instruments popular libraries:
- HTTP/HTTPS requests and responses
- Express.js middleware and routes
- Database operations (when using supported libraries)
- File system operations (can be disabled)
- And many other popular Node.js libraries

**Note:** When using auto-instrumentation, the `getTracer()`, `getMeter()`, and `getLogger()` functions return instances managed by the OpenTelemetry SDK rather than the manually configured providers.

### Tracing

```typescript
import { getTracer } from '@intangles/telemetry';

const tracer = getTracer('my-component');

const span = tracer.startSpan('operation-name');
try {
  // Your code here
  span.setAttribute('key', 'value');
} finally {
  span.end();
}
```

### Logging

```typescript
import { getLogger } from '@intangles/telemetry';

const logger = getLogger('my-component');

logger.emit({
  severityNumber: 9, // INFO
  severityText: 'INFO',
  body: 'Processing request',
  attributes: { userId: '123' }
});
```

### Metrics

```typescript
import { getMeter } from '@intangles/telemetry';

const meter = getMeter('my-component');

const counter = meter.createCounter('requests_total', {
  description: 'Total number of requests'
});

counter.add(1, { method: 'GET', status: '200' });

const histogram = meter.createHistogram('request_duration', {
  description: 'Request duration in seconds'
});

histogram.record(0.5, { method: 'GET' });
```

## Configuration

The `initInstrumentation` function accepts an `InstrumentationConfig` object with the following properties:

- `serviceName`: string (required) - The name of your service
- `serviceVersion`: string (optional) - The version of your service
- `exporters`: object (optional) - Configure exporters for traces, logs, and metrics
  - `traces`: 'otlp' | 'console'
  - `logs`: 'otlp' | 'console'
  - `metrics`: 'otlp' | 'console'
- `endpoints`: object (optional) - Configure exporter endpoints
- `autoInstrument`: boolean (optional) - Enable auto-instrumentation

## Supported Exporters

- **OTLP**: OpenTelemetry Protocol (default port 4318)
- **Console**: Console output for debugging

## License

MIT