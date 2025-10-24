import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface PowerUpProps {
  powerUpData: any;
}

const PowerUp = ({ powerUpData }: PowerUpProps) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current && !powerUpData.collected) {
      meshRef.current.position.set(
        powerUpData.position.x,
        powerUpData.position.y + Math.sin(state.clock.elapsedTime * 2) * 0.1,
        0.2
      );
      
      // Rotate power-up for effect
      meshRef.current.rotation.z = state.clock.elapsedTime;
    }
  });

  if (powerUpData.collected) return null;

  const getPowerUpColor = () => {
    switch (powerUpData.type) {
      case 'weapon_machine_gun': return '#ffff44';
      case 'weapon_spread_gun': return '#ff8844';
      case 'weapon_laser': return '#ff44ff';
      case 'extra_life': return '#44ff44';
      case 'shield': return '#4444ff';
      default: return '#ffffff';
    }
  };

  const getPowerUpIcon = () => {
    switch (powerUpData.type) {
      case 'weapon_machine_gun':
      case 'weapon_spread_gun':
      case 'weapon_laser':
        return 'weapon'; // Gun icon
      case 'extra_life':
        return 'heart';
      case 'shield':
        return 'shield';
      default:
        return 'default';
    }
  };

  const icon = getPowerUpIcon();

  return (
    <group ref={meshRef}>
      {/* Background glow */}
      <mesh position={[0, 0, -0.01]}>
        <planeGeometry args={[0.7, 0.7]} />
        <meshBasicMaterial 
          color={getPowerUpColor()} 
          transparent 
          opacity={0.3}
        />
      </mesh>

      {/* Main power-up box */}
      <mesh position={[0, 0, 0]}>
        <planeGeometry args={[0.5, 0.5]} />
        <meshBasicMaterial color={getPowerUpColor()} />
      </mesh>

      {/* Icon based on type */}
      {icon === 'weapon' && (
        <>
          <mesh position={[0, 0, 0.01]}>
            <planeGeometry args={[0.35, 0.08]} />
            <meshBasicMaterial color="#1a1a1a" />
          </mesh>
          <mesh position={[0.15, 0, 0.02]}>
            <planeGeometry args={[0.1, 0.06]} />
            <meshBasicMaterial color="#1a1a1a" />
          </mesh>
        </>
      )}

      {icon === 'heart' && (
        <>
          <mesh position={[-0.08, 0.05, 0.01]}>
            <planeGeometry args={[0.12, 0.12]} />
            <meshBasicMaterial color="#ff0000" />
          </mesh>
          <mesh position={[0.08, 0.05, 0.01]}>
            <planeGeometry args={[0.12, 0.12]} />
            <meshBasicMaterial color="#ff0000" />
          </mesh>
          <mesh position={[0, -0.05, 0.01]}>
            <planeGeometry args={[0.25, 0.2]} />
            <meshBasicMaterial color="#ff0000" />
          </mesh>
        </>
      )}

      {icon === 'shield' && (
        <>
          <mesh position={[0, 0, 0.01]}>
            <planeGeometry args={[0.3, 0.35]} />
            <meshBasicMaterial color="#1a1aff" />
          </mesh>
          <mesh position={[0, 0, 0.02]}>
            <planeGeometry args={[0.15, 0.25]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
        </>
      )}

      {/* Border */}
      <mesh position={[0, 0, 0.03]}>
        <planeGeometry args={[0.52, 0.52]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0} />
      </mesh>
    </group>
  );
};

export default PowerUp;
