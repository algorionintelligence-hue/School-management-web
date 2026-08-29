import User from "./user.schema.js";

const findByEmailAndSchool = async ({
    email,
    schoolId,
}) => {
    return User.findOne({
        email: email.toLowerCase(),
        schoolId,
    }).select("+passwordHash");
};

const findById = async (userId) => {
    return User.findById(userId);
};

const create = async (data) => {
    return User.create(data);
};

export { findByEmailAndSchool, findById, create };