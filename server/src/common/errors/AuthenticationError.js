const AppError = require("./AppError");

class AuthenticationError extends AppError {
    constructor(message = "Invalid credentials") {
        super(message, 401);
    }
}

module.exports = AuthenticationError;