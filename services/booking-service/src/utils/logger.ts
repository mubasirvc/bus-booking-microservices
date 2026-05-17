import { createLogger } from '@bus-booking/common';
import type { Logger } from '@bus-booking/common';

export const logger: Logger = createLogger({ name: 'booking-service' });
