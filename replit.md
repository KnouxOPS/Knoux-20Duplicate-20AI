# Knoux Duplicate AI - Replit Setup

## Project Overview
This is a full-stack React application called "Knoux Duplicate AI" - an intelligent duplicate file detection and management system. The application uses the Fusion Starter template with:
- **Frontend**: React 18 + Vite + TypeScript + TailwindCSS + Radix UI
- **Backend**: Express.js API server
- **Build System**: Vite 7 with SWC
- **Package Manager**: PNPM

## Project Purpose
Knoux Duplicate AI helps users:
- Scan and detect duplicate files (images, videos, documents, audio)
- Manage duplicates with smart rules and suggestions
- Preview and compare duplicate files
- Safely trash/restore files with a safe trash system
- Apply automated rules for duplicate handling (keep largest, newest, best quality)

## Architecture

### Frontend (Client)
- **Location**: `/client`
- **Entry**: `client/main.tsx`
- **Routing**: React Router 6 (SPA mode)
- **State**: React Context API + TanStack Query
- **UI Components**: Radix UI primitives in `client/components/ui/`
- **Pages**: 
  - Index (Home/Dashboard)
  - Scan (File scanning)
  - Rules (Duplicate management rules)
  - Settings
  - Help
  - Onboarding/Splash screens

### Backend (Server)
- **Location**: `/server`
- **Entry**: `server/index.ts`
- **Port**: Integrated with Vite dev server on port 5000 (development)
- **API Routes**:
  - `/api/ping` - Health check
  - `/api/demo` - Demo endpoint
  - `/api/duplicates/*` - Duplicate detection and analysis
  - `/api/trash/*` - Safe trash management
  - `/api/rules/*` - Rule management
  - `/api/preview/*` - File preview generation

### Shared
- **Location**: `/shared`
- **Purpose**: Type definitions and interfaces shared between client and server

## Development Setup

### Configuration Changes for Replit
1. **Vite Configuration** (`vite.config.ts`):
   - Changed port from 8080 to 5000
   - Set host to `0.0.0.0` for Replit compatibility
   - Configured HMR (Hot Module Reload) for WebSocket proxy:
     - Host: Uses `REPLIT_DEV_DOMAIN` environment variable
     - Client port: 443
     - Protocol: WSS (secure WebSocket)

2. **Bug Fixes Applied**:
   - Fixed `sonner` toast import in `client/hooks/useNotification.ts` (import from 'sonner' package, not UI component)
   - Fixed invalid `Toggle2` icon in `client/pages/Rules.tsx` (changed to `ToggleLeft` from lucide-react)

### Workflow
- **Name**: Start application
- **Command**: `pnpm dev`
- **Port**: 5000
- **Type**: webview

## Deployment Configuration
- **Target**: Autoscale (stateless web application)
- **Build**: `pnpm build`
- **Run**: `node dist/server/production.mjs`
- **Build Output**: 
  - Client: `dist/spa/`
  - Server: `dist/server/`

## Key Features
1. **Duplicate Detection**: Intelligent file scanning with various algorithms
2. **Smart Rules**: Automated duplicate handling based on size, date, quality
3. **Safe Trash**: Temporary storage before permanent deletion
4. **File Preview**: Visual comparison of duplicate files
5. **Batch Operations**: Process multiple duplicates at once
6. **Multi-format Support**: Images, videos, documents, audio files

## Scripts
- `pnpm dev` - Start development server (frontend + backend)
- `pnpm build` - Production build (client + server)
- `pnpm start` - Start production server
- `pnpm typecheck` - TypeScript validation
- `pnpm test` - Run Vitest tests
- `pnpm format.fix` - Format code with Prettier

## Recent Changes (December 5, 2025)
- Configured Vite for Replit environment (port 5000, HMR via WSS)
- Fixed import errors in notification hooks
- Fixed invalid Lucide icon imports
- Set up deployment configuration
- Installed all dependencies via PNPM
- Verified application runs successfully

## Status
✅ Application is running and functional
✅ Frontend loads successfully (Splash screen visible)
✅ Backend API is integrated
✅ WebSocket HMR is working
✅ Deployment configuration is complete
