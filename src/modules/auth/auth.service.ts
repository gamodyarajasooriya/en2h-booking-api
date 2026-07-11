import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  public async register(dto: RegisterDto) {
    // 1. Check for duplicate email
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new ConflictException('Email address already registered');
    }

    // 2. Hash password securely
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(dto.password, saltRounds);

    // 3. Persist user
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: hashedPassword,
      },
    });

    // Strip password from response for security parameters
    return {
      id: user.id,
      email: user.email,
      createdAt: user.createdAt,
    };
  }

  public async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid) throw new UnauthorizedException('Invalid credentials');

    const payload = { sub: user.id, email: user.email };
    
    // Access Token (Short-lived)
    const accessToken = this.jwtService.sign(payload, { 
      secret: process.env.JWT_SECRET || 'fallbackAccessKey',
      expiresIn: '15m' 
    });

    // Refresh Token (Long-lived) - Distinct Secret Used Here
    const refreshToken = this.jwtService.sign(payload, { 
      secret: process.env.JWT_REFRESH_SECRET || 'fallbackRefreshKey',
      expiresIn: '7d' 
    });

    // Save hashed refresh token to DB
    const hashedRt = await bcrypt.hash(refreshToken, 10);
    await this.prisma.user.update({
      where: { id: user.id },
      data: { refreshToken: hashedRt },
    });

    return { access_token: accessToken, refresh_token: refreshToken };
  }

  public async refreshTokens(userId: string, refreshToken: string) {
    // Verify the signature and expiration of the refresh token using the distinct refresh secret
    try {
      this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET || 'fallbackRefreshKey',
      });
    } catch (error) {
      throw new UnauthorizedException('Access Denied');
    }

    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user || !user.refreshToken) throw new UnauthorizedException('Access Denied');

    const rtMatches = await bcrypt.compare(refreshToken, user.refreshToken);
    if (!rtMatches) throw new UnauthorizedException('Access Denied');

    const payload = { sub: user.id, email: user.email };
    const accessToken = this.jwtService.sign(payload, { 
      secret: process.env.JWT_SECRET || 'fallbackAccessKey',
      expiresIn: '15m' 
    });

    return { access_token: accessToken };
  }
}
