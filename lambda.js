const serverlessExpress = require('@vendia/serverless-express');
const app = require('./app.js');

const handler = async (event, context) => {
    return serverlessExpress({ app })(event, context);
}


exports.handler = handler;