import { App } from 'aws-cdk-lib';
import { ApplicationStack } from './application-stack';
import config from '../config.json';
import { SesEmailStack } from './ses-config-stack';

const app = new App();

const sesStack = new SesEmailStack(app, 'SesStack', {
    env: {
        account: config.stack.dev.account,
        region: config.stack.dev.cognitoRegion,
    },
    stackName: config.stackName + '-ses',
    crossRegionReferences: true,
});

const applicationStack = new ApplicationStack(app, 'ApplicationStack', {
    env: {
        account: config.stack.dev.account,
        region: config.region,
    },
    stackName: config.stackName + '-app',
    crossRegionReferences: true,
    emailIdentityArn: sesStack.emailIdentityArn,
    domainIdentityArn: sesStack.domainIdentityArn,
});

applicationStack.addDependency(sesStack);
