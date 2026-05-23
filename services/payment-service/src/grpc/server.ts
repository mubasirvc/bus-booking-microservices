import grpc from '@grpc/grpc-js';
import protoLoader from '@grpc/proto-loader';

import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { paymentHandlers } from './handlers/payment.handler.js';

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

const PROTO_PATH = path.join(__dirname, './proto/payment.proto');

const packageDef = protoLoader.loadSync(PROTO_PATH);

const grpcObject = grpc.loadPackageDefinition(packageDef);

const paymentPackage = (grpcObject as any).payment;

const grpcServer = new grpc.Server();

grpcServer.addService(paymentPackage.PaymentService.service, paymentHandlers);

export default grpcServer;
