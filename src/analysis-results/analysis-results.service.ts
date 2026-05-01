import { Injectable } from '@nestjs/common';
import { CreateAnalysisResultDto } from './dto/create-analysis-result.dto';
import { UpdateAnalysisResultDto } from './dto/update-analysis-result.dto';

@Injectable()
export class AnalysisResultsService {
  create(createAnalysisResultDto: CreateAnalysisResultDto) {
    return 'This action adds a new analysisResult';
  }

  findAll() {
    return `This action returns all analysisResults`;
  }

  findOne(id: number) {
    return `This action returns a #${id} analysisResult`;
  }

  update(id: number, updateAnalysisResultDto: UpdateAnalysisResultDto) {
    return `This action updates a #${id} analysisResult`;
  }

  remove(id: number) {
    return `This action removes a #${id} analysisResult`;
  }
}
