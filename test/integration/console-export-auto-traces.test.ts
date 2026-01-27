import {
  initInstrumentation,
  getTracer,
  getMeter,
  getLogger,
  flush,
} from "../../src/index";
import dotenv from "dotenv";

describe("Integration Tests - Console Traces Export", () => {
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
      const val = dotenv.config({
        path: "./test/integration/.test.traces.env",
      });
      // Initialize with console trace exporter
      initInstrumentation({
        serviceName: "integration-test-service",
        exporters: { traces: "console" },
        autoInstrument: true,
      });

      const tracer = getTracer("test-component");
      expect(tracer).toBeDefined();

      const span = tracer!.startSpan("test-operation");

      span.setAttribute("test.key", "test-value");
      span.addEvent("test-event", { eventKey: "eventValue" });

      // End the span
      span.end();

      // Wait for export
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
      const val = dotenv.config({
        path: "./test/integration/.test.traces.env",
      });

      initInstrumentation({
        serviceName: "integration-test-service",
        exporters: { traces: "console" },
        autoInstrument: true,
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

      // Wait for export
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
});
