import mongoose from 'mongoose';
import { Student } from '../../modules/student/student.schema.js';

/**
 * Generates a unique roll number for a student in a specific school.
 * Checks if the roll number is already assigned to another student in the same school.
 */
export const generateUniqueRollNumber = async (schoolId) => {
  const { ObjectId } = mongoose.Types;
  const currentYear = new Date().getFullYear();
  const count = await Student.countDocuments({ schoolId: new ObjectId(schoolId) });

  let sequence = count + 1;
  let rollNumber = `STU-${currentYear}-${String(sequence).padStart(4, '0')}`;

  // Check if this roll number belongs to any other student in the same school
  let existingStudent = await Student.findOne({
    schoolId: new ObjectId(schoolId),
    rollNumber,
  });

  while (existingStudent) {
    sequence++;
    rollNumber = `STU-${currentYear}-${String(sequence).padStart(4, '0')}`;
    existingStudent = await Student.findOne({
      schoolId: new ObjectId(schoolId),
      rollNumber,
    });
  }

  return rollNumber;
};
