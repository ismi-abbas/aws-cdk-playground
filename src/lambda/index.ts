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
        try {
            const response = await sendEmail(email);
            console.log(response);
            return c.json({
                success: true,
                message: 'Email sent successfully',
            });
        } catch (error) {
            console.error('Error sending email:', error);
            return c.json({
                success: false,
                error: error,
            });
        }
    })
    .post('/template-email', async (c) => {
        const { email, code } = await c.req.json();
        try {
            const response = await sendTemplateEmail(email, code);
            console.log(response);
            return c.json({
                success: true,
                message: 'Email sent successfully',
            });
        } catch (error) {
            console.error('Error sending template email:', error);
            return c.json({
                success: false,
                error: error,
            });
        }
    });

export const handler = handle(app);
