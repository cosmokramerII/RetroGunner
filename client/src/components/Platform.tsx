import { useRef, useMemo } from "react";
import * as THREE from "three";

interface PlatformProps {
  position: [number, number, number];
  size: [number, number];
}

const Platform = ({ position, size }: PlatformProps) => {
  const meshRef = useRef<THREE.Group>(null);
  const [width, height] = size;
  
  // Metal platform colors
  const metalGray = "#4a5a5a";
  const metalDark = "#3a4a4a";
  const metalLight = "#6a7a7a";
  const rivetColor = "#2a3a3a";
  const grassGreen = "#3a7a2a";
  const grassDark = "#2a5a1a";
  
  // Generate static positions for grass
  const grassPositions = useMemo(() => {
    const positions = [];
    const grassCount = Math.floor(width * 2);
    for (let i = 0; i < grassCount; i++) {
      positions.push({
        x: (Math.random() - 0.5) * width * 0.9,
        height: 0.08 + Math.random() * 0.12,
        width: 0.04 + Math.random() * 0.04,
        color: Math.random() > 0.5 ? grassGreen : grassDark
      });
    }
    return positions;
  }, [width]);
  
  return (
    <group ref={meshRef} position={position}>
      {/* Main metal platform */}
      <mesh position={[0, 0, 0]}>
        <planeGeometry args={[width, height]} />
        <meshBasicMaterial color={metalGray} />
      </mesh>
      
      {/* Metal plate texture - top strip */}
      <mesh position={[0, height * 0.4, 0.01]}>
        <planeGeometry args={[width * 0.95, height * 0.15]} />
        <meshBasicMaterial color={metalLight} />
      </mesh>
      
      {/* Metal plate texture - middle strip */}
      <mesh position={[0, 0, 0.01]}>
        <planeGeometry args={[width * 0.95, height * 0.2]} />
        <meshBasicMaterial color={metalDark} />
      </mesh>
      
      {/* Metal plate texture - bottom strip */}
      <mesh position={[0, -height * 0.35, 0.01]}>
        <planeGeometry args={[width * 0.95, height * 0.2]} />
        <meshBasicMaterial color={metalDark} />
      </mesh>
      
      {/* Rivets along the edges */}
      {Array.from({ length: Math.ceil(width / 0.5) }).map((_, i) => {
        const xPos = -width / 2 + (i * 0.5) + 0.25;
        return (
          <group key={`rivet-${i}`}>
            {/* Top rivet */}
            <mesh position={[xPos, height * 0.45, 0.02]}>
              <circleGeometry args={[0.03, 6]} />
              <meshBasicMaterial color={rivetColor} />
            </mesh>
            {/* Bottom rivet */}
            <mesh position={[xPos, -height * 0.45, 0.02]}>
              <circleGeometry args={[0.03, 6]} />
              <meshBasicMaterial color={rivetColor} />
            </mesh>
          </group>
        );
      })}
      
      {/* Side edge details */}
      <mesh position={[-width * 0.48, 0, 0.015]}>
        <planeGeometry args={[0.05, height]} />
        <meshBasicMaterial color={metalDark} />
      </mesh>
      <mesh position={[width * 0.48, 0, 0.015]}>
        <planeGeometry args={[0.05, height]} />
        <meshBasicMaterial color={metalDark} />
      </mesh>
      
      {/* Grass growing on top of platform */}
      <group position={[0, height / 2 + 0.05, 0.02]}>
        {grassPositions.map((grass, i) => (
          <mesh key={`grass-${i}`} position={[grass.x, grass.height / 2, 0]}>
            <planeGeometry args={[grass.width, grass.height]} />
            <meshBasicMaterial color={grass.color} />
          </mesh>
        ))}
      </group>
      
      {/* Warning stripes on edges */}
      {Array.from({ length: 3 }).map((_, i) => (
        <mesh 
          key={`stripe-${i}`}
          position={[-width * 0.45 + i * 0.15, -height * 0.35, 0.02]}
        >
          <planeGeometry args={[0.08, 0.15]} />
          <meshBasicMaterial color="#cccc00" />
        </mesh>
      ))}
      
      {/* Collision box (invisible) */}
      <mesh position={[0, 0, -0.1]} visible={false}>
        <boxGeometry args={[width, height, 0.1]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>
    </group>
  );
};

export default Platform;