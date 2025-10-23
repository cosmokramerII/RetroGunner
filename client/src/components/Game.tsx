import { useFrame } from "@react-three/fiber";
import { useRef, useEffect } from "react";
import { OrthographicCamera } from "@react-three/drei";
import * as THREE from "three";
import Player from "./Player";
import Level from "./Level";
import Enemy from "./Enemy";
import Bullet from "./Bullet";
import PowerUp from "./PowerUp";
import Explosion from "./Explosion";
import Particle from "./Particle";
import { useGameStore } from "../lib/stores/useGameStore";

const Game = () => {
  const cameraRef = useRef<THREE.OrthographicCamera>(null);
  const {
    player,
    enemies,
    bullets,
    powerUps,
    explosions,
    particles,
    boss,
    bossActive,
    level,
    gameState,
    updatePlayer,
    updateEnemies,
    updateBullets,
    updatePowerUps,
    updateExplosions,
    updateParticles,
    updateComboTimer,
    checkCollisions,
    spawnEnemies,
    spawnPowerUp,
    initializeGame
  } = useGameStore();

  // Initialize game
  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  // Game loop
  useFrame((state, delta) => {
    if (gameState === 'playing') {
      // Update game systems
      updatePlayer(delta);
      updateEnemies(delta);
      updateBullets(delta);
      updatePowerUps(delta);
      updateExplosions(delta);
      updateParticles(delta);
      updateComboTimer(delta);
      checkCollisions();
      
      // Only spawn enemies if not fighting boss
      if (!bossActive) {
        spawnEnemies();
      }
      spawnPowerUp();

      // Update camera to follow player
      if (cameraRef.current && player) {
        const targetX = player.position.x + 2; // Look ahead slightly
        cameraRef.current.position.x = THREE.MathUtils.lerp(
          cameraRef.current.position.x,
          targetX,
          delta * 2
        );
      }
    }
  });

  return (
    <>
      {/* Orthographic camera for 2D look */}
      <OrthographicCamera
        ref={cameraRef}
        makeDefault
        zoom={50}
        position={[0, 0, 10]}
        near={0.1}
        far={1000}
      />

      {/* Ambient lighting */}
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 10, 5]} intensity={0.8} />

      {/* Level */}
      <Level levelData={level} />

      {/* Player */}
      {player && <Player playerData={player} />}

      {/* Enemies */}
      {enemies.map(enemy => (
        <Enemy key={enemy.id} enemyData={enemy} />
      ))}
      
      {/* Boss */}
      {boss && bossActive && (
        <Enemy key={boss.id} enemyData={boss} />
      )}

      {/* Bullets */}
      {bullets.map(bullet => (
        <Bullet key={bullet.id} bulletData={bullet} />
      ))}

      {/* Power-ups */}
      {powerUps.map(powerUp => (
        <PowerUp key={powerUp.id} powerUpData={powerUp} />
      ))}
      
      {/* Explosions */}
      {explosions.map(explosion => (
        <Explosion key={explosion.id} explosionData={explosion} />
      ))}
      
      {/* Particles */}
      {particles.map(particle => (
        <Particle key={particle.id} particleData={particle} />
      ))}
    </>
  );
};

export default Game;