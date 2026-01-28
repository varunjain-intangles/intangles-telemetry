import {
  initInstrumentation,
  getTracer,
  getMeter,
  getLogger,
  flush,
} from "../../src/index";
import dotenv from "dotenv";

describe("Integration Tests - Console Logs Export", () => {
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

  describe("Logs Publishing", () => {
    const val = dotenv.config({ path: "./test/integration/.test.logs.env" });

    test("should publish log records to console", async () => {
      initInstrumentation({
        serviceName: "integration-test-service",
        exporters: { logs: "console" },
        injectCodeAttributes: true,
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

      await flush();
      // Wait for processing
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
      const val = dotenv.config({ path: "./test/integration/.test.logs.env" });

      initInstrumentation({
        serviceName: "integration-test-service",
        exporters: { logs: "console" },
        autoInstrument: true,
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
      await flush();
      // Wait for processing
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
    }, 5000);

    test("should publish logs with different severity levels using specific methods", async () => {
      const val = dotenv.config({ path: "./test/integration/.test.logs.env" });

      initInstrumentation({
        serviceName: "integration-test-service",
        exporters: { logs: "console" },
        autoInstrument: true,
      });

      const logger = getLogger("test-component");

      // Log different severity levels
      logger!.debug("Debug message", { component: "test-component" });

      logger!.info("Info message", { component: "test-component" });

      logger!.warn("Warning message", { component: "test-component" });

      logger!.error("Error message", { component: "test-component" });

      await flush();
      // Wait for processing
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
    }, 5000);
  });
});
