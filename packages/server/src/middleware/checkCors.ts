import process from 'node:process';

const cors = require('cors');

const isLocalDev = process.env.NODE_ENV !== 'development';
const corsOptions = {
    origin: 'https://localhost:8081',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
};
export const checkCors = () => cors(isLocalDev ? { origin: 'http://localhost:8081', credentials: true } : corsOptions);
