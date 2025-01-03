import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ses from 'aws-cdk-lib/aws-ses';
import { buildNameAndId } from './application-stack';
import config from '../config.json';

export class SesEmailStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        const { name, id: sesId } = buildNameAndId({
            resourceName: 'ses',
            envName: 'dev',
        });

        const emailIdentity = new ses.EmailIdentity(
            this,
            `${name}-${sesId}-EmailIdentity`,
            { identity: ses.Identity.email(config.stack.dev.emailIdentity) }
        );

        new ses.CfnTemplate(this, `${name}-${sesId}-Template`, {
            template: {
                templateName: 'OTPEmailTemplate',
                subjectPart: 'Verification Code',
                htmlPart: `
                <!DOCTYPE html>
                    <html lang="en">
                    <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <title>OTP Email</title>
                        <style>
                            /* Reset styles */
                            body, html {
                                margin: 0;
                                padding: 0;
                                font-family: Arial, sans-serif;
                                background-color: #f7f7f7;
                                color: #333;
                            }

                            /* Container */
                            .email-container {
                                max-width: 600px;
                                margin: 0 auto;
                                padding: 20px;
                                background-color: #ffffff;
                                border-radius: 8px;
                                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                            }

                            /* Header */
                            .header {
                                text-align: center;
                                padding: 20px 0;
                            }

                            .header img {
                                max-width: 150px;
                            }

                            /* Content */
                            .content {
                                padding: 20px;
                                text-align: center;
                            }

                            .content h1 {
                                font-size: 24px;
                                color: #333;
                                margin-bottom: 20px;
                            }

                            .content p {
                                font-size: 16px;
                                line-height: 1.6;
                                color: #555;
                            }

                            /* OTP Box */
                            .otp-box {
                                background-color: #f0f4f8;
                                padding: 15px;
                                border-radius: 8px;
                                margin: 20px 0;
                                display: inline-block;
                            }

                            .otp-box span {
                                font-size: 28px;
                                font-weight: bold;
                                color: #2d3748;
                                letter-spacing: 5px;
                            }

                            /* Footer */
                            .footer {
                                text-align: center;
                                padding: 20px 0;
                                font-size: 14px;
                                color: #777;
                            }

                            .footer a {
                                color: #3182ce;
                                text-decoration: none;
                            }

                            .footer a:hover {
                                text-decoration: underline;
                            }

                            /* Responsive Design */
                            @media (max-width: 600px) {
                                .email-container {
                                    padding: 10px;
                                }

                                .content h1 {
                                    font-size: 20px;
                                }

                                .otp-box span {
                                    font-size: 24px;
                                }
                            }
                        </style>
                    </head>
                    <body>
                        <div class="email-container">
                            <!-- Header -->
                            <div class="header">
                                <img src="https://your-logo-url.com/logo.png" alt="Company Logo">
                            </div>

                            <!-- Content -->
                            <div class="content">
                                <h1>Your One-Time Password (OTP)</h1>
                                <p>Hello,</p>
                                <p>You have requested a One-Time Password (OTP) for your account. Please use the following code to proceed:</p>

                                <div class="otp-box">
                                    <span>{{code}}</span>
                                </div>

                                <p>This OTP is valid for the next 10 minutes. If you did not request this code, please ignore this email.</p>
                            </div>

                            <!-- Footer -->
                            <div class="footer">
                                <p>If you have any questions, feel free to <a href="mailto:support@yourcompany.com">contact us</a>.</p>
                                <p>&copy; 2024 Your Company. All rights reserved.</p>
                            </div>
                        </div>
                    </body>
                    </html>
                `,
                textPart: 'This is a test email from AWS SES',
            },
        });
    }
}
