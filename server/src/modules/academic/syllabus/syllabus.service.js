import mongoose from 'mongoose';
import { Syllabus } from './schemas/syllabus.schema.js';
import { Class } from '../class/schemas/class.schema.js';
import { ClassSubject } from '../class/schemas/class-subject.schema.js';
import { Status } from '../../../common/constants.js';
import {
  BadRequestException,
  NotFoundException,
  ConflictException,
} from '../../../common/errors/HttpException.js';

const { ObjectId } = mongoose.Types;

class SyllabusService {
  /**
   * Format syllabus document with progress percentage calculation
   */
  formatSyllabus(syllabusDoc) {
    if (!syllabusDoc) return null;
    const obj = typeof syllabusDoc.toObject === 'function' ? syllabusDoc.toObject() : syllabusDoc;

    const hours = obj.hours || 0;
    const completedHours = obj.completedHours || 0;
    const progressPercentage = hours > 0 ? parseFloat(((completedHours / hours) * 100).toFixed(2)) : 0;

    return {
      ...obj,
      progressPercentage: Math.min(progressPercentage, 100),
    };
  }

  /**
   * Create a new Syllabus
   */
  async createSyllabus(schoolId, dto) {
    const schoolObjId = new ObjectId(schoolId);
    const classObjId = new ObjectId(dto.classId);
    const classSubjectObjId = new ObjectId(dto.classSubjectId);

    // 1. Validate Class existence in school
    const classObj = await Class.findOne({ _id: classObjId, schoolId: schoolObjId });
    if (!classObj) {
      throw new NotFoundException('Class not found in this school');
    }

    // 2. Validate ClassSubject existence in school
    const classSubjectObj = await ClassSubject.findOne({
      _id: classSubjectObjId,
      schoolId: schoolObjId,
    });
    if (!classSubjectObj) {
      throw new NotFoundException('ClassSubject not found in this school');
    }

    // 3. Verify ClassSubject belongs to Class
    if (classSubjectObj.classId.toString() !== classObjId.toString()) {
      throw new BadRequestException('The specified ClassSubject does not belong to this Class');
    }

    // 4. Check for duplicate syllabus
    const duplicate = await Syllabus.findOne({
      schoolId: schoolObjId,
      academicYear: dto.academicYear.trim(),
      classId: classObjId,
      classSubjectId: classSubjectObjId,
    });

    if (duplicate) {
      throw new ConflictException(
        'A syllabus record already exists for this class subject and academic year'
      );
    }

    // 5. Create Syllabus (completedHours defaults to 0)
    const newSyllabus = await Syllabus.create({
      schoolId: schoolObjId,
      academicYear: dto.academicYear.trim(),
      classId: classObjId,
      classSubjectId: classSubjectObjId,
      hours: dto.hours,
      completedHours: 0,
      totalUnits: dto.totalUnits,
      status: dto.status || Status.ACTIVE,
    });

    return this.getSyllabusById(schoolId, newSyllabus._id);
  }

  /**
   * Update an existing Syllabus
   */
  async updateSyllabus(schoolId, syllabusId, dto) {
    const schoolObjId = new ObjectId(schoolId);
    const syllabusObjId = new ObjectId(syllabusId);

    const existing = await Syllabus.findOne({
      _id: syllabusObjId,
      schoolId: schoolObjId,
    });

    if (!existing) {
      throw new NotFoundException('Syllabus not found');
    }

    if (dto.academicYear) existing.academicYear = dto.academicYear.trim();
    if (dto.hours !== undefined) existing.hours = dto.hours;
    if (dto.completedHours !== undefined) existing.completedHours = dto.completedHours;
    if (dto.totalUnits !== undefined) existing.totalUnits = dto.totalUnits;
    if (dto.status) existing.status = dto.status;

    await existing.save();

    return this.getSyllabusById(schoolId, existing._id);
  }

  /**
   * Get Syllabuses by Class
   */
  async getSyllabusesByClass(schoolId, classId, filters = {}) {
    const schoolObjId = new ObjectId(schoolId);
    const classObjId = new ObjectId(classId);

    const query = {
      schoolId: schoolObjId,
      classId: classObjId,
    };

    if (filters.academicYear) query.academicYear = filters.academicYear.trim();
    if (filters.status) query.status = filters.status;

    const syllabuses = await Syllabus.find(query)
      .populate('classId', 'name level section academicSession')
      .populate({
        path: 'classSubjectId',
        populate: [
          { path: 'subjectId', select: 'name code category' },
          { path: 'teacherId', select: 'firstName lastName email' },
        ],
      })
      .sort({ createdAt: -1 });

    return syllabuses.map((s) => this.formatSyllabus(s));
  }

  /**
   * Get single Syllabus by ID
   */
  async getSyllabusById(schoolId, syllabusId) {
    const schoolObjId = new ObjectId(schoolId);
    const syllabusObjId = new ObjectId(syllabusId);

    const syllabus = await Syllabus.findOne({
      _id: syllabusObjId,
      schoolId: schoolObjId,
    })
      .populate('classId', 'name level section academicSession')
      .populate({
        path: 'classSubjectId',
        populate: [
          { path: 'subjectId', select: 'name code category' },
          { path: 'teacherId', select: 'firstName lastName email' },
        ],
      });

    if (!syllabus) {
      throw new NotFoundException('Syllabus not found');
    }

    return this.formatSyllabus(syllabus);
  }

  /**
   * Delete Syllabus
   */
  async deleteSyllabus(schoolId, syllabusId) {
    const schoolObjId = new ObjectId(schoolId);
    const syllabusObjId = new ObjectId(syllabusId);

    const deleted = await Syllabus.findOneAndDelete({
      _id: syllabusObjId,
      schoolId: schoolObjId,
    });

    if (!deleted) {
      throw new NotFoundException('Syllabus not found');
    }

    return { message: 'Syllabus deleted successfully' };
  }
}

export const syllabusService = new SyllabusService();
