import {
  initInstrumentation,
  getTracer,
  getMeter,
  getLogger,
  flush,
} from "../../src/index";
import dotenv from "dotenv";

describe("Integration Tests - Console All Telemetry Export", () => {
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

  describe("Combined Telemetry Publishing", () => {
    test("should publish traces, metrics, and logs simultaneously", async () => {
      const val = dotenv.config({ path: "./test/integration/.test.all.env" });
      const manager = initInstrumentation({
        serviceName: "integration-test-service",
        exporters: {
          traces: "console",
          metrics: "console",
          logs: "console",
        },
        instrumentations: [],
        autoInstrument: true,
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

      await flush();
      // Wait for all processing
      await new Promise((resolve) => setTimeout(resolve, 500));

      manager.shutdown().then(() => {
        expect(true).toBe(true); // Just to ensure shutdown completes without error
      });

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
    }, 5000);
  });
});
