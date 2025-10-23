import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface EnemyProps {
  enemyData: any;
}

const Enemy = ({ enemyData }: EnemyProps) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.position.set(
        enemyData.position.x,
        enemyData.position.y,
        0
      );
      
      // Flip sprite based on direction
      meshRef.current.scale.x = enemyData.facingRight ? 1 : -1;
    }
  });

  // Render different sprites based on enemy type
  if (enemyData.type === 'flying') {
    return (
      <group ref={meshRef}>
        {/* Flying drone body */}
        <mesh position={[0, 0, 0.01]}>
          <planeGeometry args={[0.6, 0.4]} />
          <meshBasicMaterial color="#6a4a9a" />
        </mesh>
        
        {/* Wings */}
        <mesh position={[-0.35, 0, 0.02]}>
          <planeGeometry args={[0.25, 0.15]} />
          <meshBasicMaterial color="#8a6aaa" />
        </mesh>
        <mesh position={[0.35, 0, 0.02]}>
          <planeGeometry args={[0.25, 0.15]} />
          <meshBasicMaterial color="#8a6aaa" />
        </mesh>
        
        {/* Core/eye */}
        <mesh position={[0, 0, 0.03]}>
          <planeGeometry args={[0.2, 0.2]} />
          <meshBasicMaterial color="#ff4444" />
        </mesh>
        
        {/* Propellers */}
        <mesh position={[-0.35, 0.15, 0.03]}>
          <planeGeometry args={[0.15, 0.05]} />
          <meshBasicMaterial color="#aaaaaa" />
        </mesh>
        <mesh position={[0.35, 0.15, 0.03]}>
          <planeGeometry args={[0.15, 0.05]} />
          <meshBasicMaterial color="#aaaaaa" />
        </mesh>
      </group>
    );
  }
  
  if (enemyData.type === 'turret') {
    return (
      <group ref={meshRef}>
        {/* Base */}
        <mesh position={[0, -0.15, 0.01]}>
          <planeGeometry args={[0.7, 0.3]} />
          <meshBasicMaterial color="#4a4a6a" />
        </mesh>
        
        {/* Body */}
        <mesh position={[0, 0.05, 0.02]}>
          <planeGeometry args={[0.5, 0.4]} />
          <meshBasicMaterial color="#5a5a7a" />
        </mesh>
        
        {/* Barrel */}
        <mesh position={[enemyData.facingRight ? 0.35 : -0.35, 0.15, 0.03]}>
          <planeGeometry args={[0.35, 0.12]} />
          <meshBasicMaterial color="#3a3a5a" />
        </mesh>
        
        {/* Barrel tip */}
        <mesh position={[enemyData.facingRight ? 0.5 : -0.5, 0.15, 0.04]}>
          <planeGeometry args={[0.1, 0.1]} />
          <meshBasicMaterial color="#2a2a4a" />
        </mesh>
        
        {/* Core light */}
        <mesh position={[0, 0.05, 0.04]}>
          <planeGeometry args={[0.15, 0.15]} />
          <meshBasicMaterial color="#ff6666" />
        </mesh>
      </group>
    );
  }
  
  if (enemyData.type === 'runner') {
    return (
      <group ref={meshRef}>
        {/* Body - sleek runner */}
        <mesh position={[0, 0, 0.01]}>
          <planeGeometry args={[0.5, 0.6]} />
          <meshBasicMaterial color="#ff6a4a" />
        </mesh>
        
        {/* Body highlight */}
        <mesh position={[-0.05, -0.05, 0.02]}>
          <planeGeometry args={[0.4, 0.5]} />
          <meshBasicMaterial color="#dd4a2a" />
        </mesh>
        
        {/* Head/visor */}
        <mesh position={[0, 0.35, 0.01]}>
          <planeGeometry args={[0.35, 0.3]} />
          <meshBasicMaterial color="#aa3a1a" />
        </mesh>
        
        {/* Visor glow */}
        <mesh position={[0, 0.35, 0.02]}>
          <planeGeometry args={[0.25, 0.15]} />
          <meshBasicMaterial color="#ffff44" />
        </mesh>
        
        {/* Legs - running pose */}
        <mesh position={[-0.1, -0.4, 0.01]}>
          <planeGeometry args={[0.18, 0.35]} />
          <meshBasicMaterial color="#dd4a2a" />
        </mesh>
        <mesh position={[0.1, -0.5, 0.01]}>
          <planeGeometry args={[0.18, 0.45]} />
          <meshBasicMaterial color="#dd4a2a" />
        </mesh>
        
        {/* Speed lines */}
        <mesh position={[enemyData.facingRight ? -0.3 : 0.3, 0, 0.00]}>
          <planeGeometry args={[0.2, 0.05]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.6} />
        </mesh>
      </group>
    );
  }

  // Default soldier type
  const enemyColor = '#4a6fa5';
  const enemyShade = '#2a4a75';

  return (
    <group ref={meshRef}>
      {/* Body */}
      <mesh position={[0, 0, 0.01]}>
        <planeGeometry args={[0.55, 0.7]} />
        <meshBasicMaterial color={enemyColor} />
      </mesh>
      
      {/* Body shadow */}
      <mesh position={[-0.05, -0.08, 0.02]}>
        <planeGeometry args={[0.45, 0.55]} />
        <meshBasicMaterial color={enemyShade} />
      </mesh>
      
      {/* Head */}
      <mesh position={[0, 0.42, 0.01]}>
        <planeGeometry args={[0.4, 0.4]} />
        <meshBasicMaterial color="#ffb380" />
      </mesh>
      
      {/* Helmet */}
      <mesh position={[0, 0.52, 0.02]}>
        <planeGeometry args={[0.42, 0.22]} />
        <meshBasicMaterial color="#3a3a3a" />
      </mesh>
      
      {/* Visor/eyes */}
      <mesh position={[0, 0.42, 0.03]}>
        <planeGeometry args={[0.3, 0.1]} />
        <meshBasicMaterial color="#1a1a1a" />
      </mesh>
      
      {/* Gun */}
      <mesh position={[enemyData.facingRight ? 0.3 : -0.3, 0.08, 0.03]}>
        <planeGeometry args={[0.35, 0.1]} />
        <meshBasicMaterial color="#555555" />
      </mesh>
      
      {/* Gun barrel */}
      <mesh position={[enemyData.facingRight ? 0.45 : -0.45, 0.08, 0.04]}>
        <planeGeometry args={[0.15, 0.07]} />
        <meshBasicMaterial color="#2a2a2a" />
      </mesh>
      
      {/* Legs */}
      <mesh position={[-0.1, -0.45, 0.01]}>
        <planeGeometry args={[0.2, 0.42]} />
        <meshBasicMaterial color="#2a4a2a" />
      </mesh>
      <mesh position={[0.1, -0.45, 0.01]}>
        <planeGeometry args={[0.2, 0.42]} />
        <meshBasicMaterial color="#2a4a2a" />
      </mesh>
      
      {/* Boots */}
      <mesh position={[-0.1, -0.62, 0.02]}>
        <planeGeometry args={[0.22, 0.12]} />
        <meshBasicMaterial color="#1a1a1a" />
      </mesh>
      <mesh position={[0.1, -0.62, 0.02]}>
        <planeGeometry args={[0.22, 0.12]} />
        <meshBasicMaterial color="#1a1a1a" />
      </mesh>
      
      {/* Belt */}
      <mesh position={[0, -0.1, 0.03]}>
        <planeGeometry args={[0.5, 0.08]} />
        <meshBasicMaterial color="#8b6914" />
      </mesh>
      
      {/* Arm holding gun */}
      <mesh position={[enemyData.facingRight ? 0.22 : -0.22, 0.05, 0.00]}>
        <planeGeometry args={[0.15, 0.4]} />
        <meshBasicMaterial color="#ffb380" />
      </mesh>
    </group>
  );
};

export default Enemy;
