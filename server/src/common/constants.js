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

export const SchoolRange = Object.freeze({
  PRIMARY_TO_SECONDARY: "1-10",
  HIGHER_SECONDARY: "11-12",
});

export const SchoolShift = Object.freeze({
  MORNING: "morning",
  EVENING: "evening",
});

export const SchoolBoard = Object.freeze({
  FEDERAL: "Federal Board",
  SINDH: "Sindh Board",
  PUNJAB: "Punjab Board",
  BALOCHISTAN: "Balochistan Board",
  KHYBER_PAKHTUNKHWA: "Khyber Pakhtunkhwa Board",
  PRIVATE: "Private Board",
});

export const GradeLevel = Object.freeze({
  NURSERY: 'Nursery',
  LKG: 'LKG',
  UKG: 'UKG',
  GRADE_1: '1st',
  GRADE_2: '2nd',
  GRADE_3: '3rd',
  GRADE_4: '4th',
  GRADE_5: '5th',
  GRADE_6: '6th',
  GRADE_7: '7th',
  GRADE_8: '8th',
  GRADE_9: '9th',
  GRADE_10: '10th',
  GRADE_11: '11th',
  GRADE_12: '12th',
});

export const Section = Object.freeze({
  A: 'A',
  B: 'B',
  C: 'C',
  D: 'D',
  E: 'E',
  F: 'F',
});

export const BloodGroup = Object.freeze({
  A_POSITIVE: 'A+',
  A_NEGATIVE: 'A-',
  B_POSITIVE: 'B+',
  B_NEGATIVE: 'B-',
  AB_POSITIVE: 'AB+',
  AB_NEGATIVE: 'AB-',
  O_POSITIVE: 'O+',
  O_NEGATIVE: 'O-',
});

export const ClassStream = {
  SCIENCE: "Science",
  ARTS: "Arts",
  COMMERCE: "Commerce",
};


// src/modules/subjects/subject.constants.js

export const SubjectType = {
  COMPULSORY: "Core",
  ELECTIVE: "Elective",
};

export const SubjectCategory = {
  LANGUAGE: "Language",
  SCIENCE: "Science",
  MATHEMATICS: "Mathematics",
  SOCIAL_SCIENCE: "SocialScience",
  ARTS: "Arts",
  PHYSICAL_EDUCATION: "PhysicalEducation",
  VOCATIONAL: "Vocational",
  OTHER: "Other",
};

export const TeacherSubjectRole = {
  PRIMARY: "primary",
  CO_TEACHER: "co_teacher",
};

export const Status = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  SUSPENDED: 'archived',
};

export const StreamCode = {
  SCIENCE: "SCI",
  COMMERCE: "COM",
  ARTS: "ART",
};

// Helper function to get all enum values
export const getEnumValues = (enumObj) => {
  return Object.values(enumObj);
};