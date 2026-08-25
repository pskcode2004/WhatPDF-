# ============================================
# WhatPDF Worker — Dockerfile
# Includes LibreOffice for document conversion
# ============================================
FROM node:20-slim AS base

# Install LibreOffice + system dependencies + Python
RUN apt-get update && apt-get install -y \
    libreoffice \
    libreoffice-writer \
    libreoffice-calc \
    libreoffice-impress \
    libvips \
    poppler-utils \
    python3 \
    python3-pip \
    python3-venv \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Setup Python Virtual Environment and install pdf2docx
RUN python3 -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"
RUN pip install --no-cache-dir pdf2docx

# Install pnpm
RUN npm install -g pnpm

WORKDIR /app

# Copy workspace manifests
COPY pnpm-workspace.yaml ./
COPY package.json ./

# Copy shared package and worker app
COPY packages/shared ./packages/shared
COPY apps/worker ./apps/worker

# Install only worker dependencies (and tsx for running it)
RUN pnpm install --filter @whatpdf/worker...
RUN npm install -g tsx

CMD ["tsx", "apps/worker/src/index.ts"]
