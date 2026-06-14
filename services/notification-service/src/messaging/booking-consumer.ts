import {
  BOOKING_CONFIRMED_ROUTING_KEY,
  BOOKING_CANCELLED_ROUTING_KEY,
  BOOKING_EVENTS_EXCHANGE,
} from '@bus-booking/common';

import {
  connect,
  type Channel,
  type ChannelModel,
  type Connection,
  type ConsumeMessage,
  type Replies,
} from 'amqplib';

import { env } from '../config/env.js';
import { logger } from '../utils/logger.js';
import { emailService } from '../services/email.service.js';

type ManagedConnection = Connection & ChannelModel;

let connectionRef: ManagedConnection | null = null;
let channel: Channel | null = null;
let consumerTag: string | null = null;

const QUEUE_NAME = 'notification-service.booking-events';

const handleMessage = async (message: ConsumeMessage, ch: Channel) => {
  const raw = message.content.toString('utf-8');
  const event = JSON.parse(raw);
  
  switch (event.type) {
    case BOOKING_CONFIRMED_ROUTING_KEY:
      await emailService.sendBookingConfirmation(event.payload);
      break;

    case BOOKING_CANCELLED_ROUTING_KEY:
      await emailService.sendBookingCancellation(event.payload);
      break;

    default:
      logger.warn({ type: event.type }, 'Unknown booking event');
  }

  ch.ack(message);
};

export const startBookingEventConsumer = async () => {
  if (!env.RABBITMQ_URL) {
    logger.warn('RabbitMQ URL is not configured');
    return;
  }

  if (channel) {
    return;
  }

  const connection = (await connect(env.RABBITMQ_URL)) as ManagedConnection;

  connectionRef = connection;

  const ch = await connection.createChannel();
  channel = ch;

  await ch.assertExchange(BOOKING_EVENTS_EXCHANGE, 'topic', { durable: true });
  const queue = await ch.assertQueue(QUEUE_NAME, { durable: true });
  await ch.bindQueue(queue.queue, BOOKING_EVENTS_EXCHANGE, BOOKING_CONFIRMED_ROUTING_KEY);
  await ch.bindQueue(queue.queue, BOOKING_EVENTS_EXCHANGE, BOOKING_CANCELLED_ROUTING_KEY);

  const consumeHandler = (msg: ConsumeMessage | null) => {
    if (!msg) return;

    void handleMessage(msg, ch).catch(async (error: unknown) => {
      logger.error({ err: error }, 'Failed to process booking notification event');

      ch.nack(msg, false, false);
    });
  };

  const result: Replies.Consume = await ch.consume(queue.queue, consumeHandler);

  consumerTag = result.consumerTag;

  connection.on('close', () => {
    logger.warn('Notification consumer connection closed');

    connectionRef = null;
    channel = null;
    consumerTag = null;
  });

  connection.on('error', (error) => {
    logger.error({ err: error }, 'Notification consumer connection error');
  });

  logger.info('Notification booking consumer started');
};

// export const stopBookingEventConsumer = async () => {
//   try {
//     const ch = channel;

//     if (ch && consumerTag) {
//       await ch.cancel(consumerTag);
//       consumerTag = null;
//     }

//     if (ch) {
//       await ch.close();
//       channel = null;
//     }

//     if (connectionRef) {
//       await connectionRef.close();
//       connectionRef = null;
//     }
//   } catch (error) {
//     logger.error({ err: error }, 'Failed to stop notification consumer');
//   }
// };
