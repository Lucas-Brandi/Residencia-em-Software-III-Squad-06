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
} from '@nestjs/common';
import { RepositoriesService } from './repositories.service';
import { CreateRepositoryDto } from './dto/create-repository.dto';
import { UpdateRepositoryDto } from './dto/update-repository.dto';

@Controller('repositories')
export class RepositoriesController {
  constructor(private readonly repositoriesService: RepositoriesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createRepositoryDto: CreateRepositoryDto) {
    const repository =
      await this.repositoriesService.create(createRepositoryDto);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Repository created successfully',
      data: repository,
    };
  }

  @Get()
  async findAll() {
    const repositories = await this.repositoriesService.findAll();
    return {
      statusCode: HttpStatus.OK,
      data: repositories,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const repository = await this.repositoriesService.findOne(id);
    return {
      statusCode: HttpStatus.OK,
      data: repository,
    };
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateRepositoryDto: UpdateRepositoryDto,
  ) {
    const repository = await this.repositoriesService.update(
      id,
      updateRepositoryDto,
    );
    return {
      statusCode: HttpStatus.OK,
      message: 'Repository updated successfully',
      data: repository,
    };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const repository = await this.repositoriesService.remove(id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Repository deleted successfully (soft delete)',
      data: repository,
    };
  }
}
