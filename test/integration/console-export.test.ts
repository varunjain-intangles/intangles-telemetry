import {
  initInstrumentation,
  getTracer,
  getMeter,
  getLogger,
  INSTRUMENTATION_HTTP,
  INSTRUMENTATION_EXPRESS,
  flush,
} from "../../src/index";

describe("Integration Tests - Console Export", () => {
  let consoleSpies: { [key: string]: jest.SpyInstance } = {};
  let capturedOutput: { [key: string]: any[] } = {};

  beforeEach(() => {
    // Clear captured output
    capturedOutput = {};

    // Spy on all console methods
    const consoleMethods = [
      "log",
      "dir",
      "info",
      "warn",
      "error",
      "debug",
      "table",
    ];
    consoleMethods.forEach((method) => {
      capturedOutput[method] = [];
      consoleSpies[method] = jest
        .spyOn(console, method as any)
        .mockImplementation((...args) => {
          capturedOutput[method].push(args.length === 1 ? args[0] : args);
        });
    });
  });

  afterEach(() => {
    // Restore all console methods
    Object.values(consoleSpies).forEach((spy) => spy.mockRestore());

    // Clean up any global state
    jest.clearAllMocks();
  });

  describe("Trace Publishing", () => {
    test("should publish spans to console", async () => {
      // Initialize with console trace exporter
      initInstrumentation({
        serviceName: "integration-test-service",
        exporters: { traces: "console" },
        autoInstrument: false,
        instrumentations: [INSTRUMENTATION_HTTP, INSTRUMENTATION_EXPRESS],
      });

      const tracer = getTracer("test-component");
      expect(tracer).toBeDefined();

      const span = tracer!.startSpan("test-operation");

      span.setAttribute("test.key", "test-value");
      span.addEvent("test-event", { eventKey: "eventValue" });

      // End the span
      span.end();

      // Wait a bit for async processing
      await flush();
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Debug: log captured output
      console.log("Captured output:", JSON.stringify(capturedOutput, null, 2));

      // Check that span was logged to console
      const allSpanOutput = Object.values(capturedOutput).flat().flat();
      const spanStrings = allSpanOutput.filter(
        (item) =>
          typeof item === "string" &&
          (item.includes("test-operation") || item.includes("test.key")),
      );
      const spanObjects = allSpanOutput.filter(
        (item) =>
          typeof item === "object" && item && item.name === "test-operation",
      );

      expect(spanStrings.length + spanObjects.length).toBeGreaterThan(0);
    }, 10000);

    test("should publish nested spans to console", async () => {
      initInstrumentation({
        serviceName: "integration-test-service",
        exporters: { traces: "console" },
      });

      const tracer = getTracer("test-component");
      expect(tracer).toBeDefined();

      const parentSpan = tracer!.startSpan("parent-operation");

      parentSpan.setAttribute("parent.key", "parent-value");

      const childSpan = tracer!.startSpan("child-operation", {
        parent: parentSpan,
      });

      childSpan.setAttribute("child.key", "child-value");
      childSpan.end();

      parentSpan.end();

      // Wait for processing
      await flush();
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Check that both spans were logged
      const allNestedOutput = Object.values(capturedOutput).flat().flat();
      expect(
        allNestedOutput.some(
          (item) =>
            (typeof item === "string" && item.includes("parent-operation")) ||
            (typeof item === "object" &&
              item &&
              item.name === "parent-operation"),
        ),
      ).toBe(true);
      expect(
        allNestedOutput.some(
          (item) =>
            (typeof item === "string" && item.includes("child-operation")) ||
            (typeof item === "object" &&
              item &&
              item.name === "child-operation"),
        ),
      ).toBe(true);
    }, 10000);
  });

  describe("Metrics Publishing", () => {
    test("should publish counter metrics to console", async () => {
      initInstrumentation({
        serviceName: "integration-test-service",
        exporters: { metrics: "console" },
      });

      const meter = getMeter("test-component");
      expect(meter).toBeDefined();

      const counter = meter!.createCounter("test_counter", {
        description: "Test counter for integration",
      });

      // Record some metrics
      counter.add(5, { environment: "test", version: "1.0" });
      counter.add(3, { environment: "test", version: "1.0" });

      // Wait for metrics to be exported (console exporter uses PeriodicExportingMetricReader with 10s interval)
      await flush();
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Check that metrics were logged
      const allMetricOutput = Object.values(capturedOutput).flat().flat();
      const metricObjects = allMetricOutput.filter(
        (item) =>
          typeof item === "object" &&
          item &&
          item.descriptor &&
          item.descriptor.name === "test_counter",
      );

      expect(metricObjects.length).toBeGreaterThan(0);
    }, 15000);

    test("should publish histogram metrics to console", async () => {
      initInstrumentation({
        serviceName: "integration-test-service",
        exporters: { metrics: "console" },
      });

      const meter = getMeter("test-component");
      expect(meter).toBeDefined();

      const histogram = meter!.createHistogram("test_histogram", {
        description: "Test histogram for integration",
      });

      // Record some measurements
      histogram.record(100, { method: "GET" });
      histogram.record(200, { method: "POST" });
      histogram.record(150, { method: "GET" });

      // Wait for export
      await flush();
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Check that histogram was logged
      const allHistogramOutput = Object.values(capturedOutput).flat().flat();
      const histogramObjects = allHistogramOutput.filter(
        (item) =>
          typeof item === "object" &&
          item &&
          item.descriptor &&
          item.descriptor.name === "test_histogram",
      );

      expect(histogramObjects.length).toBeGreaterThan(0);
    }, 15000);
  });

  describe("Logs Publishing", () => {
    test("should publish log records to console", async () => {
      initInstrumentation({
        serviceName: "integration-test-service",
        exporters: { logs: "console" },
      });

      const logger = getLogger("test-component");
      expect(logger).toBeDefined();

      logger!.emit({
        severityNumber: 9, // INFO
        severityText: "INFO",
        body: "Test log message",
        attributes: {
          "log.key": "log-value",
          component: "test-component",
        },
      });

      // Wait for processing
      await flush();
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Check that log was published
      const allLogOutput = Object.values(capturedOutput).flat().flat();
      const logStrings = allLogOutput.filter(
        (item) =>
          typeof item === "string" &&
          (item.includes("Test log message") || item.includes("log.key")),
      );
      const logObjects = allLogOutput.filter(
        (item) =>
          typeof item === "object" && item && item.body === "Test log message",
      );

      expect(logStrings.length + logObjects.length).toBeGreaterThan(0);
    }, 10000);

    test("should publish logs with different severity levels", async () => {
      initInstrumentation({
        serviceName: "integration-test-service",
        exporters: { logs: "console" },
      });

      const logger = getLogger("test-component");

      // Log different severity levels
      logger!.emit({
        severityNumber: 5, // DEBUG
        severityText: "DEBUG",
        body: "Debug message",
      });

      logger!.emit({
        severityNumber: 9, // INFO
        severityText: "INFO",
        body: "Info message",
      });

      logger!.emit({
        severityNumber: 13, // WARN
        severityText: "WARN",
        body: "Warning message",
      });

      logger!.emit({
        severityNumber: 17, // ERROR
        severityText: "ERROR",
        body: "Error message",
      });

      // Wait for processing
      await flush();
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Check that all log levels were published
      const allSeverityOutput = Object.values(capturedOutput).flat().flat();
      expect(
        allSeverityOutput.some(
          (item) =>
            (typeof item === "string" && item.includes("Debug message")) ||
            (typeof item === "object" && item && item.body === "Debug message"),
        ),
      ).toBe(true);
      expect(
        allSeverityOutput.some(
          (item) =>
            (typeof item === "string" && item.includes("Info message")) ||
            (typeof item === "object" && item && item.body === "Info message"),
        ),
      ).toBe(true);
      expect(
        allSeverityOutput.some(
          (item) =>
            (typeof item === "string" && item.includes("Warning message")) ||
            (typeof item === "object" &&
              item &&
              item.body === "Warning message"),
        ),
      ).toBe(true);
      expect(
        allSeverityOutput.some(
          (item) =>
            (typeof item === "string" && item.includes("Error message")) ||
            (typeof item === "object" && item && item.body === "Error message"),
        ),
      ).toBe(true);
    }, 10000);

    test("should publish logs with different severity levels using specific methods", async () => {
      initInstrumentation({
        serviceName: "integration-test-service",
        exporters: { logs: "console" },
      });

      const logger = getLogger("test-component");

      // Log different severity levels
      logger!.debug("Debug message", { component: "test-component" });

      logger!.info("Info message", { component: "test-component" });

      logger!.warn("Warning message", { component: "test-component" });

      logger!.error("Error message", { component: "test-component" });

      // Wait for processing
      await flush();
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Check that all log levels were published
      const allSeverityOutput = Object.values(capturedOutput).flat().flat();
      expect(
        allSeverityOutput.some(
          (item) =>
            (typeof item === "string" && item.includes("Debug message")) ||
            (typeof item === "object" && item && item.body === "Debug message"),
        ),
      ).toBe(true);
      expect(
        allSeverityOutput.some(
          (item) =>
            (typeof item === "string" && item.includes("Info message")) ||
            (typeof item === "object" && item && item.body === "Info message"),
        ),
      ).toBe(true);
      expect(
        allSeverityOutput.some(
          (item) =>
            (typeof item === "string" && item.includes("Warning message")) ||
            (typeof item === "object" &&
              item &&
              item.body === "Warning message"),
        ),
      ).toBe(true);
      expect(
        allSeverityOutput.some(
          (item) =>
            (typeof item === "string" && item.includes("Error message")) ||
            (typeof item === "object" && item && item.body === "Error message"),
        ),
      ).toBe(true);
    }, 10000);
  });

  describe("Combined Telemetry Publishing", () => {
    test("should publish traces, metrics, and logs simultaneously", async () => {
      initInstrumentation({
        serviceName: "integration-test-service",
        exporters: {
          traces: "console",
          metrics: "console",
          logs: "console",
        },
        instrumentations: [],
      });

      // Create a trace
      const tracer = getTracer("test-component");
      expect(tracer).toBeDefined();

      const span = tracer!.startSpan("combined-test-operation");
      span.setAttribute("test.type", "combined");
      span.end();

      // Create a metric
      const meter = getMeter("test-component");
      expect(meter).toBeDefined();

      const counter = meter!.createCounter("combined_test_counter");
      counter.add(1, { test: "combined" });

      // Create a log
      const logger = getLogger("test-component");
      expect(logger).toBeDefined();

      logger!.emit({
        severityNumber: 9,
        severityText: "INFO",
        body: "Combined test log",
        attributes: { test: "combined" },
      });

      // Wait for all processing
      await flush();
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Verify all telemetry types were published
      const allCombinedOutput = Object.values(capturedOutput).flat().flat();
      expect(
        allCombinedOutput.some(
          (item) =>
            (typeof item === "string" &&
              item.includes("combined-test-operation")) ||
            (typeof item === "object" &&
              item &&
              item.name === "combined-test-operation"),
        ),
      ).toBe(true);
      expect(
        allCombinedOutput.some(
          (item) =>
            typeof item === "object" &&
            item &&
            item.descriptor &&
            item.descriptor.name === "combined_test_counter",
        ),
      ).toBe(true);
      expect(
        allCombinedOutput.some(
          (item) =>
            (typeof item === "string" && item.includes("Combined test log")) ||
            (typeof item === "object" &&
              item &&
              item.body === "Combined test log"),
        ),
      ).toBe(true);
    }, 15000);
  });
});
