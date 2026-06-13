import {
  AUTH_EVENT_EXCHANGE,
  AUTH_USER_REGISTERED_ROUTING_KEY,
  type AuthRegisteredEvent,
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
import { notificationService } from '../services/notification.service.js';

type ManageConnection = Connection & ChannelModel;

let connectionRef: ManageConnection | null = null;
let channel: Channel | null = null;
let consumerTag: string | null = null;

const QUEUE_NAME = 'notification-service.user-registered';

const closeConnection = async (conn: ManageConnection) => {
  await conn.close();
  connectionRef = null;
  channel = null;
  consumerTag = null;
};

const handleMessage = async (message: ConsumeMessage, ch: Channel) => {
  const raw = message.content.toString('utf-8');

  const event = JSON.parse(raw) as AuthRegisteredEvent;

  const payload = event.payload;

  await notificationService.sendVerificationEmail({
    email: payload.email,
    userName: payload.userName,
    verificationToken: payload.verificationToken,
  });

  ch.ack(message);
};

export const startAuthEventConsumer = async () => {
  if (!env.RABBITMQ_URL) {
    logger.warn('RabbitMQ URL is not configured, skip');
    return;
  }

  if (channel) {
    return;
  }

  const connection = (await connect(env.RABBITMQ_URL)) as ManageConnection;
  connectionRef = connection;
  const ch = await connection.createChannel();
  channel = ch;
  await ch.assertExchange(AUTH_EVENT_EXCHANGE, 'topic', { durable: true });
  const queue = await ch.assertQueue(QUEUE_NAME, { durable: true });
  await ch.bindQueue(queue.queue, AUTH_EVENT_EXCHANGE, AUTH_USER_REGISTERED_ROUTING_KEY);

  const consumeHandler = (msg: ConsumeMessage | null) => {
    if (!msg) {
      return;
    }

    void handleMessage(msg, ch).catch((error: unknown) => {
      logger.error({ err: error }, 'Failed to process auth event');

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

  logger.info('Notification auth consumer started');
};
