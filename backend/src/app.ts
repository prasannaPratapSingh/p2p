import express from 'express';
import morgan from 'morgan';

import errorHandler from './middlewares/errorHandler.js';
import asyncHandler from './utils/asyncHandler.js';
import ApiResponse from './utils/ApiResponse.js';

const app = express();

app.use(express.json());

app.use(morgan('dev'));

app.get(
    '/api/healthcheck',
    asyncHandler(async (_, res) => {
        return res.status(200).json(
            new ApiResponse(
                200,
                'Server Health Is OK! ✅', {
                uptime: process.uptime()
            }
            )
        );
    })
);

app.use(errorHandler);

export default app;