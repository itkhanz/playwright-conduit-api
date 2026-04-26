import dotenv from 'dotenv';
import path from 'path';

const env = process.env.API_ENV || 'INT'; // INT, QA, PROD (defaults to INT)
console.log('Test Environment:', env);

dotenv.config({
    path: path.resolve(__dirname, 'env', `${env}.env`)
});

// Helper to fetch + validate env vars
function getEnvVar(key: string): string {
    const value = process.env[key];
    if (!value) {
        throw new Error(`Missing required env variable: ${key}`);
    }
    return value;
}

const config = {
    apiUrl: 'https://conduit-api.bondaracademy.com/api',
    userEmail: '',
    userPassword: ''
};

const prefix = env; // INT, QA, PROD

config.userEmail = getEnvVar(`${env}_USERNAME`);
config.userPassword = getEnvVar(`${env}_PASSWORD`);


export { config };
