import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { Role } from './enums/role.enum';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  // ─── LOGIN ──────────────────────────────────────────────────────────────────

  async login(loginDto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { username: loginDto.username },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: user.id, username: user.username, role: user.role };

    const { accessToken, refreshToken } = await this.generateTokens(payload);

    const { password: _, ...userWithoutPassword } = user;

    return {
      accessToken,
      refreshToken,
      user: {
        id: userWithoutPassword.id,
        username: userWithoutPassword.username,
        role: userWithoutPassword.role as Role,
      },
    };
  }

  // ─── REFRESH ─────────────────────────────────────────────────────────────────

  async refreshTokens(refreshToken: string) {
    // Verifica e decodifica o refresh token
    let payload: any;
    try {
      payload = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET ?? 'dev-refresh-secret-inseguro',
      });
    } catch {
      throw new UnauthorizedException('Refresh token inválido ou expirado');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
    });

    if (!user || !user.refreshToken) {
      throw new UnauthorizedException('Sessão encerrada. Faça login novamente');
    }

    // Compara o token recebido com o hash armazenado
    const tokenMatches = await bcrypt.compare(refreshToken, user.refreshToken);
    if (!tokenMatches) {
      throw new UnauthorizedException('Refresh token inválido');
    }

    const newPayload = {
      sub: user.id,
      username: user.username,
      role: user.role,
    };
    const tokens = await this.generateTokens(newPayload);

    return tokens;
  }

  // ─── LOGOUT ──────────────────────────────────────────────────────────────────

  async logout(userId: number) {
    // Remove o refresh token do banco — invalida a sessão
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken: null },
    });
  }

  // ─── VALIDATE (usado pelo JwtStrategy) ──────────────────────────────────────

  async validateUser(userId: number) {
    try {
      const user = await this.prisma.user.findUnique({ where: { id: userId } });
      if (!user) return null;
      const { password: _, ...userWithoutPassword } = user;
      return userWithoutPassword;
    } catch (error) {
      console.error('[validateUser] Database error:', error);
      return null;
    }
  }

  // ─── REGISTER ────────────────────────────────────────────────────────────────

  async register(registerDto: RegisterDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { username: registerDto.username },
    });

    if (existingUser) {
      throw new ConflictException('Username already exists');
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    const newUser = await this.prisma.user.create({
      data: {
        username: registerDto.username,
        password: hashedPassword,
        role: Role.USER,
      },
    });

    const { password: _, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  }

  // ─── HELPERS ─────────────────────────────────────────────────────────────────

  private async generateTokens(payload: {
    sub: number;
    username: string;
    role: string;
  }) {
    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET ?? 'dev-secret-inseguro-nao-use-em-prod',
      expiresIn: (process.env.JWT_EXPIRES_IN ?? '15m') as any,
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET ?? 'dev-refresh-secret-inseguro',
      expiresIn: (process.env.JWT_REFRESH_EXPIRES_IN ?? '7d') as any,
    });

    // Armazena o hash do refresh token no banco
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.prisma.user.update({
      where: { id: payload.sub },
      data: { refreshToken: hashedRefreshToken },
    });

    return { accessToken, refreshToken };
  }
}
