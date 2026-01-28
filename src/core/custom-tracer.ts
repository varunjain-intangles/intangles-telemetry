import {
  Tracer as OTelTracer,
  Span as OTelSpan,
  SpanOptions as OTelSpanOptions,
  context,
  Context,
} from "@opentelemetry/api";
import { Tracer, Span, SpanOptions } from "../types/tracer";

export class CustomSpan implements Span {
  private _otelSpan: OTelSpan;

  constructor(otelSpan: OTelSpan) {
    this._otelSpan = otelSpan;
  }

  // Getter to access the underlying OTEL span for parent relationships
  get otelSpan(): OTelSpan {
    return this._otelSpan;
  }

  setAttribute(key: string, value: string | number | boolean): void {
    this._otelSpan.setAttribute(key, value);
  }

  addEvent(
    name: string,
    attributes?: Record<string, string | number | boolean>,
  ): void {
    this._otelSpan.addEvent(name, attributes);
  }

  setStatus(status: { code: number; message?: string }): void {
    this._otelSpan.setStatus(status);
  }

  end(endTime?: number): void {
    this._otelSpan.end(endTime);
  }

  recordException(
    exception: Error,
    attributes?: Record<string, string | number | boolean>,
  ): void {
    if (attributes) {
      this._otelSpan.recordException(exception);
      Object.entries(attributes).forEach(([key, value]) => {
        this._otelSpan.setAttribute(key, value);
      });
    } else {
      this._otelSpan.recordException(exception);
    }
  }
}

export class CustomTracer implements Tracer {
  private otelTracer: OTelTracer;

  constructor(otelTracer: OTelTracer) {
    this.otelTracer = otelTracer;
  }

  startSpan(name: string, options?: SpanOptions): Span {
    const otelOptions: any = {
      kind: options?.kind,
      attributes: options?.attributes,
      links: options?.links,
      startTime: options?.startTime,
    };

    // Handle parent span
    if (options?.parent) {
      if (options.parent instanceof CustomSpan) {
        // If it's a CustomSpan, get the underlying OTEL span
        otelOptions.parent = (options.parent as CustomSpan).otelSpan;
      } else {
        // Otherwise, assume it's already a context or span
        otelOptions.parent = options.parent;
      }
    }

    const otelSpan = this.otelTracer.startSpan(name, otelOptions);
    return new CustomSpan(otelSpan);
  }

  startActiveSpan<T>(
    name: string,
    fn: (span: Span) => T,
    options?: SpanOptions,
  ): T {
    const otelOptions: any = {};

    if (options) {
      if (options.kind !== undefined) otelOptions.kind = options.kind;
      if (options.attributes !== undefined)
        otelOptions.attributes = options.attributes;
      if (options.links !== undefined) otelOptions.links = options.links;
      if (options.startTime !== undefined)
        otelOptions.startTime = options.startTime;
    }

    // Handle parent span
    if (options?.parent) {
      if (options.parent instanceof CustomSpan) {
        otelOptions.parent = (options.parent as CustomSpan).otelSpan;
      } else {
        otelOptions.parent = options.parent;
      }
    }

    // Create wrapper function
    const otelFn = (otelSpan: OTelSpan): T => {
      const customSpan = new CustomSpan(otelSpan);
      return fn(customSpan);
    };

    // Call startActiveSpan - parameter order: name, options, fn
    return (this.otelTracer as any).startActiveSpan(
      name,
      otelOptions,
      otelFn,
    ) as T;
  }
}
