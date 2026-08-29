import { User } from '../user/user.schema.js';
import { School } from '../school/school.schema.js';
import { Teacher } from '../teacher/teacher.schema.js';
import { Student } from '../student/student.schema.js';
import { UnauthorizedException, NotFoundException } from '../../common/errors/HttpException.js';
import { comparePassword } from '../../common/utils/password.util.js';
import { generateToken } from '../../common/utils/jwt.util.js';
import { UserRole } from '../../common/constants.js';

export class AuthService {
  async login(loginDto) {
    const { email, password, domain } = loginDto;

    // 1. First find the school by domain (and verify it is active)
    const school = await School.findOne({ 
      domain: domain.toLowerCase().trim(), 
    });

    if (!school) {
      throw new UnauthorizedException('Invalid domain or school is inactive');
    }

    // 2. Find the user belonging to THIS school using school._id (or businessId) & email
    const user = await User.findOne({
      schoolId: school._id,
      email: email.toLowerCase().trim(),
    }).select('+passwordHash');

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // 3. Verify password
    const isMatch = await comparePassword(password, user.passwordHash);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // 4. Update last login timestamp
    await User.findByIdAndUpdate(user._id, { lastLoginAt: new Date() });

    // 5. Load role-specific profile scoped to the tenant
    let profile = null;
    if (user.role === UserRole.TEACHER) {
      profile = await Teacher.findOne({ userId: user._id, schoolId: school._id });
    } else if (user.role === UserRole.STUDENT) {
      profile = await Student.findOne({ userId: user._id, schoolId: school._id });
    }

    // 6. Generate JWT payload with tenant context
    const payload = {
      userId: user._id,
      schoolId: school._id,
      businessId: school.businessId,
      domain: school.domain,
      role: user.role,
      email: user.email,
    };

    const token = generateToken(payload);

    return {
      token,
      user: {
        userId: user._id,
        schoolId: school._id,
        businessId: school.businessId,
        role: user.role,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        profile,
      },
    };
  }



  async validateToken(token) {
    const { verifyToken } = await import('../../common/utils/jwt.util.js');
    try {
      return verifyToken(token);
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}

export const authService = new AuthService();