import * as cdk from 'aws-cdk-lib';
import { Template, Match } from 'aws-cdk-lib/assertions';
import { ApplicationStack } from '../infra/application-stack';

describe('app', () => {
    it('should make sure all and only intended resources are created', () => {
        const app = new cdk.App();
        const stack = new ApplicationStack(app, 'ApplicationStack', {
            env: {
                account: '654654447613',
                region: 'ap-southeast-5',
            },
            stackName: 'cdk-playground-dev',
            crossRegionReferences: true,
            domainIdentityArn:
                'arn:aws:ses:ap-southeast-1:654654447613:identity/muhdabbas98@gmail.com',
            emailIdentityArn:
                'arn:aws:ses:ap-southeast-1:654654447613:identity/aws.ismiabbas.xyz',
        });
        const template = Template.fromStack(stack);
        template.resourceCountIs('AWS::Lambda::Function', 1);
        template.resourceCountIs('AWS::IAM::Role', 1);
        template.resourceCountIs('AWS::ApiGateway::RestApi', 1);
        template.resourceCountIs('AWS::ApiGateway::Account', 1);
        template.resourceCountIs('AWS::ApiGateway::Deployment', 1);
        template.resourceCountIs('AWS::ApiGateway::Stage', 1);
        template.resourceCountIs('AWS::ApiGateway::DomainName', 1);
        template.resourceCountIs('AWS::ApiGateway::BasePathMapping', 1);
        template.resourceCountIs('AWS::ApiGateway::Resource', 1);
        template.resourceCountIs('AWS::ApiGateway::Method', 2);
        template.resourceCountIs('AWS::Lambda::Permission', 4);
    });
});
