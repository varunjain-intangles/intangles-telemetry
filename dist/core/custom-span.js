"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomTracer = exports.CustomSpan = void 0;
class CustomSpan {
    constructor(otelSpan) {
        this.otelSpan = otelSpan;
    }
    setAttribute(key, value) {
        this.otelSpan.setAttribute(key, value);
    }
    addEvent(name, attributes) {
        this.otelSpan.addEvent(name, attributes);
    }
    setStatus(status) {
        this.otelSpan.setStatus(status);
    }
    end(endTime) {
        this.otelSpan.end(endTime);
    }
    recordException(exception) {
        this.otelSpan.recordException(exception);
    }
}
exports.CustomSpan = CustomSpan;
class CustomTracer {
    constructor(otelTracer) {
        this.otelTracer = otelTracer;
    }
    startSpan(name, options) {
        const otelOptions = {
            ...options,
            kind: options?.kind,
            attributes: options?.attributes,
            links: options?.links,
            startTime: options?.startTime,
        };
        const otelSpan = this.otelTracer.startSpan(name, otelOptions);
        return new CustomSpan(otelSpan);
    }
    startActiveSpan(name, fn, options) {
        const otelOptions = {
            ...options,
            kind: options?.kind,
            attributes: options?.attributes,
            links: options?.links,
            startTime: options?.startTime,
        };
        return this.otelTracer.startActiveSpan(name, (otelSpan) => {
            const customSpan = new CustomSpan(otelSpan);
            return fn(customSpan);
        }, otelOptions);
    }
}
exports.CustomTracer = CustomTracer;
//# sourceMappingURL=custom-span.js.map