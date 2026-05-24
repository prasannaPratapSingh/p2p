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
if (!process.env.ACCESS_TOKEN_SECRET) {
    logger.error("ACCESS_TOKEN_SECRET env variable does not loaded successfully!")
    process.exit(1);
}
if (!process.env.REFRESH_TOKEN_SECRET) {
    logger.error("REFRESH_TOKEN_SECRET env variable does not loaded successfully!")
    process.exit(1);
}
if (!process.env.REDIS_URL) {
    logger.error("REDIS_URL env variable does not loaded successfully!")
    process.exit(1);
}


interface EnvConfig {
    PORT: Number,
    NODE_ENV: String,
    DB_URL: string,
    ACCESS_TOKEN_SECRET:string,
    REFRESH_TOKEN_SECRET:string,
    REDIS_URL:string

}


const envConfig: EnvConfig = {
    PORT: Number(process.env.PORT),
    NODE_ENV: process.env.NODE_ENV,
    DB_URL: process.env.DB_URL,
    ACCESS_TOKEN_SECRET:process.env.ACCESS_TOKEN_SECRET,
    REFRESH_TOKEN_SECRET:process.env.REFRESH_TOKEN_SECRET,
    REDIS_URL:process.env.REDIS_URL
}

export default envConfig;