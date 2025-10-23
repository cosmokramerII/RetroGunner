import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface BulletProps {
  bulletData: any;
}

const Bullet = ({ bulletData }: BulletProps) => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.position.set(
        bulletData.position.x,
        bulletData.position.y,
        0.1
      );
    }
  });

  const getBulletColor = () => {
    switch (bulletData.weapon) {
      case 'machine_gun': return '#ffff44';
      case 'spread_gun': return '#ff8844';
      case 'laser': return '#ff44ff';
      default: return '#ffffff';
    }
  };

  const getGlowColor = () => {
    switch (bulletData.weapon) {
      case 'machine_gun': return '#ffff88';
      case 'spread_gun': return '#ffaa66';
      case 'laser': return '#ff88ff';
      default: return '#ffcccc';
    }
  };

  const getBulletSize = () => {
    switch (bulletData.weapon) {
      case 'laser': return [0.4, 0.08];
      case 'spread_gun': return [0.18, 0.18];
      default: return [0.15, 0.12];
    }
  };

  const [width, height] = getBulletSize();

  return (
    <group ref={groupRef}>
      {/* Glow effect */}
      <mesh position={[0, 0, -0.02]}>
        <planeGeometry args={[width * 1.5, height * 1.5]} />
        <meshBasicMaterial 
          color={getGlowColor()} 
          transparent={true}
          opacity={0.4}
        />
      </mesh>
      
      {/* Main bullet */}
      <mesh position={[0, 0, 0]}>
        <planeGeometry args={[width, height]} />
        <meshBasicMaterial 
          color={getBulletColor()} 
          transparent={true}
          opacity={1.0}
        />
      </mesh>
      
      {/* Bullet core/highlight */}
      <mesh position={[0, 0, 0.01]}>
        <planeGeometry args={[width * 0.5, height * 0.5]} />
        <meshBasicMaterial 
          color="#ffffff" 
          transparent={true}
          opacity={0.8}
        />
      </mesh>
    </group>
  );
};

export default Bullet;
