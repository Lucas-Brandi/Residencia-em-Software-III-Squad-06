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
  Query,
} from '@nestjs/common';
import { AnalysisRulesService } from './analysis-rules.service';
import { CreateAnalysisRuleDto } from './dto/create-analysis-rule.dto';
import { UpdateAnalysisRuleDto } from './dto/update-analysis-rule.dto';

@Controller('analysis-rules')
export class AnalysisRulesController {
  constructor(private readonly analysisRulesService: AnalysisRulesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createAnalysisRuleDto: CreateAnalysisRuleDto) {
    const analysisRule = await this.analysisRulesService.create(
      createAnalysisRuleDto,
    );
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Analysis rule created successfully',
      data: analysisRule,
    };
  }

  @Get()
  async findAll(@Query('repositoryId') repositoryId?: string) {
    const analysisRules = await this.analysisRulesService.findAll(repositoryId);
    return {
      statusCode: HttpStatus.OK,
      data: analysisRules,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const analysisRule = await this.analysisRulesService.findOne(id);
    return {
      statusCode: HttpStatus.OK,
      data: analysisRule,
    };
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateAnalysisRuleDto: UpdateAnalysisRuleDto,
  ) {
    const analysisRule = await this.analysisRulesService.update(
      id,
      updateAnalysisRuleDto,
    );
    return {
      statusCode: HttpStatus.OK,
      message: 'Analysis rule updated successfully',
      data: analysisRule,
    };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const analysisRule = await this.analysisRulesService.remove(id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Analysis rule deleted successfully',
      data: analysisRule,
    };
  }
}
