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
export const INSTRUMENTATION_AMQPLIB = "@opentelemetry/instrumentation-amqplib";
export const INSTRUMENTATION_AWS_LAMBDA =
  "@opentelemetry/instrumentation-aws-lambda";
export const INSTRUMENTATION_AWS_SDK = "@opentelemetry/instrumentation-aws-sdk";
export const INSTRUMENTATION_BUNYAN = "@opentelemetry/instrumentation-bunyan";
export const INSTRUMENTATION_CASSANDRA_DRIVER =
  "@opentelemetry/instrumentation-cassandra-driver";
export const INSTRUMENTATION_CONNECT =
  "@opentelemetry/instrumentation-connect";
export const INSTRUMENTATION_CUCUMBER =
  "@opentelemetry/instrumentation-cucumber";
export const INSTRUMENTATION_DATALOADER =
  "@opentelemetry/instrumentation-dataloader";
export const INSTRUMENTATION_DNS = "@opentelemetry/instrumentation-dns";
export const INSTRUMENTATION_EXPRESS =
  "@opentelemetry/instrumentation-express";
export const INSTRUMENTATION_FS = "@opentelemetry/instrumentation-fs";
export const INSTRUMENTATION_GENERIC_POOL =
  "@opentelemetry/instrumentation-generic-pool";
export const INSTRUMENTATION_GRAPHQL =
  "@opentelemetry/instrumentation-graphql";
export const INSTRUMENTATION_GRPC = "@opentelemetry/instrumentation-grpc";
export const INSTRUMENTATION_HAPI = "@opentelemetry/instrumentation-hapi";
export const INSTRUMENTATION_HTTP = "@opentelemetry/instrumentation-http";
export const INSTRUMENTATION_IOREDIS =
  "@opentelemetry/instrumentation-ioredis";
export const INSTRUMENTATION_KAFKAJS =
  "@opentelemetry/instrumentation-kafkajs";
export const INSTRUMENTATION_KNEX = "@opentelemetry/instrumentation-knex";
export const INSTRUMENTATION_KOA = "@opentelemetry/instrumentation-koa";
export const INSTRUMENTATION_LRU_MEMOIZER =
  "@opentelemetry/instrumentation-lru-memoizer";
export const INSTRUMENTATION_MEMCACHED =
  "@opentelemetry/instrumentation-memcached";
export const INSTRUMENTATION_MONGODB =
  "@opentelemetry/instrumentation-mongodb";
export const INSTRUMENTATION_MONGOOSE =
  "@opentelemetry/instrumentation-mongoose";
export const INSTRUMENTATION_MYSQL = "@opentelemetry/instrumentation-mysql";
export const INSTRUMENTATION_MYSQL2 =
  "@opentelemetry/instrumentation-mysql2";
export const INSTRUMENTATION_NESTJS_CORE =
  "@opentelemetry/instrumentation-nestjs-core";
export const INSTRUMENTATION_NET = "@opentelemetry/instrumentation-net";
export const INSTRUMENTATION_OPENAI =
  "@opentelemetry/instrumentation-openai";
export const INSTRUMENTATION_ORACLEDB =
  "@opentelemetry/instrumentation-oracledb";
export const INSTRUMENTATION_PG = "@opentelemetry/instrumentation-pg";
export const INSTRUMENTATION_PINO = "@opentelemetry/instrumentation-pino";
export const INSTRUMENTATION_REDIS = "@opentelemetry/instrumentation-redis";
export const INSTRUMENTATION_RESTIFY =
  "@opentelemetry/instrumentation-restify";
export const INSTRUMENTATION_RUNTIME_NODE =
  "@opentelemetry/instrumentation-runtime-node";
export const INSTRUMENTATION_SOCKET_IO =
  "@opentelemetry/instrumentation-socket.io";
export const INSTRUMENTATION_UNDICI =
  "@opentelemetry/instrumentation-undici";
export const INSTRUMENTATION_WINSTON =
  "@opentelemetry/instrumentation-winston";

export type SupportedInstrumentation =
  | typeof INSTRUMENTATION_AMQPLIB
  | typeof INSTRUMENTATION_AWS_LAMBDA
  | typeof INSTRUMENTATION_AWS_SDK
  | typeof INSTRUMENTATION_BUNYAN
  | typeof INSTRUMENTATION_CASSANDRA_DRIVER
  | typeof INSTRUMENTATION_CONNECT
  | typeof INSTRUMENTATION_CUCUMBER
  | typeof INSTRUMENTATION_DATALOADER
  | typeof INSTRUMENTATION_DNS
  | typeof INSTRUMENTATION_EXPRESS
  | typeof INSTRUMENTATION_FS
  | typeof INSTRUMENTATION_GENERIC_POOL
  | typeof INSTRUMENTATION_GRAPHQL
  | typeof INSTRUMENTATION_GRPC
  | typeof INSTRUMENTATION_HAPI
  | typeof INSTRUMENTATION_HTTP
  | typeof INSTRUMENTATION_IOREDIS
  | typeof INSTRUMENTATION_KAFKAJS
  | typeof INSTRUMENTATION_KNEX
  | typeof INSTRUMENTATION_KOA
  | typeof INSTRUMENTATION_LRU_MEMOIZER
  | typeof INSTRUMENTATION_MEMCACHED
  | typeof INSTRUMENTATION_MONGODB
  | typeof INSTRUMENTATION_MONGOOSE
  | typeof INSTRUMENTATION_MYSQL
  | typeof INSTRUMENTATION_MYSQL2
  | typeof INSTRUMENTATION_NESTJS_CORE
  | typeof INSTRUMENTATION_NET
  | typeof INSTRUMENTATION_OPENAI
  | typeof INSTRUMENTATION_ORACLEDB
  | typeof INSTRUMENTATION_PG
  | typeof INSTRUMENTATION_PINO
  | typeof INSTRUMENTATION_REDIS
  | typeof INSTRUMENTATION_RESTIFY
  | typeof INSTRUMENTATION_RUNTIME_NODE
  | typeof INSTRUMENTATION_SOCKET_IO
  | typeof INSTRUMENTATION_UNDICI
  | typeof INSTRUMENTATION_WINSTON;
