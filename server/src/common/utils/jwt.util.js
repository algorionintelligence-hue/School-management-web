import jwt from "jsonwebtoken";
import env from "../../config/env.js";

const generateToken = (user) => {
    return jwt.sign(
        {
            sub: user._id || user.userId,

            schoolId: user.schoolId,

            role: user.role,

            email: user.email,
        },
        env.jwtSecret,
        {
            expiresIn: env.jwtExpiresIn,
        }
    );
};

const verifyToken = (token) => {
    return jwt.verify(token, env.jwtSecret);
};

export { generateToken, verifyToken };