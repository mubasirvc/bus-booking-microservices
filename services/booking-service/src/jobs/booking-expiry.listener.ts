// import { redisClient } from '@bus-booking/common';
// import { getRedisClient } from '../redis/redis.js';
import { bookingService } from '../service/booking.service.js';
import { BookingStatus } from '../types/booking.js';
import { logger } from '../utils/logger.js';
import { getRedisClient } from '@bus-booking/common';

export const startExpiryListener = async () => {
  const subscriber = getRedisClient().duplicate();

  await subscriber.subscribe('__keyevent@0__:expired');

  subscriber.on('message', async (_: any, key: any) => {
    logger.info(`Received expired event for key: ${key}`);
    if (!key.startsWith('booking:')) {
      return;
    }

    const bookingId = key.replace('booking:', '');

    logger.info(`Booking expired: ${bookingId}`);

    await bookingService.updateBookingStatus(bookingId, BookingStatus.CANCELLED);

    logger.info(`Booking ${bookingId} marked as CANCELLED due to expiry`);
  });
};
