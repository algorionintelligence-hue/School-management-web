import mongoose from 'mongoose';
import { School } from './school.schema.js';
import { User } from '../user/user.schema.js';
import { ConflictException, NotFoundException } from '../../common/errors/HttpException.js';
import AppError from '../../common/errors/AppError.js';
import { hashPassword } from '../../common/utils/password.util.js';
import generateBusinessId from '../../common/utils/businessId.util.js';
import { UserRole } from '../../common/constants.js';
export class SchoolService {
  async create(data) {

    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const normalizedDomain = data.domain.toLowerCase().trim();
      const existingSchool =
        await School.findOne({
          domain: data.domain.toLowerCase()
        }).session(session);

      if (existingSchool) {
        throw new AppError(
          "This domain is already registered",
          409
        );
      }
      const businessId =
        generateBusinessId();

      const [school] = await School.create(
        [
          {
            businessId,
            domain: normalizedDomain,
            name:
              data.name,

            legalName:
              data.legalName,

            email:
              data.email,

            phone:
              data.phone,

            address:
              data.address,

            logo:
              data.logo || null,
            establishedYear: data.establishedYear,

            schoolRange: data.schoolRange,

            shift: data.shift,

            numberOfCampus: data.numberOfCampus,

            selectedBoard: data.selectedBoard,

            timezone:
              data.timezone ||
              "Asia/Karachi",

            locale:
              data.locale ||
              "en-PK",
          }
        ],
        {
          session
        }
      );
      const passwordHash =
        await hashPassword(
          data.admin.password
        );
      const [adminUser] =
        await User.create(
          [
            {
              schoolId:
                school._id,

              email:
                data.admin.email
                  .toLowerCase()
                  .trim(),

              passwordHash,

              role: UserRole.ADMIN,

              firstName:
                data.admin.firstName,

              lastName:
                data.admin.lastName,

              status:
                "active",

              emailVerified:
                false
            }
          ],
          {
            session
          }
        );

      await session.commitTransaction();

      return {
        school: {
          id: school._id,
          businessId:
            school.businessId,
          domain:
            school.domain,
          name:
            school.name
        },

        admin: {
          id: adminUser._id,
          email:
            adminUser.email,
          role:
            adminUser.role
        }
      };

    } catch (error) {

      await session.abortTransaction();

      throw error;

    } finally {

      await session.endSession();
    }
  }
  async findAll() {
    const schools = await School.find({ isActive: true });
    return schools.map((school) => school.toObject());
  }

  async findOne(id) {
    const school = await School.findOne({ _id: id, isActive: true });
    if (!school) {
      throw new NotFoundException('School not found');
    }
    return school.toObject();
  }

  async findOneByDomain(domain) {
    const school = await School.findOne({ domain, isActive: true });
    if (!school) {
      throw new NotFoundException('School not found');
    }
    return school.toObject();
  }

  async update(id, updateSchoolDto) {
    const updatedSchool = await School.findOneAndUpdate(
      { _id: id, isActive: true },
      updateSchoolDto,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedSchool) {
      throw new NotFoundException('School not found');
    }

    return updatedSchool.toObject();
  }

  async remove(id) {
    const result = await School.findOneAndUpdate(
      { _id: id },
      { isActive: false },
      { new: true }
    );

    if (!result) {
      throw new NotFoundException('School not found');
    }
  }
}

export const schoolService = new SchoolService();