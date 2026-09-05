import { User } from '../user/user.schema.js';
import { School } from '../school/school.schema.js';
import { Teacher } from '../teacher/teacher.schema.js';
import { Student } from '../student/student.schema.js';
import { UnauthorizedException, NotFoundException } from '../../common/errors/HttpException.js';
import { comparePassword } from '../../common/utils/password.util.js';
import { generateToken } from '../../common/utils/jwt.util.js';
import { UserRole } from '../../common/constants.js';
import { EmailVerificationToken } from './email-verification.model.js';
import { hashVerificationToken } from '../../common/utils/verification-token.js';
import { sendVerificationEmail } from '../../common/utils/email-service.js';
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

  async verifyEmail(rawToken) {
    if (!rawToken || typeof rawToken !== "string") {
      throw new AppError("Invalid verification link", 400);
    }

    const tokenHash = hashVerificationToken(rawToken);

    const verificationRecord = await EmailVerificationToken.findOne({
        tokenHash,
      });

    if (!verificationRecord) {
      throw new AppError(
        "Invalid or already-used verification link",
        400
      );
    }

    if (verificationRecord.expiresAt.getTime() < Date.now()) {
      await EmailVerificationToken.deleteOne({
        _id: verificationRecord._id,
      });

      throw new Error(
        "This verification link has expired",
        400
      );
    }

    const user = await User.findById(
      verificationRecord.userId
    );

    if (!user) {
      await EmailVerificationToken.deleteOne({
        _id: verificationRecord._id,
      });

      throw new AppError("User account not found", 404);
    }

    if (!user.emailVerified) {
      user.emailVerified = true;
      await user.save();
    }

    // Makes the token single-use.
    await EmailVerificationToken.deleteOne({
      _id: verificationRecord._id,
    });

    return {
      userId: user._id,
      email: user.email,
      emailVerified: user.emailVerified,
    };
  }

  async createEmailVerificationToken(userId, session) {
    const { rawToken, tokenHash } = generateVerificationToken();
    const expiresAt = new Date(
      Date.now() + 24 * 60 * 60 * 1000
    );
    await EmailVerificationToken.deleteMany(
      { userId },
      { session }
    );
    await EmailVerificationToken.create(
      [
        {
          userId,
          tokenHash,
          expiresAt,
        },
      ],
      { session }
    );
    return rawToken;
  }

  async resendVerificationEmail(req, res, next) {
    try {
      const { email } = req.body;

      const user = await User.findOne({ email });

      // Always return a generic response for security
      const message =
        "If an account with this email exists, a new verification link has been sent.";

      if (!user) {
        return res.status(200).json({ success: true, message });
      }

      const rawToken = await createEmailVerificationToken(user._id);

      await sendVerificationEmail({
        to: user.email,
        firstName: user.firstName,
        verificationToken: rawToken,
      });

      return message
    } catch (error) {
      next(error);
    }
  }

 async resetPassword(req, res, next) {
    try {
      const { token, newPassword } = req.body;

      if (!token || typeof token !== "string") {
        throw new AppError("Reset token is required", 400);
      }

      if (!newPassword || typeof newPassword !== "string") {
        throw new AppError("New password is required", 400);
      }

      const result = await authService.resetPassword(token, newPassword);

      return {
        
      }
    } catch (error) {
      next(error);
    }
  }

 async requestPasswordReset(req, res, next) {
    try {
      const { email } = req.body;

      if (!email || typeof email !== "string") {
        throw new AppError("Email is required", 400);
      }

      const result = await authService.requestPasswordReset(email);

      return res.status(StatusCodes.OK).json({
        success: true,
        ...result, // { message: "..." }
      });
    } catch (error) {
      next(error);
    }
  }

  async me(req, res, next) {
    try {
      // Assuming you have an auth middleware that attaches req.user via validateToken
      if (!req.user) {
        throw new AppError("Unauthorized", 401);
      }

      return res.status(StatusCodes.OK).json({
        success: true,
        data: req.user,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const authService = new AuthService();