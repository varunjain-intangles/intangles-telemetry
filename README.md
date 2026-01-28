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

// initInstrumentation is async and should be awaited
await initInstrumentation({
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

// Initialize with auto-instrumentation enabled
await initInstrumentation({
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

### Configuration Environment Variables

 Checkout official configuration paramters
 https://opentelemetry.io/docs/specs/otel/configuration/sdk-environment-variables/

 ## Sample configuration
- OTEL_SERVICE_NAME=telemetry-service
- OTEL_EXPORTER_OTLP_ENDPOINT=http://localhost:4317
- OTEL_LOGS_EXPORTER=console
- OTEL_METRICS_EXPORTER=console
- OTEL_TRACES_EXPORTER=console
- OTEL_INSTRUMENTATION_AUTO_INSTRUMENTATION_ENABLED=true

**Note:** When using auto-instrumentation, the `getTracer()`, `getMeter()`, and `getLogger()` functions return instances managed by the OpenTelemetry SDK rather than the manually configured providers.

### Supported Instrumentations

When using manual instrumentation configuration, you can specify which libraries to instrument using the `instrumentations` array. The following instrumentation constants are available:

```typescript
import {
  INSTRUMENTATION_HTTP,
  INSTRUMENTATION_EXPRESS,
  INSTRUMENTATION_MONGODB,
  INSTRUMENTATION_MYSQL,
  INSTRUMENTATION_PG,
  INSTRUMENTATION_REDIS,
  INSTRUMENTATION_AWS_SDK,
  // ... and many more
  initInstrumentation
} from '@intangles/telemetry';

// Configure specific instrumentations
await initInstrumentation({
  serviceName: 'my-service',
  autoInstrument: false,
  exporters: {
    traces: 'console'
  },
  instrumentations: [
    INSTRUMENTATION_HTTP,
    INSTRUMENTATION_EXPRESS,
    INSTRUMENTATION_MONGODB
  ]
});
```

**Note: The required instrumentation library must be added to dependencies of your app.**

List of supported libraries is also available at:

https://www.npmjs.com/package/@opentelemetry/auto-instrumentations-node

**Available Instrumentations:**

| Constant | Library | Purpose |
|----------|---------|---------|
| `INSTRUMENTATION_AMQPLIB` | amqplib | Traces AMQP message broker operations |
| `INSTRUMENTATION_AWS_LAMBDA` | AWS Lambda | Instruments AWS Lambda function execution |
| `INSTRUMENTATION_AWS_SDK` | AWS SDK | Traces AWS service calls |
| `INSTRUMENTATION_BUNYAN` | Bunyan | Instruments Bunyan logging library |
| `INSTRUMENTATION_CASSANDRA_DRIVER` | cassandra-driver | Traces Apache Cassandra operations |
| `INSTRUMENTATION_CONNECT` | Connect | Traces Connect middleware operations |
| `INSTRUMENTATION_CUCUMBER` | Cucumber | Instruments Cucumber test framework |
| `INSTRUMENTATION_DATALOADER` | dataloader | Traces DataLoader batch operations |
| `INSTRUMENTATION_DNS` | Node.js dns | Traces DNS lookups |
| `INSTRUMENTATION_EXPRESS` | Express.js | Traces Express middleware and routes |
| `INSTRUMENTATION_FS` | Node.js fs | Traces file system operations (default disabled) |
| `INSTRUMENTATION_GENERIC_POOL` | generic-pool | Traces connection pool operations |
| `INSTRUMENTATION_GRAPHQL` | GraphQL | Traces GraphQL operations and resolvers |
| `INSTRUMENTATION_GRPC` | gRPC | Traces gRPC calls |
| `INSTRUMENTATION_HAPI` | Hapi | Traces Hapi framework operations |
| `INSTRUMENTATION_HTTP` | Node.js HTTP/HTTPS | Traces HTTP requests and responses |
| `INSTRUMENTATION_IOREDIS` | ioredis | Traces ioredis Redis client operations |
| `INSTRUMENTATION_KAFKAJS` | KafkaJS | Traces Kafka message operations |
| `INSTRUMENTATION_KNEX` | Knex.js | Traces Knex query builder operations |
| `INSTRUMENTATION_KOA` | Koa | Traces Koa middleware and routes |
| `INSTRUMENTATION_LRU_MEMOIZER` | lru-memoizer | Traces LRU memoization operations |
| `INSTRUMENTATION_MEMCACHED` | memcached | Traces Memcached operations |
| `INSTRUMENTATION_MONGODB` | MongoDB | Traces MongoDB database operations |
| `INSTRUMENTATION_MONGOOSE` | Mongoose | Traces Mongoose ODM operations |
| `INSTRUMENTATION_MYSQL` | mysql | Traces MySQL database operations |
| `INSTRUMENTATION_MYSQL2` | mysql2 | Traces MySQL2 database operations |
| `INSTRUMENTATION_NESTJS_CORE` | NestJS | Traces NestJS core operations |
| `INSTRUMENTATION_NET` | Node.js net | Traces network socket operations |
| `INSTRUMENTATION_OPENAI` | OpenAI | Traces OpenAI API calls |
| `INSTRUMENTATION_ORACLEDB` | oracledb | Traces Oracle database operations |
| `INSTRUMENTATION_PG` | pg (PostgreSQL) | Traces PostgreSQL database operations |
| `INSTRUMENTATION_PINO` | Pino | Instruments Pino logging library |
| `INSTRUMENTATION_REDIS` | redis | Traces Redis client operations |
| `INSTRUMENTATION_RESTIFY` | Restify | Traces Restify framework operations |
| `INSTRUMENTATION_RUNTIME_NODE` | Node.js runtime | Instruments Node.js runtime metrics |
| `INSTRUMENTATION_SOCKET_IO` | Socket.IO | Traces Socket.IO events and operations |
| `INSTRUMENTATION_UNDICI` | undici | Traces HTTP requests via undici client |
| `INSTRUMENTATION_WINSTON` | Winston | Instruments Winston logging library |

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

#### Active Spans with Context

Use `startActiveSpan` to automatically set the current active span in the context. This is useful for nested operations where you want child spans to automatically reference the parent:

```typescript
import { getTracer } from '@intangles/telemetry';

const tracer = getTracer('my-component');

// startActiveSpan automatically manages the span context
const result = tracer.startActiveSpan('parent-operation', (parentSpan) => {
  parentSpan.setAttribute('user.id', '12345');
  
  // Any child spans created here will automatically have parentSpan as parent
  const childResult = tracer.startActiveSpan('child-operation', (childSpan) => {
    childSpan.setAttribute('step', 'processing');
    // Do work...
    return 'child-result';
  });
  
  return childResult;
});
```

**Key differences from `startSpan`:**
- Automatically manages span context
- Child spans inherit parent context automatically
- Better for async/await patterns with proper context propagation
- Requires a callback function that receives the span and returns the result

#### Span Decorator

Use the `@SpanDecorator` decorator for automatic span creation around methods without explicit span management:

```typescript
import { SpanDecorator } from '@intangles/telemetry';

class UserService {
  // Basic decorator usage - uses method name as span name
  @SpanDecorator()
  async getUser(id: string) {
    // Automatically creates a span named 'getUser'
    // Tracks execution time, arguments, and exceptions
    return await db.users.findById(id);
  }

  // Custom span name
  @SpanDecorator('user-lookup')
  async findUserByEmail(email: string) {
    // Creates a span named 'user-lookup'
    return await db.users.findByEmail(email);
  }

  // With custom attributes
  @SpanDecorator('save-user', {
    attributes: {
      'service': 'user-management',
      'operation': 'create'
    }
  })
  async saveUser(user: User) {
    // Automatically includes custom attributes
    return await db.users.save(user);
  }
}
```

**What the decorator tracks automatically:**
- Method execution time (`duration_ms` attribute)
- Execution status (`success` or `error`)
- Method arguments (for primitives and JSON-serializable objects as `arg0`, `arg1`, etc.)
- Exceptions with full stack traces
- Both synchronous and asynchronous methods
- Promise rejections

**Usage Guidelines:**
- Use `@SpanDecorator()` for class methods when you want automatic tracing with minimal code
- Use `startActiveSpan` for more complex scenarios with explicit context management
- Use `startSpan` when you need fine-grained control over span lifecycle

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

- `initInstrumentation(config: InstrumentationConfig): Promise<InstrumentationManager>` - Initialize telemetry (async, must be awaited)
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