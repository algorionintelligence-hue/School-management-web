import { User } from '../user/user.schema.js';
import { School } from '../school/school.schema.js';
import { Teacher } from '../teacher/teacher.schema.js';
import { Student } from '../student/student.schema.js';
import { UnauthorizedException, NotFoundException, BadRequestException, ConflictException } from '../../common/errors/HttpException.js';
import { comparePassword, hashPassword } from '../../common/utils/password.util.js';
import { generateToken, verifyToken } from '../../common/utils/jwt.util.js';
import { UserRole } from '../../common/constants.js';
import { EmailVerificationToken } from './email-verification.model.js';
import { PasswordResetToken } from './password-reset.model.js';
import { generateVerificationToken, hashVerificationToken } from '../../common/utils/verification-token.js';
import { sendVerificationEmail, sendPasswordResetEmail } from '../../common/utils/email-service.js';

export class AuthService {
  async signup(signupDto) {
    const { email, password, firstName, lastName } = signupDto;
    const cleanEmail = email.toLowerCase().trim();

    const existingUser = await User.findOne({ email: cleanEmail });
    if (existingUser) {
      if (existingUser.schoolId) {
        throw new ConflictException('An account with this email already exists.');
      }
      if (existingUser.emailVerified) {
        throw new ConflictException('Email is already verified. Please log in to complete school registration.');
      }
      // Unverified user without school -> Re-send verification email
      const rawToken = await this.createEmailVerificationToken(existingUser._id);
      try {
        await sendVerificationEmail({
          to: existingUser.email,
          firstName: existingUser.firstName,
          verificationToken: rawToken,
        });
      } catch (err) {
        console.error('Failed to send verification email:', err.message);
      }
      return {
        message: 'A verification email has been re-sent. Please check your inbox.',
      };
    }

    const passwordHash = await hashPassword(password);
    const user = await User.create({
      email: cleanEmail,
      passwordHash,
      firstName,
      lastName,
      role: UserRole.ADMIN,
      schoolId: null,
      isActive: true,
      emailVerified: false,
    });

    const rawToken = await this.createEmailVerificationToken(user._id);
    try {
      await sendVerificationEmail({
        to: user.email,
        firstName: user.firstName,
        verificationToken: rawToken,
      });
    } catch (err) {
      console.error('Failed to send verification email:', err.message);
    }

    return {
      message: 'Registration successful. Please check your email to verify your account.',
      userId: user._id,
    };
  }

  async login(loginDto) {
    const { email, password, domain } = loginDto;
    const cleanEmail = email.toLowerCase().trim();

    // Case 1: Domain provided -> Tenant login
    if (domain) {
      const school = await School.findOne({
        domain: domain.toLowerCase().trim(),
      });

      if (!school) {
        throw new UnauthorizedException('Invalid domain or school is inactive');
      }

      const user = await User.findOne({
        schoolId: school._id,
        email: cleanEmail,
      }).select('+passwordHash');

      if (!user) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const isMatch = await comparePassword(password, user.passwordHash);
      if (!isMatch) {
        throw new UnauthorizedException('Invalid credentials');
      }

      await User.findByIdAndUpdate(user._id, { lastLoginAt: new Date() });

      let profile = null;
      if (user.role === UserRole.TEACHER) {
        profile = await Teacher.findOne({ userId: user._id, schoolId: school._id });
      } else if (user.role === UserRole.STUDENT) {
        profile = await Student.findOne({ userId: user._id, schoolId: school._id });
      }

      const payload = {
        userId: user._id,
        schoolId: school._id,
        role: user.role,
        email: user.email,
      };

      const token = generateToken(payload);

      return {
        token,
        user: {
          userId: user._id,
          schoolId: school._id,
          role: user.role,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          profile,
        },
      };
    }

    // Case 2: No domain provided -> Onboarding Admin Login
    const user = await User.findOne({
      email: cleanEmail,
      role: UserRole.ADMIN,
    }).select('+passwordHash');

    if (!user) {
      throw new UnauthorizedException('Invalid credentials or domain required for non-admin login');
    }

    const isMatch = await comparePassword(password, user.passwordHash);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.emailVerified) {
      throw new UnauthorizedException('Email is not verified. Please verify your email before logging in.');
    }

    await User.findByIdAndUpdate(user._id, { lastLoginAt: new Date() });

    let schoolId = user.schoolId;
    let school = null;
    if (schoolId) {
      school = await School.findById(schoolId);
    }

    const payload = {
      userId: user._id,
      schoolId: schoolId || null,
      role: user.role,
      email: user.email,
    };

    const token = generateToken(payload);

    return {
      token,
      user: {
        userId: user._id,
        schoolId: schoolId || null,
        schoolDomain: school ? school.domain : null,
        role: user.role,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        emailVerified: user.emailVerified,
        requiresSchoolRegistration: !schoolId,
      },
    };
  }

  async validateToken(token) {
    try {
      return verifyToken(token);
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  async verifyEmail(rawToken) {
    if (!rawToken || typeof rawToken !== "string") {
      throw new BadRequestException("Invalid verification link");
    }

    const tokenHash = hashVerificationToken(rawToken);

    const verificationRecord = await EmailVerificationToken.findOne({
      tokenHash,
    });

    if (!verificationRecord) {
      throw new BadRequestException(
        "Invalid or already-used verification link"
      );
    }

    if (verificationRecord.expiresAt.getTime() < Date.now()) {
      await EmailVerificationToken.deleteOne({
        _id: verificationRecord._id,
      });

      throw new BadRequestException(
        "This verification link has expired"
      );
    }

    const user = await User.findById(verificationRecord.userId);

    if (!user) {
      await EmailVerificationToken.deleteOne({
        _id: verificationRecord._id,
      });

      throw new NotFoundException("User account not found");
    }

    if (!user.emailVerified) {
      user.emailVerified = true;
      await user.save();
    }

    // Single-use token cleanup
    await EmailVerificationToken.deleteOne({
      _id: verificationRecord._id,
    });

    const token = generateToken({
      userId: user._id,
      schoolId: user.schoolId || null,
      role: user.role,
      email: user.email,
    });

    return {
      token,
      userId: user._id,
      email: user.email,
      emailVerified: user.emailVerified,
      requiresSchoolRegistration: !user.schoolId,
    };
  }

  async createEmailVerificationToken(userId, session = null) {
    const { rawToken, tokenHash } = generateVerificationToken();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const deleteQuery = EmailVerificationToken.deleteMany({ userId });
    if (session) deleteQuery.session(session);
    await deleteQuery;

    if (session) {
      await EmailVerificationToken.create([{ userId, tokenHash, expiresAt }], { session });
    } else {
      await EmailVerificationToken.create({ userId, tokenHash, expiresAt });
    }

    return rawToken;
  }

  async resendVerificationEmail(email) {
    if (!email || typeof email !== "string") {
      throw new BadRequestException("Email is required");
    }

    const cleanEmail = email.toLowerCase().trim();
    console.log(`🔍 [RESEND VERIFICATION]: Searching DB for user email: [${cleanEmail}]`);

    const user = await User.findOne({ email: cleanEmail });

    // Always return generic message for security
    const message = "If an account with this email exists, a new verification link has been sent.";

    if (!user) {
      console.log(`⚠️ [RESEND VERIFICATION]: User with email [${cleanEmail}] NOT FOUND in database! No email sent.`);
      return { message };
    }

    if (user.emailVerified) {
      console.log(`ℹ️ [RESEND VERIFICATION]: User [${cleanEmail}] is ALREADY VERIFIED (emailVerified: true). No email sent.`);
      return { message: "Email is already verified." };
    }

    console.log(`🚀 [RESEND VERIFICATION]: User found! Generating token and sending verification email...`);
    const rawToken = await this.createEmailVerificationToken(user._id);

    try {
      await sendVerificationEmail({
        to: user.email,
        firstName: user.firstName,
        verificationToken: rawToken,
      });
    } catch (err) {
      console.log(`Email sending FAILED for user ${cleanEmail}:`, err.message);
    }

    return { message };
  }

  async forgetPassword(email) {
    if (!email || typeof email !== "string") {
      throw new BadRequestException("Email is required");
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });

    const message = "If an account with this email exists, a password reset link has been sent.";

    if (!user) {
      return { message };
    }

    const { rawToken, tokenHash } = generateVerificationToken();
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await PasswordResetToken.deleteMany({ userId: user._id });
    await PasswordResetToken.create({
      userId: user._id,
      tokenHash,
      expiresAt,
    });

    try {
      await sendPasswordResetEmail({
      to: user.email,
      firstName: user.firstName,
      resetToken: rawToken,
    });
    } catch(err) {
      console.err(`failed to forget password: ${err.message}`)
    }

    return { message };
  }

  async resetPassword(rawToken, newPassword) {
    if (!rawToken || typeof rawToken !== "string") {
      throw new BadRequestException("Reset token is required");
    }

    if (!newPassword || typeof newPassword !== "string" || newPassword.length < 8) {
      throw new BadRequestException("New password must be at least 8 characters long");
    }

    const tokenHash = hashVerificationToken(rawToken);
    const resetRecord = await PasswordResetToken.findOne({ tokenHash });

    if (!resetRecord) {
      throw new BadRequestException("Invalid or already-used reset link");
    }

    if (resetRecord.expiresAt.getTime() < Date.now()) {
      await PasswordResetToken.deleteOne({ _id: resetRecord._id });
      throw new BadRequestException("This reset link has expired");
    }

    const user = await User.findById(resetRecord.userId);
    if (!user) {
      await PasswordResetToken.deleteOne({ _id: resetRecord._id });
      throw new NotFoundException("User account not found");
    }

    const newPasswordHash = await hashPassword(newPassword);
    user.passwordHash = newPasswordHash;
    await user.save();

    await PasswordResetToken.deleteOne({ _id: resetRecord._id });

    return {
      message: "Password has been reset successfully",
    };
  }

  async getCurrentUser(userId) {
    const user = await User.findById(userId);
    if (!user) {
      throw new NotFoundException("User not found");
    }

    let profile = null;
    if (user.role === UserRole.TEACHER) {
      profile = await Teacher.findOne({ userId: user._id, schoolId: user.schoolId });
    } else if (user.role === UserRole.STUDENT) {
      profile = await Student.findOne({ userId: user._id, schoolId: user.schoolId });
    }

    return {
      userId: user._id,
      schoolId: user.schoolId,
      role: user.role,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      emailVerified: user.emailVerified,
      profile,
    };
  }
}

export const authService = new AuthService();