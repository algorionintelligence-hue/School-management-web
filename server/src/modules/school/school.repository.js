const School = require("./school.model");

const findByDomain = async (domain) => {
    return School.findOne({
        domain: domain.toLowerCase(),
    });
};

const findById = async (schoolId) => {
    return School.findById(schoolId);
};

const create = async (data) => {
    return School.create(data);
};

module.exports = {
    findByDomain,
    findById,
    create,
};