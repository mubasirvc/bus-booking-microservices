import grpc from '@grpc/grpc-js';
import protoLoader from '@grpc/proto-loader';

import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { inventoryHandlers } from './handlers/inventory.handler.js';

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

// const PROTO_PATH = path.join(__dirname, './proto/inventory.proto');
const PROTO_PATH = path.resolve(process.cwd(), 'packages/common/src/proto/inventory.proto');
const packageDef = protoLoader.loadSync(PROTO_PATH);

const grpcObject = grpc.loadPackageDefinition(packageDef);

const inventoryPackage = (grpcObject as any).inventory;

const grpcServer = new grpc.Server();

grpcServer.addService(inventoryPackage.InventoryService.service, inventoryHandlers);

export default grpcServer;
