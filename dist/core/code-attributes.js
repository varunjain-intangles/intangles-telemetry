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
    static getCodeAttributes(skipFrames = 2) {
        try {
            // Use V8's stack trace API without creating an Error object
            const obj = {};
            Error.captureStackTrace(obj, this.getCodeAttributes);
            const detectorRegex = /^\s*at\s+(?:(.+?)\s+)?\(?([^)]+)\)?$/;
            const stack = obj.stack
                .split("\n")
                .map((x) => x.trim())
                .filter((x) => x.startsWith("at"))
                .map((x) => x.match(detectorRegex));
            // .filter((x: RegExpMatchArray | null) => !!x) as RegExpMatchArray[];
            const detections = stack.map((x) => {
                const identifier = x[1];
                const pathlinecol = x[2].split(":");
                const column = pathlinecol.length > 2 ? parseInt(pathlinecol.pop() ?? "0") : 0;
                const line = pathlinecol.length > 1 ? parseInt(pathlinecol.pop() ?? "0") : 0;
                const p = pathlinecol.join(":");
                return {
                    "code.column.number": column,
                    "code.function.name": identifier,
                    "code.file.path": p,
                    "code.line.number": line,
                };
            });
            return detections[skipFrames] || {};
        }
        catch (error) {
            // If anything goes wrong, return empty object
            return {};
        }
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