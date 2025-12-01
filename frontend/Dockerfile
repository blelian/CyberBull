# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Accept build args for frontend env vars
ARG NEXT_PUBLIC_PY_BACKEND
ARG NEXT_PUBLIC_CPP_BACKEND

# Make them available at build time for Next.js
ENV NEXT_PUBLIC_PY_BACKEND=$NEXT_PUBLIC_PY_BACKEND
ENV NEXT_PUBLIC_CPP_BACKEND=$NEXT_PUBLIC_CPP_BACKEND

COPY package.json pnpm-lock.yaml* ./
RUN npm install
COPY . .
RUN npm run build

# Production stage
FROM node:20-alpine AS runner
WORKDIR /app

# Pass runtime env vars (optional, only needed if used in server code)
ENV NEXT_PUBLIC_PY_BACKEND=$NEXT_PUBLIC_PY_BACKEND
ENV NEXT_PUBLIC_CPP_BACKEND=$NEXT_PUBLIC_CPP_BACKEND

COPY --from=builder /app/ ./
EXPOSE 3000
CMD ["npm", "start"]
