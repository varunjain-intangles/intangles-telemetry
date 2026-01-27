import {
  initInstrumentation,
  getTracer,
  getMeter,
  getLogger,
  flush,
} from "../../src/index";
import dotenv from "dotenv";
import { MeterProvider } from "@opentelemetry/api";

describe("Integration Tests - Console Metrics Export", () => {
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

  describe("Metrics Publishing", () => {
    test("should publish counter metrics to console", async () => {
      const val = dotenv.config({
        path: "./test/integration/.test.metrics.env",
      });

      initInstrumentation({
        serviceName: "integration-test-service",
        exporters: { metrics: "console" },
        autoInstrument: true,
      });

      const meter = getMeter("test-component");
      expect(meter).toBeDefined();

      const counter = meter!.createCounter("test_counter", {
        description: "Test counter for integration",
      });

      // Record some metrics
      counter.add(5, { environment: "test", version: "1.0" });
      counter.add(3, { environment: "test", version: "1.0" });

      await flush();
      // Wait for metrics to be exported (console exporter uses PeriodicExportingMetricReader with 10s interval)
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
    }, 5000);

    test("should publish histogram metrics to console", async () => {
      const val = dotenv.config({
        path: "./test/integration/.test.metrics.env",
      });

      initInstrumentation({
        serviceName: "integration-test-service",
        exporters: { metrics: "console" },
        autoInstrument: true,
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

      await flush();
      // Wait for export
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
    }, 5000);
  });
});
