/**
 * CodeAttributes utility class for extracting code location information
 * from the call stack during tracing. Implements OpenTelemetry semantic
 * conventions for code attributes.
 *
 * Reference: https://opentelemetry.io/docs/specs/semconv/code/
 */

export interface CodeAttributesData {
  "code.column.number"?: number;
  "code.file.path"?: string;
  "code.function.name"?: string;
  "code.line.number"?: number;
}

export class CodeAttributes {
  /**
   * Extract code attributes from the call stack.
   * Skips a specified number of frames to account for the instrumentation layer.
   *
   * Uses V8's stack trace API via Error.captureStackTrace() without creating
   * an actual Error object.
   *
   * @param skipFrames - Number of stack frames to skip (default: 2)
   *                    Accounts for: getCodeAttributes -> decorator -> actual code
   * @returns Object containing code location attributes following OpenTelemetry conventions
   *
   * @example
   * ```typescript
   * const codeAttrs = CodeAttributes.getCodeAttributes();
   * span.setAttribute('code.function.name', codeAttrs['code.function.name']);
   * ```
   */
  static getCodeAttributes(skipFrames: number = 2): CodeAttributesData {
    try {
      // Use V8's stack trace API without creating an Error object
      const obj = {};
      Error.captureStackTrace(obj, this.getCodeAttributes);
      const detectorRegex = /^\s*at\s+(?:(.+?)\s+)?\(?([^)]+)\)?$/;

      const stack = (obj as any).stack
        .split("\n")
        .map((x: string) => x.trim())
        .filter((x: string) => x.startsWith("at"))
        .map((x: string) => x.match(detectorRegex)) as RegExpMatchArray[];
      // .filter((x: RegExpMatchArray | null) => !!x) as RegExpMatchArray[];

      const detections: CodeAttributesData[] = stack.map(
        (x: RegExpMatchArray) => {
          const identifier = x[1];
          const pathlinecol = x[2].split(":");
          const column =
            pathlinecol.length > 2 ? parseInt(pathlinecol.pop() ?? "0") : 0;
          const line =
            pathlinecol.length > 1 ? parseInt(pathlinecol.pop() ?? "0") : 0;
          const p = pathlinecol.join(":");
          return {
            "code.column.number": column,
            "code.function.name": identifier,
            "code.file.path": p,
            "code.line.number": line,
          };
        },
      );
      return detections[skipFrames] || {};
    } catch (error) {
      // If anything goes wrong, return empty object
      return {};
    }
  }

  /**
   * Parse a single line from the stack trace to extract code attributes.
   * Handles various stack trace formats.
   *
   * @param line - A single line from the stack trace
   * @returns Parsed code attributes
   */
  private static parseStackLine(line: string): CodeAttributesData {
    const attributes: CodeAttributesData = {};

    // Extract function name (comes after "at ")
    const functionMatch = line.match(/at\s+(.+?)\s+\(/);
    if (functionMatch) {
      const functionName = functionMatch[1].trim();
      // Handle class methods (e.g., "ClassName.methodName")
      attributes["code.function.name"] = functionName;
    }

    // Extract file path and location (line:column)
    // Match pattern: (path/to/file.ts:123:45)
    const locationMatch = line.match(/\(([^:]+):(\d+):(\d+)\)/);
    if (locationMatch) {
      attributes["code.file.path"] = locationMatch[1];
      attributes["code.line.number"] = parseInt(locationMatch[2], 10);
      attributes["code.column.number"] = parseInt(locationMatch[3], 10);
    } else {
      // Fallback: try to match just the file path
      const fileMatch = line.match(/\(([^:)]+)\)/);
      if (fileMatch) {
        attributes["code.file.path"] = fileMatch[1];
      }
    }

    return attributes;
  }

  /**
   * Get only the function name from code attributes.
   *
   * @param skipFrames - Number of stack frames to skip
   * @returns Function name or undefined
   */
  static getFunctionName(skipFrames: number = 3): string | undefined {
    return this.getCodeAttributes(skipFrames)["code.function.name"];
  }

  /**
   * Get only the file path from code attributes.
   *
   * @param skipFrames - Number of stack frames to skip
   * @returns File path or undefined
   */
  static getFilePath(skipFrames: number = 3): string | undefined {
    return this.getCodeAttributes(skipFrames)["code.file.path"];
  }

  /**
   * Get only the line number from code attributes.
   *
   * @param skipFrames - Number of stack frames to skip
   * @returns Line number or undefined
   */
  static getLineNumber(skipFrames: number = 3): number | undefined {
    return this.getCodeAttributes(skipFrames)["code.line.number"];
  }

  /**
   * Get only the column number from code attributes.
   *
   * @param skipFrames - Number of stack frames to skip
   * @returns Column number or undefined
   */
  static getColumnNumber(skipFrames: number = 3): number | undefined {
    return this.getCodeAttributes(skipFrames)["code.column.number"];
  }
}
