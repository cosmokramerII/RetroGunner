import { useMemo } from "react";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";

interface LevelProps {
  levelData: any;
}

const Level = ({ levelData }: LevelProps) => {
  const grassTexture = useTexture("/textures/grass.png");
  const asphaltTexture = useTexture("/textures/asphalt.png");
  
  // Set texture filtering for pixelated look
  grassTexture.magFilter = THREE.NearestFilter;
  grassTexture.minFilter = THREE.NearestFilter;
  grassTexture.wrapS = THREE.RepeatWrapping;
  grassTexture.wrapT = THREE.RepeatWrapping;
  
  asphaltTexture.magFilter = THREE.NearestFilter;
  asphaltTexture.minFilter = THREE.NearestFilter;
  asphaltTexture.wrapS = THREE.RepeatWrapping;
  asphaltTexture.wrapT = THREE.RepeatWrapping;

  // Generate background elements with useMemo to avoid re-rendering
  const backgroundElements = useMemo(() => {
    const elements = [];
    
    // Far mountains - purple/blue tint
    for (let i = 0; i < 12; i++) {
      const x = i * 10 - 20;
      const height = 5 + Math.sin(i * 0.5) * 2;
      elements.push({
        id: `mountain-far-${i}`,
        x,
        y: 3 + height / 2,
        width: 12,
        height: height,
        color: '#2a2a5a',
        zIndex: -10
      });
    }
    
    // Mid mountains - darker blue
    for (let i = 0; i < 10; i++) {
      const x = i * 11 - 15;
      const height = 4 + Math.sin(i * 0.7) * 1.5;
      elements.push({
        id: `mountain-mid-${i}`,
        x,
        y: 2 + height / 2,
        width: 13,
        height: height,
        color: '#3a3a6a',
        zIndex: -8
      });
    }
    
    // Near mountains/hills - lighter
    for (let i = 0; i < 8; i++) {
      const x = i * 13 - 10;
      const height = 3 + Math.sin(i * 0.9) * 1;
      elements.push({
        id: `mountain-near-${i}`,
        x,
        y: 1 + height / 2,
        width: 15,
        height: height,
        color: '#4a4a7a',
        zIndex: -6
      });
    }
    
    // Clouds - various sizes and positions
    for (let i = 0; i < 8; i++) {
      elements.push({
        id: `cloud-${i}`,
        x: i * 14 - 8 + (i % 3) * 3,
        y: 7 + (i % 2) * 2,
        width: 3 + (i % 2),
        height: 1.2,
        color: '#5a5a8a',
        zIndex: -7
      });
    }
    
    // Buildings silhouettes in far background
    for (let i = 0; i < 15; i++) {
      const height = 2 + Math.random() * 3;
      elements.push({
        id: `building-${i}`,
        x: i * 8 - 20,
        y: -1 + height / 2,
        width: 3 + Math.random() * 2,
        height: height,
        color: '#1a1a3a',
        zIndex: -5
      });
    }
    
    return elements;
  }, []);

  if (!levelData) return null;

  return (
    <group>
      {/* Sky gradient - multiple layers for depth */}
      <mesh position={[0, 15, -12]}>
        <planeGeometry args={[300, 35]} />
        <meshBasicMaterial color="#1a1a4a" />
      </mesh>
      
      <mesh position={[0, 10, -11.5]}>
        <planeGeometry args={[300, 25]} />
        <meshBasicMaterial color="#2a2a5a" />
      </mesh>
      
      <mesh position={[0, 5, -11]}>
        <planeGeometry args={[300, 20]} />
        <meshBasicMaterial color="#3a3a6a" />
      </mesh>

      {/* Background mountains, clouds, and buildings */}
      {backgroundElements.map((elem) => (
        <mesh
          key={elem.id}
          position={[elem.x, elem.y, elem.zIndex]}
        >
          <planeGeometry args={[elem.width, elem.height]} />
          <meshBasicMaterial color={elem.color} transparent opacity={0.85} />
        </mesh>
      ))}

      {/* Mid-ground atmospheric layer with gradient */}
      <mesh position={[0, 2, -4]}>
        <planeGeometry args={[250, 10]} />
        <meshBasicMaterial color="#4a4a7a" transparent opacity={0.4} />
      </mesh>
      
      {/* Ground fog/mist effect */}
      <mesh position={[0, -2, -2]}>
        <planeGeometry args={[250, 3]} />
        <meshBasicMaterial color="#5a5a8a" transparent opacity={0.25} />
      </mesh>

      {/* Ground platforms with enhanced visuals */}
      {levelData.platforms.map((platform: any, index: number) => {
        const texture = platform.type === 'grass' ? grassTexture : asphaltTexture;
        texture.repeat.set(platform.width / 2, platform.height / 2);
        
        return (
          <group key={`platform-${index}`}>
            {/* Platform base glow */}
            <mesh position={[platform.x, platform.y - 0.05, -0.2]}>
              <planeGeometry args={[platform.width + 0.2, platform.height + 0.1]} />
              <meshBasicMaterial color="#2a2a5a" transparent opacity={0.3} />
            </mesh>
            
            {/* Main platform */}
            <mesh position={[platform.x, platform.y, -0.1]}>
              <planeGeometry args={[platform.width, platform.height]} />
              <meshBasicMaterial map={texture} />
            </mesh>
            
            {/* Platform top highlight */}
            <mesh position={[platform.x, platform.y + platform.height/2 - 0.05, -0.05]}>
              <planeGeometry args={[platform.width, 0.1]} />
              <meshBasicMaterial color="#8a8aaa" transparent opacity={0.6} />
            </mesh>
            
            {/* Platform shadow/depth */}
            <mesh position={[platform.x, platform.y - platform.height/2 - 0.1, -0.15]}>
              <planeGeometry args={[platform.width, 0.2]} />
              <meshBasicMaterial color="#0a0a1a" transparent opacity={0.7} />
            </mesh>
            
            {/* Side edges for depth illusion */}
            <mesh position={[platform.x - platform.width/2 - 0.05, platform.y, -0.12]}>
              <planeGeometry args={[0.1, platform.height]} />
              <meshBasicMaterial color="#1a1a3a" transparent opacity={0.8} />
            </mesh>
            <mesh position={[platform.x + platform.width/2 + 0.05, platform.y, -0.12]}>
              <planeGeometry args={[0.1, platform.height]} />
              <meshBasicMaterial color="#1a1a3a" transparent opacity={0.8} />
            </mesh>
          </group>
        );
      })}

      {/* Foreground atmospheric effects - vignette style */}
      <mesh position={[0, 0, 3]}>
        <planeGeometry args={[250, 25]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.15} />
      </mesh>
      
      {/* Subtle scan line effect */}
      {[...Array(10)].map((_, i) => (
        <mesh key={`scan-${i}`} position={[0, i * 2 - 5, 2.5]}>
          <planeGeometry args={[250, 0.05]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.02} />
        </mesh>
      ))}
    </group>
  );
};

export default Level;
