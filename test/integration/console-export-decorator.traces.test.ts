import {
  initInstrumentation,
  getTracer,
  getMeter,
  getLogger,
  INSTRUMENTATION_HTTP,
  INSTRUMENTATION_EXPRESS,
  flush,
  SpanDecorator,
} from "../../src/index";

describe("Integration Tests - Console Traces Decorator Export", () => {
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

  class TestClass {
    @SpanDecorator("decorated-operation-async")
    async decoratedAsyncMethod() {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    @SpanDecorator("decorated-operation", {
      attributes: { component: "order-service" },
    })
    decoratedMethod() {
      new Promise((resolve) => setTimeout(resolve, 100)).finally(() => {
        // no-op
      });
    }
  }

  describe("Trace Publishing", () => {
    test("should publish spans to console", async () => {
      // Initialize with console trace exporter
      initInstrumentation({
        serviceName: "integration-test-service",
        exporters: { traces: "console" },
        autoInstrument: false,
        instrumentations: [INSTRUMENTATION_HTTP, INSTRUMENTATION_EXPRESS],
      });

      const testInstance = new TestClass();
      await testInstance.decoratedMethod();
      await testInstance.decoratedAsyncMethod();

      // Wait a bit for async processing
      await flush();
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Check that span was logged to console
      const allSpanOutput = Object.values(capturedOutput).flat().flat();
      const spanStrings = allSpanOutput.filter(
        (item) =>
          typeof item === "string" &&
          (item.includes("decorated-operation") || item.includes("component")),
      );
      const spanObjects = allSpanOutput.filter(
        (item) =>
          typeof item === "object" &&
          item &&
          (item.name === "decorated-operation" ||
            item.name === "decorated-operation-async"),
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

      const testInstance = new TestClass();
      await testInstance.decoratedAsyncMethod();

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
            typeof item === "object" &&
            item &&
            (item.name === "decorated-operation" ||
              item.name === "decorated-operation-async"),
        ),
      ).toBe(true);
    }, 10000);
  });
});
