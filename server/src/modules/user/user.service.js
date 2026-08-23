const userRepository = require("./user.repository");

const getUserByEmailAndSchool = async ({
    email,
    schoolId,
}) => {
    return userRepository.findByEmailAndSchool({
        email,
        schoolId,
    });
};

module.exports = {
    getUserByEmailAndSchool,
};