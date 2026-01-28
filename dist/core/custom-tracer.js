"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomTracer = exports.CustomSpan = void 0;
class CustomSpan {
    constructor(otelSpan) {
        this._otelSpan = otelSpan;
    }
    // Getter to access the underlying OTEL span for parent relationships
    get otelSpan() {
        return this._otelSpan;
    }
    setAttribute(key, value) {
        this._otelSpan.setAttribute(key, value);
    }
    addEvent(name, attributes) {
        this._otelSpan.addEvent(name, attributes);
    }
    setStatus(status) {
        this._otelSpan.setStatus(status);
    }
    end(endTime) {
        this._otelSpan.end(endTime);
    }
    recordException(exception, attributes) {
        if (attributes) {
            this._otelSpan.recordException(exception);
            Object.entries(attributes).forEach(([key, value]) => {
                this._otelSpan.setAttribute(key, value);
            });
        }
        else {
            this._otelSpan.recordException(exception);
        }
    }
}
exports.CustomSpan = CustomSpan;
class CustomTracer {
    constructor(otelTracer) {
        this.otelTracer = otelTracer;
    }
    startSpan(name, options) {
        const otelOptions = {
            kind: options?.kind,
            attributes: options?.attributes,
            links: options?.links,
            startTime: options?.startTime,
        };
        // Handle parent span
        if (options?.parent) {
            if (options.parent instanceof CustomSpan) {
                // If it's a CustomSpan, get the underlying OTEL span
                otelOptions.parent = options.parent.otelSpan;
            }
            else {
                // Otherwise, assume it's already a context or span
                otelOptions.parent = options.parent;
            }
        }
        const otelSpan = this.otelTracer.startSpan(name, otelOptions);
        return new CustomSpan(otelSpan);
    }
    startActiveSpan(name, fn, options) {
        const otelOptions = {};
        if (options) {
            if (options.kind !== undefined)
                otelOptions.kind = options.kind;
            if (options.attributes !== undefined)
                otelOptions.attributes = options.attributes;
            if (options.links !== undefined)
                otelOptions.links = options.links;
            if (options.startTime !== undefined)
                otelOptions.startTime = options.startTime;
        }
        // Handle parent span
        if (options?.parent) {
            if (options.parent instanceof CustomSpan) {
                otelOptions.parent = options.parent.otelSpan;
            }
            else {
                otelOptions.parent = options.parent;
            }
        }
        // Create wrapper function
        const otelFn = (otelSpan) => {
            const customSpan = new CustomSpan(otelSpan);
            return fn(customSpan);
        };
        // Call startActiveSpan - parameter order: name, options, fn
        return this.otelTracer.startActiveSpan(name, otelOptions, otelFn);
    }
}
exports.CustomTracer = CustomTracer;
//# sourceMappingURL=custom-tracer.js.map