import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Public } from './auth/decorators/public.decorator';

@ApiTags('App')
@Controller()
export class AppController {
  @Public()
  @Get()
  @ApiOperation({ summary: 'Verificar status da API' })
  @ApiResponse({
    status: 200,
    description: 'API online',
    schema: { type: 'string', example: 'Bot de Análise de Código Online!' },
  })
  getHello(): string {
    return 'Bot de Análise de Código Online!';
  }
}
