const processENV = process.env.TEST_ENV
const env = processENV || 'INT'
console.log('Test Environment: ' + env)

const config = {
    apiUrl: 'https://conduit-api.bondaracademy.com/api',
    userEmail: 'itkhanz@test.com',
    userPassword: 'test1234'
}

if (env === 'QA') {
    config.userEmail = 'qaaccount@test.com'
    config.userPassword = 'test1234'
}
if (env === 'PROD') {
    config.userEmail = ''
    config.userPassword = ''
}

export { config }