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

// Basic info logging
logger.info('Processing request', attributes: { userId: '123', endpoint: '/api/users' });

// Debug logging with detailed context
logger.debug('Database query executed',
  attributes: {
    query: 'SELECT * FROM users WHERE id = ?',
    duration: 45,
    rows: 1
  }
);

// Warning with business context
logger.warn(
  'Rate limit approaching threshold',
  attributes: {
    currentRequests: 85,
    threshold: 100,
    window: '1m'
  }
);

// Error logging with exception details
logger.error(
  'Failed to process payment',
  attributes: {
    error: 'Payment gateway timeout',
    orderId: 'ORD-12345',
    amount: 99.99,
    retryCount: 2
  }
);

// Critical system error
logger.emit({
  severityNumber: 21, // FATAL
  severityText: 'FATAL',
  body: 'Database connection lost',
  attributes: {
    database: 'postgres',
    host: 'db.example.com',
    impact: 'high'
  }
});
```

#### Severity Levels

The `severityNumber` follows OpenTelemetry semantic conventions:

- `1`: TRACE - Very detailed diagnostic information
- `5`: DEBUG - Debug information for development
- `9`: INFO - General information about application operation
- `13`: WARN - Warning about potentially harmful situations
- `17`: ERROR - Error conditions that don't stop the application
- `21`: FATAL - Critical errors that may cause application failure

#### Structured Logging

Use `attributes` to add structured data to your logs:

```typescript
// HTTP request logging
logger.emit({
  severityNumber: 9,
  severityText: 'INFO',
  body: 'HTTP request received',
  attributes: {
    method: 'POST',
    url: '/api/orders',
    userAgent: 'Mozilla/5.0...',
    ip: '192.168.1.1',
    requestId: 'req-abc123',
    contentLength: 1024
  }
});

// Performance monitoring
logger.emit({
  severityNumber: 9,
  severityText: 'INFO',
  body: 'Operation completed',
  attributes: {
    operation: 'user_registration',
    duration: 250, // milliseconds
    success: true,
    userType: 'premium'
  }
});

// Business events
logger.emit({
  severityNumber: 9,
  severityText: 'INFO',
  body: 'Order placed successfully',
  attributes: {
    orderId: 'ORD-12345',
    customerId: 'CUST-67890',
    total: 149.99,
    currency: 'USD',
    items: 3
  }
});
```

#### Error Handling

```typescript
try {
  // Some operation that might fail
  await processPayment(orderData);
  
  logger.emit({
    severityNumber: 9,
    severityText: 'INFO',
    body: 'Payment processed successfully',
    attributes: { orderId: orderData.id, amount: orderData.total }
  });
} catch (error) {
  logger.emit({
    severityNumber: 17,
    severityText: 'ERROR',
    body: `Payment processing failed: ${error.message}`,
    attributes: {
      orderId: orderData.id,
      errorType: error.constructor.name,
      stack: error.stack?.substring(0, 500) // Truncate for readability
    }
  });
}
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

## Key Features

- **Complete OpenTelemetry Abstraction**: No direct OpenTelemetry dependencies in consuming applications
- **Simple API**: Clean, intuitive interfaces for tracing, logging, and metrics
- **Auto-Instrumentation**: Automatic instrumentation of popular Node.js libraries
- **Manual Instrumentation**: Full control over custom instrumentation
- **Multiple Exporters**: Support for OTLP and console exporters
- **TypeScript Support**: Full TypeScript definitions included

## Dependency Benefits

This library provides complete abstraction from OpenTelemetry, meaning consuming applications:

- **No OTEL Dependencies**: Applications don't need to install or manage OpenTelemetry packages
- **Future-Proof**: Can upgrade OpenTelemetry versions without affecting consumers
- **Simplified Maintenance**: Single source of truth for telemetry configuration
- **Clean Architecture**: Telemetry concerns are separated from business logic

## Configuration

The `initInstrumentation` function accepts an `InstrumentationConfig` object with the following properties:

- `serviceName`: string (required) - The name of your service
- `serviceVersion`: string (optional) - The version of your service
- `exporters`: object (optional) - Configure exporters for traces, logs, and metrics
  - `traces`: 'otlp' | 'console'
  - `logs`: 'otlp' | 'console'
  - `metrics`: 'otlp' | 'console'
- `endpoints`: object (optional) - Configure exporter endpoints
  - `otlp`: string - OTLP endpoint URL (default: 'http://localhost:4318')
- `autoInstrument`: boolean (optional) - Enable auto-instrumentation (default: false)

## API Reference

### Functions

- `initInstrumentation(config: InstrumentationConfig): InstrumentationManager` - Initialize telemetry
- `getTracer(name: string): Tracer | undefined` - Get a tracer instance
- `getLogger(name: string): Logger | undefined` - Get a logger instance  
- `getMeter(name: string): Meter | undefined` - Get a meter instance

### Types

- `InstrumentationConfig` - Configuration interface
- `Tracer` - Tracing interface with `startSpan()` and `startActiveSpan()` methods
- `Span` - Span interface with `setAttribute()`, `addEvent()`, `setStatus()`, `end()` methods
- `Logger` - Logging interface with `emit()` method
- `LogRecord` - Log record structure with severity, body, and attributes
- `Meter` - Metrics interface with instrument creation methods
- `Counter`, `Histogram`, `UpDownCounter` - Metric instrument interfaces

## Supported Exporters

- **OTLP**: OpenTelemetry Protocol (default port 4318)
- **Console**: Console output for debugging

## License

MIT