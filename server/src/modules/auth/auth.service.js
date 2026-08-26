import { User } from '../user/user.schema.js';
import { School } from '../school/school.schema.js';
import { Teacher } from '../teacher/teacher.schema.js';
import { Student } from '../student/student.schema.js';
import { UnauthorizedException, NotFoundException } from '../../common/errors/HttpException.js';
import { comparePassword } from '../../common/utils/password.util.js';
import { generateToken } from '../../common/utils/jwt.util.js';

export class AuthService {
  async login(loginDto) {
    const { email, password, domain } = loginDto;

    // Find user by domain and email
    const user = await User.findOne({ domain, email }).select('+passwordHash');

    if (!user || !user.isActive) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Verify password
    const isMatch = await comparePassword(password, user.passwordHash);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Verify school is active
    const school = await School.findOne({ _id: user.schoolId, isActive: true });
    if (!school) {
      throw new UnauthorizedException('School is not active');
    }

    // Update last login
    await User.findByIdAndUpdate(user._id, { lastLoginAt: new Date() });

    // Load role-specific profile
    let profile = null;
    if (user.role === 'teacher') {
      profile = await Teacher.findOne({ userId: user._id });
    } else if (user.role === 'student') {
      profile = await Student.findOne({ userId: user._id });
    }

    // Generate JWT token
    const payload = {
      userId: user._id.toString(),
      schoolId: user.schoolId.toString(),
      role: user.role,
      email: user.email,
    };

    const token = generateToken(payload);

    return {
      token,
      user: {
        userId: user._id.toString(),
        schoolId: user.schoolId.toString(),
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