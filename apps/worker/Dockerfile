# ============================================
# WhatPDF Worker — Dockerfile
# Includes LibreOffice for document conversion
# ============================================
FROM node:20-slim AS base

# Install LibreOffice + system dependencies
RUN apt-get update && apt-get install -y \
    libreoffice \
    libreoffice-writer \
    libreoffice-calc \
    libreoffice-impress \
    libvips \
    poppler-utils \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Install pnpm
RUN npm install -g pnpm

WORKDIR /app

# Copy workspace manifests
COPY pnpm-workspace.yaml ./
COPY package.json ./

# Copy shared package and worker app
COPY packages/shared ./packages/shared
COPY apps/worker ./apps/worker

# Install only worker dependencies
RUN pnpm install --filter @whatpdf/worker...

# Build TypeScript
RUN pnpm --filter @whatpdf/worker build

CMD ["node", "apps/worker/dist/index.js"]
