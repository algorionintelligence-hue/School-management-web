import jwt from "jsonwebtoken";
import env from "../../config/env.js";

const generateToken = (user) => {
    return jwt.sign(
        {
            sub: user._id.toString(),

            schoolId: user.schoolId.toString(),

            role: user.role,
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