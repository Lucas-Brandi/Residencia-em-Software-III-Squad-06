# Stage 1: Instalar dependências de produção
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --omit=dev

# Stage 2: Build da aplicação
FROM node:20-alpine AS builder
WORKDIR /app
# Copia os arquivos de configuração e dependências
COPY package.json package-lock.json ./
# Instala TODAS as dependências, incluindo as de desenvolvimento
RUN npm install
# Copia o código fonte e outros arquivos necessários para o build
COPY src ./src
COPY src/prisma ./prisma
COPY tsconfig.json tsconfig.build.json nest-cli.json ./
# Gera o Prisma Client e compila a aplicação
RUN npx prisma generate
RUN npm run build

# Stage 3: Imagem de produção
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Copia as dependências de produção do primeiro estágio
COPY --from=deps /app/node_modules ./node_modules
# Copia o código compilado e o schema do Prisma do estágio de build
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
# Copia o Prisma Client gerado
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

# Copia o package.json para metadados e para a pasta dist
COPY package.json .
COPY package.json ./dist

EXPOSE 3000
CMD ["node", "dist/src/main"]