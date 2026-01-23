# Design Document: OpenTelemetry Instrumentation Library

## Overview

This document outlines the design for a portable Node.js/TypeScript npm library that provides instrumentation capabilities for exporting traces, logs, and metrics using OpenTelemetry. The library aims to simplify the integration of observability into applications by offering a standardized, easy-to-use interface for collecting and exporting telemetry data.

## Goals and Requirements

### Primary Goals
- Provide a simple, portable library for instrumenting Node.js/TypeScript applications
- Support export of traces, logs, and metrics via OpenTelemetry standards
- Enable easy consumption by other applications through npm
- Maintain compatibility with OpenTelemetry specifications
- Offer both automatic and manual instrumentation options

### Functional Requirements
- **Tracing**: Support distributed tracing with span creation, context propagation, and trace export
- **Metrics**: Enable collection and export of custom metrics (counters, histograms, gauges)
- **Logging**: Provide structured logging with correlation to traces and metrics
- **Export**: Support multiple exporters (OTLP, Jaeger, Prometheus, etc.)
- **Configuration**: Allow runtime configuration of instrumentation settings
- **Performance**: Minimal overhead when instrumentation is disabled

### Non-Functional Requirements
- TypeScript-first with full type safety
- Comprehensive documentation and examples
- Cross-platform compatibility (Linux, macOS, Windows)
- Active maintenance and community support
- Semantic versioning for releases

## Architecture

### High-Level Architecture
```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Application   │───▶│ Instrumentation  │───▶│   Exporters     │
│                 │    │    Library       │    │                 │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                              │
                              ▼
                       ┌──────────────────┐
                       │ OpenTelemetry    │
                       │ SDK              │
                       └──────────────────┘
```

### Core Components

#### 1. Instrumentation Manager
- Central component for initializing and managing instrumentation
- Handles configuration loading and validation
- Manages lifecycle of tracers, meters, and loggers

#### 2. Tracer Provider
- Wraps OpenTelemetry TracerProvider
- Provides methods for creating tracers
- Handles span context propagation

#### 3. Meter Provider
- Wraps OpenTelemetry MeterProvider
- Provides methods for creating meters and instruments
- Manages metric collection and aggregation

#### 4. Logger Provider
- Integrates with OpenTelemetry logging API
- Provides structured logging with trace correlation
- Supports log level filtering and formatting

#### 5. Exporter Manager
- Manages multiple exporters for different telemetry types
- Handles export configuration and batching
- Provides fallback and retry mechanisms

#### 6. Configuration Module
- Environment-based configuration
- Programmatic configuration API
- Validation and defaults

## API Design

### Initialization
```typescript
import { initInstrumentation } from '@intangles/telemetry';

const instrumentation = initInstrumentation({
  serviceName: 'my-service',
  serviceVersion: '1.0.0',
  exporters: {
    traces: 'otlp',
    metrics: 'prometheus',
    logs: 'otlp'
  },
  endpoints: {
    otlp: 'http://localhost:4318'
  }
});
```

### Tracing API
```typescript
import { getTracer } from '@intangles/telemetry';

const tracer = getTracer('my-component');

const span = tracer.startSpan('operation-name');
try {
  // Your code here
  span.setAttribute('key', 'value');
  span.addEvent('event-name', { key: 'value' });
} finally {
  span.end();
}
```

### Metrics API
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

### Logging API
```typescript
import { getLogger } from '@intangles/telemetry';

const logger = getLogger('my-component');

logger.info('Processing request', {
  userId: '123',
  requestId: 'abc-123'
});
```

## Dependencies

### Core Dependencies
- `@opentelemetry/api`: OpenTelemetry API definitions
- `@opentelemetry/sdk-node`: Node.js SDK implementation
- `@opentelemetry/auto-instrumentations-node`: Auto-instrumentation packages
- `@opentelemetry/exporter-otlp-proto`: OTLP protocol exporter
- `@opentelemetry/exporter-prometheus`: Prometheus metrics exporter
- `@opentelemetry/exporter-jaeger`: Jaeger tracing exporter

### Development Dependencies
- `typescript`: TypeScript compiler
- `@types/node`: Node.js type definitions
- `jest`: Testing framework
- `eslint`: Code linting
- `prettier`: Code formatting

## Usage Examples

### Basic Setup
```typescript
// index.ts
import { initInstrumentation } from '@intangles/telemetry';

initInstrumentation({
  serviceName: process.env.SERVICE_NAME || 'unknown-service',
  serviceVersion: process.env.SERVICE_VERSION || '1.0.0'
});

// Your application code
import express from 'express';
const app = express();

// The library will automatically instrument Express
app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(3000);
```

### Custom Instrumentation
```typescript
import { getTracer, getMeter } from '@intangles/telemetry';

const tracer = getTracer('database');
const meter = getMeter('database');

async function queryDatabase(query: string) {
  const span = tracer.startSpan('db.query', {
    attributes: { 'db.statement': query }
  });

  const counter = meter.createCounter('db_queries_total');
  const histogram = meter.createHistogram('db_query_duration');

  const startTime = Date.now();

  try {
    // Database query logic
    const result = await executeQuery(query);
    span.setAttribute('db.rows_affected', result.rowCount);
    counter.add(1, { operation: 'select' });
    return result;
  } catch (error) {
    span.recordException(error);
    throw error;
  } finally {
    const duration = (Date.now() - startTime) / 1000;
    histogram.record(duration);
    span.end();
  }
}
```

## Testing Strategy

### Unit Tests
- Test individual components in isolation
- Mock OpenTelemetry SDK components
- Validate API contracts and error handling

### Integration Tests
- Test end-to-end telemetry collection and export
- Validate exporter configurations
- Test auto-instrumentation with sample applications

### Performance Tests
- Measure instrumentation overhead
- Benchmark export performance
- Memory usage analysis

## Deployment and Distribution

### NPM Publishing
- Package will be published to npm registry
- Scoped package: `@intangles/telemetry`
- Support for both CommonJS and ES modules

### Versioning
- Follow semantic versioning (SemVer)
- Major versions for breaking changes
- Minor versions for new features
- Patch versions for bug fixes

### CI/CD Pipeline
- Automated testing on multiple Node.js versions
- Automated publishing on tag creation
- Code quality checks (linting, formatting)

## Security Considerations

- No sensitive data in telemetry by default
- Configuration validation to prevent misconfigurations
- Secure exporter endpoints (HTTPS, authentication)
- Input sanitization for user-provided data

## Future Enhancements

### Phase 2
- Support for custom exporters
- Advanced sampling strategies
- Integration with popular frameworks (NestJS, Fastify)
- Performance monitoring dashboards

### Phase 3
- WASM support for edge computing
- Integration with cloud-native platforms
- Advanced log correlation features
- Machine learning-based anomaly detection

## Conclusion

This design document provides a comprehensive blueprint for building a robust OpenTelemetry instrumentation library. The library will serve as a foundational component for observability in Node.js/TypeScript applications, enabling teams to gain insights into application performance and behavior through standardized telemetry collection and export.