import grpc from '@grpc/grpc-js';
import protoLoader from '@grpc/proto-loader';

import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { bookingHandlers } from './handlers/booking.handler.js';

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

const PROTO_PATH = path.join(__dirname, './proto/booking.proto');

const packageDef = protoLoader.loadSync(PROTO_PATH);

const grpcObject = grpc.loadPackageDefinition(packageDef);

const bookingPackage = (grpcObject as any).booking;

const grpcServer = new grpc.Server();

grpcServer.addService(bookingPackage.BookingService.service, bookingHandlers);

export default grpcServer;
