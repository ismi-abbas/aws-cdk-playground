import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ses from 'aws-cdk-lib/aws-ses';
import { buildNameAndId } from './application-stack';
import config from '../config.json';

export class SesEmailStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        new ses.CfnEmailIdentity(this, 'EmailIdentity', {
            emailIdentity: config.stack.dev.enpoints.api,
        });

        new ses.CfnTemplate(this, 'EmailTemplate', {
            template: {
                subjectPart: 'Test Email',
                templateName: 'EmailTemplate',
                htmlPart: '<h1>This is a test email from AWS SES</h1>',
                textPart: 'This is a test email from AWS SES',
            },
        });
    }
}
