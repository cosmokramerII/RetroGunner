# Contra-Style Run & Gun Game

A modern Contra-inspired side-scrolling action platformer built with React Three Fiber, featuring fast-paced arcade gameplay, modern graphics, and touch controls.

## Features

### Gameplay
- **Classic Run & Gun Action**: Side-scrolling platformer with intense shooting mechanics
- **Multiple Weapon Types**: Basic gun, machine gun, spread gun, and laser weapon
- **Power-Up System**: Collect weapon upgrades and health boosts
- **Enemy Variety**: 
  - Soldiers with ground patrol AI
  - Flying enemies with aerial attacks
  - Stationary turrets with tracking shots
  - Fast-moving runner enemies
  - Epic boss battles with multi-phase AI
- **Procedural Level Generation**: Dynamic platform layouts and enemy spawns
- **Progressive Difficulty**: Levels get harder as you advance

### Graphics & Effects
- **Modern 3D Graphics**: Built with React Three Fiber (not pixel art)
- **Particle Effects**: Explosions, muzzle flashes, and hit impacts
- **Dynamic Environments**: Jungle backgrounds with trees, vines, and foliage
- **Smooth Animations**: Character movement, enemy AI, and visual effects

### Audio
- **Procedural 80s Music**: Authentic synthesized arcade soundtrack
- **Dynamic Sound Effects**: Hit sounds, weapon fire, and explosions
- **Adjustable Audio**: Volume controls and mute options

### Controls
- **Keyboard Controls**: 
  - Arrow Keys/WASD for movement
  - Spacebar to jump
  - Z to shoot
- **Touch Gamepad**: On-screen controls for mobile devices
- **Responsive Design**: Works on desktop and mobile browsers

## Technical Stack

### Frontend
- **React Three Fiber**: 3D rendering in React
- **Three.js**: Core 3D graphics library
- **Zustand**: State management
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Styling
- **shadcn/ui**: UI components
- **Vite**: Build tool

### Backend
- **Express.js**: Web server
- **Drizzle ORM**: Database management
- **PostgreSQL**: Database (Neon serverless)

## Getting Started

### Installation
```bash
npm install
```

### Development
```bash
npm run dev
```

The game will be available at `http://localhost:5000`

### Building
```bash
npm run build
```

## Game Mechanics

### Movement
- Run left/right with arrow keys or A/D
- Jump with Spacebar
- Double-tap for rapid fire

### Combat
- Aim automatically at nearest enemy
- Collect weapon power-ups for enhanced firepower
- Defeat bosses to advance levels

### Scoring
- Points for defeating enemies
- Combo multipliers for consecutive hits
- Bonus points for completing levels quickly

## Architecture

The game uses a component-based architecture with React Three Fiber for rendering. Key systems include:

- **Game Store**: Centralized state management with Zustand
- **Physics System**: Custom AABB collision detection
- **AI System**: Different behavior patterns for each enemy type
- **Audio Engine**: Web Audio API for procedural music generation
- **Level Generator**: Procedural platform and enemy placement

## Performance

- Optimized rendering with React Three Fiber
- Efficient collision detection
- Smooth 60 FPS gameplay
- Mobile-optimized touch controls

## Browser Compatibility

- Chrome (recommended)
- Firefox
- Safari
- Edge
- Mobile browsers (iOS Safari, Chrome Mobile)

## Credits

Inspired by the classic Contra series, reimagined with modern web technologies.

## License

This project is for educational purposes.