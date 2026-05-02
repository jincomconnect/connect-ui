# CommunityHub - Social Media Website

## Overview
A React + Vite + TypeScript frontend-only social media web application called "CommunityHub". It features a community-based social feed where users can post services, interact with communities, and manage their profiles.

## Architecture
- **Frontend**: React 18 + Vite 6 + TypeScript
- **Styling**: Tailwind CSS v4 + shadcn/ui components + Radix UI primitives + MUI
- **Routing**: React Router v7
- **Build Tool**: Vite (pnpm as package manager)
- **No backend**: Pure frontend SPA with mock/static data

## Project Structure
```
src/
  app/
    App.tsx           - Root app with RouterProvider and providers
    routes.tsx        - All app routes
    components/       - Page and UI components
      Root/           - Layout shell (sidebar, header)
      Home/           - Feed page
      Communities/    - Communities listing
      CommunityDetail/- Individual community view
      AdminPanel/     - Admin dashboard
      Search/         - Search page
      Profile/        - User profile
      Settings/       - User settings
      Help/           - Help page
      Login/          - Login page
      Signup/         - Sign up page
      NotFound/       - 404 page
      ui/             - Shared UI components
    context/          - React contexts (SidebarContext)
    config/           - App configuration
  styles/             - Global CSS (index, tailwind, theme, fonts)
  main.tsx            - Entry point
index.html            - HTML template
vite.config.ts        - Vite configuration (port 5000, host 0.0.0.0, allowedHosts: true)
```

## Development
- Run: `node_modules/.bin/vite --mode development` (workflow command)
- Port: 5000
- Package manager: pnpm

## Deployment
- Type: Static site
- Build command: `pnpm run build`
- Output directory: `dist`
