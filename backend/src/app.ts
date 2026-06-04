import express from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import errorHandler from './middlewares/errorHandler.js';
import asyncHandler from './utils/asyncHandler.js';
import ApiResponse from './utils/ApiResponse.js';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './swagger.js';

import authRouter from './modules/auth/auth.routes.js'
import skillRouter from './modules/skills/skills.routes.js';
import walletRouter from './modules/wallet/wallet.routes.js';
import matchRouter from './modules/match/match.routes.js';
import connectionRouter from './modules/connections/connections.routes.js';
import profileRouter from './modules/profile/profile.routes.js';

const app = express();

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

app.use(express.json());

app.use(cookieParser());

app.use(morgan('dev'));

app.use('/api/auth', authRouter);

/**
 * GET /api/healthcheck
 * Params: none
 * Returns: server uptime and health status
 */
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

app.use('/api/skills', skillRouter);
app.use('/api/wallet', walletRouter);
app.use('/api/match', matchRouter);
app.use('/api/connection', connectionRouter);
app.use('/api/profile', profileRouter)

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.get('/api/docs.json', (_, res) => res.json(swaggerDocument));

app.use(errorHandler);

export default app;