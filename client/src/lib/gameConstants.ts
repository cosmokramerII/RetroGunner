export const GAME_CONSTANTS = {
  // Player constants
  PLAYER_MAX_SPEED: 5,
  PLAYER_ACCELERATION: 20,
  JUMP_FORCE: 8,
  
  // Physics
  GRAVITY: 25,
  
  // Enemy constants
  ENEMY_SPEED: 2,
  ENEMY_HEALTH: 2,
  
  // Bullet constants
  BULLET_SPEED: 10,
  BULLET_DAMAGE: 1,
  
  // Game constants
  MAX_ENEMIES: 5,
  ENEMY_SPAWN_INTERVAL: 3000, // milliseconds
  
  // Collision constants
  PLAYER_WIDTH: 0.6,
  PLAYER_HEIGHT: 1.2,
  ENEMY_WIDTH: 0.5,
  ENEMY_HEIGHT: 0.8,
  BULLET_SIZE: 0.1,
  
  // Weapons
  WEAPONS: {
    basic: {
      damage: 1,
      cooldown: 0.2,
      speed: 10,
      spread: 0
    },
    machine_gun: {
      damage: 1,
      cooldown: 0.1,
      speed: 12,
      spread: 0
    },
    spread_gun: {
      damage: 2,
      cooldown: 0.3,
      speed: 10,
      spread: 3
    },
    laser: {
      damage: 3,
      cooldown: 0.5,
      speed: 15,
      spread: 0
    }
  }
};
