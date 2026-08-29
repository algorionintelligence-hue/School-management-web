import "dotenv/config";

const env = {
    port: process.env.PORT || 5001,

    mongodbUri: process.env.MONGODB_URI,

    jwtSecret: process.env.JWT_SECRET,

    jwtExpiresIn: process.env.JWT_EXPIRES_IN || "1d",
};

if (!env.mongodbUri) {
    throw new Error("MONGODB_URI is not defined");
}

if (!env.jwtSecret) {
    throw new Error("JWT_SECRET is not defined");
}

export default env;