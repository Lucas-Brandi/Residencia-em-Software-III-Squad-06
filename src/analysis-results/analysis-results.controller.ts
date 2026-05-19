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
import { AnalysisResultsService } from './analysis-results.service';
import { CreateAnalysisResultDto } from './dto/create-analysis-result.dto';
import { UpdateAnalysisResultDto } from './dto/update-analysis-result.dto';

@Controller('analysis-results')
export class AnalysisResultsController {
  constructor(
    private readonly analysisResultsService: AnalysisResultsService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createAnalysisResultDto: CreateAnalysisResultDto) {
    const analysisResult = await this.analysisResultsService.create(
      createAnalysisResultDto,
    );
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Analysis result created successfully',
      data: analysisResult,
    };
  }

  @Get()
  async findAll() {
    const analysisResults = await this.analysisResultsService.findAll();
    return {
      statusCode: HttpStatus.OK,
      data: analysisResults,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const analysisResult = await this.analysisResultsService.findOne(id);
    return {
      statusCode: HttpStatus.OK,
      data: analysisResult,
    };
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateAnalysisResultDto: UpdateAnalysisResultDto,
  ) {
    const analysisResult = await this.analysisResultsService.update(
      id,
      updateAnalysisResultDto,
    );
    return {
      statusCode: HttpStatus.OK,
      message: 'Analysis result updated successfully',
      data: analysisResult,
    };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const analysisResult = await this.analysisResultsService.remove(id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Analysis result deleted successfully',
      data: analysisResult,
    };
  }
}
