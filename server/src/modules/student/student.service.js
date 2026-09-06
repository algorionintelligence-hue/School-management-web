import mongoose from 'mongoose';
import { Student } from './student.schema.js';
import { User } from '../user/user.schema.js';
import { ConflictException, NotFoundException } from '../../common/errors/HttpException.js';
import { hashPassword } from '../../common/utils/password.util.js';

export class StudentService {

  async create(schoolId, domain, createStudentDto) {
    const { ObjectId } = mongoose.Types;

    // Check if email already exists in this school
    const existingUser = await User.findOne({
      schoolId: new ObjectId(schoolId),
      email: createStudentDto.email,
    });

    if (existingUser) {
      throw new ConflictException('Student with this email already exists in this school');
    }

    // Auto-generate system roll number and verify it is unique and not already assigned this function in utils and also i asked you to only if the rollnumber doesn't
    const rollNumber = await this.generateUniqueRollNumber(schoolId);

    // Hash password
    const passwordHash = await hashPassword(createStudentDto.password);

    // Create user
    const createdUser = await User.create({
      schoolId: new ObjectId(schoolId),
      role: 'student',
      email: createStudentDto.email,
      passwordHash,
      domain,
      firstName: createStudentDto.firstName,
      lastName: createStudentDto.lastName,
      middleName: createStudentDto.middleName,
      phone: createStudentDto.phone,
      gender: createStudentDto.gender,
      dateOfBirth: createStudentDto.dateOfBirth ? new Date(createStudentDto.dateOfBirth) : undefined,
      isActive: true,
    });

    // Create student profile
    const createdStudent = await Student.create({
      userId: createdUser._id,
      schoolId: new ObjectId(schoolId),
      rollNumber,
      gradeLevel: createStudentDto.gradeLevel,
      section: createStudentDto.section,
      guardianName: createStudentDto.guardianName,
      guardianPhone: createStudentDto.guardianPhone,
      guardianEmail: createStudentDto.guardianEmail,
      guardianRelation: createStudentDto.guardianRelation,
      admissionDate: createStudentDto.admissionDate ? new Date(createStudentDto.admissionDate) : undefined,
      bloodGroup: createStudentDto.bloodGroup,
      medicalNotes: createStudentDto.medicalNotes,
      isAlumni: false,
    });

    return createdStudent.toObject();
  }

  async findAll(schoolId) {
    const { ObjectId } = mongoose.Types;
    const students = await Student.find({
      schoolId: new ObjectId(schoolId),
      isAlumni: false,
    }).populate('userId', 'firstName lastName email studentId');

    return students.map((student) => student.toObject());
  }

  async findOne(schoolId, id) {
    const { ObjectId } = mongoose.Types;
    const student = await Student.findOne({
      _id: id,
      schoolId: new ObjectId(schoolId),
    }).populate('userId', 'firstName lastName email studentId phone gender dateOfBirth');

    if (!student) {
      throw new NotFoundException('Student not found');
    }

    return student.toObject();
  }

  async findByUserId(schoolId, userId) {
    const { ObjectId } = mongoose.Types;
    const student = await Student.findOne({
      schoolId: new ObjectId(schoolId),
      userId: new ObjectId(userId),
    }).populate('userId');

    if (!student) {
      throw new NotFoundException('Student not found');
    }

    return student.toObject();
  }

  async update(schoolId, id, updateStudentDto) {
    const { ObjectId } = mongoose.Types;
    const updateData = { ...updateStudentDto };

    if (updateStudentDto.admissionDate) {
      updateData.admissionDate = new Date(updateStudentDto.admissionDate);
    }

    // Update student profile
    const updatedStudent = await Student.findOneAndUpdate(
      { _id: id, schoolId: new ObjectId(schoolId) },
      updateData,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedStudent) {
      throw new NotFoundException('Student not found');
    }

    // Update user if needed
    if (
      updateStudentDto.email ||
      updateStudentDto.firstName ||
      updateStudentDto.lastName ||
      updateStudentDto.phone ||
      updateStudentDto.gender ||
      updateStudentDto.dateOfBirth
    ) {
      const userUpdateData = {};
      if (updateStudentDto.email) userUpdateData.email = updateStudentDto.email;
      if (updateStudentDto.firstName) userUpdateData.firstName = updateStudentDto.firstName;
      if (updateStudentDto.lastName) userUpdateData.lastName = updateStudentDto.lastName;
      if (updateStudentDto.phone) userUpdateData.phone = updateStudentDto.phone;
      if (updateStudentDto.gender) userUpdateData.gender = updateStudentDto.gender;
      if (updateStudentDto.dateOfBirth) userUpdateData.dateOfBirth = new Date(updateStudentDto.dateOfBirth);

      if (Object.keys(userUpdateData).length > 0) {
        await User.findOneAndUpdate(
          { _id: updatedStudent.userId, schoolId: new ObjectId(schoolId) },
          userUpdateData
        );
      }
    }

    return updatedStudent.toObject();
  }

  async remove(schoolId, id) {
    const { ObjectId } = mongoose.Types;
    const student = await Student.findOne({
      _id: id,
      schoolId: new ObjectId(schoolId),
    });

    if (!student) {
      throw new NotFoundException('Student not found');
    }

    // Soft delete user
    await User.findOneAndUpdate(
      { _id: student.userId, schoolId: new ObjectId(schoolId) },
      { isActive: false }
    );

    // Mark as alumni
    await Student.findOneAndUpdate({ _id: id }, { isAlumni: true });
  }
}

export const studentService = new StudentService();