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
- **IA**: OpenAI GPT-4o-mini para análise inteligente de código
- **VCS**: GitHub App Integration com Webhooks

---

## 🎯 Funcionalidades Principais

### Análise Inteligente de PRs com IA
- Integração com OpenAI GPT-4o-mini para análise automática de código
- Sugestões de melhoria baseadas em IA
- Análise de qualidade, segurança e performance

### Dashboard com Métricas
- Visualização em tempo real de PRs e análises
- Filtros avançados por data, título e status
- Cálculo de tempo economizado em revisões manuais
- Health score e status de análise para cada PR

### Sistema de Findings
- Detecção automática de problemas no código
- Classificação por severidade (CRÍTICO, AVISO, INFO)
- Rastreamento de findings por PR e regra de análise

### Gestão de Regras de Análise
- Criar, editar e deletar regras customizadas
- Associar regras a usuários específicos
- Controle de ativação/desativação por times

### GitHub App Integration
- Webhooks para eventos de PR (abrir, atualizar, fechar)
- Auto-registro de repositórios na primeira análise
- Autenticação segura com GitHub via JWT

### Gestão de Times (Squads)
- Organização de usuários em times
- Controle de acesso baseado em papéis (ADMIN, USER)
- Associação de repositórios a times específicos

### Autenticação e Segurança
- Autenticação JWT com refresh tokens
- Criptografia bcrypt para senhas
- Sistema de papéis e permissões
- Status de usuário (ATIVO, PENDENTE, INATIVO)

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

# Autenticação JWT
JWT_SECRET=uma_chave_secreta_bem_forte_e_aleatoria

# OpenAI - Integração com IA (OBRIGATÓRIO)
AI_API_KEY=sua_chave_api_openai_aqui

# GitHub App - Integração com GitHub (OBRIGATÓRIO para webhooks e análises)
GITHUB_APP_ID=seu_github_app_id
GITHUB_APP_PRIVATE_KEY=sua_chave_privada_github
GITHUB_APP_INSTALLATION_ID=seu_installation_id

# GitHub Webhook Secret - Segurança (OBRIGATÓRIO)
GITHUB_WEBHOOK_SECRET=seu_webhook_secret
```

### Obtendo as Credenciais

**GitHub App:**
1. Acesse https://github.com/settings/apps
2. Crie uma nova GitHub App
3. Configure os webhooks para apontar para `https://seu-dominio/webhook/github`
4. Gere uma chave privada na aba "Private keys"
5. Copie APP_ID, Private Key e Installation ID

**OpenAI:**
1. Acesse https://platform.openai.com/api-keys
2. Crie uma nova chave de API
3. Copie e cole em `AI_API_KEY`

Repositórios da organização podem ser **auto-registrados** no primeiro PR aberto por um membro da org, sem cadastro manual via `POST /repositories`.

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

## 🕀 Fluxo de Análise de Pull Requests

O sistema opera em um fluxo de processamento automatizado:

```
1. TRIGGER: PR aberto/atualizado no GitHub
   ↑
2. WEBHOOK: GitHub envia evento para POST /webhook/github
   ↑
3. VALIDAÇÃO: Assinatura do webhook é verificada (GITHUB_WEBHOOK_SECRET)
   ↑
4. REGISTRO: Repositório auto-registrado se não existir
   ↑
5. ANALYSIS RULES: Regras customizadas são acionadas
   ↑
6. IA ANALYSIS: OpenAI GPT-4o-mini analisa o código
   ↑
7. FINDINGS: Problemas são detectados e classif icados
   ↑
8. ARMAZENAMENTO: Resultados salvos no PostgreSQL
   ↑
9. DASHBOARD: Dados disponíveis em tempo real no painel
```

### Exemplo de Workflow Completo

1. Desenvolvedora abre PR no GitHub
2. GitHub App recebe webhook
3. Sistema extrai código e histórico da PR
4. OpenAI analisa a qualidade, segurança e performance
5. Regras customizadas da squad são aplicadas
6. Findings (CRITICO, AVISO, INFO) são criados
7. Resultado combinado gera um health score
8. Dashboard exibe a análise com tímpo estimado de revisão manual economizado

---

## 📄 Principais Endpoints da API

### Dashboard & Métricas
```
GET    /dashboard              - Obter métricas gerais com filtros
GET    /dashboard/pr-stats     - Estatísticas de PRs
```

### Pull Requests
```
GET    /pull-requests          - Listar PRs com filtros
GET    /pull-requests/:id      - Obter detalhes de uma PR
POST   /pull-requests          - Registrar PR manualmente
```

### Análise de Resultados
```
GET    /analysis-results       - Listar resultados de análise
GET    /analysis-results/:id   - Obter resultado de uma PR
PATCH  /analysis-results/:id   - Atualizar status da revisão
```

### Findings (Problemas Detectados)
```
GET    /findings               - Listar findings com filtros por severidade
GET    /findings/:id           - Obter detalhes de um finding
DELETE /findings/:id           - Remover um finding
```

### Regras de Análise
```
GET    /analysis-rules         - Listar regras de análise
POST   /analysis-rules         - Criar nova regra
GET    /analysis-rules/:id     - Obter detalhes da regra
PUT    /analysis-rules/:id     - Atualizar regra
DELETE /analysis-rules/:id     - Deletar regra
```

### Times (Squads)
```
GET    /teams                  - Listar times
POST   /teams                  - Criar novo time
GET    /teams/:id              - Obter detalhes do time
GET    /teams/:id/members      - Listar membros do time
POST   /teams/:id/members      - Adicionar membro ao time
DELETE /teams/:id/members/:uid - Remover membro do time
```

### Usuários
```
GET    /users                  - Listar usuários
GET    /users/:id              - Obter dados do usuário
PUT    /users/:id              - Atualizar usuário
```

### Repositórios
```
GET    /repositories           - Listar repositórios registrados
GET    /repositories/:id       - Obter detalhes do repositório
POST   /repositories           - Registrar novo repositório
DELETE /repositories/:id       - Remover repositório
```

### Autenticação
```
POST   /auth/register          - Registrar novo usuário
POST   /auth/login             - Login e obter JWT token
POST   /auth/refresh           - Renovar JWT token
POST   /auth/logout            - Fazer logout
```

### GitHub Webhook (Integração)
```
POST   /webhook/github         - Receber eventos do GitHub
(Requer assinatura válida com GITHUB_WEBHOOK_SECRET)
```

Consulte o Swagger em `http://localhost:3000/api` para documentação interativa completa.

---

## 📚 Estrutura dos Módulos

### Módulos Principais

#### **AI Module** (`src/AI/`)
- Integração com OpenAI GPT-4o-mini
- Geração de análises inteligentes de código
- Processamento de contexto de regras
- **Serviços**: `AIService`, `AIController`

#### **Analysis Rules Module** (`src/analysis-rules/`)
- CRUD de regras de análise customizadas
- Execução de regras em PRs
- Controle de proprietário (usuário criador)
- **Serviços**: `AnalysisRulesService`, `AnalysisRulesController`

#### **Analysis Results Module** (`src/analysis-results/`)
- Armazenamento de resultados de análise
- Cálculo de health score
- Rastreamento de status (PENDING, COMPLETED, FAILED)
- **Serviços**: `AnalysisResultsService`, `AnalysisResultsController`

#### **Dashboard Module** (`src/dashboard/`)
- Visualização de métricas e PRs
- Filtros avançados (data, título, status)
- Cálculo de tempo economizado em revisões
- **Serviços**: `DashboardService`, `DashboardController`

#### **Findings Module** (`src/findings/`)
- Detecção e classificacião de problemas
- Filtros por severidade (CRITICO, AVISO, INFO)
- Relação com Analysis Results e Rules
- **Serviços**: `FindingsService`, `FindingsController`

#### **GitHub Module** (`src/github/`)
- Integração com GitHub App API
- Processamento de webhooks
- Autenticação via JWT com GitHub
- **Serviços**: `GithubAppService`

#### **Auth Module** (`src/auth/`)
- Autenticação JWT com Passport
- Generação e refresh de tokens
- Guards e Strategies de segurança
- **Serviços**: `AuthService`, `AuthController`

#### **Teams Module** (`src/teams/`)
- Gestão de squads/times
- Associação de usuários e repositórios
- Controle de acesso team-based
- **Serviços**: `TeamsService`, `TeamsController`

#### **Users Module** (`src/users/`)
- Gestão de usuários
- Status (ATIVO, PENDENTE, INATIVO)
- Integração com GitHub username
- **Serviços**: `UsersService`, `UsersController`

#### **Repositories Module** (`src/repositories/`)
- Registro e gestão de repositórios
- Auto-registro via webhooks
- Associação a teams
- **Serviços**: `RepositoriesService`, `RepositoriesController`

#### **Pull Requests Module** (`src/pull-requests/`)
- Armazenamento de meta-dados de PRs
- Rastreamento de PRs relacionadas
- Status e timestamps
- **Serviços**: `PullRequestsService`, `PullRequestsController`

#### **Webhook Module** (`src/webhook/`)
- Recebimento de eventos do GitHub
- Validação de assinatura de webhook
- Disparo de fluxo de análise
- **Serviços**: `GithubWebhookController`

## 📄 Documentação da API (Swagger)

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

## 🔍 Modelo de Dados (Schema Prisma)

### Entidades Principais

#### **User** - Usuários do Sistema
```
- id: Int (PK)
- username: String (unique)
- githubUsername: String (opcional - para integração GitHub)
- avatarUrl: String (opcional)
- password: String (bcrypt)
- role: Role (USER | ADMIN)
- email: String (unique)
- status: UserStatus (ATIVO | PENDENTE | INATIVO)
- resetToken: String (para reset de senha)
- refreshToken: String (para JWT refresh)

Relacionamentos:
- teams: TeamUser[] (times que pertence)
- rules: AnalysisRule[] (regras criadas)
- prs: PullRequest[] (PRs analisadas)
- reviewedResults: AnalysisResult[] (revisões realizadas)
```

#### **Team** - Times/Squads
```
- id: String (UUID PK)
- name: String
- createdAt: DateTime

Relacionamentos:
- members: TeamUser[] (membros do time)
- repositories: Repository[] (repos do time)
```

#### **Repository** - Repositórios GitHub
```
- id: String (UUID PK)
- name: String
- githubId: Int (unique)
- githubUrl: String
- teamId: String (FK para Team)
- isActive: Boolean
- status: RepositoryStatus

Relacionamentos:
- team: Team
- pullRequests: PullRequest[]
```

#### **PullRequest** - Pull Requests do GitHub
```
- id: String (UUID PK)
- prNumber: Int
- title: String
- description: String
- author: String
- status: PRStatus (OPEN | MERGED | CLOSED)
- openedAt: DateTime
- updatedAt: DateTime
- repositoryId: String (FK)

Relacionamentos:
- repository: Repository
- analysisResults: AnalysisResult[]
```

#### **AnalysisResult** - Resultados de Análise
```
- id: String (UUID PK)
- prId: String (FK ou referencial externo)
- healthScore: Float (0-100)
- riskLevel: Severity (CRITICO | AVISO | INFO)
- status: AnalysisStatus (PENDING | COMPLETED | FAILED)
- findindsCount: Int
- createdAt: DateTime
- reviewedBy: Int (FK para User)

Relacionamentos:
- findings: Finding[]
- reviewer: User
```

#### **Finding** - Problemas/Achados Detectados
```
- id: String (UUID PK)
- title: String
- description: String
- severity: Severity (CRITICO | AVISO | INFO)
- ruleId: String (FK para AnalysisRule)
- analysisResultId: String (FK)
- lineNumber: Int (opcional)
- codeSnippet: String (opcional)

Relacionamentos:
- rule: AnalysisRule
- analysisResult: AnalysisResult
```

#### **AnalysisRule** - Regras Customizadas de Análise
```
- id: String (UUID PK)
- title: String
- description: String
- ruleType: RuleType
- severity: Severity
- isActive: Boolean
- userId: Int (FK - criador)
- createdAt: DateTime

Relacionamentos:
- creator: User
- findings: Finding[]
```

---

## 🚀 Guia Rápido de Uso

### 1. Primeira Execução

```bash
# Clonar e instalar
git clone <REPO_URL>
cd Residencia-em-Software-III-Squad-06
npm install

# Configurar .env com todas as variáveis (veja seção anterior)
# Importante: AI_API_KEY, GITHUB_APP_* e GITHUB_WEBHOOK_SECRET são OBRIGATÓRIOS

# Preparar banco de dados
npm run prisma:generate
npm run prisma:migrate

# Iniciar em desenvolvimento
npm run start:dev
```

### 2. Acessar o Sistema

- **API**: http://localhost:3000
- **Swagger (Docs)**: http://localhost:3000/api
- **Prisma Studio**: `npm run prisma:studio` → http://localhost:5555

### 3. Criar Primeiro Usuário e Time

```bash
# Via Swagger ou curl:

# 1. Registrar usuário
POST /auth/register
{
  "username": "seu-usuario",
  "email": "seu@email.com",
  "password": "senha-forte"
}

# 2. Login para obter token
POST /auth/login
{
  "username": "seu-usuario",
  "password": "senha-forte"
}
# Resposta: { "access_token": "jwt-token", ... }

# 3. Criar um time (squad)
POST /teams
Headers: Authorization: Bearer {jwt-token}
{
  "name": "Squad Backend"
}

# 4. Adicionar membro ao time
POST /teams/{teamId}/members
Headers: Authorization: Bearer {jwt-token}
{
  "userId": 1
}
```

### 4. Configurar GitHub App

```bash
# 1. Ir para https://github.com/settings/apps
# 2. Criar nova GitHub App
# 3. Preencher:
#    - Application name: "Squad-06 PR Analyzer"
#    - Homepage URL: https://seu-dominio.com
#    - Webhook URL: https://seu-dominio.com/webhook/github
#    - Webhook secret: Gerar secret aleatório
# 4. Permissões necessárias:
#    - Pull requests: Read
#    - Code: Read
#    - Commit statuses: Read & write
# 5. Subscrever eventos: Pull request, Push
# 6. Instalar em repositórios desejados
# 7. Copiar para .env:
#    - GITHUB_APP_ID
#    - GITHUB_APP_PRIVATE_KEY
#    - GITHUB_APP_INSTALLATION_ID
#    - GITHUB_WEBHOOK_SECRET
```

### 5. Analisar Primeira PR

Após configurar GitHub App:

```bash
# 1. Abrir uma PR no repositório registrado
# 2. GitHub envia webhook automaticamente
# 3. Sistema analisa com IA e regras
# 4. Acessar dashboard:
GET /dashboard
# 5. Ver results:
GET /analysis-results
# 6. Ver findings:
GET /findings
```

---

## 📚 Melhores Práticas e Padrões

### Desenvolvimento

#### Arquitetura Modular
- Crie novos módulos em `src/features/<nome>/`
- Use a estrutura: `module.ts`, `service.ts`, `controller.ts`, `dto/`, `entities/`
- Sempre exporte os serviços com `exports: [...]` no módulo

```bash
# Gerar módulo automaticamente
nest generate module features/nova-feature
nest generate service features/nova-feature
nest generate controller features/nova-feature --spec
```

#### Uso de DTOs
- Crie classes DTO em `src/features/<nome>/dto/`
- Use `class-validator` para validação
- Use `class-transformer` para transformação de dados

```typescript
// exemplo.dto.ts
import { IsString, IsEmail, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @MinLength(4)
  username: string;

  @IsEmail()
  email: string;
}
```

#### Injeção de Dependências
- Use sempre injeção de dependências no construtor
- Nunca importe módulos diretamente

```typescript
@Injectable()
export class MyService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly logger: Logger,
  ) {}
}
```

### Banco de Dados

#### Modificações no Schema
1. Edite `src/prisma/schema.prisma`
2. Execute: `npm run prisma:migrate "descrição da mudança"`
3. NUNCA edite manualmente os arquivos em `src/prisma/migrations/`
4. Sempre commit dos arquivos de migração

#### Convenções
- Nomes de coluna no BD: **snake_case** (use `@map()` e `@@map()`)
- Nomes de propriedades TS: **camelCase**
- Enums do sistema: **UPPER_CASE**

```typescript
model User {
  id      Int     @id @default(autoincrement())
  userName String @map("user_name")  // BD: user_name, TS: userName
  email   String  @unique            // 

  @@map("users")                      // Tabela BD: users
}
```

### Código

#### Linting e Formato
```bash
# Antes de commitar
npm run lint       # ESLint com auto-fix
npm run format     # Prettier
```

#### Testes
```bash
# Escrever testes para novos serviços
npm test                # Executar testes
npm run test:watch      # Watch mode
npm run test:cov        # Cobertura
```

#### Logging
Use sempre o Logger do NestJS, não `console.log`:

```typescript
import { Logger } from '@nestjs/common';

export class MyService {
  private readonly logger = new Logger(MyService.name);

  async doSomething() {
    this.logger.log('Informação');
    this.logger.warn('Aviso');
    this.logger.error('Erro');
    this.logger.debug('Debug');
  }
}
```

### Segurança

#### Variáveis de Ambiente
- NUNCA commitar `.env` (deve estar em `.gitignore`)
- NUNCA hardcodear secrets no código
- Usar variáveis de ambiente para tudo sensível

#### JWT & Autenticação
- JWT_SECRET deve ser uma string forte e aleatória
- Refresh token deve ser renovado regularmente
- Use Guards `@UseGuards(JwtAuthGuard)` para proteger rotas

```typescript
@Get('/perfil')
@UseGuards(JwtAuthGuard)
getPerfil(@Request() req) {
  return req.user; // Usuário autenticado
}
```

#### Webhook GitHub
- Validar assinatura com GITHUB_WEBHOOK_SECRET em toda requisição
- Rejeitar requisições sem assinatura válida (status 401)
- Usar HTTPS em produção

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