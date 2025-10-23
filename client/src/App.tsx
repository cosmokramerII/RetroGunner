import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useState } from "react";
import { KeyboardControls } from "@react-three/drei";
import { useAudio } from "./lib/stores/useAudio";
import "@fontsource/inter";
import Game from "./components/Game";
import TouchControls from "./components/TouchControls";
import GameUI from "./components/GameUI";
import SoundManager from "./components/SoundManager";
import { useIsMobile } from "./hooks/use-is-mobile";

// Define control keys for the game
const controls = [
  { name: "left", keys: ["KeyA", "ArrowLeft"] },
  { name: "right", keys: ["KeyD", "ArrowRight"] },
  { name: "up", keys: ["KeyW", "ArrowUp"] },
  { name: "down", keys: ["KeyS", "ArrowDown"] },
  { name: "jump", keys: ["Space", "KeyK"] },
  { name: "shoot", keys: ["KeyJ", "Enter"] },
  { name: "weapon1", keys: ["Digit1"] },
  { name: "weapon2", keys: ["Digit2"] },
  { name: "weapon3", keys: ["Digit3"] },
];

// Main App component
function App() {
  const [showCanvas, setShowCanvas] = useState(false);
  const isMobile = useIsMobile();

  // Show the canvas once everything is loaded
  useEffect(() => {
    setShowCanvas(true);
  }, []);

  return (
    <div style={{ 
      width: '100vw', 
      height: '100vh', 
      position: 'relative', 
      overflow: 'hidden',
      background: '#0a0a0a'
    }}>
      {showCanvas && (
        <KeyboardControls map={controls}>
          <Canvas
            shadows
            camera={{
              position: [0, 0, 10],
              fov: 45,
              near: 0.1,
              far: 1000
            }}
            gl={{
              antialias: false, // Pixelated look
              powerPreference: "default"
            }}
            style={{
              background: '#1a1a2e'
            }}
          >
            <color attach="background" args={["#1a1a2e"]} />
            
            <Suspense fallback={null}>
              <Game />
            </Suspense>
          </Canvas>
          
          <GameUI />
          {isMobile && <TouchControls />}
          <SoundManager />
        </KeyboardControls>
      )}
    </div>
  );
}

export default App;
