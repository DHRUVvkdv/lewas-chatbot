import { CognitoIdentityProviderClient } from "@aws-sdk/client-cognito-identity-provider";

const REGION = process.env.NEXT_PUBLIC_AWS_REGION;
const USER_POOL_ID = process.env.NEXT_PUBLIC_AWS_USER_POOL_ID;
const CLIENT_ID = process.env.NEXT_PUBLIC_AWS_USER_POOL_WEB_CLIENT_ID;

if (!REGION || !USER_POOL_ID || !CLIENT_ID) {
    console.error('AWS Cognito configuration is incomplete. Please check your environment variables.');
}

export const cognitoClient = new CognitoIdentityProviderClient({ region: REGION });

export const getSafeConfig = () => ({
    region: REGION || 'Not set',
    userPoolId: USER_POOL_ID ? `${USER_POOL_ID.split('_')[0]}...` : 'Not set',
    clientId: CLIENT_ID ? `${CLIENT_ID.slice(0, 5)}...` : 'Not set'
});

export { REGION, USER_POOL_ID, CLIENT_ID };

export const LAMBDA_API_ENDPOINT = process.env.NEXT_PUBLIC_LAMBDA_API_ENDPOINT;

if (!LAMBDA_API_ENDPOINT) {
    console.error('Lambda API endpoint is not configured. Please check your environment variables.');
}
