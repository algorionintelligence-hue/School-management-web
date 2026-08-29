require("dotenv").config();

const mongoose = require("mongoose");

const School = require("../src/modules/school/school.model");
const User = require("../src/modules/user/user.model");

const {
    hashPassword,
} = require("../src/utils/password");

const connect = async () => {
    await mongoose.connect(
        process.env.MONGODB_URI
    );
};

const seed = async () => {

    await connect();

    /**
     * Create school
     */
    const school = await School.create({
        businessId: "SCH-000001",

        domain: "demo.schoolapp.com",

        name: "Demo School",

        email: "admin@demo.schoolapp.com",

        status: "active",
    });

    /**
     * Hash password
     */
    const passwordHash = await hashPassword(
        "Password@123"
    );

    /**
     * Create admin
     */
    await User.create({
        schoolId: school._id,

        email: "admin@demo.schoolapp.com",

        passwordHash,

        role: "ADMIN",

        firstName: "School",

        lastName: "Admin",

        status: "active",

        emailVerified: true,
    });

    console.log("School and admin created");

    await mongoose.disconnect();
};

seed().catch(async (error) => {

    console.error(error);

    await mongoose.disconnect();

    process.exit(1);
});