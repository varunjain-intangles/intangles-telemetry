"use strict";
/**
 * CodeAttributes utility class for extracting code location information
 * from the call stack during tracing. Implements OpenTelemetry semantic
 * conventions for code attributes.
 *
 * Reference: https://opentelemetry.io/docs/specs/semconv/code/
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeAttributes = void 0;
class CodeAttributes {
    /**
     * Extract code attributes from the call stack.
     * Skips a specified number of frames to account for the instrumentation layer.
     *
     * @param skipFrames - Number of stack frames to skip (default: 3)
     *                    Accounts for: getCodeAttributes -> decorator -> actual code
     * @returns Object containing code location attributes following OpenTelemetry conventions
     *
     * @example
     * ```typescript
     * const codeAttrs = CodeAttributes.getCodeAttributes();
     * span.setAttribute('code.function.name', codeAttrs['code.function.name']);
     * ```
     */
    static getCodeAttributes(skipFrames = 3) {
        try {
            // Get the current stack trace
            const stack = new Error().stack || "";
            const lines = stack.split("\n");
            // Skip Error line and internal frames
            // Frame format: "at functionName (path/to/file.ts:line:column)"
            const targetLine = lines[skipFrames + 1]; // +1 for Error line
            if (!targetLine) {
                return {};
            }
            return this.parseStackLine(targetLine);
        }
        catch (error) {
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
    static parseStackLine(line) {
        const attributes = {};
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
        }
        else {
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
    static getFunctionName(skipFrames = 3) {
        return this.getCodeAttributes(skipFrames)["code.function.name"];
    }
    /**
     * Get only the file path from code attributes.
     *
     * @param skipFrames - Number of stack frames to skip
     * @returns File path or undefined
     */
    static getFilePath(skipFrames = 3) {
        return this.getCodeAttributes(skipFrames)["code.file.path"];
    }
    /**
     * Get only the line number from code attributes.
     *
     * @param skipFrames - Number of stack frames to skip
     * @returns Line number or undefined
     */
    static getLineNumber(skipFrames = 3) {
        return this.getCodeAttributes(skipFrames)["code.line.number"];
    }
    /**
     * Get only the column number from code attributes.
     *
     * @param skipFrames - Number of stack frames to skip
     * @returns Column number or undefined
     */
    static getColumnNumber(skipFrames = 3) {
        return this.getCodeAttributes(skipFrames)["code.column.number"];
    }
}
exports.CodeAttributes = CodeAttributes;
//# sourceMappingURL=code-attributes.js.map