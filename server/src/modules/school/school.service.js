import mongoose from 'mongoose';
import { School } from './school.schema.js';
import { User } from '../user/user.schema.js';
import { ConflictException, NotFoundException } from '../../common/errors/HttpException.js';
import { hashPassword } from '../../common/utils/password.util.js';
import generateBusinessId from '../../common/utils/businessId.util.js';
import { UserRole } from '../../common/constants.js';
import { sendVerificationEmail } from '../../common/utils/email-service.js';
import { authService } from '../auth/auth.service.js';

export class SchoolService {
  async create(data) {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const normalizedDomain = data.domain.toLowerCase().trim();
      const existingSchool = await School.findOne({
        domain: normalizedDomain
      }).session(session);

      if (existingSchool) {
        throw new ConflictException("This domain is already registered");
      }

      const businessId = generateBusinessId();

      const [school] = await School.create(
        [
          {
            businessId,
            domain: normalizedDomain,
            name: data.name,
            legalName: data.legalName,
            email: data.email.toLowerCase().trim(),
            phone: data.phone,
            address: {
              city: data.address.city,
              state: data.address.state,
              country: data.address.country,
              postalCode: data.address.postalCode,
            },
            logo: data.logo || data.logoUrl || null,
            status: data.status || "active",
            establishedYear: data.establishedYear,
            schoolRange: data.schoolRange,
            shift: data.shift,
            numberOfCampus: data.numberOfCampus,
            selectedBoard: data.selectedBoard,
            timezone: data.timezone || "Asia/Karachi",
            locale: data.locale || "en-PK",
            startTime: data.startTime,
            endTime: data.endTime,
            academicSession: {
              currentYear: data.academicSession.currentYear,
              startDate: new Date(data.academicSession.startDate),
              endDate: new Date(data.academicSession.endDate),
            },
            description: data.description || null,
            tagline: data.tagline || null,
            isHeadCampus: data.isHeadCampus !== undefined ? data.isHeadCampus : true,
            parentSchoolId: data.parentSchoolId || null,
            banner: data.banner || null,
          }
        ],
        { session }
      );

      const passwordHash = await hashPassword(data.admin.password);
      const [createdAdmin] = await User.create(
        [
          {
            schoolId: school._id,
            email: data.admin.email.toLowerCase().trim(),
            passwordHash,
            role: UserRole.ADMIN,
            firstName: data.admin.firstName,
            lastName: data.admin.lastName,
            isActive: true,
            emailVerified: false,
          }
        ],
        { session }
      );

      const verificationToken = await authService.createEmailVerificationToken(
        createdAdmin._id,
        session
      );

      await session.commitTransaction();

      try {
        var emailMetaData = await sendVerificationEmail({
          to: createdAdmin.email,
          firstName: createdAdmin.firstName,
          verificationToken,
        });
      } catch (emailError) {
        console.error("Verification email failed:", emailError);
      }

      return {
        school: {
          id: school._id,
          businessId: school.businessId,
          domain: school.domain,
          name: school.name,
          legalName: school.legalName,
          email: school.email,
          phone: school.phone,
          address: school.address,
          establishedYear: school.establishedYear,
          schoolRange: school.schoolRange,
          shift: school.shift,
          numberOfCampus: school.numberOfCampus,
          selectedBoard: school.selectedBoard,
          timezone: school.timezone,
          locale: school.locale,
          startTime: school.startTime,
          endTime: school.endTime,
          academicSession: school.academicSession,
          description: school.description,
          tagline: school.tagline,
          isHeadCampus: school.isHeadCampus,
          parentSchoolId: school.parentSchoolId,
          banner: school.banner,
        },
        admin: {
          id: createdAdmin._id,
          email: createdAdmin.email,
          role: createdAdmin.role,
          emailVerified: createdAdmin.emailVerified ?? 'false',
          verificationToken: verificationToken,
          verificationUrl: emailMetaData.verificationUrl
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