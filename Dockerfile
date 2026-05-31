# ─── Stage 1: Dependências de produção ───────────────────────────────────────
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --omit=dev

# ─── Stage 2: Build ───────────────────────────────────────────────────────────
FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY prisma.config.ts ./
COPY src ./src
COPY tsconfig.json tsconfig.build.json nest-cli.json ./
RUN npx prisma generate --config prisma.config.ts
RUN npm run build

# ─── Stage 3: Produção ────────────────────────────────────────────────────────
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Dependências de produção (sem devDeps)
COPY --from=deps    /app/node_modules               ./node_modules

# Build compilado
COPY --from=builder /app/dist                       ./dist

# Schema e migrations (necessários para o prisma migrate deploy)
COPY --from=builder /app/src/prisma                 ./src/prisma

# Prisma Client gerado + CLI (builder tem as devDeps, inclusive o CLI do Prisma)
COPY --from=builder /app/node_modules/.prisma       ./node_modules/.prisma
COPY --from=builder /app/node_modules/prisma        ./node_modules/prisma
COPY --from=builder /app/node_modules/@prisma       ./node_modules/@prisma
# Copia o binário do CLI para que possamos chamá-lo no CMD
COPY --from=builder /app/node_modules/.bin/prisma   ./node_modules/.bin/prisma

COPY package.json package-lock.json prisma.config.ts ./

EXPOSE 3000

# ✅ CORREÇÃO PRINCIPAL:
# Roda as migrations ANTES de subir a aplicação.
# Assim toda vez que o Railway fizer deploy, o banco é atualizado automaticamente.
CMD ["sh", "-c", "./node_modules/.bin/prisma migrate deploy --config prisma.config.ts && node dist/main.js"]