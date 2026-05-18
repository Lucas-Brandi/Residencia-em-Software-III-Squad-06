import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('app')
@Controller()
export class AppController {
  @Get()
  @ApiOperation({ summary: 'Rota de saúde da aplicação v2' })
  @ApiResponse({
    status: 200,
    description: 'Aplicação funcionando corretamente',
  })
  getHello(): string {
    return 'Bot de Análise de Código Online!';
  }
}
