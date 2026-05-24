import grpc from '@grpc/grpc-js';
import protoLoader from '@grpc/proto-loader';

import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { env } from '../config/env.js';

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

const PROTO_PATH = path.resolve(__dirname, './proto/booking.proto');

console.log(PROTO_PATH);

const packageDef = protoLoader.loadSync(PROTO_PATH);

const grpcObject = grpc.loadPackageDefinition(packageDef);

const bookingPackage = (grpcObject as any).booking;

export const bookingClient = new bookingPackage.BookingService(
  env.BOOKING_GRPC_HOST || 'localhost:50052',
  grpc.credentials.createInsecure(),
);