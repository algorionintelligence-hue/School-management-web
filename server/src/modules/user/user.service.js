import * as userRepository from "./user.repository.js";

const getUserByEmailAndSchool = async ({
    email,
    schoolId,
}) => {
    return userRepository.findByEmailAndSchool({
        email,
        schoolId,
    });
};

export { getUserByEmailAndSchool };