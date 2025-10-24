import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import Platform from "./Platform";

interface LevelProps {
  levelData: any;
}

const Level = ({ levelData }: LevelProps) => {
  const waterRef = useRef<any>(null);
  const timeRef = useRef(0);

  useFrame((state, delta) => {
    timeRef.current += delta;
    // Animate water
    if (waterRef.current) {
      waterRef.current.position.x = Math.sin(timeRef.current * 0.5) * 0.1;
    }
  });
  
  // Generate jungle background elements
  const jungleElements = useMemo(() => {
    const trees = [];
    const vines = [];
    const bushes = [];
    
    // Large jungle trees
    for (let i = 0; i < 10; i++) {
      trees.push({
        x: -15 + i * 3,
        y: 0 + Math.random() * 2,
        scale: 1.2 + Math.random() * 0.8,
        type: Math.random() > 0.5 ? 'palm' : 'jungle',
        layer: Math.random() > 0.5 ? -6 : -7
      });
    }
    
    // Hanging vines
    for (let i = 0; i < 8; i++) {
      vines.push({
        x: -14 + i * 3.5,
        y: 5,
        length: 3 + Math.random() * 2
      });
    }
    
    // Bushes and foliage
    for (let i = 0; i < 20; i++) {
      bushes.push({
        x: -16 + Math.random() * 32,
        y: -4.5 + Math.random() * 2,
        scale: 0.5 + Math.random() * 0.5
      });
    }
    
    return { trees, vines, bushes };
  }, []);

  return (
    <group>
      {/* Sky gradient - tropical */}
      <mesh position={[0, 10, -10]}>
        <planeGeometry args={[50, 30]} />
        <meshBasicMaterial color="#2a5a7a" />
      </mesh>
      
      {/* Distant mountains */}
      <mesh position={[0, 2, -9]}>
        <planeGeometry args={[50, 12]} />
        <meshBasicMaterial color="#1a3a5a" transparent opacity={0.8} />
      </mesh>
      
      {/* Jungle trees background */}
      {jungleElements.trees.map((tree, i) => (
        <group key={`tree-${i}`} position={[tree.x, tree.y, tree.layer]}>
          {/* Tree trunk */}
          <mesh position={[0, 0, 0]}>
            <planeGeometry args={[0.6 * tree.scale, 4 * tree.scale]} />
            <meshBasicMaterial color="#4a3a2a" />
          </mesh>
          
          {/* Foliage */}
          {tree.type === 'palm' ? (
            <>
              {[...Array(6)].map((_, j) => {
                const angle = (j / 6) * Math.PI * 2;
                return (
                  <mesh 
                    key={j}
                    position={[Math.cos(angle) * tree.scale, 2 + Math.sin(angle) * 0.5, 0.1]}
                    rotation={[0, 0, angle * 0.2]}
                  >
                    <planeGeometry args={[1.5 * tree.scale, 0.4 * tree.scale]} />
                    <meshBasicMaterial color="#2a6a2a" />
                  </mesh>
                );
              })}
            </>
          ) : (
            <>
              <mesh position={[0, 2.5, 0]}>
                <circleGeometry args={[2 * tree.scale, 12]} />
                <meshBasicMaterial color="#1a5a1a" />
              </mesh>
              <mesh position={[-0.5, 2, 0.1]}>
                <circleGeometry args={[1.5 * tree.scale, 10]} />
                <meshBasicMaterial color="#2a6a2a" />
              </mesh>
              <mesh position={[0.5, 2, 0.1]}>
                <circleGeometry args={[1.5 * tree.scale, 10]} />
                <meshBasicMaterial color="#2a6a2a" />
              </mesh>
            </>
          )}
        </group>
      ))}
      
      {/* Hanging vines */}
      {jungleElements.vines.map((vine, i) => (
        <mesh key={`vine-${i}`} position={[vine.x, vine.y - vine.length/2, -5]}>
          <planeGeometry args={[0.1, vine.length]} />
          <meshBasicMaterial color="#1a4a1a" transparent opacity={0.7} />
        </mesh>
      ))}
      
      {/* Bushes and foliage */}
      {jungleElements.bushes.map((bush, i) => (
        <mesh key={`bush-${i}`} position={[bush.x, bush.y, -4]}>
          <planeGeometry args={[bush.scale * 2, bush.scale * 1.5]} />
          <meshBasicMaterial color="#2a7a3a" />
        </mesh>
      ))}
      
      {/* Metal platforms - simpler implementation */}
      {levelData && levelData.platforms ? (
        levelData.platforms.map((platform: any, index: number) => (
          <Platform 
            key={`platform-${index}`}
            position={[platform.x, platform.y, 0]} 
            size={[platform.width, platform.height]} 
          />
        ))
      ) : (
        <>
          {/* Default platform layout */}
          <Platform position={[-8, -2, 0]} size={[6, 0.8]} />
          <Platform position={[0, -1, 0]} size={[8, 0.8]} />
          <Platform position={[8, 0, 0]} size={[6, 0.8]} />
          <Platform position={[-4, 1.5, 0]} size={[5, 0.8]} />
          <Platform position={[5, 2, 0]} size={[5, 0.8]} />
          <Platform position={[0, 3.5, 0]} size={[10, 0.8]} />
        </>
      )}
      
      {/* Water at bottom */}
      <group ref={waterRef} position={[0, -6, -0.5]}>
        {/* Water base */}
        <mesh position={[0, 0, 0]}>
          <planeGeometry args={[50, 4]} />
          <meshBasicMaterial color="#1a5a7a" transparent opacity={0.85} />
        </mesh>
        
        {/* Water surface */}
        <mesh position={[0, 1.8, 0.1]}>
          <planeGeometry args={[50, 0.4]} />
          <meshBasicMaterial color="#3a8aca" transparent opacity={0.6} />
        </mesh>
        
        {/* Water waves */}
        {[...Array(15)].map((_, i) => (
          <mesh 
            key={`wave-${i}`}
            position={[
              -20 + i * 2.8, 
              1.5 + Math.sin(i * 0.5 + timeRef.current) * 0.1, 
              0.2
            ]}
          >
            <planeGeometry args={[1, 0.2]} />
            <meshBasicMaterial color="#5abaff" transparent opacity={0.5} />
          </mesh>
        ))}
        
        {/* Water grass */}
        {[...Array(12)].map((_, i) => (
          <mesh
            key={`watergrass-${i}`}
            position={[-18 + i * 3, -0.5, 0.1]}
          >
            <planeGeometry args={[0.4, 1]} />
            <meshBasicMaterial color="#0a3a0a" transparent opacity={0.6} />
          </mesh>
        ))}
      </group>
      
      {/* Rock formations */}
      <group>
        <mesh position={[-10, -3, -2]}>
          <planeGeometry args={[3, 2]} />
          <meshBasicMaterial color="#4a4a4a" />
        </mesh>
        <mesh position={[11, -2, -2]}>
          <planeGeometry args={[2.5, 1.8]} />
          <meshBasicMaterial color="#5a5a5a" />
        </mesh>
      </group>
    </group>
  );
};

export default Level;
