import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  HttpCode,
  ParseIntPipe,
  UseGuards,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';

@ApiTags('Users')
@ApiBearerAuth('access-token')
@UseGuards(RolesGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // ─── CREATE (ADMIN only) ───────────────────────────────────────────────────

  @Post()
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Criar usuário (Admin only)' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ status: 201, description: 'Usuário criado com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin only' })
  @ApiResponse({ status: 409, description: 'Nome de usuário já existe' })
  async create(@Body() createUserDto: CreateUserDto) {
    const user = await this.usersService.create(createUserDto);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'User created successfully',
      data: user,
    };
  }

  // ─── GET ALL (ADMIN only) ──────────────────────────────────────────────────

  @Get()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Listar todos os usuários (Admin only)' })
  @ApiResponse({
    status: 200,
    description: 'Lista de usuários retornada com sucesso',
  })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin only' })
  async findAll() {
    const users = await this.usersService.findAll();
    return { statusCode: HttpStatus.OK, data: users };
  }

  // ─── GET ME (qualquer usuário logado) ─────────────────────────────────────

  @Get('me')
  @ApiOperation({ summary: 'Buscar perfil do usuário logado' })
  @ApiResponse({ status: 200, description: 'Perfil retornado com sucesso' })
  async getMe(@Request() req: any) {
    const user = await this.usersService.findOne(req.user.id);
    return { statusCode: HttpStatus.OK, data: user };
  }

  // ─── GET BY ID (ADMIN only) ────────────────────────────────────────────────

  @Get(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Buscar usuário por ID (Admin only)' })
  @ApiParam({ name: 'id', description: 'ID numérico do usuário', type: Number })
  @ApiResponse({ status: 200, description: 'Usuário encontrado' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin only' })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const user = await this.usersService.findOne(id);
    return { statusCode: HttpStatus.OK, data: user };
  }

  // ─── UPDATE (ADMIN pode tudo, USER pode atualizar só a si mesmo) ──────────

  @Patch(':id')
  @ApiOperation({
    summary: 'Atualizar usuário',
    description:
      'Admin pode atualizar qualquer usuário. USER só pode atualizar o próprio perfil.',
  })
  @ApiParam({ name: 'id', description: 'ID numérico do usuário', type: Number })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({ status: 200, description: 'Usuário atualizado com sucesso' })
  @ApiResponse({
    status: 403,
    description: 'Sem permissão para alterar este usuário',
  })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
  @ApiResponse({ status: 409, description: 'Nome de usuário já existe' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
    @Request() req: any,
  ) {
    const requestingUser = req.user;

    // USER só pode alterar o próprio perfil — e não pode alterar a própria role
    if (requestingUser.role !== Role.ADMIN) {
      if (requestingUser.id !== id) {
        return {
          statusCode: 403,
          message: 'Você só pode atualizar o seu próprio perfil',
        };
      }
      // Impede USER de se auto-promover a ADMIN
      delete updateUserDto.role;
    }

    const user = await this.usersService.update(id, updateUserDto);
    return {
      statusCode: HttpStatus.OK,
      message: 'User updated successfully',
      data: user,
    };
  }

  // ─── DELETE (ADMIN only) ───────────────────────────────────────────────────

  @Delete(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Remover usuário (Admin only)' })
  @ApiParam({ name: 'id', description: 'ID numérico do usuário', type: Number })
  @ApiResponse({ status: 200, description: 'Usuário removido com sucesso' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin only' })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    const user = await this.usersService.remove(id);
    return {
      statusCode: HttpStatus.OK,
      message: 'User deleted successfully',
      data: user,
    };
  }
}
