import * as cdk from 'aws-cdk-lib';
import * as ses from 'aws-cdk-lib/aws-ses';
import { Construct } from 'constructs';
import { buildNameAndId } from './application-stack';
import config from '../config.json';
import path from 'path';
import fs from 'fs';

const otpTemplate = fs.readFileSync(
    path.join(__dirname, '../infra/templates/otp.html'),
    'utf-8'
);

export interface SesEmailStackProps extends cdk.StackProps {
    stackName: string;
    crossRegionReferences: boolean;
}

export class SesEmailStack extends cdk.Stack {
    public readonly emailIdentity: ses.EmailIdentity;
    public readonly domainIdentity: ses.EmailIdentity;
    public readonly emailIdentityArn: string;
    public readonly domainIdentityArn: string;

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

        const domainIdentity = new ses.EmailIdentity(
            this,
            `${name}-${sesId}-DomainIdentity`,
            { identity: ses.Identity.domain(config.stack.dev.enpoints.api) }
        );

        this.emailIdentity = emailIdentity;
        this.domainIdentity = domainIdentity;
        this.emailIdentityArn = emailIdentity.emailIdentityArn;
        this.domainIdentityArn = domainIdentity.emailIdentityArn;

        new ses.CfnTemplate(this, `${name}-${sesId}-Template`, {
            template: {
                templateName: 'OTPEmailTemplate',
                subjectPart: 'One Time Password Verification Code',
                htmlPart: otpTemplate,
                textPart: 'This is a test email from AWS SES',
            },
        });
    }
}
