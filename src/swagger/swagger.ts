import { Express } from 'express';
import path from 'path';

const { initialize } = require('express-openapi');
const fs = require('fs');

const apiSpec = JSON.parse(fs.readFileSync(path.join(__dirname, 'api.json'), 'utf8'));

const swaggerUi = require('swagger-ui-express');
export const swaggerInit = (app: Express) => {
    initialize({
        app,
        apiDoc: apiSpec,
        paths: path.resolve('src/routes'),
    });
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(apiSpec));
};
