import * as cdk from 'aws-cdk-lib';
import { StackProps } from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigw from 'aws-cdk-lib/aws-apigateway';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';

export class ApplicationStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);

        const fn = new NodejsFunction(this, 'HelloHandler', {
            entry: '../src/index.ts',
            handler: 'handler',
            runtime: lambda.Runtime.NODEJS_22_X,
        });

        fn.addFunctionUrl({
            authType: lambda.FunctionUrlAuthType.NONE,
        });

        new apigw.LambdaRestApi(this, 'myhonoapi', {
            handler: fn,
        });
    }
}
