import * as cdk from 'aws-cdk-lib';
import { Template, Match } from 'aws-cdk-lib/assertions';
import * as AwsCdk from '../infra/application-stack';

test('SQS Queue and SNS Topic Created', () => {
    const app = new cdk.App();
    // WHEN
    const stack = new AwsCdk.ApplicationStack(app, 'MyTestStack');
    // THEN

    const template = Template.fromStack(stack);
    console.log(template.toJSON());

    template.hasResourceProperties('AWS::Lambda::Function', {
        VisibilityTimeout: 300,
    });
});
