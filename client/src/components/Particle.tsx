import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface ParticleProps {
  particleData: any;
}

const Particle = ({ particleData }: ParticleProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const rotationSpeed = useRef(Math.random() * 10 - 5);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.position.set(
        particleData.position.x,
        particleData.position.y,
        0.3
      );
      
      // Rotate particle
      meshRef.current.rotation.z += rotationSpeed.current * delta;
      
      // Fade out
      const opacity = Math.max(0, particleData.lifetime);
      if (meshRef.current.material) {
        (meshRef.current.material as any).opacity = opacity;
      }
      
      // Scale down as it fades
      const scale = 0.15 * opacity;
      meshRef.current.scale.set(scale, scale, 1);
    }
  });

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial 
        color={particleData.color || '#ffaa00'} 
        transparent 
        opacity={1}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
};

export default Particle;