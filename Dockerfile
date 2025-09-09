FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./

# Install all dependencies
RUN npm install

# Copy the full source code
COPY . .

# Build the NestJS app
RUN npm run build

# ---------------------------
# 🚀 Production Stage
# ---------------------------
FROM node:22-alpine

WORKDIR /app

# Copy only production dependencies
COPY package*.json ./
RUN npm install --omit=dev

COPY --from=builder /app/dist ./dist

COPY .env ./

EXPOSE 3000

# Start the app
CMD ["node", "dist/main.js"]