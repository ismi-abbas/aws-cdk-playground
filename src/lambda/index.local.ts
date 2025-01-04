process.env.LOG_LEVEL = 'debug';
process.env.REGION = 'ap-southeast-1';
process.env.LOCAL_RUN = 'true';
process.env.COGNITO_REGION = 'ap-southeast-1';
process.env.EMAIL_IDENTITY = 'muhdabbas98@gmail.com';
process.env.TEMPLATE_NAME = 'OTPEmailTemplate';

import { app } from '.';
import { serve } from '@hono/node-server';

const PORT = process.env.PORT || 8000;

serve({
    fetch: app.fetch,
    port: PORT as number,
});

console.log(`Server is running on http://localhost:${PORT}`);
