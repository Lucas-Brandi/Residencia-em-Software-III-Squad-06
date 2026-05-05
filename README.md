# Squad-06 - Sistema de Análise de Pull Requests do GitHub

## 📋 Navegação Rápida

- [Visão Geral do Projeto](#visão-geral-do-projeto)
- [Pré-requisitos & Instalação](#pré-requisitos--instalação)
- [Configuração do Ambiente](#configuração-do-ambiente)
- [Executando a Aplicação](#executando-a-aplicação)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Referência de Scripts](#referência-de-scripts)
- [Gerenciamento do Banco de Dados](#gerenciamento-do-banco-de-dados)
- [Documentação da API (Swagger)](#documentação-da-api-swagger)
- [Testes](#testes)
- [Depuração & Desenvolvimento](#depuração--desenvolvimento)
- [Estilo de Código & Convenções](#estilo-de-código--convenções)
- [Problemas Comuns & Soluções](#problemas-comuns--soluções)
- [Fluxo de Desenvolvimento](#fluxo-de-desenvolvimento)

---

## Visão Geral do Projeto

**Residencia-em-Software-III-Squad-06** é um sistema backend baseado em NestJS para análise de pull requests do GitHub dentro de contextos de squad/time. Utiliza PostgreSQL (via Prisma ORM) para gerenciar autenticação de usuários, organização de times e resultados de análise de PRs.

## Stack Tecnológico & Ferramentas Principais

- **Runtime**: Node.js v16+ com TypeScript 5.7
- **Framework**: NestJS 11 com adaptador Express
- **Banco de Dados**: PostgreSQL com Prisma 7.x (usando adaptador PrismaPg)
- **Documentação da API**: Swagger/OpenAPI (@nestjs/swagger)
- **Testes**: Jest + Supertest (unit, spec, e2e)
- **Linting**: ESLint 9 com plugin TypeScript
- **Formatação de Código**: Prettier 3.4
- **CLI**: NestJS CLI

## Pré-requisitos & Instalação

### Requisitos do Sistema

- **Node.js**: v16.x ou superior ([Download](https://nodejs.org/))
- **npm**: Incluído com Node.js
- **PostgreSQL**: v12+ (certifique-se de que está rodando e acessível)
- **NestJS CLI** (opcional): `npm install -g @nestjs/cli` para comandos de conveniência

### Passos de Instalação

1. **Clone o repositório**
   ```bash
   git clone <URL_DO_REPOSITORIO>
   cd Residencia-em-Software-III-Squad-06
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente** (veja a seção [Configuração do Ambiente](#configuração-do-ambiente))

4. **Configure o banco de dados com Prisma** (veja a seção [Pré-requisitos Antes de Executar a Aplicação](#⚠️-pré-requisitos-antes-de-executar-a-aplicação))

---

## Configuração do Ambiente

### Criar Arquivo .env

Crie um arquivo `.env` na raiz do projeto:

```bash
cp .env.example .env  # se disponível, ou crie manualmente
```

### Variáveis de Ambiente Obrigatórias

```ini
# Ambiente
NODE_ENV=development

# Servidor
PORT=3000

# Banco de Dados (PostgreSQL + Prisma)
DATABASE_URL=postgres://usuario:senha@localhost:5432/nome_banco

# Autenticação
JWT_SECRET=uma_chave_secreta_bem_forte_e_aleatoria

# Opcional: Integração com GitHub
GITHUB_API_TOKEN=seu_token_do_github_aqui
```

### Conexão com Banco de Dados

Certifique-se de que PostgreSQL está rodando e acessível:

```bash
# Verifique a conexão com PostgreSQL
psql -U usuario -h localhost -d nome_banco
```

Se estiver usando Docker localmente:
```bash
# Exemplo: inicie PostgreSQL em um container
docker run --name postgres-sq6 -e POSTGRES_PASSWORD=senha -d -p 5432:5432 postgres:15
```

---

## ⚠️ Pré-requisitos Antes de Executar a Aplicação

**IMPORTANTE:** Antes de executar a aplicação, você **DEVE** configurar o banco de dados corretamente executando os comandos do Prisma. A aplicação não funcionará sem esta configuração.

### Passos Obrigatórios de Configuração

1. **Gerar Prisma Client** (necessário uma única vez após instalar dependências):
   ```bash
   npm run prisma:generate
   ```

2. **Executar migrações do banco de dados**:
   ```bash
   npm run prisma:migrate
   ```
   Este comando:
   - Detecta e aplica todas as migrações pendentes
   - Cria as tabelas no banco de dados PostgreSQL
   - Sincroniza o schema local com o banco de dados

3. **Verifique a configuração** (opcional, mas recomendado):
   ```bash
   npm run prisma:studio
   ```
   Isso abre uma interface visual (http://localhost:5555) onde você pode verificar se as tabelas foram criadas corretamente.

**Sem executar estes comandos, a aplicação falhará ao tentar conectar com o banco de dados!**

---

## Executando a Aplicação

### Modo de Desenvolvimento (Recomendado para Desenvolvimento)

```bash
npm run start:dev
```

**Características:**
- Hot reload em mudanças de arquivo
- Observa automaticamente arquivos TypeScript
- Conecta ao banco de dados local via DATABASE_URL

**Acesso:** http://localhost:3000

### Build e Produção

```bash
npm run build        # Compila TypeScript para dist/
npm run start:prod   # Executa a aplicação compilada
```

### Modo Debug

```bash
npm run start:debug
```

- Inicia com o debugger do Node na porta `9229`
- Use o debugger do VS Code ou Chrome DevTools (chrome://inspect)

---

## Estrutura do Projeto

```
src/
├── app.controller.ts          # Endpoint raiz GET /
├── app.service.ts             # Lógica de negócio
├── app.module.ts              # Módulo raiz, importa PrismaModule
├── main.ts                    # Ponto de entrada, bootstrapa AppModule
└── prisma/
    ├── schema.prisma          # Schema do Prisma (PostgreSQL)
    ├── prisma.service.ts      # Provider global de Prisma (adaptador PrismaPg)
    ├── prisma.module.ts       # Módulo global (@Global() decorator)
    └── migrations/            # Migrações auto-geradas pelo Prisma

test/
├── app.e2e-spec.ts            # Testes E2E
└── jest-e2e.json              # Configuração E2E do Jest

.github/
└── copilot-instructions.md    # Instruções do Copilot

Arquivos Raiz:
├── prisma.config.ts           # Configuração customizada do Prisma
├── package.json               # Dependências & scripts npm
├── tsconfig.json              # Configuração TypeScript
├── eslint.config.mjs          # Regras ESLint
├── jest.config.js             # Configuração Jest
└── .env                       # Variáveis de ambiente (não no repo)
```

---

## Referência de Scripts

| Script | Comando | Propósito |
|--------|---------|----------|
| **Desenvolvimento** | | |
| | `npm run start:dev` | Inicia em modo watch (auto-reload) |
| | `npm run start:debug` | Inicia com debugger do Node na porta 9229 |
| **Build** | | |
| | `npm run build` | Compila TypeScript para `dist/` |
| | `npm start` | Executa `dist/main.js` compilado |
| | `npm run start:prod` | Ponto de entrada para produção |
| **Testes** | | |
| | `npm test` | Executa testes Jest unitários (`*.spec.ts`) |
| | `npm run test:watch` | Executa testes em modo watch |
| | `npm run test:cov` | Gera relatório de cobertura |
| | `npm run test:e2e` | Executa testes de ponta a ponta |
| | `npm run test:debug` | Debug de testes com breakpoints |
| **Qualidade de Código** | | |
| | `npm run lint` | Executa ESLint com auto-fix |
| | `npm run format` | Formata código com Prettier |
| **Banco de Dados** | | |
| | `npm run prisma:migrate` | Cria & aplica migração (interativo) |
| | `npm run prisma:deploy` | Aplica migrações pendentes |
| | `npm run prisma:generate` | Regenera Prisma Client |
| | `npm run prisma:studio` | Abre interface Prisma Studio (http://localhost:5555) |

---

## Gerenciamento do Banco de Dados

### Visão Geral

O projeto utiliza **Prisma ORM** com **PostgreSQL** e o adaptador **PrismaPg** para suporte nativo a PostgreSQL.

**Arquivos-chave:**
- `src/prisma/schema.prisma` — Definição do schema do banco de dados
- `src/prisma/prisma.service.ts` — Provider global de Prisma Client
- `prisma.config.ts` — Configuração customizada do Prisma
- `src/prisma/migrations/` — Histórico de migrações auto-gerado

### Schema do Banco de Dados

Modelos atuais:
- **User**: Autenticação, integração com GitHub, acesso baseado em papéis (admin, dev)
- **Team**: Coleções de squad/projeto
- **TeamUser**: Tabela de junção vinculando usuários a times
- **Adicionais**: AnalysisRule, PullRequest, AnalysisResult, Repository (parcialmente definidos)

**Convenções:**
- Nomes de coluna em snake_case no banco de dados (via declarações `@map()`)
- Nomes de propriedade em camelCase no TypeScript
- Comentários em português para lógica de negócio
- Chaves compostas para tabelas de junção (ex: `@@id([teamId, userId])`)

### Fluxo de Trabalho: Adicionando Mudanças no Banco de Dados

1. **Atualize** `src/prisma/schema.prisma` com novos modelos/relações
2. **Crie migração**:
   ```bash
   npm run prisma:migrate
   ```
   Isso solicita um nome para a migração e cria o SQL
3. **Verifique mudanças** via Prisma Studio:
   ```bash
   npm run prisma:studio
   ```
4. **Commit da migração** para controle de versão (arquivos auto-gerados em `src/prisma/migrations/`)

### Importante: Migrações de Banco de Dados

⚠️ **Nunca edite manualmente arquivos de migração** — sempre use o fluxo do Prisma

- **Detectar desvio de schema**: Prisma avisa se o schema local não corresponde ao banco
- **Resetar banco de desenvolvimento** (perda de dados!):
  ```bash
  # AVISO: Remove banco de dados e reaplica todas as migrações
  prisma migrate reset --force --config prisma.config.ts
  ```

### Acessando Prisma Studio

```bash
npm run prisma:studio
```

Abre a interface Prisma Studio em http://localhost:5555 para navegação e edição visual de dados.

---

## Documentação da API (Swagger)

O projeto integra **@nestjs/swagger** para documentação automática de OpenAPI.

**URL Padrão:** http://localhost:3000/api

### Configuração do Swagger

Configurado em `src/main.ts`:
- Auto-gerado a partir de decorators do NestJS
- Explorador de API interativo
- Schemas de requisição/resposta

### Usando Decorators do Swagger

Exemplo em um controller:

```typescript
import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('teams')
export class TeamsController {
  
  @Get()
  @ApiOperation({ summary: 'Listar todos os times' })
  @ApiResponse({ status: 200, description: 'Lista de times' })
  getTeams() {
    // ...
  }
}
```

---

## Testes

### Testes Unitários & Integração

```bash
npm test                 # Executa todos os testes
npm run test:watch      # Modo watch
npm run test:cov        # Relatório de cobertura
```

**Arquivos de teste:** `src/**/*.spec.ts` (colocalizados com arquivos-fonte)

### Testes End-to-End (E2E)

```bash
npm run test:e2e
```

**Arquivos de teste:** `test/**/*.e2e-spec.ts`

Certifique-se de:
- O banco de dados está rodando
- `.env` está configurado
- Estado limpo do banco (ou use fixtures/seeds)

### Estrutura de Teste de Exemplo

```typescript
// app.service.spec.ts
import { Test } from '@nestjs/testing';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';

describe('AppService', () => {
  let service: AppService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [AppService, PrismaService],
    }).compile();

    service = module.get<AppService>(AppService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('deve retornar Hello World', () => {
    expect(service.getHello()).toBe('Hello World!');
  });
});
```

---

## Depuração & Desenvolvimento

### Debugger do VS Code

1. **Inicie o modo debug:**
   ```bash
   npm run start:debug
   ```

2. **Adicione breakpoints** no VS Code (clique no número da linha)

3. **Anexe o debugger** automaticamente (se `.vscode/launch.json` configurado) ou use:
   - Chrome: chrome://inspect
   - VS Code: Debug view (Ctrl+Shift+D) → "Attach to Node"

### Logging

Use o serviço Logger do NestJS:

```typescript
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);

  getHello(): string {
    this.logger.debug('Mensagem de debug');
    this.logger.log('Mensagem de informação');
    this.logger.warn('Mensagem de aviso');
    this.logger.error('Mensagem de erro');
    return 'Hello World!';
  }
}
```

### Debug com Breakpoints

1. **Modo debug de testes:**
   ```bash
   npm run test:debug
   ```
2. **Anexe debugger** (VS Code ou Chrome DevTools)
3. **Defina breakpoints**, execute testes e inspecione estado

---

## Estilo de Código & Convenções

### Geral
- **Linguagem**: TypeScript com modo strict habilitado (`tsconfig.json`)
- **Comentários**: Use português para comentários de contexto/negócio
- **Nomeação**: camelCase para propriedades, PascalCase para classes/interfaces, UPPER_CASE para constantes
- **Nomeação de arquivo**: kebab-case para arquivos (ex: `app.service.ts`, `prisma.service.ts`)

### Específico do NestJS
- Decorators: `@Controller()`, `@Get()`, `@Post()`, `@Injectable()`, `@Global()`, `@Module()`
- Injeção de Dependência: Baseada em construtor com `private readonly`
- Imports de módulo no array `imports: [...]`

### Schema do Prisma
- Modelos definidos com PascalCase em maiúsculas
- Relações declaradas com `@relation()` para chaves estrangeiras explícitas
- Seções distintas marcadas com comentários `// --- NOME DA SEÇÃO ---`
- Use `@map()` para mapeamento de nome de coluna (snake_case no BD)
- Use `@@map()` para mapeamento de nome de tabela

### Testes
- Testes unitários: `*.spec.ts` colocalizados com arquivos-fonte
- Testes E2E: `test/app.e2e-spec.ts`
- Config Jest inclui `collectCoverageFrom` para todos os arquivos-fonte

---

## Fluxo de Desenvolvimento

### Iniciando o Desenvolvimento

**⚠️ PRIMEIRO, configure o banco de dados:**

1. **Certifique-se de que PostgreSQL está rodando** com variável env DATABASE_URL definida
2. **Gere o Prisma Client**:
   ```bash
   npm run prisma:generate
   ```
3. **Execute migrações para configurar o banco**:
   ```bash
   npm run prisma:migrate
   ```
   Isso cria todas as tabelas e estruturas necessárias no banco de dados
4. **Inicie servidor dev**: `npm run start:dev` (auto-recarrega em mudanças de arquivo)
5. **Visualize/edite dados** (opcional): `npm run prisma:studio` abre Prisma Studio

### Adicionando Funcionalidades
1. **Crie novos serviços** em `src/features/` com estrutura modular
2. **Gere scaffold do NestJS** (opcional):
   ```bash
   nest generate module features/time
   nest generate service features/time
   nest generate controller features/time
   ```
3. **Atualize schema.prisma** se houver mudanças no BD; execute `npm run prisma:migrate "descrição"`
4. **Escreva testes**: `nest generate controller features/time --spec`
5. **Lint e formato**: `npm run lint && npm run format`

### Fluxo de Mudanças no Banco de Dados

1. **Modifique** `src/prisma/schema.prisma`
2. **Crie migração**:
   ```bash
   npm run prisma:migrate
   ```
3. **Teste que a migração funciona**:
   ```bash
   npm run prisma:studio        # Verifique schema visualmente
   npm test                     # Execute testes com novo schema
   ```
4. **Commit** do arquivo de migração para git

### Melhores Práticas

- **Nunca edite manualmente arquivos de migração** — use o fluxo do Prisma
- **Nunca foque DATABASE_URL ou secrets** — sempre use `.env`
- **DI em vez de imports**: Use injeção de dependência no construtor
- **Arquitetura modular**: Agrupe funcionalidades relacionadas em módulos separados
- **Abordagem orientada a testes**: Escreva specs junto com funcionalidades

---

## Problemas Comuns & Soluções

| Problema | Solução |
|----------|---------|
| **Aplicação falha ao iniciar com erro de conexão ao BD** | Execute `npm run prisma:generate` e depois `npm run prisma:migrate` para configurar o banco de dados |
| **Porta 3000 já está em uso** | Mude `PORT` em `.env` ou mate processo: `netstat -ano \| findstr :3000` (Windows) ou `lsof -i :3000` (Mac/Linux) |
| **DATABASE_URL não encontrado** | Crie arquivo `.env` com `DATABASE_URL=postgres://...` |
| **Não consegue encontrar módulo `@prisma/client`** | Execute `npm run prisma:generate` |
| **Desvio de schema do Prisma detectado** | Execute `npm run prisma:migrate` para resolver |
| **Build TypeScript falha** | Certifique-se de que `npm run build` funciona localmente antes de commitar |
| **Testes falham em CI/GitHub Actions** | Certifique-se de que variáveis `.env` estão definidas; use estado limpo do BD |
| **Hot-reload não funcionando** | Reinicie `npm run start:dev` ou atualize NestJS CLI |
| **Docs Swagger não aparecem** | Certifique-se de que decorators `@ApiOperation()` foram adicionados; verifique `src/main.ts` |

---

## Dicas de Produtividade

- **Use NestJS CLI**: `nest generate schematics` acelera criação de módulo/serviço/controller
- **Habilite ESLint ao salvar**: Auto-fix de erros de linting
- **Use formato Prettier**: `npm run format` mantém código consistente
- **Comentários pragma**: Marque seções com `// --- NOME DA SEÇÃO ---` para clareza
- **Modo strict TypeScript**: Pegue erros de tipo cedo
- **Serviço Logger**: Não use `console.log` — use `Logger` para logging estruturado

---

## Comandos Úteis - Referência Rápida

| Tarefa | Comando |
|--------|---------|
| Iniciar desenvolvimento | `npm run start:dev` |
| Modo debug | `npm run start:debug` |
| Build do projeto | `npm run build` |
| Iniciar produção | `npm run start:prod` |
| Executar todos os testes | `npm test` |
| Testes em modo watch | `npm run test:watch` |
| Relatório de cobertura | `npm run test:cov` |
| Testes E2E | `npm run test:e2e` |
| Debug de testes | `npm run test:debug` |
| Verificar qualidade de código | `npm run lint` |
| Auto-fix & formatar | `npm run lint && npm run format` |
| Migração de banco de dados | `npm run prisma:migrate` |
| Aplicar migrações pendentes | `npm run prisma:deploy` |
| Visualizar banco de dados (UI) | `npm run prisma:studio` |
| Regenerar Prisma Client | `npm run prisma:generate` |
| Gerar módulo NestJS | `nest generate module features/<nome>` |
| Gerar serviço NestJS | `nest generate service features/<nome>` |
| Gerar controller NestJS | `nest generate controller features/<nome>` |

---

**Versão:** 1.0.0  
**Última Atualização:** Abril de 2026  
**Compatibilidade Node.js:** 16.x+  
**Compatibilidade PostgreSQL:** 12+  
**Compatibilidade NestJS:** 11.x+

# Comando para rodar o Contêiner Docker
```
docker run -d -p 3000:3000 `
  -e DATABASE_URL="postgres://usuario:senha@host:5432/nome_banco" `
  -e JWT_SECRET="{jwt_secret}" `
  -e AI_API_KEY="{api_api_key}" `
  -e GITHUB_API_TOKEN="{github_api_key}" `
  --name api-residencia-container `
  api-residencia 
```