# IBOS System Frontend

A modern, full-featured business management system frontend built with React, TypeScript, and shadcn/ui components.

## Overview

IBOS (Integrated Business Operations System) is a comprehensive business management platform that provides role-based dashboards for admins, clients, and employees. The system includes project tracking, task management, invoice generation, analytics dashboards, internal messaging, and AI-powered insights.

## Features

### Core Functionality
- **Client Panel**: Project tracking, milestone updates, and invoice history
- **Task Manager**: Kanban boards, deadlines, and assignments for employee productivity
- **Invoice Generator**: Professional PDF invoices with QR code payments
- **Analytics Dashboard**: KPIs, revenue charts, and performance metrics
- **Internal Chat**: Real-time messaging between teams, clients, and admins
- **AI Assistant**: Smart predictions, natural language queries, and automated insights

### Role-Based Access
- **Admin Dashboard**: Full system control and management
- **Client Dashboard**: Project oversight and collaboration tools
- **Employee Dashboard**: Task management and productivity tracking

## Tech Stack

### Frontend Framework
- **React 18.3.1** - UI library
- **TypeScript 5.8.3** - Type safety
- **Vite 5.4.19** - Build tool and dev server

### UI Components & Styling
- **shadcn/ui** - High-quality component library
- **Radix UI** - Accessible component primitives
- **Tailwind CSS 3.4.17** - Utility-first CSS framework
- **Lucide React** - Icon library
- **next-themes** - Theme management

### State Management & Data Fetching
- **TanStack Query 5.83.0** - Data fetching and caching
- **React Hook Form 7.61.1** - Form management
- **Zod 3.25.76** - Schema validation

### Routing
- **React Router DOM 6.30.1** - Client-side routing

### Additional Libraries
- **Recharts 2.15.4** - Charting library
- **date-fns 3.6.0** - Date manipulation
- **Sonner 1.7.4** - Toast notifications
- **Embla Carousel 8.6.0** - Carousel component
- **React Resizable Panels 2.1.9** - Resizable layouts

### Development Tools
- **ESLint 9.32.0** - Code linting
- **Vitest 3.2.4** - Unit testing
- **Testing Library** - React component testing

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── ui/           # shadcn/ui components (49 components)
│   │   └── NavLink.tsx   # Custom navigation component
│   ├── pages/
│   │   ├── LandingPage.tsx      # Public landing page
│   │   ├── LoginPage.tsx        # Authentication
│   │   ├── SignUpPage.tsx       # User registration
│   │   ├── AdminDashboard.tsx   # Admin management interface
│   │   ├── ClientDashboard.tsx  # Client portal
│   │   ├── EmployeeDashboard.tsx# Employee workspace
│   │   ├── NotFound.tsx         # 404 page
│   │   └── Index.tsx            # Page exports
│   ├── hooks/
│   │   ├── use-mobile.tsx       # Mobile detection
│   │   └── use-toast.ts         # Toast notifications
│   ├── lib/
│   │   └── utils.ts             # Utility functions
│   ├── App.tsx                  # Main app component with routing
│   ├── main.tsx                 # Application entry point
│   ├── index.css                # Global styles
│   └── vite-env.d.ts            # Vite type definitions
├── public/                      # Static assets
├── components.json              # shadcn/ui configuration
├── tailwind.config.ts           # Tailwind CSS configuration
├── vite.config.ts               # Vite configuration
├── tsconfig.json                # TypeScript configuration
└── package.json                 # Dependencies and scripts
```

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm, yarn, or bun

### Installation

1. Clone the repository:
```bash
git clone https://github.com/HamzaAnis67/IBOS_System_Frontend.git
cd IBOS_System_Frontend
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
bun install
```

### Development

Start the development server:
```bash
npm run dev
# or
yarn dev
# or
bun dev
```

The application will be available at `http://localhost:8080`

### Build

Build for production:
```bash
npm run build
# or
yarn build
# or
bun build
```

Preview production build:
```bash
npm run preview
# or
yarn preview
# or
bun preview
```

### Testing

Run tests:
```bash
npm run test
# or
yarn test
# or
bun test
```

Run tests in watch mode:
```bash
npm run test:watch
# or
yarn test:watch
# or
bun test:watch
```

### Linting

Run ESLint:
```bash
npm run lint
# or
yarn lint
# or
bun lint
```

## Live Demo

Check out the live application: https://ibos-system-frontend.vercel.app/

### Demo Credentials

**Admin**
- Email: danish@mail.com
- Password: danish123

**Employee**
- Email: asfar@example.com
- Password: asfar123

**Client**
- Email: john@example.com
- Password: password1234

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:dev` - Build in development mode
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run test` - Run tests once
- `npm run test:watch` - Run tests in watch mode

## Configuration

### Environment Variables
Create a `.env` file in the root directory (if needed):
```
VITE_API_URL=your_api_url
```

### Tailwind CSS
Customize the theme in `tailwind.config.ts`:
- Colors, fonts, and spacing
- Dark mode configuration
- Custom component styles

### TypeScript
TypeScript configuration in `tsconfig.json`:
- Strict type checking enabled
- Path aliases configured (`@/` maps to `./src`)

## Component Library

This project uses shadcn/ui components. To add new components:

```bash
npx shadcn-ui@latest add [component-name]
```

Available components include:
- Button, Input, Select, Checkbox, Radio
- Dialog, Sheet, Drawer
- Card, Badge, Avatar
- Table, Pagination
- Form, Toast, Alert
- And 40+ more components

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

This project is private and proprietary.

## Contributing

This is a private project. For contribution guidelines, please contact the maintainers.

## Support

For support and questions, please contact the development team.
