# Overview

This is a side-scrolling action game built with React Three Fiber, inspired by classic run-and-gun arcade games like Contra. The application features a 3D-rendered 2D game with physics-based movement, multiple enemy types, weapon systems, power-ups, and boss battles. The game runs in the browser with both keyboard and touch controls for mobile support.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture

The frontend is built using a modern React stack with 3D rendering capabilities:

**React Three Fiber (R3F)**: The core rendering engine uses React Three Fiber to render the game in 3D while maintaining 2D gameplay mechanics. This approach allows for visual effects like particles, explosions, and layered backgrounds while keeping gameplay simple and responsive.

**Component-Based Game Objects**: Each game entity (Player, Enemy, Bullet, PowerUp, etc.) is a separate React component that updates independently. This provides clean separation of concerns and makes the game logic modular and maintainable.

**State Management with Zustand**: The application uses Zustand for global state management with two main stores:
- `useGameStore`: Manages all game state including player, enemies, bullets, score, levels, and game logic
- `useAudio`: Handles sound effects and background music with mute controls

**Tailwind CSS + shadcn/ui**: The UI layer uses Tailwind for styling and shadcn/ui for pre-built accessible components. The game HUD is rendered as HTML overlays on top of the 3D canvas.

**Custom Hook for Mobile Detection**: The `useIsMobile` hook detects screen size to conditionally render touch controls on mobile devices.

## Backend Architecture

The backend follows a minimal Express.js structure:

**Express Server**: A simple HTTP server that serves the React application and provides API routes (currently minimal/placeholder routes).

**Storage Interface Pattern**: The backend uses an interface-based storage pattern (`IStorage`) with an in-memory implementation (`MemStorage`). This allows easy swapping to database-backed storage without changing application logic.

**Vite Development Integration**: In development mode, the Express server integrates Vite's middleware for hot module replacement and fast refresh. In production, it serves the pre-built static assets.

**Separation of Concerns**: 
- `server/index.ts`: Main server entry point with middleware setup
- `server/routes.ts`: API route registration
- `server/storage.ts`: Data access layer
- `server/vite.ts`: Development tooling integration

## Database & Schema

**Drizzle ORM**: The application uses Drizzle as the database ORM with PostgreSQL dialect configured. Schema definitions live in `shared/schema.ts` for use across both client and server.

**Schema Structure**: Currently defines a minimal `users` table with username/password fields. The schema uses Drizzle's type-safe schema builder and Zod for validation.

**Migration Strategy**: Drizzle Kit is configured to generate migrations in the `./migrations` directory. The `db:push` script allows schema changes to be pushed directly to the database.

**Neon Serverless**: The application is configured to use Neon's serverless PostgreSQL driver (`@neondatabase/serverless`), which is optimized for serverless and edge environments.

## Game Architecture

**Game Loop**: The main game loop runs in `Game.tsx` using R3F's `useFrame` hook, which executes on every render frame. This updates all game systems including physics, AI, collision detection, and spawning.

**Physics System**: Custom physics implementation handles gravity, velocity, acceleration, and collision detection using AABB (Axis-Aligned Bounding Box) algorithms defined in `lib/collision.ts`.

**Entity Component System**: Game entities maintain their own state and update logic. The game store orchestrates interactions between entities through collision detection and game rules.

**Level System**: Procedural level generation creates platforms, background elements (trees, vines, bushes), and manages enemy spawn points based on the current level.

**Weapon System**: Multiple weapon types (basic, machine gun, spread gun, laser) with different damage, fire rates, and projectile patterns. Weapons are acquired through power-ups.

**AI System**: Different enemy types have distinct behavior patterns:
- Soldier: Ground-based patrol and shooting
- Flying: Hovering movement with aerial attacks
- Turret: Stationary with tracking shots
- Runner: Fast-moving melee enemies
- Boss: Complex multi-phase behavior

## External Dependencies

**Rendering & 3D**: 
- `@react-three/fiber`: React renderer for Three.js
- `@react-three/drei`: Useful helpers and abstractions for R3F
- `@react-three/postprocessing`: Post-processing effects
- `three`: Core 3D library

**UI Components**: 
- `@radix-ui/*`: Comprehensive set of accessible UI primitives
- `tailwindcss`: Utility-first CSS framework
- `class-variance-authority`: Type-safe variant management for components
- `cmdk`: Command palette component

**State & Data**:
- `zustand`: Lightweight state management
- `@tanstack/react-query`: Server state management (prepared for API integration)
- `drizzle-orm`: Type-safe ORM
- `drizzle-zod`: Zod schema generation from Drizzle schemas

**Backend**:
- `express`: Web server framework
- `@neondatabase/serverless`: Serverless PostgreSQL client
- `vite`: Build tool and development server

**Development Tools**:
- `typescript`: Type safety
- `tsx`: TypeScript execution for development
- `esbuild`: Fast JavaScript bundler for production builds
- `vite-plugin-glsl`: GLSL shader support for custom visual effects

**Audio**: The application expects audio files in `/public/sounds/` directory (background.mp3, hit.mp3, success.mp3) though these are not included in the repository.

**Fonts**: Uses Inter font family loaded via `@fontsource/inter` for consistent typography.