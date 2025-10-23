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
    // Mountains in the background
    for (let i = 0; i < 8; i++) {
      elements.push({
        id: `mountain-${i}`,
        x: i * 12 - 10,
        y: 3,
        width: 10,
        height: 6,
        color: '#1a2a4a',
        zIndex: -8
      });
    }
    
    // Clouds
    for (let i = 0; i < 6; i++) {
      elements.push({
        id: `cloud-${i}`,
        x: i * 15 - 5,
        y: 6,
        width: 3,
        height: 1.5,
        color: '#4a5a6a',
        zIndex: -6
      });
    }
    
    return elements;
  }, []);

  if (!levelData) return null;

  return (
    <group>
      {/* Sky gradient background */}
      <mesh position={[0, 8, -10]}>
        <planeGeometry args={[200, 30]} />
        <meshBasicMaterial color="#2a3a5a" />
      </mesh>
      
      {/* Upper sky */}
      <mesh position={[0, 12, -10.1]}>
        <planeGeometry args={[200, 15]} />
        <meshBasicMaterial color="#1a2a4a" />
      </mesh>

      {/* Background mountains and clouds */}
      {backgroundElements.map((elem) => (
        <mesh
          key={elem.id}
          position={[elem.x, elem.y, elem.zIndex]}
        >
          <planeGeometry args={[elem.width, elem.height]} />
          <meshBasicMaterial color={elem.color} transparent opacity={0.8} />
        </mesh>
      ))}

      {/* Mid-ground layer */}
      <mesh position={[0, 2, -4]}>
        <planeGeometry args={[200, 12]} />
        <meshBasicMaterial color="#3a4a6a" transparent opacity={0.5} />
      </mesh>

      {/* Ground platforms with textures */}
      {levelData.platforms.map((platform: any, index: number) => {
        const texture = platform.type === 'grass' ? grassTexture : asphaltTexture;
        texture.repeat.set(platform.width / 2, platform.height / 2);
        
        return (
          <group key={`platform-${index}`}>
            {/* Platform */}
            <mesh position={[platform.x, platform.y, -0.1]}>
              <planeGeometry args={[platform.width, platform.height]} />
              <meshBasicMaterial map={texture} />
            </mesh>
            
            {/* Platform shadow/depth */}
            <mesh position={[platform.x, platform.y - platform.height/2 - 0.05, -0.15]}>
              <planeGeometry args={[platform.width, 0.1]} />
              <meshBasicMaterial color="#1a1a2a" transparent opacity={0.5} />
            </mesh>
          </group>
        );
      })}

      {/* Foreground atmospheric effects */}
      <mesh position={[0, 0, 2]}>
        <planeGeometry args={[200, 20]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.1} />
      </mesh>
    </group>
  );
};

export default Level;
