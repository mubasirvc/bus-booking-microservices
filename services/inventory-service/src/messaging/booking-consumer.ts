import {
  BOOKING_PENDING_ROUTING_KEY,
  BOOKING_EVENTS_EXCHANGE,
  BOOKING_CANCELLED_ROUTING_KEY,
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
import { tripService } from '../modules/trip/service/trip.service.js';
import { env } from '../config/env.js';
import { publishSeatReservationFailed, publishSeatReservationSuccess } from './event-publishing.js';

type ManageConnection = Connection & ChannelModel;

let connectionRef: ManageConnection | null = null;
let channel: Channel | null = null;
let consumerTag: string | null = null;

const QUEUE_NAME = 'inventory-service.booking-events';

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
    case BOOKING_PENDING_ROUTING_KEY: {
      try {
        const reservation = await tripService.reserveSeats(event.payload);

        publishSeatReservationSuccess(reservation);
      } catch (error) {
        publishSeatReservationFailed({
          bookingId: event.payload.bookingId,
          userId: event.payload.userId,
          tripId: event.payload.tripId,
          seats: event.payload.seats,
          reason: error instanceof Error ? error.message : 'Reservation failed',
        });
      }

      break;
    }

    case BOOKING_CANCELLED_ROUTING_KEY: {

      await tripService.releaseSeats(event.payload.tripId, event.payload.seats);
      break;
    }

    default:
      logger.warn({ eventType: event.type }, 'Unknown booking event received');
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

  const connection = (await connect(env.RABBITMQ_URL)) as ManageConnection;
  connectionRef = connection;
  const ch = await connection.createChannel();
  channel = ch;

  await ch.assertExchange(BOOKING_EVENTS_EXCHANGE, 'topic', { durable: true });
  const queue = await ch.assertQueue(QUEUE_NAME, { durable: true });

  await ch.bindQueue(queue.queue, BOOKING_EVENTS_EXCHANGE, BOOKING_PENDING_ROUTING_KEY);
  await ch.bindQueue(queue.queue, BOOKING_EVENTS_EXCHANGE, BOOKING_CANCELLED_ROUTING_KEY);

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

export const stopBookingEventConsumer = async () => {
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
