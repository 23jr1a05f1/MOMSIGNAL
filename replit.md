# MomSignal Smart Belt - Maternal Health Monitoring System

## Overview

MomSignal is a real-time maternal health monitoring dashboard designed to work with an IoT smart belt device. The system tracks vital signs during pregnancy including heart rate, SpO2, temperature, contractions, and fetal movement. It provides live data visualization, historical tracking, and automated health alerts.

The application connects to physical hardware (Arduino-based sensors including ADXL345 accelerometer and MAX30105 pulse sensor) via REST API endpoints, storing readings in a PostgreSQL database and displaying them through an interactive React dashboard.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight client-side routing)
- **State Management**: TanStack React Query for server state with automatic polling (3-5 second intervals for live data)
- **UI Components**: shadcn/ui component library with Radix UI primitives
- **Styling**: Tailwind CSS with custom medical-themed design tokens (soft pinks, calming blues)
- **Charts**: Recharts for vital sign visualization (heart rate trends, contraction levels)
- **Fonts**: DM Sans (body), Outfit (headings)

### Backend Architecture
- **Runtime**: Node.js with Express
- **Language**: TypeScript with ES modules
- **API Design**: RESTful endpoints with Zod validation for type-safe request/response handling
- **Shared Types**: API contracts defined in `shared/routes.ts` using Zod schemas, shared between client and server

### Data Storage
- **Database**: PostgreSQL with Drizzle ORM
- **Schema Location**: `shared/schema.ts`
- **Main Tables**:
  - `readings`: Stores vital sign snapshots (heart rate, SpO2, temperature, contraction levels, fetal data)
  - `alerts`: Health alerts triggered by abnormal readings (auto-generated when vitals exceed thresholds)

### Alert System
- Automatic alert generation when readings exceed safe thresholds:
  - Heart rate > 120 or < 50 bpm → warning
  - SpO2 < 95% → critical
- Alerts can be resolved through the API

### Build System
- **Development**: Vite dev server with HMR
- **Production**: esbuild for server bundling, Vite for client build
- **Database Migrations**: Drizzle Kit with `db:push` command

## External Dependencies

### Database
- PostgreSQL (required, connection via `DATABASE_URL` environment variable)
- Drizzle ORM for database operations
- connect-pg-simple for session storage capability

### Frontend Libraries
- @tanstack/react-query: Data fetching and caching
- recharts: Data visualization
- date-fns: Date formatting
- wouter: Client-side routing
- Radix UI: Accessible component primitives
- Tailwind CSS: Utility-first styling

### Hardware Integration
- The system expects POST requests to `/api/readings` from IoT devices
- Compatible with Arduino sensors (ADXL345 accelerometer, MAX30105 pulse/SpO2 sensor)
- Device code reference available in `attached_assets/` folder

### Development Tools
- Replit-specific plugins for development (cartographer, dev-banner, runtime-error-modal)
- TypeScript for type safety across the stack