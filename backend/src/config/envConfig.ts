import dotenv from 'dotenv';
import { logger } from './logger.js';
dotenv.config();


if (!process.env.PORT) {
    logger.error("PORT env variable does not loaded successfully!")
    process.exit(1);
}
if (!process.env.NODE_ENV) {
    logger.error("NODE_ENV env variable does not loaded successfully!")
    process.exit(1);
}

if (!process.env.DB_URL) {
    logger.error("DB_URL env variable does not loaded successfully!")
    process.exit(1);
}


interface EnvConfig {
    PORT: Number,
    NODE_ENV: String,
    DB_URL: string
}


const envConfig: EnvConfig = {
    PORT: Number(process.env.PORT),
    NODE_ENV: process.env.NODE_ENV,
    DB_URL: process.env.DB_URL
}

export default envConfig;