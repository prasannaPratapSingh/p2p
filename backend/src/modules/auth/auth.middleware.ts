import jwt from 'jsonwebtoken';

import type {
    Request,
    Response,
    NextFunction
} from 'express';

import envConfig from '../../config/envConfig.js';
import ApiError from '../../utils/ApiError.js';



interface JwtPayload {
    id: string;
}

const authenticateToken = (
    req: Request,
    _: Response,
    next: NextFunction
) => {
    try {
        const token =
            req.cookies.accessToken;

        if (!token) {
            return next(
                new ApiError(
                    401,
                    'Access token missing',
                    [],
                    ''
                )
            );
        }

        const decodedUser = jwt.verify(
            token,
            envConfig.ACCESS_TOKEN_SECRET
        ) as JwtPayload;

        req.user = decodedUser;

        next();
    } catch {
        return next(
            new ApiError(
                403,
                'Invalid or expired token',
                [],
                ''
            )
        );
    }
};

export default authenticateToken;