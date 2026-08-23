const schoolRepository = require("../school/school.repository");
const userRepository = require("../user/user.repository");

const { comparePassword } = require("../../utils/password");
const { generateAccessToken } = require("../../utils/jwt");

const AuthenticationError = require("../../common/errors/AuthenticationError");
const AppError = require("../../common/errors/AppError");

const login = async ({
    email,
    password,
    domain,
}) => {

    /**
     * STEP 1
     * Find the school using the domain.
     */
    const school = await schoolRepository.findByDomain(domain);

    if (!school) {
        throw new AuthenticationError(
            "Invalid domain or credentials"
        );
    }

    /**
     * STEP 2
     * Make sure the school is allowed to login.
     */
    if (school.status !== "active") {
        throw new AuthenticationError(
            "School account is not active"
        );
    }

    /**
     * STEP 3
     * Find the user INSIDE this school.
     *
     * This is the important tenant boundary.
     */
    const user = await userRepository.findByEmailAndSchool({
        email,
        schoolId: school._id,
    });

    if (!user) {
        throw new AuthenticationError(
            "Invalid domain or credentials"
        );
    }

    /**
     * STEP 4
     * Check user status.
     */
    if (user.status !== "active") {
        throw new AuthenticationError(
            "User account is not active"
        );
    }

    /**
     * STEP 5
     * Verify password.
     */
    const passwordMatches = await comparePassword(
        password,
        user.passwordHash
    );

    if (!passwordMatches) {
        throw new AuthenticationError(
            "Invalid domain or credentials"
        );
    }

    /**
     * STEP 6
     * Generate JWT.
     *
     * The JWT contains schoolId.
     */
    const accessToken = generateAccessToken(user);

    /**
     * STEP 7
     * Update login timestamp.
     */
    user.lastLoginAt = new Date();

    await user.save();

    /**
     * STEP 8
     * Return safe user information.
     */
    return {
        accessToken,

        user: {
            id: user._id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
        },

        school: {
            id: school._id,
            businessId: school.businessId,
            domain: school.domain,
            name: school.name,
        },
    };
};

module.exports = {
    login,
};