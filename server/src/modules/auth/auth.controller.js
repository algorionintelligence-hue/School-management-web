const authService = require("./auth.service");
const loginDto = require("./dto/login.dto");

const login = async (req, res, next) => {
    try {

        const validatedData = loginDto.parse(req.body);

        const result = await authService.login(
            validatedData
        );

        return res.status(200).json({
            success: true,
            message: "Login successful",
            data: result,
        });

    } catch (error) {
        next(error);
    }
};

module.exports = {
    login,
};