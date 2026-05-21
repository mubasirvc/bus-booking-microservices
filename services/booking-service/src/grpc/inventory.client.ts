import grpc from '@grpc/grpc-js';
import protoLoader from '@grpc/proto-loader';

import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

const PROTO_PATH = path.resolve(__dirname, './inventory.proto');

console.log(PROTO_PATH);

const packageDef = protoLoader.loadSync(PROTO_PATH);

const grpcObject = grpc.loadPackageDefinition(packageDef);

const inventoryPackage = (grpcObject as any).inventory;

export const inventoryClient = new inventoryPackage.InventoryService(
  'localhost:50051',
  grpc.credentials.createInsecure(),
);
