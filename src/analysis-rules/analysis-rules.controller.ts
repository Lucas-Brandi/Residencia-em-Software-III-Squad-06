import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AnalysisRulesService } from './analysis-rules.service';
import { CreateAnalysisRuleDto } from './dto/create-analysis-rule.dto';
import { UpdateAnalysisRuleDto } from './dto/update-analysis-rule.dto';

@Controller('analysis-rules')
export class AnalysisRulesController {
  constructor(private readonly analysisRulesService: AnalysisRulesService) {}

  @Post()
  create(@Body() createAnalysisRuleDto: CreateAnalysisRuleDto) {
    return this.analysisRulesService.create(createAnalysisRuleDto);
  }

  @Get()
  findAll() {
    return this.analysisRulesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.analysisRulesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAnalysisRuleDto: UpdateAnalysisRuleDto) {
    return this.analysisRulesService.update(+id, updateAnalysisRuleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.analysisRulesService.remove(+id);
  }
}
