import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
// import { z } from 'zod';
import { z } from '@bus-booking/common';
extendZodWithOpenApi(z);

console.log('openapi patched:', typeof z.string().openapi);