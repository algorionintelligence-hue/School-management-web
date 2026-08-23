const schoolRepository = require("./school.repository");

const getSchoolByDomain = async (domain) => {
    return schoolRepository.findByDomain(domain);
};

module.exports = {
    getSchoolByDomain,
};