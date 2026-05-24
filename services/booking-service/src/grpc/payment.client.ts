import grpc from '@grpc/grpc-js';
import protoLoader from '@grpc/proto-loader';

import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { env } from '../config/env.js';

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

const PROTO_PATH = path.resolve(__dirname, './proto/payment.proto');

console.log(PROTO_PATH);

const packageDef = protoLoader.loadSync(PROTO_PATH);

const grpcObject = grpc.loadPackageDefinition(packageDef);

const paymentPackage = (grpcObject as any).payment;

export const paymentClient = new paymentPackage.PaymentService(
  env.PAYMENT_GRPC_HOST || 'localhost:50053',
  grpc.credentials.createInsecure(),
);
