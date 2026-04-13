# Squad-06 GitHub PR Analysis System — Copilot Instructions

## 📋 Quick Navigation

- [Project Overview](#project-overview)
- [Prerequisites & Installation](#prerequisites--installation)
- [Environment Setup](#environment-setup)
- [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [Scripts Reference](#scripts-reference)
- [Database Management](#database-management)
- [API Documentation (Swagger)](#api-documentation-swagger)
- [Testing](#testing)
- [Debugging & Development](#debugging--development)
- [Code Style & Conventions](#code-style--conventions)
- [Common Pitfalls & Solutions](#common-pitfalls--solutions)
- [Development Workflow](#development-workflow)
- [Architecture Notes](#architecture-notes)

---

## Project Overview

**Residencia-em-Software-III-Squad-06** is a NestJS-based backend system for analyzing GitHub pull requests within squad/team contexts. It uses PostgreSQL (via Prisma ORM) to manage user authentication, team organization, and PR analysis results.

## Tech Stack & Key Tools

- **Runtime**: Node.js v16+ with TypeScript 5.7
- **Framework**: NestJS 11 with Express adapter
- **Database**: PostgreSQL with Prisma 7.x (using PrismaPg adapter)
- **API Documentation**: Swagger/OpenAPI (@nestjs/swagger)
- **Testing**: Jest + Supertest (unit, spec, e2e)
- **Linting**: ESLint 9 with TypeScript plugin
- **Code Formatting**: Prettier 3.4
- **CLI**: NestJS CLI

## Prerequisites & Installation

### System Requirements

- **Node.js**: v16.x or higher ([Download](https://nodejs.org/))
- **npm**: Included with Node.js
- **PostgreSQL**: v12+ (ensure it's running and accessible)
- **NestJS CLI** (optional): `npm install -g @nestjs/cli` for convenience commands

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone <REPO_URL>
   cd Residencia-em-Software-III-Squad-06
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables** (see [Environment Setup](#environment-setup) section)

---

## Environment Setup

### Setup .env File

Create a `.env` file in the project root:

```bash
cp .env.example .env  # if available, or create manually
```

### Required Environment Variables

```ini
# Environment
NODE_ENV=development

# Server
PORT=3000

# Database (PostgreSQL + Prisma)
DATABASE_URL=postgres://usuario:senha@localhost:5432/nome_banco

# Authentication
JWT_SECRET=uma_chave_secreta_bem_forte_e_aleatoria

# Optional: GitHub Integration
GITHUB_API_TOKEN=seu_token_do_github_aqui
```

### Database Connection

Ensure PostgreSQL is running and accessible:

```bash
# Verify PostgreSQL connection
psql -U usuario -h localhost -d nome_banco
```

If using Docker locally:
```bash
# Example: start PostgreSQL in a container
docker run --name postgres-sq6 -e POSTGRES_PASSWORD=senha -d -p 5432:5432 postgres:15
```

---

## Running the Application

### Development Mode (Recommended for Development)

```bash
npm run start:dev
```

**Features:**
- Hot reload on file changes
- Watches TypeScript files automatically
- Connects to your local database via DATABASE_URL

**Access:** http://localhost:3000

### Production Build & Run

```bash
npm run build        # Compile TypeScript to dist/
npm run start:prod   # Run the compiled application
```

### Debug Mode

```bash
npm run start:debug
```

- Starts with Node debugger on port `9229`
- Use VS Code's debugger or Chrome DevTools (chrome://inspect)

---

## Project Structure

```
src/
├── app.controller.ts          # Root GET / endpoint (placeholder)
├── app.service.ts             # Business logic stubs
├── app.module.ts              # Root module, imports PrismaModule
├── main.ts                    # Entry point, bootstraps AppModule
└── prisma/
    ├── schema.prisma          # Prisma schema (PostgreSQL)
    ├── prisma.service.ts      # Global Prisma provider (PrismaPg adapter)
    ├── prisma.module.ts       # Global module (@Global() decorator)
    └── migrations/            # Auto-generated Prisma migrations

test/
├── app.e2e-spec.ts            # E2E tests
└── jest-e2e.json              # Jest E2E config

.github/
└── copilot-instructions.md    # This file

Root Files:
├── prisma.config.ts           # Custom Prisma config (non-standard location!)
├── package.json               # Dependencies & npm scripts
├── tsconfig.json              # TypeScript configuration
├── eslint.config.mjs          # ESLint rules
├── jest.config.js             # Jest test configuration
└── .env                       # Environment variables (not in repo)
```

---

## Scripts Reference

| Script | Command | Purpose |
|--------|---------|---------|
| **Development** | | |
| | `npm run start:dev` | Start in watch mode (auto-reload) |
| | `npm run start:debug` | Start with Node debugger on port 9229 |
| **Building** | | |
| | `npm run build` | Compile TypeScript to `dist/` |
| | `npm start` | Run compiled `dist/main.js` |
| | `npm run start:prod` | Production entry point |
| **Testing** | | |
| | `npm test` | Run Jest unit tests (`*.spec.ts`) |
| | `npm run test:watch` | Run tests in watch mode |
| | `npm run test:cov` | Generate coverage report |
| | `npm run test:e2e` | Run end-to-end tests |
| | `npm run test:debug` | Debug tests with breakpoints |
| **Code Quality** | | |
| | `npm run lint` | Run ESLint with auto-fix |
| | `npm run format` | Format code with Prettier |
| **Database** | | |
| | `npm run prisma:migrate` | Create & apply migration (interactive) |
| | `npm run prisma:deploy` | Apply pending migrations |
| | `npm run prisma:generate` | Regenerate Prisma Client |
| | `npm run prisma:studio` | Open Prisma Studio UI (http://localhost:5555) |

## Project Structure

```
src/
├── app.controller.ts          # Root GET / endpoint (placeholder)
├── app.service.ts             # Business logic stubs
├── app.module.ts              # Root module, imports PrismaModule
├── main.ts                    # Entry point, bootstraps AppModule
└── prisma/
    ├── schema.prisma          # Prisma schema (PostgreSQL)
    ├── prisma.service.ts      # Global Prisma provider (PrismaPg adapter)
    ├── prisma.module.ts       # Global module (@Global() decorator)
    └── migrations/            # Auto-generated Prisma migrations

test/
├── app.e2e-spec.ts            # E2E tests
└── jest-e2e.json              # Jest E2E config

.github/
└── copilot-instructions.md    # This file

Root Files:
├── prisma.config.ts           # Custom Prisma config (non-standard location!)
├── package.json               # Dependencies & npm scripts
├── tsconfig.json              # TypeScript configuration
├── eslint.config.mjs          # ESLint rules
├── jest.config.js             # Jest test configuration
└── .env                       # Environment variables (not in repo)
```

---

## Database Management

### Overview

The project uses **Prisma ORM** with **PostgreSQL** and the **PrismaPg** adapter for native PostgreSQL support.

**Key Files:**
- `src/prisma/schema.prisma` — Database schema definition
- `src/prisma/prisma.service.ts` — Global Prisma Client provider
- `prisma.config.ts` — Custom Prisma configuration (non-standard location)
- `src/prisma/migrations/` — Auto-generated migration history

### Database Schema

Current models:
- **User**: Authentication, GitHub integration, role-based access (admin, dev)
- **Team**: Squad/project collections
- **TeamUser**: Join table linking users to teams
- **Additional**: AnalysisRule, PullRequest, AnalysisResult, Repository (partially defined)

**Conventions:**
- Snake_case column names in database (via `@map()` declarations)
- CamelCase TypeScript property names
- Portuguese comments for business logic documentation
- Composite keys for join tables (e.g., `@@id([teamId, userId])`)

### Workflow: Adding Database Changes

1. **Update schema.prisma** with your new models/relations
2. **Create migration**:
   ```bash
   npm run prisma:migrate
   ```
   This prompts for a migration name and creates the SQL
3. **Verify changes** via Prisma Studio:
   ```bash
   npm run prisma:studio
   ```
4. **Commit migration** to version control (auto-generated files in `src/prisma/migrations/`)

### Important: Database Migrations

⚠️ **Never manually edit migration files** — always use the Prisma workflow

- **Detect schema drift**: Prisma warns if local schema doesn't match database
- **Reset development DB** (data loss!):
  ```bash
  # WARNING: Drops database and reapplies all migrations
  prisma migrate reset --force --config prisma.config.ts
  ```

### Accessing Prisma Studio

```bash
npm run prisma:studio
```

Opens Prisma Studio UI at http://localhost:5555 for visual data browsing & editing.

---

## API Documentation (Swagger)

The project integrates **@nestjs/swagger** for automatic OpenAPI documentation.

**Default URL:** http://localhost:3000/api

### Swagger Configuration

Configured in `src/main.ts`:
- Auto-generated from NestJS decorators
- Interactive API explorer
- Request/response schemas

### Using Swagger Decorators

Example in a controller:

```typescript
import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('teams')
export class TeamsController {
  
  @Get()
  @ApiOperation({ summary: 'List all teams' })
  @ApiResponse({ status: 200, description: 'Teams list' })
  getTeams() {
    // ...
  }
}
```

---

## Testing

### Unit & Integration Tests

```bash
npm test                 # Run all tests
npm run test:watch      # Watch mode
npm run test:cov        # Coverage report
```

**Test files:** `src/**/*.spec.ts` (colocated with source files)

### End-to-End (E2E) Tests

```bash
npm run test:e2e
```

**Test files:** `test/**/*.e2e-spec.ts`

Ensure:
- Database is running
- `.env` is configured
- Clean DB state (or use fixtures/seeds)

### Example Test Structure

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

  it('should return Hello World', () => {
    expect(service.getHello()).toBe('Hello World!');
  });
});
```

---

## Debugging & Development

### VS Code Debugger

1. **Start debug mode:**
   ```bash
   npm run start:debug
   ```

2. **Add breakpoints** in VS Code (click line number)

3. **Attach debugger** automatically (if `.vscode/launch.json` configured) or use:
   - Chrome: chrome://inspect
   - VS Code: Debug view (Ctrl+Shift+D) → "Attach to Node"

### Logging

Use NestJS Logger Service:

```typescript
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);

  getHello(): string {
    this.logger.debug('Debug message');
    this.logger.log('Info message');
    this.logger.warn('Warning message');
    this.logger.error('Error message');
    return 'Hello World!';
  }
}
```

### Debugging with Breakpoints

1. **Test debug mode:**
   ```bash
   npm run test:debug
   ```
2. **Attach debugger** (VS Code or Chrome DevTools)
3. **Set breakpoints**, run tests, and inspect state

---

## Code Style & Conventions

### General
- **Language**: TypeScript with strict mode enabled (`tsconfig.json`)
- **Comments**: Use Portuguese for domain/business context comments
- **Naming**: camelCase for properties, PascalCase for classes/interfaces, UPPER_CASE for constants
- **File naming**: kebab-case for files (e.g., `app.service.ts`, `prisma.service.ts`)

### NestJS Specific
- Decorators: `@Controller()`, `@Get()`, `@Post()`, `@Injectable()`, `@Global()`, `@Module()`
- Dependency Injection: Constructor-based with `private readonly`
- Module imports in `imports: [...]` array

### Prisma Schema
- Models defined with uppercase PascalCase
- Relations declared with `@relation()` for explicit foreign keys
- Distinct sections marked with `// --- SECTION NAME ---` comments
- Use `@map()` for column name mapping (snake_case in DB)
- Use `@@map()` for table name mapping

### Testing
- Unit tests: `*.spec.ts` colocated with source files
- E2E tests: `test/app.e2e-spec.ts`
- Jest config includes `collectCoverageFrom` for all source files

---

## Development Workflow

### Starting Development
1. **Ensure PostgreSQL running** with DATABASE_URL env var set
2. **Run migrations**: `npm run prisma:migrate` (applies pending migrations; prompts for migration name)
3. **Start dev server**: `npm run start:dev` (auto-reloads on file changes)
4. **View/edit data** (optional): `npm run prisma:studio` opens Prisma Studio

### Adding Features
1. **Create new services** in `src/features/` with modular structure
2. **Generate NestJS scaffold** (optional):
   ```bash
   nest generate module features/team
   nest generate service features/team
   nest generate controller features/team
   ```
3. **Update schema.prisma** if DB changes; run `npm run prisma:migrate "description"`
4. **Write tests**: `nest generate controller features/team --spec`
5. **Lint & format**: `npm run lint && npm run format`

### Database Changes Workflow

1. **Modify** `src/prisma/schema.prisma`
2. **Create migration**:
   ```bash
   npm run prisma:migrate
   ```
3. **Test that migration works**:
   ```bash
   npm run prisma:studio        # Verify schema visually
   npm test                     # Run tests with new schema
   ```
4. **Commit** migration file to git

### Best Practices

- **Never manually edit migration files** — use the Prisma workflow
- **Never hardcode** DATABASE_URL or secrets — always use `.env`
- **DI over imports**: Use constructor injection, not direct imports
- **Modular architecture**: Group related features in separate modules
- **Test-driven approach**: Write specs alongside features

---

## Common Pitfalls & Solutions

| Problem | Solution |
|---------|----------|
| **Port 3000 already in use** | Change `PORT` in `.env` or kill process: `lsof -i :3000` (Mac/Linux) or `netstat -ano \| findstr :3000` (Windows) |
| **DATABASE_URL not found** | Create `.env` file with `DATABASE_URL=postgres://...` |
| **Cannot find module `@prisma/client`** | Run `npm run prisma:generate` |
| **Prisma schema drift detected** | Run `npm run prisma:migrate` to resolve |
| **TypeScript build fails** | Ensure `npm run build` works locally before committing |
| **Tests fail on CI/GitHub Actions** | Ensure `.env` variables are set; use clean database state |
| **Hot-reload not working** | Restart `npm run start:dev` or update NestJS CLI |
| **Swagger docs not showing** | Ensure `@ApiOperation()` decorators added; check `src/main.ts` |

---

## Productivity Tips

- **Use NestJS CLI**: `nest generate schematics` speeds up module/service/controller creation
- **Enable ESLint on save**: Auto-fix linting errors
- **Use Prettier format**: `npm run format` keeps code consistent
- **Pragma comments**: Mark sections with `// --- SECTION NAME ---` for clarity
- **TypeScript strict mode**: Catch type errors early
- **Logger Service**: Don't use `console.log` — use `Logger` for structured logging

---

## Notes for AI Assistants

- **Prefer modular architecture**: Create feature modules (e.g., `src/features/users/`, `src/features/teams/`, `src/features/analysis/`) as complexity grows
- **Test-driven approach**: Write specs alongside features to catch integration issues early
- **Database-first mentality**: Always think about Prisma schema relations before implementing services
- **Avoid hardcoding**: Use `.env` for configuration (DATABASE_URL, NODE_ENV, JWT_SECRET, GITHUB_API_TOKEN, etc.)
- **DI over imports**: Nest encourages dependency injection; avoid circular dependencies by proper module structure
- **Global services**: PrismaModule is already global; don't re-export in submodules
- **Schema conventions**: Use Portuguese for business logic comments, snake_case for DB columns, CamelCase for TypeScript

---

## Useful Commands Reference

| Task | Command |
|------|---------|
| Start development | `npm run start:dev` |
| Debug mode | `npm run start:debug` |
| Build project | `npm run build` |
| Production start | `npm run start:prod` |
| Run all tests | `npm test` |
| Tests in watch mode | `npm run test:watch` |
| Coverage report | `npm run test:cov` |
| E2E tests | `npm run test:e2e` |
| Debug tests | `npm run test:debug` |
| Check code quality | `npm run lint` |
| Auto-fix & format | `npm run lint && npm run format` |
| Database migration | `npm run prisma:migrate` |
| Apply pending migrations | `npm run prisma:deploy` |
| View database (UI) | `npm run prisma:studio` |
| Regenerate Prisma Client | `npm run prisma:generate` |
| Generate NestJS module | `nest generate module features/<name>` |
| Generate NestJS service | `nest generate service features/<name>` |
| Generate NestJS controller | `nest generate controller features/<name>` |
