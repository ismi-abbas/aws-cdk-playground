import {
    SESClient,
    SendEmailCommand,
    SendEmailCommandInput,
} from '@aws-sdk/client-ses';

const ses = new SESClient({
    region: process.env.COGNITO_REGION,
});

const sendEmail = async (email: string) => {
    const params: SendEmailCommandInput = {
        Destination: {
            ToAddresses: [email],
        },
        Message: {
            Body: {
                Text: {
                    Data: 'This is a test email from AWS SES',
                    Charset: 'UTF-8',
                },
            },
            Subject: {
                Data: 'Test Email',
                Charset: 'UTF-8',
            },
        },
        Source: 'abbaspuzi.dev@gmail.com', // Replace with your verified SES email
    };

    try {
        const command = new SendEmailCommand(params);
        const response = await ses.send(command);
        return { success: true, messageId: response.MessageId };
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
};

const sendTemplateEmail = async (email: string) => {
    const params: SendEmailCommandInput = {
        Destination: {
            ToAddresses: [email],
        },
        Message: {
            Body: {
                Html: {
                    Data: '<h1>This is a test email from AWS SES</h1>',
                    Charset: 'UTF-8',
                },
            },
            Subject: {
                Data: 'Test Email',
                Charset: 'UTF-8',
            },
        },
        Source: 'abbaspuzi.dev@gmail.com', // Replace with your verified SES email
    };

    try {
        const command = new SendEmailCommand(params);
        const response = await ses.send(command);
        return { success: true, messageId: response.MessageId };
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
};

export { sendEmail, sendTemplateEmail };
