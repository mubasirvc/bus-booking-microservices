import { Express } from 'express';

import swaggerUi from 'swagger-ui-express';

import {
  OpenApiGeneratorV3,
} from '@asteasolutions/zod-to-openapi';

import { registry } from './registry';


import './paths/user.docs';
import './paths/auth.docs';
import './paths/bus.docs';
import './paths/route.docs';
import './paths/trip.docs';
import './paths/booking.docs';
import './paths/payment.docs';


export function setupSwagger(app: Express) {

  const generator = new OpenApiGeneratorV3(
    registry.definitions
  );

  const document = generator.generateDocument({
    openapi: '3.0.0',

    info: {
      title: 'Bus Booking API',
      version: '1.0.0',
    },

    servers: [
      {
        url: 'http://localhost:4000',
      },
    ],
  });

  app.use(
    '/api-docs',
    swaggerUi.serve,
    swaggerUi.setup(document)
  );
}