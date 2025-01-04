import * as cdk from 'aws-cdk-lib';
import { Duration, StackProps } from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apiGateway from 'aws-cdk-lib/aws-apigateway';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';
import config from '../config.json';
import { Certificate } from 'aws-cdk-lib/aws-certificatemanager';
import { BundlingOptions } from 'aws-cdk-lib/aws-lambda-nodejs/lib/types';
import configEsBuild from '../infra/config/config-es-build.json';
import * as iam from 'aws-cdk-lib/aws-iam';

export const buildNameAndId = ({
    resourceName,
    envName,
    type,
}: {
    resourceName: string;
    envName: string;
    type?: string;
}) => {
    if (envName === 'prod') {
        return {
            name: `${config.servicePrefix}-${resourceName}`,
            id: `${config.servicePrefix}-${resourceName}${
                type ? `-${type}-id` : '-id'
            }`,
        };
    } else {
        return {
            name: `${config.servicePrefix}-${envName}-${resourceName}`,
            id: `${config.servicePrefix}-${envName}-${resourceName}${
                type ? `-${type}-id` : '-id'
            }`,
        };
    }
};

export const buildNameAndIdWithEnvOnly = ({
    resourceName,
    envName,
}: {
    resourceName: string;
    envName: string;
}) => {
    if (envName === 'prod') {
        return {
            name: resourceName,
            id: `${resourceName}-id`,
        };
    } else {
        return {
            name: `${resourceName}-${envName}`,
            id: `${resourceName}-${envName}-id`,
        };
    }
};

export enum Environment {
    DEV = 'dev',
    PROD = 'prod',
}

interface ApplicationProperties extends StackProps {
    id: string;
    bundlingOptions: BundlingOptions;
    envName: string;
    cognitoRegion: string;
    cdnS3: string;
    cdnDistributionId: string;
    account: string;
    enpoints: {
        api: string;
        web: string;
        certArn: string;
        globalCertArn: string;
    };
    emailArn: string;
}

const build = (env: Environment): ApplicationProperties => {
    const { stack, ...esConfig } = configEsBuild;

    return {
        id: config.stackName,
        account: config.stack[env].account,
        stackName: `${config.stackName}-${env}`,
        tags: { ...config.tags, env: env },
        env: {
            region: config.region,
            account: config.stack[env].account,
        },
        bundlingOptions: {
            ...esConfig,
            ...stack[env],
        },
        emailArn: config.emailArn,
        envName: env,
        cognitoRegion: config.stack[env].cognitoRegion,
        cdnS3: config.stack[env].cdnS3,
        cdnDistributionId: config.stack[env].cdnDistributionId,
        enpoints: {
            api: config.stack[env].enpoints.api,
            web: config.stack[env].enpoints.web,
            certArn: config.stack[env].enpoints.certArn,
            globalCertArn: config.stack[env].enpoints.globalCertArn,
        },
    };
};
export class ApplicationStack extends cdk.Stack {
    constructor(
        scope: Construct,
        id: string,
        props: StackProps & {
            emailIdentityArn: string;
            domainIdentityArn: string;
        }
    ) {
        super(scope, id, props);

        const lambdaInfo = buildNameAndId({
            resourceName: 'api-handler',
            envName: 'dev',
        });

        const fn = new NodejsFunction(this, lambdaInfo.id, {
            entry: 'src/lambda/index.ts',
            handler: 'handler',
            architecture: lambda.Architecture.ARM_64,
            runtime: lambda.Runtime.NODEJS_22_X,
            functionName: lambdaInfo.name,
            timeout: Duration.seconds(10),
            memorySize: 256,
            bundling: {
                sourceMap: true,
                sourcesContent: true,
                keepNames: true,
            },
            environment: {
                REGION: config.region,
                COGNITO_REGION: config.stack.dev.cognitoRegion,
                CDN_S3_BUCKET: config.stack.dev.cdnS3,
                CDN_DISTRIBUTION_ID: config.stack.dev.cdnDistributionId,
                EMAIL_IDENTITY: config.stack.dev.emailIdentity,
                API_ENDPOINT: config.stack.dev.enpoints.api,
                WEB_ENDPOINT: config.stack.dev.enpoints.web,
                TEMPLATE_NAME: 'OTPEmailTemplate',
            },
        });

        fn.addToRolePolicy(
            new iam.PolicyStatement({
                actions: [
                    'ses:SendEmail',
                    'ses:SendRawEmail',
                    'ses:SendTemplatedEmail',
                ],
                resources: [
                    props.emailIdentityArn,
                    props.domainIdentityArn,
                    `arn:aws:ses:${config.region}:${config.stack.dev.account}:template/OTPEmailTemplate`,
                ],
                effect: iam.Effect.ALLOW,
            })
        );

        const gatewayInfo = buildNameAndId({
            resourceName: 'gateway',
            envName: 'dev',
        });

        const cert = Certificate.fromCertificateArn(
            this,
            `${gatewayInfo.id}-Cert`,
            config.stack.dev.enpoints.certArn
        );

        new apiGateway.LambdaRestApi(this, gatewayInfo.id, {
            handler: fn,
            proxy: true,
            restApiName: gatewayInfo.name,
            deployOptions: {
                stageName: 'dev',
            },
            domainName: {
                domainName: config.stack.dev.enpoints.api,
                certificate: cert,
            },
        });
    }
}
