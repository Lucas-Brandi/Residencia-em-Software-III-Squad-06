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
import { PullRequestsService } from './pull-requests.service';
import { CreatePullRequestDto } from './dto/create-pull-request.dto';
import { UpdatePullRequestDto } from './dto/update-pull-request.dto';

@Controller('pull-requests')
export class PullRequestsController {
  constructor(private readonly pullRequestsService: PullRequestsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createPullRequestDto: CreatePullRequestDto) {
    const pullRequest =
      await this.pullRequestsService.create(createPullRequestDto);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Pull request created successfully',
      data: pullRequest,
    };
  }

  @Get()
  async findAll() {
    const pullRequests = await this.pullRequestsService.findAll();
    return {
      statusCode: HttpStatus.OK,
      data: pullRequests,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const pullRequest = await this.pullRequestsService.findOne(id);
    return {
      statusCode: HttpStatus.OK,
      data: pullRequest,
    };
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updatePullRequestDto: UpdatePullRequestDto,
  ) {
    const pullRequest = await this.pullRequestsService.update(
      id,
      updatePullRequestDto,
    );
    return {
      statusCode: HttpStatus.OK,
      message: 'Pull request updated successfully',
      data: pullRequest,
    };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const pullRequest = await this.pullRequestsService.remove(id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Pull request deleted successfully',
      data: pullRequest,
    };
  }
}
