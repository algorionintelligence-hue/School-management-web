export const UserRole = {
  ADMIN: 'admin',
  TEACHER: 'teacher',
  STUDENT: 'student',
  STAFF: 'staff',
};

export const Gender = {
  MALE: 'male',
  FEMALE: 'female',
  OTHER: 'other',
};

export const GuardianRelation = {
  FATHER: 'father',
  MOTHER: 'mother',
  GUARDIAN: 'guardian',
  OTHER: 'other',
};

export const AttendanceStatus = {
  PRESENT: 'present',
  ABSENT: 'absent',
  LATE: 'late',
  EXCUSED: 'excused',
};

export const EnrollmentStatus = {
  ACTIVE: 'active',
  WITHDRAWN: 'withdrawn',
  COMPLETED: 'completed',
};

export const AssessmentType = {
  EXAM: 'exam',
  QUIZ: 'quiz',
  ASSIGNMENT: 'assignment',
  PROJECT: 'project',
};

export const StudentStatus = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  ALUMNI: 'alumni',
};

export const TeacherStatus = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  ON_LEAVE: 'on_leave',
};

export const SchoolStatus = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  SUSPENDED: 'suspended',
};

// Helper function to get all enum values
export const getEnumValues = (enumObj) => {
  return Object.values(enumObj);
};