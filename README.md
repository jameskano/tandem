# Tandem - Couples Activity Planner

A commercial, mobile-first web application for couples to plan activities, track goals, and capture memories together. Built with React, TypeScript, Tailwind CSS, and Capacitor for cross-platform deployment.

## Quick Start

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview
```

## Mobile Development

### Capacitor Setup

```bash
# Initialize Capacitor (first time only)
pnpm cap:init

# Sync web assets to native projects
pnpm cap:sync

# Open iOS project
pnpm cap:ios

# Open Android project
pnpm cap:android
```

### Building for Mobile

```bash
# Build web assets
pnpm build

# Sync to native projects
pnpm cap:sync

# Open in Xcode/Android Studio
pnpm cap:ios    # or pnpm cap:android
```

## Database Setup

### Supabase Configuration

1. Create a new Supabase project
2. Copy your project URL and anon key
3. Create `.env` file:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY=your_supabase_publishable_key
VITE_APP_NAME=Tandem
```

4. Run the database schema:

```sql
-- Execute the contents of supabase/schema.sql in your Supabase SQL editor
```

## Development

### Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm preview` - Preview production build
- `pnpm lint` - Run ESLint
- `pnpm format` - Format code with Prettier
- `pnpm typecheck` - Run TypeScript type checking
- `pnpm ui:setup` - Setup shadcn/ui components (optional)

### Code Quality

- **ESLint** - Code linting with TypeScript support
- **Prettier** - Code formatting
- **Husky** - Git hooks for pre-commit linting
- **lint-staged** - Run linters on staged files

## Architecture

### Tech Stack

- **Frontend**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS + Custom Design System
- **State Management**: Zustand (local) + TanStack Query (server)
- **Routing**: React Router 6
- **Mobile**: Capacitor 7
- **Backend**: Supabase (Auth + Database + Storage)
- **Monitoring**: Sentry (optional)

### Project Structure

```
src/
app/                    # App shell and routing
providers/              # React Query, Theme providers
routes.tsx              # Route definitions
Layout.tsx              # Main layout component
components/             # Shared components
features/               # Feature-specific components
ui/                     # Reusable UI components
dashboard/              # Dashboard features
discover/               # Activity discovery
planner/                # Calendar/planning
goals/                  # Goal tracking
moments/                # Photo gallery
settings/               # App settings
pages/                  # Route components
services/               # External service integrations
shared/                 # Shared utilities and types
state/                  # Zustand stores
styles/                 # Global styles
```

## Design System

### Brand Colors

- **Primary**: `#FF6B81` (Coral Pink)
- **Accent**: `#FF9671` (Peach)
- **Highlight**: `#FFD6A5` (Light Peach)
- **Secondary**: `#C5B9E8` (Lavender)
- **Background**: `#FFF8F7` (Warm White)
- **Text**: `#2E2E2E` (Dark Gray)
- **Text Muted**: `#6B6B6B` (Medium Gray)

### Mobile-First Design

- Minimum 44px tap targets
- Safe area support for notched devices
- Responsive breakpoints: `sm:`, `md:`, `lg:`
- Touch-friendly interactions

## Features

### Core Features

1. **Main Dashboard** - Overview of upcoming plans and stats
2. **Activity Discovery** - Browse and save activity suggestions
3. **Planner** - Calendar view for scheduling activities
4. **Goals** - Set and track shared goals with progress bars
5. **Moments** - Photo gallery with camera integration
6. **Settings** - Partner linking, notifications, preferences

### Mobile Features

- **Push Notifications** - Activity reminders
- **Camera Integration** - Capture photos directly
- **Haptic Feedback** - Touch responses
- **Share Functionality** - Share activities and moments

## Authentication & Data

### User Management

- Supabase Auth integration
- Couple-based data sharing
- Row Level Security (RLS) policies
- Partner invitation system

### Data Models

- **Users** - User profiles and authentication
- **Couples** - Relationship entities
- **Activities** - Suggested activities with metadata
- **Plans** - Scheduled activities
- **Goals** - Progress tracking
- **Moments** - Photo memories
- **Notifications** - Push notification tokens

## Deployment

### Web Deployment

```bash
# Build the app
pnpm build

# Deploy dist/ folder to your hosting service
# (Vercel, Netlify, GitHub Pages, etc.)
```

### Mobile App Stores

1. Build web assets: `pnpm build`
2. Sync to native: `pnpm cap:sync`
3. Open in Xcode/Android Studio: `pnpm cap:ios` / `pnpm cap:android`
4. Build and submit to app stores

### Environment Variables

Required for production:

```env
VITE_SUPABASE_URL=your_production_supabase_url
VITE_SUPABASE_ANON_KEY=your_production_anon_key
VITE_SENTRY_DSN=your_sentry_dsn (optional)
```

## Troubleshooting

### Common Issues

1. **Capacitor sync fails**: Ensure `dist/` folder exists after building
2. **Supabase connection issues**: Check environment variables
3. **Push notifications not working**: Verify device permissions and FCM setup
4. **Camera not working on web**: Falls back to file input automatically

### Development Tips

- Use browser dev tools for mobile testing
- Check Capacitor logs for mobile debugging
- Verify Supabase RLS policies

## Licensing

This software is proprietary and intended for commercial use. Redistribution, modification, or use outside authorized deployments is not permitted without a written agreement.

## Contributions

This repository is not open to public contributions. For business partnerships or authorized development access, contact the product owner.

## Support

For issues and questions:
- Check the troubleshooting section
- Review Supabase documentation
- Check Capacitor documentation for mobile issues
