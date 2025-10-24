import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useGameStore } from "../lib/stores/useGameStore";

const Player = () => {
  const meshRef = useRef<THREE.Group>(null);
  const { player } = useGameStore();
  
  // Animation state
  const animFrame = useRef(0);
  const animTimer = useRef(0);
  
  // Safety check - don't render if player doesn't exist
  if (!player) return null;
  
  useFrame((state, delta) => {
    if (meshRef.current && player) {
      meshRef.current.position.set(
        player.position.x,
        player.position.y,
        0
      );
      
      // Run animation
      if (Math.abs(player.velocity.x) > 0.1) {
        animTimer.current += delta;
        if (animTimer.current > 0.08) {
          animTimer.current = 0;
          animFrame.current = (animFrame.current + 1) % 6;
        }
      } else {
        animFrame.current = 0;
      }
    }
  });

  const isRunning = Math.abs(player.velocity.x) > 0.1;
  const legOffset = isRunning ? Math.sin(animFrame.current * 0.8) * 0.1 : 0;
  const armSwing = isRunning ? Math.sin(animFrame.current * 0.8) * 0.05 : 0;

  return (
    <group ref={meshRef}>
      {/* Modern detailed sprite */}
      <group scale={[player.facingRight ? 1.2 : -1.2, 1.2, 1]}>
        
        {/* Shadow */}
        <mesh position={[0, -0.55, -0.01]}>
          <planeGeometry args={[0.6, 0.1]} />
          <meshBasicMaterial color="#000000" transparent opacity={0.3} />
        </mesh>
        
        {/* Body */}
        <group>
          {/* Torso - military vest */}
          <mesh position={[0, 0.1, 0]}>
            <planeGeometry args={[0.35, 0.4]} />
            <meshBasicMaterial color="#3a4a3a" />
          </mesh>
          
          {/* Vest details */}
          <mesh position={[0, 0.15, 0.01]}>
            <planeGeometry args={[0.32, 0.25]} />
            <meshBasicMaterial color="#2a3a2a" />
          </mesh>
          
          {/* Belt and pouches */}
          <mesh position={[0, -0.05, 0.01]}>
            <planeGeometry args={[0.35, 0.08]} />
            <meshBasicMaterial color="#4a3a2a" />
          </mesh>
          
          {/* Head */}
          <mesh position={[0, 0.38, 0]}>
            <planeGeometry args={[0.2, 0.22]} />
            <meshBasicMaterial color="#d4a373" />
          </mesh>
          
          {/* Hair */}
          <mesh position={[0, 0.46, 0.01]}>
            <planeGeometry args={[0.22, 0.12]} />
            <meshBasicMaterial color="#2a2a2a" />
          </mesh>
          
          {/* Bandana */}
          <mesh position={[0, 0.43, 0.02]}>
            <planeGeometry args={[0.25, 0.06]} />
            <meshBasicMaterial color="#cc2222" />
          </mesh>
          
          {/* Arms */}
          {/* Gun arm */}
          <group rotation={[0, 0, player.shootCooldown > 0 ? -0.05 : 0]}>
            <mesh position={[0.22, 0.1 + armSwing * 0.5, 0]}>
              <planeGeometry args={[0.4, 0.12]} />
              <meshBasicMaterial color="#d4a373" />
            </mesh>
            
            {/* Weapon */}
            <group position={[0.45, 0.1, 0.01]}>
              {/* Assault rifle body */}
              <mesh position={[0, 0, 0]}>
                <planeGeometry args={[0.35, 0.1]} />
                <meshBasicMaterial color="#1a1a1a" />
              </mesh>
              
              {/* Barrel */}
              <mesh position={[0.2, 0, 0.01]}>
                <planeGeometry args={[0.2, 0.06]} />
                <meshBasicMaterial color="#2a2a2a" />
              </mesh>
              
              {/* Magazine */}
              <mesh position={[-0.05, -0.05, 0]}>
                <planeGeometry args={[0.04, 0.08]} />
                <meshBasicMaterial color="#1a1a1a" />
              </mesh>
              
              {/* Muzzle flash */}
              {player.shootCooldown > 0.1 && (
                <>
                  <mesh position={[0.35, 0, 0.02]}>
                    <planeGeometry args={[0.25, 0.25]} />
                    <meshBasicMaterial color="#ffff88" transparent opacity={0.9} />
                  </mesh>
                  <mesh position={[0.4, 0, 0.025]}>
                    <planeGeometry args={[0.15, 0.15]} />
                    <meshBasicMaterial color="#ffffff" transparent opacity={0.8} />
                  </mesh>
                </>
              )}
            </group>
          </group>
          
          {/* Support arm */}
          <mesh position={[-0.15, 0.05 - armSwing * 0.5, 0]}>
            <planeGeometry args={[0.12, 0.35]} />
            <meshBasicMaterial color="#d4a373" />
          </mesh>
          
          {/* Legs */}
          {/* Right leg */}
          <group>
            <mesh position={[0.08, -0.25 - Math.abs(legOffset), 0]}>
              <planeGeometry args={[0.14, 0.3]} />
              <meshBasicMaterial color="#4a5a4a" />
            </mesh>
            {/* Boot */}
            <mesh position={[0.08, -0.45 - Math.abs(legOffset), 0.01]}>
              <planeGeometry args={[0.15, 0.12]} />
              <meshBasicMaterial color="#2a2a2a" />
            </mesh>
          </group>
          
          {/* Left leg */}
          <group>
            <mesh position={[-0.08, -0.25 + Math.abs(legOffset), 0]}>
              <planeGeometry args={[0.14, 0.3]} />
              <meshBasicMaterial color="#4a5a4a" />
            </mesh>
            {/* Boot */}
            <mesh position={[-0.08, -0.45 + Math.abs(legOffset), 0.01]}>
              <planeGeometry args={[0.15, 0.12]} />
              <meshBasicMaterial color="#2a2a2a" />
            </mesh>
          </group>
        </group>
      </group>
      
      {/* Power-up indicator */}
      {player.currentWeapon !== 'basic' && (
        <group position={[0, 0.9, 0.1]}>
          {/* Weapon icon background */}
          <mesh position={[0, 0, 0]}>
            <planeGeometry args={[0.4, 0.15]} />
            <meshBasicMaterial color="#000000" transparent opacity={0.7} />
          </mesh>
          
          {/* Weapon text */}
          <mesh position={[0, 0, 0.01]}>
            <planeGeometry args={[0.35, 0.1]} />
            <meshBasicMaterial 
              color={
                player.currentWeapon === 'machine_gun' ? '#ffff00' :
                player.currentWeapon === 'spread_gun' ? '#ff4400' :
                '#ff00ff'
              }
            />
          </mesh>
        </group>
      )}
      
      {/* Shield effect */}
      {player.hasShield && (
        <>
          {/* Energy shield bubble */}
          <mesh position={[0, 0, 0.05]}>
            <circleGeometry args={[1.0, 32]} />
            <meshBasicMaterial 
              color="#00aaff"
              transparent
              opacity={0.2}
              side={THREE.DoubleSide}
            />
          </mesh>
          
          {/* Shield hexagon pattern */}
          {Array.from({ length: 8 }).map((_, i) => {
            const angle = (i / 8) * Math.PI * 2;
            const radius = 0.9;
            return (
              <mesh 
                key={i} 
                position={[
                  Math.cos(angle) * radius, 
                  Math.sin(angle) * radius, 
                  0.06
                ]}
                rotation={[0, 0, angle]}
              >
                <planeGeometry args={[0.2, 0.05]} />
                <meshBasicMaterial 
                  color="#44ccff"
                  transparent
                  opacity={0.4}
                />
              </mesh>
            );
          })}
        </>
      )}
    </group>
  );
};

export default Player;