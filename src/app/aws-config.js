import { Amplify } from 'aws-amplify';

const awsConfig = {
    Auth: {
        region: process.env.NEXT_PUBLIC_AWS_REGION,
        userPoolId: process.env.NEXT_PUBLIC_AWS_USER_POOL_ID,
        userPoolWebClientId: process.env.NEXT_PUBLIC_AWS_USER_POOL_WEB_CLIENT_ID,
    }
};

if (!awsConfig.Auth.region || !awsConfig.Auth.userPoolId || !awsConfig.Auth.userPoolWebClientId) {
    console.error('AWS Cognito configuration is incomplete. Please check your environment variables.');
}

Amplify.configure(awsConfig);

export default awsConfig;