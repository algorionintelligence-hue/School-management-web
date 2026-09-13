import mongoose from 'mongoose';
import { Teacher } from './teacher.schema.js';
import { User } from '../user/user.schema.js';
import { ConflictException, NotFoundException } from '../../common/errors/HttpException.js';
import { hashPassword } from '../../common/utils/password.util.js';
import { UserRole } from '../../common/constants.js';
export class TeacherService {
  async create(schoolId, domain, createTeacherDto) {
    const { ObjectId } = mongoose.Types;

    // Check if email already exists in this school
    const existingUser = await User.findOne({
      schoolId: new ObjectId(schoolId),
      email: createTeacherDto.email,
    });

    if (existingUser) {
      throw new ConflictException('Teacher with this email already exists in this school');
    }

    // Hash password
    const passwordHash = await hashPassword(createTeacherDto.password);

    // Create user
    const createdUser = await User.create({
      schoolId: schoolId,
      role: UserRole.TEACHER,
      email: createTeacherDto.email,
      passwordHash,
      firstName: createTeacherDto.firstName,
      lastName: createTeacherDto.lastName,
      middleName: createTeacherDto.middleName,
      phone: createTeacherDto.phone,
      gender: createTeacherDto.gender,
      dateOfBirth: createTeacherDto.dateOfBirth ? new Date(createTeacherDto.dateOfBirth) : undefined,
      employeeId: createTeacherDto.employeeId,
      isActive: true,
    });

    // Create teacher profile
    const createdTeacher = await Teacher.create({
      userId: createdUser._id,
      schoolId: schoolId,
      department: createTeacherDto.department,
      specialization: createTeacherDto.specialization,
      qualifications: createTeacherDto.qualifications,
      joiningDate: createTeacherDto.joiningDate ? new Date(createTeacherDto.joiningDate) : undefined
    });

    return createdTeacher.toObject();
  }

  async findAll(schoolId) {
    const { ObjectId } = mongoose.Types;
    const teachers = await Teacher.find({ schoolId: new ObjectId(schoolId) }).populate(
      'userId',
      'firstName lastName email employeeId'
    );

    return teachers.map((teacher) => teacher.toObject());
  }

  async getDropdown(schoolId) {
    const { ObjectId } = mongoose.Types;
    const teachers = await Teacher.find({ schoolId: new ObjectId(schoolId) })
      .populate('userId', 'firstName middleName lastName isActive');

    return teachers
      .filter((t) => t.userId && t.userId.isActive)
      .map((t) => {
        const user = t.userId;
        const name = `${user.firstName || ''} ${user.middleName ? user.middleName + ' ' : ''}${user.lastName || ''}`.trim();
        return {
          _id: user._id, // We return the User's _id because class and subject assignments expect the User reference
          teacherProfileId: t._id,
          name: name || 'Unknown Teacher',
        };
      });
  }

  async findOne(schoolId, id) {
    const { ObjectId } = mongoose.Types;
    const teacher = await Teacher.findOne({
      _id: id,
      schoolId: new ObjectId(schoolId),
    }).populate('userId', 'firstName lastName email employeeId phone gender dateOfBirth');

    if (!teacher) {
      throw new NotFoundException('Teacher not found');
    }

    return teacher.toObject();
  }

  async findByUserId(schoolId, userId) {
    const { ObjectId } = mongoose.Types;
    const teacher = await Teacher.findOne({
      schoolId: new ObjectId(schoolId),
      userId: new ObjectId(userId),
    }).populate('userId');

    if (!teacher) {
      throw new NotFoundException('Teacher not found');
    }

    return teacher.toObject();
  }

  async update(schoolId, id, updateTeacherDto) {
    const { ObjectId } = mongoose.Types;
    const updateData = { ...updateTeacherDto };

    if (updateTeacherDto.joiningDate) {
      updateData.joiningDate = new Date(updateTeacherDto.joiningDate);
    }

    // Update teacher profile
    const updatedTeacher = await Teacher.findOneAndUpdate(
      { _id: id, schoolId: new ObjectId(schoolId) },
      updateData,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedTeacher) {
      throw new NotFoundException('Teacher not found');
    }

    // Update user if needed
    if (
      updateTeacherDto.email ||
      updateTeacherDto.firstName ||
      updateTeacherDto.lastName ||
      updateTeacherDto.phone ||
      updateTeacherDto.gender ||
      updateTeacherDto.dateOfBirth
    ) {
      const userUpdateData = {};
      if (updateTeacherDto.email) userUpdateData.email = updateTeacherDto.email;
      if (updateTeacherDto.firstName) userUpdateData.firstName = updateTeacherDto.firstName;
      if (updateTeacherDto.lastName) userUpdateData.lastName = updateTeacherDto.lastName;
      if (updateTeacherDto.phone) userUpdateData.phone = updateTeacherDto.phone;
      if (updateTeacherDto.gender) userUpdateData.gender = updateTeacherDto.gender;
      if (updateTeacherDto.dateOfBirth) userUpdateData.dateOfBirth = new Date(updateTeacherDto.dateOfBirth);

      if (Object.keys(userUpdateData).length > 0) {
        await User.findOneAndUpdate(
          { _id: updatedTeacher.userId, schoolId: new ObjectId(schoolId) },
          userUpdateData
        );
      }
    }

    return updatedTeacher.toObject();
  }

  async remove(schoolId, id) {
    const { ObjectId } = mongoose.Types;
    const teacher = await Teacher.findOne({
      _id: id,
      schoolId: new ObjectId(schoolId),
    });

    if (!teacher) {
      throw new NotFoundException('Teacher not found');
    }

    // Soft delete user
    await User.findOneAndUpdate(
      { _id: teacher.userId, schoolId: new ObjectId(schoolId) },
      { isActive: false }
    );

    // Remove teacher profile
    await Teacher.deleteOne({ _id: id });
  }
}

export const teacherService = new TeacherService();