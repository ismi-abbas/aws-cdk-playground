import {
    SESClient,
    SendEmailCommand,
    SendEmailCommandInput,
    SendTemplatedEmailCommand,
    SendTemplatedEmailCommandInput,
} from '@aws-sdk/client-ses';

const ses = new SESClient({
    region: process.env.COGNITO_REGION,
});

const sendEmail = async (email: string) => {
    const params: SendEmailCommandInput = {
        Destination: {
            ToAddresses: [email],
        },
        Source: 'muhdabbas98@gmail.com',
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
    const params: SendTemplatedEmailCommandInput = {
        Destination: {
            ToAddresses: [email],
        },
        Source: 'muhdabbas98@gmail.com',
        Template: 'OTPEmailTemplate',
        TemplateData: JSON.stringify({ code: '123456' }),
    };

    try {
        const command = new SendTemplatedEmailCommand(params);
        const response = await ses.send(command);
        return { success: true, messageId: response.MessageId };
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
};

export { sendEmail, sendTemplateEmail };
