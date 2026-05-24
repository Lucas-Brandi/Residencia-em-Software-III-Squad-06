import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { Prisma, UserStatus } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    try {
      const user = await this.prisma.user.create({
        data: {
          username: createUserDto.username,
          email: createUserDto.email,
          githubUsername: createUserDto.githubUsername,
          avatarUrl: createUserDto.avatarUrl,
          password: hashedPassword,
          role: createUserDto.role,
          status: createUserDto.status ?? UserStatus.PENDENTE,
        },
      });

      const { password: _, ...userWithoutPassword } = user;
      return userWithoutPassword;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException('Username ou e-mail já cadastrado');
        }
      }
      throw error;
    }
  }

  async findAll() {
    const users = await this.prisma.user.findMany();
    return users.map(({ password: _, ...u }) => u);
  }

  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const existingUser = await this.prisma.user.findUnique({ where: { id } });

    if (!existingUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    const updateData: Prisma.UserUpdateInput = {
      username: updateUserDto.username,
      email: updateUserDto.email,
      githubUsername: updateUserDto.githubUsername,
      avatarUrl: updateUserDto.avatarUrl,
      role: updateUserDto.role,
      status: updateUserDto.status,
    };

    if (updateUserDto.password) {
      updateData.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    try {
      const updatedUser = await this.prisma.user.update({
        where: { id },
        data: updateData,
      });

      const { password: _, ...userWithoutPassword } = updatedUser;
      return userWithoutPassword;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException('Username ou e-mail já cadastrado');
        }
      }
      throw error;
    }
  }

  async remove(id: number) {
    const existingUser = await this.prisma.user.findUnique({ where: { id } });

    if (!existingUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    await this.prisma.user.delete({ where: { id } });

    const { password: _, ...userWithoutPassword } = existingUser;
    return userWithoutPassword;
  }
}
