import winston from 'winston';

const { combine, timestamp, errors, json, colorize, printf } =
    winston.format;

const devFormat = printf(({ level, message, timestamp, stack }) => {
    return `${timestamp} ${level}: ${stack || message}`;
});

export const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',

    format: combine(
        timestamp(),
        errors({ stack: true }),
        json()
    ),

    defaultMeta: {
        service: 'sandbox-service'
    },

    transports: [
        new winston.transports.Console({
            format:
                process.env.NODE_ENV === 'production'
                    ? combine(
                        timestamp(),
                        errors({ stack: true }),
                        json()
                    )
                    : combine(
                        colorize(),
                        timestamp({
                            format: 'HH:mm:ss'
                        }),
                        errors({ stack: true }),
                        devFormat
                    )
        })
    ],

    exceptionHandlers: [
        new winston.transports.Console()
    ],

    rejectionHandlers: [
        new winston.transports.Console()
    ]
});