process.env.LOG_LEVEL = 'debug';
process.env.REGION = 'ap-southeast-5';
process.env.LOCAL_RUN = 'true';
process.env.COGNITO_REGION = 'ap-southeast-1';
process.env.CDN_S3_BUCKET = 'iksn-dev-cdn-bucket';
process.env.WEB_ENPOINT = 'dev-iksn-uitm.zons.io';

import { app } from '.';
import { serve } from '@hono/node-server';

const PORT = process.env.PORT || 8000;

serve({
    fetch: app.fetch,
    port: PORT as number,
});

console.log(`Server is running on http://localhost:${PORT}`);
