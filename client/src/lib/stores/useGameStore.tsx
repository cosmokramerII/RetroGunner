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
}

interface Enemy {
  id: string;
  position: Position;
  velocity: Position;
  health: number;
  type: string;
  facingRight: boolean;
  aiState: string;
  shootCooldown: number;
  patrolStart: number;
  patrolEnd: number;
}

interface Bullet {
  id: string;
  position: Position;
  velocity: Position;
  weapon: string;
  owner: string;
  damage: number;
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
  level: Level;
  gameState: 'menu' | 'playing' | 'gameOver';
  score: number;
  enemySpawnTimer: number;
  
  // Actions
  initializeGame: () => void;
  startGame: () => void;
  restartGame: () => void;
  updatePlayer: (delta: number) => void;
  updateEnemies: (delta: number) => void;
  updateBullets: (delta: number) => void;
  updatePlayerInput: (input: any) => void;
  shootBullet: (position: Position, direction: Position, weapon: string, owner: string) => void;
  checkCollisions: () => void;
  spawnEnemies: () => void;
  changeWeapon: (weapon: string) => void;
}

let nextId = 1;
const generateId = () => `entity_${nextId++}`;

export const useGameStore = create<GameState>()(
  subscribeWithSelector((set, get) => ({
    player: null,
    enemies: [],
    bullets: [],
    level: { platforms: [] },
    gameState: 'menu',
    score: 0,
    enemySpawnTimer: 0,

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
        color: '#ff4444'
      };

      set({
        player,
        enemies: [],
        bullets: [],
        gameState: 'playing',
        score: 0,
        enemySpawnTimer: 0
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

      set({ player: { ...player } });
    },

    updateEnemies: (delta: number) => {
      const { enemies, player, level } = get();
      
      const updatedEnemies = enemies.map(enemy => {
        // AI Logic
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
                  
                  enemy.shootCooldown = 1.0; // 1 second cooldown
                }

                // Return to patrol if player is far away
                if (Math.abs(player.position.x - enemy.position.x) > 8) {
                  enemy.aiState = 'patrol';
                }
              }
            }
            break;
        }

        // Apply gravity
        enemy.velocity.y -= GAME_CONSTANTS.GRAVITY * delta;

        // Update position
        enemy.position.x += enemy.velocity.x * delta;
        enemy.position.y += enemy.velocity.y * delta;

        // Ground collision
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
        const audio = useAudio.getState();
        // We'll trigger sound in the UI layer
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
      const { player, enemies, bullets } = get();
      if (!player) return;

      let updatedEnemies = [...enemies];
      let updatedBullets = [...bullets];
      let updatedPlayer = { ...player };
      let newScore = get().score;

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
                // Play success sound
              } else {
                // Play hit sound
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
            // Remove bullet and damage player
            updatedBullets.splice(i, 1);
            updatedPlayer.health -= bullet.damage;
            
            if (updatedPlayer.health <= 0) {
              set({ gameState: 'gameOver' });
              return;
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
      
      if (newTimer > 3.0 && enemies.length < 5) { // Spawn every 3 seconds, max 5 enemies
        const spawnX = player.position.x + (Math.random() > 0.5 ? 10 : -10);
        
        const enemy: Enemy = {
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
    }
  }))
);
