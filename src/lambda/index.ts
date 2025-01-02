import { DynamoDB } from '@aws-sdk/client-dynamodb';
import { InvokeCommand, Lambda } from '@aws-sdk/client-lambda';
import { Hono } from 'hono';
import { handle } from 'hono/aws-lambda';

const app = new Hono();

app.get('/', async (c) => {
    const dynamo = new DynamoDB();
    const lambda = new Lambda();

    await dynamo.updateItem({
        TableName: process.env.HITS_TABLE_NAME,
        Key: { path: { S: c.req.path } },
        UpdateExpression: 'ADD hits :incr',
        ExpressionAttributeValues: { ':incr': { N: '1' } },
    });

    // call downstream
    const command = new InvokeCommand({
        FunctionName: process.env.DOWNSTREAM_FUNCTION_NAME,
        Payload: JSON.stringify(event),
    });

    const { Payload } = await lambda.send(command);
    if (!Payload) {
        return;
    }
    const result = Buffer.from(Payload).toString();

    console.log('downstream response:', JSON.stringify(result, undefined, 2));

    // return response to upstream
    return JSON.parse(result);
});

export const handler = handle(app);
