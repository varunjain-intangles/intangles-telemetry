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
export declare class CodeAttributes {
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
    static getCodeAttributes(skipFrames?: number): CodeAttributesData;
    /**
     * Get only the function name from code attributes.
     *
     * @param skipFrames - Number of stack frames to skip
     * @returns Function name or undefined
     */
    static getFunctionName(skipFrames?: number): string | undefined;
    /**
     * Get only the file path from code attributes.
     *
     * @param skipFrames - Number of stack frames to skip
     * @returns File path or undefined
     */
    static getFilePath(skipFrames?: number): string | undefined;
    /**
     * Get only the line number from code attributes.
     *
     * @param skipFrames - Number of stack frames to skip
     * @returns Line number or undefined
     */
    static getLineNumber(skipFrames?: number): number | undefined;
    /**
     * Get only the column number from code attributes.
     *
     * @param skipFrames - Number of stack frames to skip
     * @returns Column number or undefined
     */
    static getColumnNumber(skipFrames?: number): number | undefined;
}
//# sourceMappingURL=code-attributes.d.ts.map