import {
 PAYMENT_SUCCESS_ROUTING_KEY,
 PAYMENT_FAILED_ROUTING_KEY,
 PAYMENT_EVENTS_EXCHANGE,
 type PaymentRsultPayload,
} from '@bus-booking/common';

import { connect, type Channel, type ChannelModel } from 'amqplib';
import { env } from '../config/env.js';
import { logger } from '../utils/logger.js';

let connectionRef: ChannelModel | null = null;
let channel: Channel | null = null;

export const initPublisher = async () => {
  if (!env.RABBITMQ_URL) {
    logger.warn('RABBITMQ_URL is not defined. Skipping RabbitMQ initialization.');
    return;
  }

  if (channel) {
    return;
  }

  const connection = await connect(env.RABBITMQ_URL);
  connectionRef = connection;
  channel = await connection.createChannel();
  await channel.assertExchange(PAYMENT_EVENTS_EXCHANGE, 'topic', { durable: true });

  connection.on('close', () => {
    logger.warn('RabbitMQ connection closed');
    channel = null;
    connectionRef = null;
  });
  connection.on('error', (err) => {
    logger.error({ err }, 'RabbitMQ connection error');
  });

  logger.info('Payment service RabbitMQ publisher initialized');
};

export const publishPaymentSuccess = (payload: PaymentRsultPayload) => {
    if (!channel) {
      logger.warn('RabbitMQ channel is not initialized. Cannot publish message.');
      return;
    }

  const event = {
    type: PAYMENT_SUCCESS_ROUTING_KEY,
    payload,
    occuredAt: new Date().toISOString(),
    metadata: { version: 1 },
  };

  channel.publish(
    PAYMENT_EVENTS_EXCHANGE,
    PAYMENT_SUCCESS_ROUTING_KEY,
    Buffer.from(JSON.stringify(event)),
    {
      contentType: 'application/json',
      persistent: true,
    },
  );
};

export const publishPaymentFailed = (payload: PaymentRsultPayload) => {
  if (!channel) {
    logger.warn('RabbitMQ channel is not initialized. Cannot publish message.');
    return;
  }

  const event = {
    type: PAYMENT_FAILED_ROUTING_KEY,
    payload,
    occuredAt: new Date().toISOString(),
    metadata: { version: 1 },
  };

  channel.publish(
    PAYMENT_EVENTS_EXCHANGE,
    PAYMENT_FAILED_ROUTING_KEY,
    Buffer.from(JSON.stringify(event)),
    {
      contentType: 'application/json',
      persistent: true,
    },
  );
};

export const closePublisher = async () => {
  try {
    const ch = channel;
    if (ch) {
      await ch.close();
      channel = null;
    }
    const conn = connectionRef;
    if (conn) {
      await conn.close();
      connectionRef = null;
    }
  } catch (error) {
    logger.error({ err: error }, 'Error closing RabbitMQ connection/channel');
  }
};
