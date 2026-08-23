const { verifyAccessToken } = require("../../utils/jwt");

const AuthenticationError = require("../errors/AuthenticationError");

const authenticate = (req, res, next) => {
    try {

        const authHeader = req.headers.authorization;

        if (!authHeader) {
            throw new AuthenticationError(
                "Authentication required"
            );
        }

        const [type, token] = authHeader.split(" ");

        if (type !== "Bearer" || !token) {
            throw new AuthenticationError(
                "Invalid authorization header"
            );
        }

        const payload = verifyAccessToken(token);

        /**
         * Attach authenticated identity to request.
         *
         * This becomes the tenant context.
         */
        req.user = {
            id: payload.sub,
            schoolId: payload.schoolId,
            role: payload.role,
        };

        next();

    } catch (error) {
        next(
            error instanceof AuthenticationError
                ? error
                : new AuthenticationError(
                    "Invalid or expired token"
                )
        );
    }
};

module.exports = authenticate;