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

  // SNES-style detailed enemy sprite
  const enemyColor = enemyData.type === 'soldier' ? '#4a6fa5' : '#5a9a5a';
  const enemyShade = enemyData.type === 'soldier' ? '#2a4a75' : '#3a6a3a';

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
