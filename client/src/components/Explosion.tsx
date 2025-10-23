import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface ExplosionProps {
  explosionData: any;
}

const Explosion = ({ explosionData }: ExplosionProps) => {
  const meshRef = useRef<THREE.Group>(null);
  const pulseRef = useRef(0);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.position.set(
        explosionData.position.x,
        explosionData.position.y,
        0.5
      );
      
      // Pulsing effect
      pulseRef.current += delta * 10;
      const scale = explosionData.size * (1 + Math.sin(pulseRef.current) * 0.2);
      meshRef.current.scale.set(scale, scale, 1);
      
      // Fade out
      const opacity = explosionData.lifetime / 0.5;
      meshRef.current.children.forEach((child: any) => {
        if (child.material) {
          child.material.opacity = opacity;
        }
      });
    }
  });

  return (
    <group ref={meshRef}>
      {/* Main explosion burst */}
      <mesh position={[0, 0, 0]}>
        <circleGeometry args={[1, 32]} />
        <meshBasicMaterial 
          color="#ff6600" 
          transparent 
          opacity={0.8}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      
      {/* Inner core */}
      <mesh position={[0, 0, 0.01]}>
        <circleGeometry args={[0.6, 24]} />
        <meshBasicMaterial 
          color="#ffff00" 
          transparent 
          opacity={0.9}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      
      {/* Outer ring */}
      <mesh position={[0, 0, -0.01]}>
        <ringGeometry args={[1.2, 1.5, 32]} />
        <meshBasicMaterial 
          color="#ff3300" 
          transparent 
          opacity={0.6}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      
      {/* Spark rays */}
      {[...Array(8)].map((_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        const x = Math.cos(angle) * 0.8;
        const y = Math.sin(angle) * 0.8;
        return (
          <mesh key={i} position={[x, y, 0.02]} rotation={[0, 0, angle]}>
            <planeGeometry args={[0.8, 0.15]} />
            <meshBasicMaterial 
              color="#ffaa00" 
              transparent 
              opacity={0.7}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
        );
      })}
    </group>
  );
};

export default Explosion;