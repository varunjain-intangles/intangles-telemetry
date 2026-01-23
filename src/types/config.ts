export interface InstrumentationConfig {
  serviceName: string;
  serviceVersion?: string;
  exporters?: {
    traces?: "otlp" | "console";
    logs?: "otlp" | "console";
    metrics?: "otlp" | "console";
  };
  endpoints?: Record<string, string>;
  autoInstrument?: boolean;
  instrumentations?: any[];
}
