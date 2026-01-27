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
  instrumentations?: SupportedInstrumentation[];
}

// Supported OpenTelemetry instrumentations for Node.js
export const INSTRUMENTATION_HTTP = "@opentelemetry/instrumentation-http";
export const INSTRUMENTATION_EXPRESS = "@opentelemetry/instrumentation-express";
export const INSTRUMENTATION_FS = "@opentelemetry/instrumentation-fs";
export const INSTRUMENTATION_MONGODB = "@opentelemetry/instrumentation-mongodb";
export const INSTRUMENTATION_MYSQL = "@opentelemetry/instrumentation-mysql";
export const INSTRUMENTATION_PG = "@opentelemetry/instrumentation-pg";
export const INSTRUMENTATION_REDIS = "@opentelemetry/instrumentation-redis";
export const INSTRUMENTATION_IOREDIS = "@opentelemetry/instrumentation-ioredis";
export const INSTRUMENTATION_GRPC = "@opentelemetry/instrumentation-grpc";
export const INSTRUMENTATION_NET = "@opentelemetry/instrumentation-net";
export const INSTRUMENTATION_DNS = "@opentelemetry/instrumentation-dns";
export const INSTRUMENTATION_AWS_SDK = "@opentelemetry/instrumentation-aws-sdk";
export const INSTRUMENTATION_BUNYAN = "@opentelemetry/instrumentation-bunyan";
export const INSTRUMENTATION_WINSTON = "@opentelemetry/instrumentation-winston";
export const INSTRUMENTATION_PINO = "@opentelemetry/instrumentation-pino";
export const INSTRUMENTATION_GRAPHQL = "@opentelemetry/instrumentation-graphql";
export const INSTRUMENTATION_KNEX = "@opentelemetry/instrumentation-knex";
export const INSTRUMENTATION_KOA = "@opentelemetry/instrumentation-koa";
export const INSTRUMENTATION_NESTJS_CORE =
  "@opentelemetry/instrumentation-nestjs-core";
export const INSTRUMENTATION_SOCKET_IO =
  "@opentelemetry/instrumentation-socket.io";

export type SupportedInstrumentation =
  | typeof INSTRUMENTATION_HTTP
  | typeof INSTRUMENTATION_EXPRESS
  | typeof INSTRUMENTATION_FS
  | typeof INSTRUMENTATION_MONGODB
  | typeof INSTRUMENTATION_MYSQL
  | typeof INSTRUMENTATION_PG
  | typeof INSTRUMENTATION_REDIS
  | typeof INSTRUMENTATION_IOREDIS
  | typeof INSTRUMENTATION_GRPC
  | typeof INSTRUMENTATION_NET
  | typeof INSTRUMENTATION_DNS
  | typeof INSTRUMENTATION_AWS_SDK
  | typeof INSTRUMENTATION_BUNYAN
  | typeof INSTRUMENTATION_WINSTON
  | typeof INSTRUMENTATION_PINO
  | typeof INSTRUMENTATION_GRAPHQL
  | typeof INSTRUMENTATION_KNEX
  | typeof INSTRUMENTATION_KOA
  | typeof INSTRUMENTATION_NESTJS_CORE
  | typeof INSTRUMENTATION_SOCKET_IO;
