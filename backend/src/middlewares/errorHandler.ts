import type {
    NextFunction,
    Request,
    Response
} from 'express';

import ApiError from '../utils/ApiError.js';

const errorHandler = (
    err: ApiError,
    _: Request,
    res: Response,
    __: NextFunction
) => {
    const statusCode =
        err.statusCode || 500;

    return res.status(statusCode).json({
        success: false,
        statusCode,
        message:
            err.message ||
            'Internal Server Error',
        errors: err.errors || [],
        stack:
            process.env.NODE_ENV ===
                'development'
                ? err.stack
                : undefined
    });
};

export default errorHandler;