# ---------- Stage 1 : Build ----------
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/
COPY prisma.config.ts ./

RUN npm ci

RUN npx prisma generate

COPY tsconfig.json ./
COPY src ./src/

RUN npm run build

# ---------- Stage 2 : Production ----------
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/
COPY prisma.config.ts ./

RUN npm ci --omit=dev

RUN npx prisma generate

COPY --from=builder /app/dist ./dist/

EXPOSE 3000

CMD ["node", "dist/index.js"]
