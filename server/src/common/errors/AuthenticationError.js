import AppError from "./AppError.js";

class AuthenticationError extends AppError {
    constructor(message = "Invalid credentials") {
        super(message, 401);
    }
}

export default AuthenticationError;