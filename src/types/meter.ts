export interface MetricOptions {
  description?: string;
  unit?: string;
}

export interface Counter {
  add(
    value: number,
    attributes?: Record<string, string | number | boolean>,
  ): void;
}

export interface Histogram {
  record(
    value: number,
    attributes?: Record<string, string | number | boolean>,
  ): void;
}

export interface UpDownCounter {
  add(
    value: number,
    attributes?: Record<string, string | number | boolean>,
  ): void;
}

export interface ObservableCounter {
  // Observable instruments are more complex, simplified for now
}

export interface ObservableGauge {
  // Observable instruments are more complex, simplified for now
}

export interface ObservableUpDownCounter {
  // Observable instruments are more complex, simplified for now
}

export interface Meter {
  createCounter(name: string, options?: MetricOptions): Counter;
  createHistogram(name: string, options?: MetricOptions): Histogram;
  createUpDownCounter(name: string, options?: MetricOptions): UpDownCounter;
  createObservableCounter(
    name: string,
    options?: MetricOptions,
  ): ObservableCounter;
  createObservableGauge(name: string, options?: MetricOptions): ObservableGauge;
  createObservableUpDownCounter(
    name: string,
    options?: MetricOptions,
  ): ObservableUpDownCounter;
}
