import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { GAME_CONSTANTS } from "../gameConstants";
import { checkAABBCollision } from "../collision";
import { useAudio } from "./useAudio";

interface Position {
  x: number;
  y: number;
}

interface Player {
  id: string;
  position: Position;
  velocity: Position;
  health: number;
  maxHealth: number;
  currentWeapon: string;
  facingRight: boolean;
  isJumping: boolean;
  onGround: boolean;
  shootCooldown: number;
  color: string;
  hasShield: boolean;
  shieldDuration: number;
}

interface Enemy {
  id: string;
  position: Position;
  velocity: Position;
  health: number;
  type: 'soldier' | 'flying' | 'turret' | 'runner';
  facingRight: boolean;
  aiState: string;
  shootCooldown: number;
  patrolStart: number;
  patrolEnd: number;
  hoverOffset?: number;
  hoverSpeed?: number;
}

interface Bullet {
  id: string;
  position: Position;
  velocity: Position;
  weapon: string;
  owner: string;
  damage: number;
}

interface PowerUp {
  id: string;
  position: Position;
  type: 'weapon_machine_gun' | 'weapon_spread_gun' | 'weapon_laser' | 'extra_life' | 'shield';
  collected: boolean;
}

interface Platform {
  x: number;
  y: number;
  width: number;
  height: number;
  type: string;
}

interface Level {
  platforms: Platform[];
}

interface GameState {
  player: Player | null;
  enemies: Enemy[];
  bullets: Bullet[];
  powerUps: PowerUp[];
  level: Level;
  gameState: 'menu' | 'playing' | 'gameOver';
  score: number;
  enemySpawnTimer: number;
  powerUpSpawnTimer: number;
  
  // Actions
  initializeGame: () => void;
  startGame: () => void;
  restartGame: () => void;
  updatePlayer: (delta: number) => void;
  updateEnemies: (delta: number) => void;
  updateBullets: (delta: number) => void;
  updatePowerUps: (delta: number) => void;
  updatePlayerInput: (input: any) => void;
  shootBullet: (position: Position, direction: Position, weapon: string, owner: string) => void;
  checkCollisions: () => void;
  spawnEnemies: () => void;
  spawnPowerUp: () => void;
  collectPowerUp: (powerUpId: string) => void;
  changeWeapon: (weapon: string) => void;
}

let nextId = 1;
const generateId = () => `entity_${nextId++}`;

export const useGameStore = create<GameState>()(
  subscribeWithSelector((set, get) => ({
    player: null,
    enemies: [],
    bullets: [],
    powerUps: [],
    level: { platforms: [] },
    gameState: 'menu',
    score: 0,
    enemySpawnTimer: 0,
    powerUpSpawnTimer: 0,

    initializeGame: () => {
      const level: Level = {
        platforms: [
          // Ground platforms
          { x: 0, y: -3, width: 20, height: 1, type: 'grass' },
          { x: 25, y: -3, width: 15, height: 1, type: 'asphalt' },
          { x: 45, y: -3, width: 20, height: 1, type: 'grass' },
          
          // Elevated platforms
          { x: 10, y: -1, width: 4, height: 0.5, type: 'asphalt' },
          { x: 20, y: 1, width: 6, height: 0.5, type: 'asphalt' },
          { x: 35, y: 0.5, width: 5, height: 0.5, type: 'asphalt' },
        ]
      };

      set({ level });
    },

    startGame: () => {
      const player: Player = {
        id: generateId(),
        position: { x: 0, y: -1.5 },
        velocity: { x: 0, y: 0 },
        health: 3,
        maxHealth: 3,
        currentWeapon: 'basic',
        facingRight: true,
        isJumping: false,
        onGround: false,
        shootCooldown: 0,
        color: '#ff4444',
        hasShield: false,
        shieldDuration: 0
      };

      set({
        player,
        enemies: [],
        bullets: [],
        powerUps: [],
        gameState: 'playing',
        score: 0,
        enemySpawnTimer: 0,
        powerUpSpawnTimer: 0
      });
    },

    restartGame: () => {
      get().startGame();
    },

    updatePlayer: (delta: number) => {
      const { player, level } = get();
      if (!player) return;

      // Apply gravity
      if (!player.onGround) {
        player.velocity.y -= GAME_CONSTANTS.GRAVITY * delta;
      }

      // Update position
      player.position.x += player.velocity.x * delta;
      player.position.y += player.velocity.y * delta;

      // Check ground collision
      player.onGround = false;
      for (const platform of level.platforms) {
        if (checkAABBCollision(
          { x: player.position.x - 0.3, y: player.position.y - 0.6, width: 0.6, height: 1.2 },
          { x: platform.x - platform.width/2, y: platform.y - platform.height/2, width: platform.width, height: platform.height }
        )) {
          if (player.velocity.y <= 0) {
            player.position.y = platform.y + platform.height/2 + 0.6;
            player.velocity.y = 0;
            player.onGround = true;
            player.isJumping = false;
          }
        }
      }

      // Apply friction
      player.velocity.x *= 0.85;

      // Update cooldowns
      if (player.shootCooldown > 0) {
        player.shootCooldown -= delta;
      }
      
      // Update shield duration
      if (player.hasShield && player.shieldDuration > 0) {
        player.shieldDuration -= delta;
        if (player.shieldDuration <= 0) {
          player.hasShield = false;
          player.shieldDuration = 0;
        }
      }

      set({ player: { ...player } });
    },

    updateEnemies: (delta: number) => {
      const { enemies, player, level } = get();
      
      const updatedEnemies = enemies.map(enemy => {
        // AI Logic based on enemy type
        switch (enemy.type) {
          case 'soldier':
            // Simple patrol AI
            if (enemy.aiState === 'patrol') {
              if (enemy.position.x <= enemy.patrolStart) {
                enemy.facingRight = true;
                enemy.velocity.x = GAME_CONSTANTS.ENEMY_SPEED;
              } else if (enemy.position.x >= enemy.patrolEnd) {
                enemy.facingRight = false;
                enemy.velocity.x = -GAME_CONSTANTS.ENEMY_SPEED;
              }

              // Check if player is nearby
              if (player && Math.abs(player.position.x - enemy.position.x) < 6) {
                enemy.aiState = 'attack';
                enemy.facingRight = player.position.x > enemy.position.x;
              }
            } else if (enemy.aiState === 'attack') {
              // Stop and shoot at player
              enemy.velocity.x = 0;
              
              if (player) {
                enemy.facingRight = player.position.x > enemy.position.x;
                
                // Shoot at player
                if (enemy.shootCooldown <= 0) {
                  const direction = {
                    x: enemy.facingRight ? 1 : -1,
                    y: 0
                  };
                  
                  get().shootBullet(
                    { x: enemy.position.x + (enemy.facingRight ? 0.3 : -0.3), y: enemy.position.y + 0.1 },
                    direction,
                    'basic',
                    enemy.id
                  );
                  
                  enemy.shootCooldown = 1.0;
                }

                // Return to patrol if player is far away
                if (Math.abs(player.position.x - enemy.position.x) > 8) {
                  enemy.aiState = 'patrol';
                }
              }
            }
            break;
            
          case 'flying':
            // Flying enemy - hovers and dives at player
            enemy.hoverOffset = (enemy.hoverOffset || 0) + delta * (enemy.hoverSpeed || 3);
            const baseY = 2;
            const targetY = baseY + Math.sin(enemy.hoverOffset) * 1.5;
            
            // Move horizontally toward player
            if (player) {
              const dx = player.position.x - enemy.position.x;
              if (Math.abs(dx) > 1) {
                enemy.velocity.x = dx > 0 ? 2 : -2;
                enemy.facingRight = dx > 0;
              } else {
                enemy.velocity.x = 0;
              }
              
              // Dive attack when close
              if (Math.abs(dx) < 3 && Math.abs(player.position.y - enemy.position.y) > 1) {
                enemy.velocity.y = -5;
              } else {
                // Return to hover height
                enemy.velocity.y = (targetY - enemy.position.y) * 3;
              }
              
              // Shoot at player
              if (enemy.shootCooldown <= 0 && Math.abs(dx) < 7) {
                const dy = player.position.y - enemy.position.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                get().shootBullet(
                  { x: enemy.position.x, y: enemy.position.y },
                  { x: dx / distance, y: dy / distance },
                  'basic',
                  enemy.id
                );
                enemy.shootCooldown = 1.5;
              }
            }
            break;
            
          case 'turret':
            // Stationary turret - shoots rapidly
            enemy.velocity.x = 0;
            
            if (player) {
              const dx = player.position.x - enemy.position.x;
              const dy = player.position.y - enemy.position.y;
              enemy.facingRight = dx > 0;
              
              // Shoot at player when in range
              if (enemy.shootCooldown <= 0 && Math.abs(dx) < 10) {
                const distance = Math.sqrt(dx * dx + dy * dy);
                get().shootBullet(
                  { x: enemy.position.x, y: enemy.position.y + 0.2 },
                  { x: dx / distance, y: dy / distance },
                  'basic',
                  enemy.id
                );
                enemy.shootCooldown = 0.5; // Fast shooting
              }
            }
            break;
            
          case 'runner':
            // Fast runner - charges at player
            if (player) {
              const dx = player.position.x - enemy.position.x;
              
              if (Math.abs(dx) < 8) {
                // Charge at player
                enemy.velocity.x = dx > 0 ? 4 : -4;
                enemy.facingRight = dx > 0;
                enemy.aiState = 'charge';
              } else if (enemy.aiState !== 'charge') {
                // Patrol
                if (enemy.position.x <= enemy.patrolStart) {
                  enemy.facingRight = true;
                  enemy.velocity.x = 3;
                } else if (enemy.position.x >= enemy.patrolEnd) {
                  enemy.facingRight = false;
                  enemy.velocity.x = -3;
                }
              }
            }
            break;
        }

        // Apply gravity (not for flying or turret enemies)
        if (enemy.type !== 'flying' && enemy.type !== 'turret') {
          enemy.velocity.y -= GAME_CONSTANTS.GRAVITY * delta;
        }

        // Update position
        enemy.position.x += enemy.velocity.x * delta;
        enemy.position.y += enemy.velocity.y * delta;

        // Ground collision (only for ground-based enemies)
        if (enemy.type !== 'flying' && enemy.type !== 'turret') {
          for (const platform of level.platforms) {
            if (checkAABBCollision(
              { x: enemy.position.x - 0.25, y: enemy.position.y - 0.4, width: 0.5, height: 0.8 },
              { x: platform.x - platform.width/2, y: platform.y - platform.height/2, width: platform.width, height: platform.height }
            )) {
              if (enemy.velocity.y <= 0) {
                enemy.position.y = platform.y + platform.height/2 + 0.4;
                enemy.velocity.y = 0;
              }
            }
          }
        }

        // Update cooldowns
        if (enemy.shootCooldown > 0) {
          enemy.shootCooldown -= delta;
        }

        return enemy;
      });

      set({ enemies: updatedEnemies });
    },

    updateBullets: (delta: number) => {
      const { bullets } = get();
      
      const updatedBullets = bullets
        .map(bullet => ({
          ...bullet,
          position: {
            x: bullet.position.x + bullet.velocity.x * delta,
            y: bullet.position.y + bullet.velocity.y * delta
          }
        }))
        .filter(bullet => 
          bullet.position.x > -50 && bullet.position.x < 100 &&
          bullet.position.y > -10 && bullet.position.y < 10
        );

      set({ bullets: updatedBullets });
    },

    updatePlayerInput: (input: any) => {
      const { player } = get();
      if (!player || get().gameState !== 'playing') return;

      // Movement
      if (input.left) {
        player.velocity.x = Math.max(player.velocity.x - GAME_CONSTANTS.PLAYER_ACCELERATION, -GAME_CONSTANTS.PLAYER_MAX_SPEED);
        player.facingRight = false;
      }
      if (input.right) {
        player.velocity.x = Math.min(player.velocity.x + GAME_CONSTANTS.PLAYER_ACCELERATION, GAME_CONSTANTS.PLAYER_MAX_SPEED);
        player.facingRight = true;
      }

      // Jumping
      if (input.jump && player.onGround && !player.isJumping) {
        player.velocity.y = GAME_CONSTANTS.JUMP_FORCE;
        player.isJumping = true;
        player.onGround = false;
      }

      // Shooting
      if (input.shoot && player.shootCooldown <= 0) {
        const weaponCooldown = player.currentWeapon === 'machine_gun' ? 0.1 : 
                              player.currentWeapon === 'spread_gun' ? 0.3 : 
                              player.currentWeapon === 'laser' ? 0.5 : 0.2;

        if (player.currentWeapon === 'spread_gun') {
          // Shoot 3 bullets in spread pattern
          for (let i = -1; i <= 1; i++) {
            get().shootBullet(
              { 
                x: player.position.x + (player.facingRight ? 0.4 : -0.4), 
                y: player.position.y + 0.1 
              },
              { 
                x: (player.facingRight ? 1 : -1) * Math.cos(i * 0.3), 
                y: Math.sin(i * 0.3) 
              },
              player.currentWeapon,
              player.id
            );
          }
        } else {
          get().shootBullet(
            { 
              x: player.position.x + (player.facingRight ? 0.4 : -0.4), 
              y: player.position.y + 0.1 
            },
            { x: player.facingRight ? 1 : -1, y: 0 },
            player.currentWeapon,
            player.id
          );
        }
        
        player.shootCooldown = weaponCooldown;
        
        // Play shoot sound
        useAudio.getState().playHit();
      }

      // Weapon switching
      if (input.weapon1) player.currentWeapon = 'basic';
      if (input.weapon2) player.currentWeapon = 'machine_gun';
      if (input.weapon3) player.currentWeapon = 'spread_gun';

      set({ player: { ...player } });
    },

    shootBullet: (position: Position, direction: Position, weapon: string, owner: string) => {
      const bulletSpeed = weapon === 'laser' ? 15 : 
                         weapon === 'machine_gun' ? 12 : 10;
      
      const bullet: Bullet = {
        id: generateId(),
        position: { ...position },
        velocity: {
          x: direction.x * bulletSpeed,
          y: direction.y * bulletSpeed
        },
        weapon,
        owner,
        damage: weapon === 'laser' ? 3 : 
               weapon === 'spread_gun' ? 2 : 1
      };

      set(state => ({ bullets: [...state.bullets, bullet] }));
    },

    checkCollisions: () => {
      const { player, enemies, bullets, powerUps } = get();
      if (!player) return;

      let updatedEnemies = [...enemies];
      let updatedBullets = [...bullets];
      let updatedPlayer = { ...player };
      let newScore = get().score;
      
      // Check power-up collection
      for (const powerUp of powerUps) {
        if (!powerUp.collected && checkAABBCollision(
          { x: updatedPlayer.position.x - 0.3, y: updatedPlayer.position.y - 0.6, width: 0.6, height: 1.2 },
          { x: powerUp.position.x - 0.25, y: powerUp.position.y - 0.25, width: 0.5, height: 0.5 }
        )) {
          get().collectPowerUp(powerUp.id);
        }
      }

      // Bullet vs Enemy collisions
      for (let i = updatedBullets.length - 1; i >= 0; i--) {
        const bullet = updatedBullets[i];
        
        if (bullet.owner === player.id) {
          // Player bullet hitting enemy
          for (let j = updatedEnemies.length - 1; j >= 0; j--) {
            const enemy = updatedEnemies[j];
            
            if (checkAABBCollision(
              { x: bullet.position.x - 0.1, y: bullet.position.y - 0.1, width: 0.2, height: 0.2 },
              { x: enemy.position.x - 0.25, y: enemy.position.y - 0.4, width: 0.5, height: 0.8 }
            )) {
              // Remove bullet and damage enemy
              updatedBullets.splice(i, 1);
              enemy.health -= bullet.damage;
              
              if (enemy.health <= 0) {
                updatedEnemies.splice(j, 1);
                newScore += 100;
                useAudio.getState().playSuccess();
              } else {
                useAudio.getState().playHit();
              }
              break;
            }
          }
        } else {
          // Enemy bullet hitting player
          if (checkAABBCollision(
            { x: bullet.position.x - 0.1, y: bullet.position.y - 0.1, width: 0.2, height: 0.2 },
            { x: updatedPlayer.position.x - 0.3, y: updatedPlayer.position.y - 0.6, width: 0.6, height: 1.2 }
          )) {
            // Remove bullet
            updatedBullets.splice(i, 1);
            
            // Only damage player if shield is not active
            if (!updatedPlayer.hasShield) {
              updatedPlayer.health -= bullet.damage;
              useAudio.getState().playHit();
              
              if (updatedPlayer.health <= 0) {
                set({ gameState: 'gameOver' });
                return;
              }
            } else {
              // Shield absorbed the hit
              useAudio.getState().playSuccess();
            }
          }
        }
      }

      set({ 
        player: updatedPlayer,
        enemies: updatedEnemies, 
        bullets: updatedBullets,
        score: newScore
      });
    },

    spawnEnemies: () => {
      const { enemySpawnTimer, player, enemies } = get();
      if (!player) return;

      const newTimer = enemySpawnTimer + 1/60; // Assuming 60 FPS
      
      if (newTimer > 2.5 && enemies.length < 6) { // Spawn every 2.5 seconds, max 6 enemies
        const spawnX = player.position.x + (Math.random() > 0.5 ? 12 : -12);
        
        // Randomly select enemy type
        const enemyTypes: ('soldier' | 'flying' | 'turret' | 'runner')[] = ['soldier', 'flying', 'turret', 'runner'];
        const randomType = enemyTypes[Math.floor(Math.random() * enemyTypes.length)];
        
        let enemy: Enemy;
        
        switch (randomType) {
          case 'flying':
            enemy = {
              id: generateId(),
              position: { x: spawnX, y: 2 },
              velocity: { x: 0, y: 0 },
              health: 1,
              type: 'flying',
              facingRight: true,
              aiState: 'hover',
              shootCooldown: 0,
              patrolStart: spawnX - 4,
              patrolEnd: spawnX + 4,
              hoverOffset: Math.random() * Math.PI * 2,
              hoverSpeed: 2 + Math.random()
            };
            break;
            
          case 'turret':
            enemy = {
              id: generateId(),
              position: { x: spawnX, y: -1.3 },
              velocity: { x: 0, y: 0 },
              health: 3,
              type: 'turret',
              facingRight: true,
              aiState: 'shoot',
              shootCooldown: 0,
              patrolStart: spawnX,
              patrolEnd: spawnX
            };
            break;
            
          case 'runner':
            enemy = {
              id: generateId(),
              position: { x: spawnX, y: -1.5 },
              velocity: { x: 0, y: 0 },
              health: 1,
              type: 'runner',
              facingRight: true,
              aiState: 'patrol',
              shootCooldown: 999, // Runners don't shoot
              patrolStart: spawnX - 5,
              patrolEnd: spawnX + 5
            };
            break;
            
          default: // soldier
            enemy = {
              id: generateId(),
              position: { x: spawnX, y: -1.5 },
              velocity: { x: 0, y: 0 },
              health: 2,
              type: 'soldier',
              facingRight: true,
              aiState: 'patrol',
              shootCooldown: 0,
              patrolStart: spawnX - 3,
              patrolEnd: spawnX + 3
            };
        }

        set(state => ({ 
          enemies: [...state.enemies, enemy],
          enemySpawnTimer: 0
        }));
      } else {
        set({ enemySpawnTimer: newTimer });
      }
    },

    changeWeapon: (weapon: string) => {
      const { player } = get();
      if (player) {
        set({ player: { ...player, currentWeapon: weapon } });
      }
    },
    
    updatePowerUps: (delta: number) => {
      // Power-ups don't move, just check if they should be removed
      const { powerUps } = get();
      const filteredPowerUps = powerUps.filter(p => !p.collected);
      if (filteredPowerUps.length !== powerUps.length) {
        set({ powerUps: filteredPowerUps });
      }
    },
    
    spawnPowerUp: () => {
      const { powerUpSpawnTimer, player, powerUps } = get();
      if (!player) return;

      const newTimer = powerUpSpawnTimer + 1/60;
      
      if (newTimer > 8.0 && powerUps.length < 3) { // Spawn every 8 seconds, max 3 power-ups
        const spawnX = player.position.x + (Math.random() * 16 - 8);
        const spawnY = -0.5;
        
        const powerUpTypes: PowerUp['type'][] = [
          'weapon_machine_gun',
          'weapon_spread_gun',
          'weapon_laser',
          'extra_life',
          'shield'
        ];
        const randomType = powerUpTypes[Math.floor(Math.random() * powerUpTypes.length)];
        
        const powerUp: PowerUp = {
          id: generateId(),
          position: { x: spawnX, y: spawnY },
          type: randomType,
          collected: false
        };

        set(state => ({ 
          powerUps: [...state.powerUps, powerUp],
          powerUpSpawnTimer: 0
        }));
      } else {
        set({ powerUpSpawnTimer: newTimer });
      }
    },
    
    collectPowerUp: (powerUpId: string) => {
      const { player, powerUps } = get();
      if (!player) return;

      const powerUp = powerUps.find(p => p.id === powerUpId);
      if (!powerUp || powerUp.collected) return;

      // Apply power-up effect
      switch (powerUp.type) {
        case 'weapon_machine_gun':
          player.currentWeapon = 'machine_gun';
          break;
        case 'weapon_spread_gun':
          player.currentWeapon = 'spread_gun';
          break;
        case 'weapon_laser':
          player.currentWeapon = 'laser';
          break;
        case 'extra_life':
          if (player.health < player.maxHealth) {
            player.health = Math.min(player.health + 1, player.maxHealth);
          }
          break;
        case 'shield':
          player.hasShield = true;
          player.shieldDuration = 10; // 10 seconds of shield
          break;
      }

      // Mark as collected
      powerUp.collected = true;
      useAudio.getState().playSuccess();

      set({ player: { ...player }, powerUps: [...powerUps] });
    }
  }))
);
