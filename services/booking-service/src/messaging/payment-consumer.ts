import {
PAYMENT_EVENTS_EXCHANGE,
PAYMENT_SUCCESS_ROUTING_KEY,
PAYMENT_FAILED_ROUTING_KEY,
} from '@bus-booking/common';

import {
  connect,
  type Channel,
  type ChannelModel,
  type Connection,
  type ConsumeMessage,
  type Replies,
} from 'amqplib';

import { logger } from '../utils/logger.js';
import { env } from '../config/env.js';
import { bookingService } from '../service/booking.service.js';

type ManageConnection = Connection & ChannelModel;

let connectionRef: ManageConnection | null = null;
let channel: Channel | null = null;
let consumerTag: string | null = null;

const QUEUE_NAME = 'booking-service.payment-events';

const closeConnection = async (conn: ManageConnection) => {
  await conn.close();

  connectionRef = null;
  channel = null;
  consumerTag = null;
};

const handleMessage = async (message: ConsumeMessage, ch: Channel) => {
  const raw = message.content.toString('utf-8');

  const event = JSON.parse(raw);

  switch (event.type) {
    case PAYMENT_SUCCESS_ROUTING_KEY:
      await bookingService.handlePaymentSuccess(event.payload);
      break;

    case PAYMENT_FAILED_ROUTING_KEY:
      await bookingService.handlePaymentFailed(event.payload);
      break;
  }

  ch.ack(message);
};

export const startPaymentEventConsumer = async () => {
  if (!env.RABBITMQ_URL) {
    logger.warn('RabbitMQ URL is not configured');
    return;
  }

  if (channel) {
    return;
  }

  const connection = (await connect(env.RABBITMQ_URL)) as ManageConnection;
  connectionRef = connection;
  const ch = await connection.createChannel();
  channel = ch;

  await ch.assertExchange(PAYMENT_EVENTS_EXCHANGE, 'topic', { durable: true });
  const queue = await ch.assertQueue(QUEUE_NAME, { durable: true });

  await ch.bindQueue(queue.queue, PAYMENT_EVENTS_EXCHANGE, PAYMENT_FAILED_ROUTING_KEY);
  await ch.bindQueue(queue.queue, PAYMENT_EVENTS_EXCHANGE, PAYMENT_SUCCESS_ROUTING_KEY);

  const consumeHandler = (msg: ConsumeMessage | null) => {
    if (!msg) {
      return;
    }

    void handleMessage(msg, ch).catch((error: unknown) => {
      logger.error({ err: error }, 'Failed to process booking event');

      ch.nack(msg, false, false);
    });
  };

  const result: Replies.Consume = await ch.consume(queue.queue, consumeHandler);

  consumerTag = result.consumerTag;

  connection.on('close', () => {
    logger.warn('Booking consumer connection closed');

    connectionRef = null;
    channel = null;
    consumerTag = null;
  });

  connection.on('error', (error) => {
    logger.error({ err: error }, 'Booking consumer connection error');
  });

  logger.info('Booking event consumer started');
};

export const stopPaymentEventConsumer = async () => {
  try {
    const ch = channel;
    if (ch && consumerTag) {
      await ch.cancel(consumerTag);
      consumerTag = null;
    }
    if (ch) {
      await ch.close();
      channel = null;
    }
    const conn = connectionRef;
    if (conn) {
      await closeConnection(conn);
    }
  } catch (error) {
    logger.error({ err: error }, 'Failed to stop booking event consumer');
  }
};
