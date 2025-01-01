import { Stack, StackProps } from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';
import { LambdaRestApi } from 'aws-cdk-lib/aws-apigateway';
import { HitCounter } from './hit-counter';

export class AwsCdkStack extends Stack {
    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);

        const hello = new lambda.Function(this, 'helloWorld', {
            handler: 'hello.handler',
            functionName: 'helloWorld',
            runtime: lambda.Runtime.NODEJS_LATEST,
            code: lambda.Code.fromAsset('lambda'),
        });

        const helloWithCounter = new HitCounter(this, 'HelloHitCounter', {
            downstream: hello,
        });

        // defines an API Gateway REST API resource backed by our "hello" function.
        const gateway = new LambdaRestApi(this, 'Endpoint', {
            handler: helloWithCounter.handler,
        });
    }
}
