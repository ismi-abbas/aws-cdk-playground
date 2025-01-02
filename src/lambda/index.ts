import { Hono } from 'hono';
import { handle } from 'hono/aws-lambda';
import { sendEmail, sendTemplateEmail } from './services/sesHelper';

export const app = new Hono()
    .get('/', async (c) => {
        return c.json({
            message: 'Hello, World from Hono with in Lambda!',
        });
    })
    .post('/', async (c) => {
        const { name } = await c.req.json();
        return c.json({
            message: `Hello, ${name} from Hono with in Lambda!`,
        });
    })
    .post('/email', async (c) => {
        const { email } = await c.req.json();
        const response = await sendEmail(email);
        return c.json(response);
    })
    .post('/template-email', async (c) => {
        const { email } = await c.req.json();
        const response = await sendTemplateEmail(email);
        return c.json(response);
    });

export const handler = handle(app);
