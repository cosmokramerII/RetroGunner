# RetroGunner iOS

## Overview

RetroGunner is a retro-style side-scrolling shooter game built with React and Three.js, packaged for iOS deployment using Capacitor. The game features classic arcade-style gameplay with modern web technologies, including 3D graphics rendering, physics-based movement, and touch controls optimized for mobile devices.

The project combines a Canvas-based 3D game engine (using React Three Fiber) with a native iOS wrapper, allowing the web-based game to run as a native iOS application.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Core Framework**: React 18 with TypeScript, built using Vite for fast development and optimized production builds.

**3D Rendering**: React Three Fiber (@react-three/fiber) provides a declarative React interface for Three.js, enabling WebGL-based 3D graphics within the browser/WebView. The game uses an orthographic camera to achieve a 2D retro aesthetic while leveraging 3D rendering capabilities.

**State Management**: Zustand manages game state with middleware support (subscribeWithSelector). Separate stores handle:
- Game state (useGameStore) - Player, enemies, bullets, power-ups, score, levels
- Audio state (useAudio) - Sound effects and music playback
- Game phase (useGame) - Ready/playing/ended states

**Component Structure**:
- Game entities (Player, Enemy, Bullet, PowerUp, Explosion, Particle) are isolated React components that sync with game state
- Each entity uses `useFrame` hook for per-frame updates
- Touch controls overlay provides mobile-friendly input
- UI components render HUD, menus, and game information

**Input Handling**: 
- Keyboard controls using @react-three/drei's KeyboardControls for desktop
- Custom touch controls component for mobile devices (D-pad, action buttons)
- Input state is managed centrally and applied to player movement/actions

**Game Loop**: The main game loop runs through React Three Fiber's `useFrame` hook, updating:
- Player physics (movement, jumping, gravity)
- Enemy AI and movement patterns
- Bullet trajectories
- Collision detection (AABB-based)
- Spawn systems for enemies and power-ups
- Visual effects (explosions, particles)

### Mobile Platform (Capacitor)

**iOS Integration**: Capacitor 6.x wraps the web application in a native iOS WebView, providing:
- Native app packaging and distribution
- Access to device APIs if needed
- Proper viewport handling for mobile screens
- Touch event normalization

**Build Pipeline**:
1. Vite compiles React/TypeScript to optimized JavaScript
2. Assets bundled into `dist/` directory
3. Capacitor syncs web assets to native iOS project
4. Xcode builds final iOS app bundle

### Audio System

**Custom Audio Generation**: Instead of using audio files, the game generates retro-style music procedurally using the Web Audio API. The RetroMusicGenerator class creates 80s-style arcade music with:
- Synthesized bass patterns
- Lead melodies with catchy hooks
- Dynamic tempo and section variation
- Low CPU overhead

**Sound Effects**: Traditional audio files (MP3) for hit and success sounds, managed through the audio store.

### Game Physics

**Movement System**: Custom physics implementation with:
- Gravity and velocity-based movement
- Platform collision detection using AABB (Axis-Aligned Bounding Box)
- Jump mechanics with ground detection
- Horizontal acceleration/deceleration

**Collision Detection**: Utility functions in `lib/collision.ts` provide AABB collision checking between game entities for bullet hits, enemy contact, and power-up collection.

### Rendering Approach

**Sprite-Style 3D**: The game uses flat 3D planes (PlaneGeometry) with basic materials to achieve a retro pixel-art aesthetic while benefiting from GPU-accelerated rendering. This "fake 2D" approach provides:
- Crisp edges through orthographic camera
- Layering with Z-positioning
- Efficient rendering of many entities
- Visual effects like glow using additive blending

**UI Layer**: Separate React component layer overlays the 3D canvas for HUD, menus, and controls using standard HTML/CSS (Tailwind CSS).

## External Dependencies

### Core Libraries

- **React 18.3** - UI framework
- **React Three Fiber** - React renderer for Three.js
- **Three.js** (implicit via R3F) - WebGL 3D library
- **@react-three/drei** - Useful helpers for R3F (OrthographicCamera, KeyboardControls)

### Mobile Framework

- **Capacitor 6.1** - Native mobile wrapper
  - @capacitor/core - Core APIs
  - @capacitor/ios - iOS platform integration
  - @capacitor/cli - Build tooling

### State & Utilities

- **Zustand** - Lightweight state management with middleware
- **Tailwind CSS** - Utility-first CSS framework
- **class-variance-authority** - Component variant utilities
- **clsx / tailwind-merge** - Conditional className utilities

### UI Components

Radix UI primitives for accessible, unstyled components:
- Dialog, Dropdown, Select, Tooltip, etc.
- Custom styled via Tailwind (shadcn/ui pattern)

### Build Tools

- **Vite 5.4** - Frontend build tool and dev server
- **TypeScript 5.6** - Type safety
- **@vitejs/plugin-react** - React integration for Vite

### Optional/Unused

- **@tanstack/react-query** (imported but unused) - Would handle server data fetching
- **react-hook-form** (UI components present) - For form handling if needed
- **Lucide React** - Icon library for UI

### Font Resources

- **@fontsource/inter** - Self-hosted Inter font
- Custom font JSON in public/fonts/

### Audio

- **Web Audio API** (browser native) - Procedural music generation
- Sound effect files expected in `/public/sounds/` (hit.mp3, success.mp3)