import { DynamoDB } from '@aws-sdk/client-dynamodb';
import { Lambda, InvokeCommand } from '@aws-sdk/client-lambda';
import { Request } from 'express';

export const handler = async function (event: Request) {
    console.log('Request', JSON.stringify(event, undefined, 2));

    const dynamo = new DynamoDB();
    const lambda = new Lambda();

    await dynamo.updateItem({
        TableName: process.env.HITS_TABLE_NAME,
        Key: { path: { S: event.path } },
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
};
