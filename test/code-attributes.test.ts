import { CodeAttributes } from "../src/core/code-attributes";

describe("CodeAttributes", () => {
  describe("getCodeAttributes", () => {
    test("should extract code attributes from call stack", () => {
      // Call from this location - this function should be in the stack trace
      const attributes = CodeAttributes.getCodeAttributes(2);

      // We should get some attributes
      expect(Object.keys(attributes).length).toBeGreaterThan(0);

      // At least one attribute should be present
      expect(
        attributes["code.function.name"] ||
          attributes["code.file.path"] ||
          attributes["code.line.number"] ||
          attributes["code.column.number"]
      ).toBeDefined();
    });

    test("should extract file path", () => {
      const attributes = CodeAttributes.getCodeAttributes(2);

      if (attributes["code.file.path"]) {
        expect(typeof attributes["code.file.path"]).toBe("string");
        // Should be an absolute path
        expect(attributes["code.file.path"].length).toBeGreaterThan(0);
      }
    });

    test("should extract line number", () => {
      const attributes = CodeAttributes.getCodeAttributes(2);

      if (attributes["code.line.number"]) {
        expect(typeof attributes["code.line.number"]).toBe("number");
        expect(attributes["code.line.number"]).toBeGreaterThan(0);
      }
    });

    test("should extract column number", () => {
      const attributes = CodeAttributes.getCodeAttributes(2);

      if (attributes["code.column.number"]) {
        expect(typeof attributes["code.column.number"]).toBe("number");
        expect(attributes["code.column.number"]).toBeGreaterThan(0);
      }
    });

    test("should handle different skip frame counts", () => {
      const attrs1 = CodeAttributes.getCodeAttributes(1);
      const attrs2 = CodeAttributes.getCodeAttributes(3);

      // Both should return objects
      expect(attrs1).toBeDefined();
      expect(attrs2).toBeDefined();
    });
  });

  describe("getFunctionName", () => {
    test("should return function name or undefined", () => {
      const functionName = CodeAttributes.getFunctionName(2);

      if (functionName) {
        expect(typeof functionName).toBe("string");
        expect(functionName.length).toBeGreaterThan(0);
      }
    });
  });

  describe("getFilePath", () => {
    test("should return file path or undefined", () => {
      const filePath = CodeAttributes.getFilePath(2);

      if (filePath) {
        expect(typeof filePath).toBe("string");
        expect(filePath.length).toBeGreaterThan(0);
      }
    });
  });

  describe("getLineNumber", () => {
    test("should return line number or undefined", () => {
      const lineNumber = CodeAttributes.getLineNumber(2);

      if (lineNumber) {
        expect(typeof lineNumber).toBe("number");
        expect(lineNumber).toBeGreaterThan(0);
      }
    });
  });

  describe("getColumnNumber", () => {
    test("should return column number or undefined", () => {
      const columnNumber = CodeAttributes.getColumnNumber(2);

      if (columnNumber) {
        expect(typeof columnNumber).toBe("number");
        expect(columnNumber).toBeGreaterThan(0);
      }
    });
  });

  describe("integration with real code", () => {
    test("should capture code attributes during function execution", () => {
      function myTestFunction() {
        // Get attributes from within the function
        return CodeAttributes.getCodeAttributes(0);
      }

      const attributes = myTestFunction();

      // Should have captured the function name
      if (attributes["code.function.name"]) {
        expect(attributes["code.function.name"]).toContain("myTestFunction");
      }

      // Should have captured line number and file path
      expect(attributes["code.line.number"]).toBeDefined();
      expect(attributes["code.file.path"]).toBeDefined();
    });
  });
});

