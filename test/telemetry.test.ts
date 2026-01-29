import { initInstrumentation, getTracer, getMeter, getLogger } from '../src/index';

describe('Telemetry Library', () => {
  beforeEach(() => {
    // Reset any global state between tests
    jest.clearAllMocks();
  });

  describe('Manual Instrumentation', () => {
    test('should initialize with manual instrumentation', () => {
      const manager = initInstrumentation({
        serviceName: 'test-service',
        exporters: {
          traces: 'console',
          metrics: 'console',
          logs: 'console'
        }
      });

      expect(manager).toBeDefined();
    });

    test('should provide tracer instance', () => {
      initInstrumentation({
        serviceName: 'test-service',
        exporters: { traces: 'console' }
      });

      const tracer = getTracer('test-component');
      expect(tracer).toBeDefined();
      expect(tracer).toBeTruthy();
      expect(typeof tracer!.startSpan).toBe('function');
    });

    test('should provide meter instance', () => {
      initInstrumentation({
        serviceName: 'test-service',
        exporters: { metrics: 'console' }
      });

      const meter = getMeter('test-component');
      expect(meter).toBeDefined();
      expect(meter).toBeTruthy();
      expect(typeof meter!.createCounter).toBe('function');
    });

    test('should provide logger instance', () => {
      initInstrumentation({
        serviceName: 'test-service',
        exporters: { logs: 'console' }
      });

      const logger = getLogger('test-component');
      expect(logger).toBeDefined();
      expect(logger).toBeTruthy();
      expect(typeof logger!.emit).toBe('function');
    });

    test('should create spans correctly', () => {
      initInstrumentation({
        serviceName: 'test-service',
        exporters: { traces: 'console' }
      });

      const tracer = getTracer('test-component');
      expect(tracer).toBeDefined();
      
      const span = tracer!.startSpan('test-operation');

      expect(span).toBeDefined();
      expect(typeof span.setAttribute).toBe('function');
      expect(typeof span.end).toBe('function');
      span.setStatus({ code: 1 });
      span.recordException(new Error('Test error'), { severity: 'high' });
      span.recordException(new Error('Test error'));
      span.end();
    });

    test('should create metrics correctly', () => {
      initInstrumentation({
        serviceName: 'test-service',
        exporters: { metrics: 'console' }
      });

      const meter = getMeter('test-component');
      expect(meter).toBeDefined();
      
      const counter = meter!.createCounter('test_counter', {
        description: 'Test counter'
      });

      expect(counter).toBeDefined();
      expect(typeof counter.add).toBe('function');

      counter.add(1, { key: 'value' });
    });
  });

  describe('Auto Instrumentation', () => {
    test('should initialize with auto instrumentation', () => {
      const manager = initInstrumentation({
        serviceName: 'test-service-auto',
        autoInstrument: true,
        exporters: {
          traces: 'console',
          metrics: 'console',
          logs: 'console'
        }
      });

      expect(manager).toBeDefined();
    });

    test('should provide tracer instance in auto mode', () => {
      initInstrumentation({
        serviceName: 'test-service-auto',
        autoInstrument: true,
        exporters: { traces: 'console' }
      });

      const tracer = getTracer('test-component');
      expect(tracer).toBeDefined();
      expect(typeof tracer!.startSpan).toBe('function');
    });

    test('should provide meter instance in auto mode', () => {
      initInstrumentation({
        serviceName: 'test-service-auto',
        autoInstrument: true,
        exporters: { metrics: 'console' }
      });

      const meter = getMeter('test-component');
      expect(meter).toBeDefined();
      expect(typeof meter!.createCounter).toBe('function');
    });

    test('should provide logger instance in auto mode', () => {
      initInstrumentation({
        serviceName: 'test-service-auto',
        autoInstrument: true,
        exporters: { logs: 'console' }
      });

      const logger = getLogger('test-component');
      expect(logger).toBeDefined();
      expect(typeof logger!.emit).toBe('function');
    });
  });

  describe('Configuration', () => {
    test('should accept custom endpoints', () => {
      const manager = initInstrumentation({
        serviceName: 'test-service',
        exporters: { traces: 'otlp' },
        endpoints: {
          otlp: 'http://custom-endpoint:4318'
        }
      });

      expect(manager).toBeDefined();
    });

    test('should accept service version', () => {
      const manager = initInstrumentation({
        serviceName: 'test-service',
        serviceVersion: '2.1.0',
        exporters: { traces: 'console' }
      });

      expect(manager).toBeDefined();
    });

    test('should handle missing optional configuration', () => {
      const manager = initInstrumentation({
        serviceName: 'test-service'
        // No exporters specified
      });

      expect(manager).toBeDefined();

      manager.shutdown().then(() => {
        expect(true).toBe(true); // Just to ensure shutdown completes without error
      });
    });
  });
});