import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { useKeyboardControls } from "@react-three/drei";
import * as THREE from "three";
import { useGameStore } from "../lib/stores/useGameStore";
import { GAME_CONSTANTS } from "../lib/gameConstants";

interface PlayerProps {
  playerData: any;
}

const Player = ({ playerData }: PlayerProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const { shootBullet, updatePlayerInput } = useGameStore();
  
  const [subscribeKeys, getKeys] = useKeyboardControls();

  // Handle keyboard input
  useFrame(() => {
    const keys = getKeys();
    
    const input = {
      left: keys.left,
      right: keys.right,
      up: keys.up,
      down: keys.down,
      jump: keys.jump,
      shoot: keys.shoot,
      weapon1: keys.weapon1,
      weapon2: keys.weapon2,
      weapon3: keys.weapon3
    };

    updatePlayerInput(input);

    // Update mesh position
    if (meshRef.current) {
      meshRef.current.position.set(
        playerData.position.x,
        playerData.position.y,
        0
      );
      
      // Flip sprite based on direction
      meshRef.current.scale.x = playerData.facingRight ? 1 : -1;
    }
  });

  // SNES-style detailed player sprite
  return (
    <group ref={meshRef}>
      {/* Body - main torso with detailed shading */}
      <mesh position={[0, 0, 0.01]}>
        <planeGeometry args={[0.6, 0.8]} />
        <meshBasicMaterial color="#d94040" />
      </mesh>
      
      {/* Body shadow/detail */}
      <mesh position={[-0.05, -0.1, 0.02]}>
        <planeGeometry args={[0.5, 0.6]} />
        <meshBasicMaterial color="#a02828" />
      </mesh>
      
      {/* Chest detail - bandolier */}
      <mesh position={[0.1, 0.2, 0.03]}>
        <planeGeometry args={[0.5, 0.15]} />
        <meshBasicMaterial color="#8b6914" />
      </mesh>
      
      {/* Head */}
      <mesh position={[0, 0.5, 0.01]}>
        <planeGeometry args={[0.45, 0.45]} />
        <meshBasicMaterial color="#ffb380" />
      </mesh>
      
      {/* Headband - Rambo style */}
      <mesh position={[0, 0.65, 0.02]}>
        <planeGeometry args={[0.5, 0.12]} />
        <meshBasicMaterial color="#2a52be" />
      </mesh>
      
      {/* Eyes */}
      <mesh position={[playerData.facingRight ? 0.1 : -0.1, 0.52, 0.03]}>
        <planeGeometry args={[0.08, 0.08]} />
        <meshBasicMaterial color="#2a1810" />
      </mesh>
      
      {/* Gun - detailed weapon */}
      <mesh position={[playerData.facingRight ? 0.35 : -0.35, 0.15, 0.03]}>
        <planeGeometry args={[0.45, 0.12]} />
        <meshBasicMaterial color="#4a4a4a" />
      </mesh>
      
      {/* Gun barrel */}
      <mesh position={[playerData.facingRight ? 0.55 : -0.55, 0.15, 0.04]}>
        <planeGeometry args={[0.2, 0.08]} />
        <meshBasicMaterial color="#2a2a2a" />
      </mesh>
      
      {/* Legs */}
      <mesh position={[-0.12, -0.5, 0.01]}>
        <planeGeometry args={[0.22, 0.5]} />
        <meshBasicMaterial color="#3a5a8a" />
      </mesh>
      <mesh position={[0.12, -0.5, 0.01]}>
        <planeGeometry args={[0.22, 0.5]} />
        <meshBasicMaterial color="#3a5a8a" />
      </mesh>
      
      {/* Boots */}
      <mesh position={[-0.12, -0.7, 0.02]}>
        <planeGeometry args={[0.25, 0.15]} />
        <meshBasicMaterial color="#1a1a1a" />
      </mesh>
      <mesh position={[0.12, -0.7, 0.02]}>
        <planeGeometry args={[0.25, 0.15]} />
        <meshBasicMaterial color="#1a1a1a" />
      </mesh>
      
      {/* Arms */}
      <mesh position={[playerData.facingRight ? 0.25 : -0.25, 0.1, 0.00]}>
        <planeGeometry args={[0.18, 0.5]} />
        <meshBasicMaterial color="#ffb380" />
      </mesh>
      
      {/* Weapon highlight based on current weapon */}
      {playerData.currentWeapon !== 'basic' && (
        <mesh position={[playerData.facingRight ? 0.5 : -0.5, 0.15, 0.05]}>
          <planeGeometry args={[0.15, 0.15]} />
          <meshBasicMaterial 
            color={
              playerData.currentWeapon === 'machine_gun' ? '#ffff00' :
              playerData.currentWeapon === 'spread_gun' ? '#ff6600' :
              '#ff00ff'
            }
            transparent
            opacity={0.6}
          />
        </mesh>
      )}
      
      {/* Shield effect when active */}
      {playerData.hasShield && (
        <>
          {/* Shield outer glow */}
          <mesh position={[0, 0, 0.06]}>
            <planeGeometry args={[1.6, 1.8]} />
            <meshBasicMaterial 
              color="#4488ff"
              transparent
              opacity={0.15}
            />
          </mesh>
          
          {/* Shield hexagon pattern */}
          <mesh position={[0, 0, 0.07]}>
            <planeGeometry args={[1.4, 1.6]} />
            <meshBasicMaterial 
              color="#88bbff"
              transparent
              opacity={0.25}
            />
          </mesh>
          
          {/* Shield inner core */}
          <mesh position={[0, 0, 0.08]}>
            <planeGeometry args={[1.2, 1.4]} />
            <meshBasicMaterial 
              color="#aaddff"
              transparent
              opacity={0.2}
            />
          </mesh>
        </>
      )}
    </group>
  );
};

export default Player;
